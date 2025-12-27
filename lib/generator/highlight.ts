import { createHighlighter, Highlighter } from 'shiki';

type Language = 'typescript' | 'vue' | 'html' | 'css' | 'javascript' | 'json';

let highlighter: Highlighter | null = null;
let theme: 'github-dark' | 'github-light' = 'github-dark';

async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'vue', 'html', 'css', 'javascript', 'json']
    });
  }
  return highlighter;
}

export async function highlightCode(code: string, language: string, isDarkMode: boolean = true): Promise<string> {
  const hl = await getHighlighterInstance();
  theme = isDarkMode ? 'github-dark' : 'github-light';

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
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function setSyntaxTheme(isDarkMode: boolean) {
  theme = isDarkMode ? 'github-dark' : 'github-light';
}

export async function getSupportedLanguages(): Promise<string[]> {
  return ['typescript', 'vue', 'html', 'css', 'javascript', 'json'];
}
