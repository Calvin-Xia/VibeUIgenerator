import { createHighlighter, type Highlighter } from 'shiki';

type Language = 'typescript' | 'vue' | 'html' | 'css' | 'javascript' | 'json';

let highlighter: Highlighter | null = null;
let highlightFailed = false;

async function getHighlighterInstance(): Promise<Highlighter | null> {
  if (highlightFailed) {
    return null;
  }

  if (!highlighter) {
    try {
      highlighter = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['typescript', 'vue', 'html', 'css', 'javascript', 'json'],
        bundle: true
      });
    } catch (error) {
      console.error('Failed to initialize shiki highlighter:', error);
      highlightFailed = true;
      return null;
    }
  }
  return highlighter;
}

export async function highlightCode(code: string, language: string, isDarkMode: boolean = true): Promise<string> {
  const hl = await getHighlighterInstance();

  if (!hl) {
    return escapeHtml(code);
  }

  const theme = isDarkMode ? 'github-dark' : 'github-light';

  const langMap: Record<string, Language> = {
    'tsx': 'typescript',
    'typescript': 'typescript',
    'vue': 'vue',
    'html': 'html',
    'css': 'css',
    'javascript': 'javascript',
    'json': 'json'
  };

  const lang = langMap[language.toLowerCase()] || 'typescript';

  try {
    const html = hl.codeToHtml(code, {
      lang,
      theme,
      structure: 'classic'
    });
    return html;
  } catch (error) {
    console.error('Syntax highlighting error:', error);
    return escapeHtml(code);
  }
}

export function escapeHtml(text: string): string {
  return `<pre style="margin:0;font-family:monospace;font-size:12px;line-height:24px;white-space:pre-wrap;"><code>${text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')}</code></pre>`;
}

export function setSyntaxTheme(isDarkMode: boolean) {
}

export async function getSupportedLanguages(): Promise<string[]> {
  return ['typescript', 'vue', 'html', 'css', 'javascript', 'json'];
}
