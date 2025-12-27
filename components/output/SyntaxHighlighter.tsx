'use client';

import { useMemo, useState, useEffect } from 'react';
import { highlightCode } from '@/lib/generator/highlight';
import { cn } from '@/lib/utils';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

export function SyntaxHighlighter({ code, language, className }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    updateTheme();
    window.addEventListener('themechange', updateTheme);
    return () => window.removeEventListener('themechange', updateTheme);
  }, []);

  useEffect(() => {
    let mounted = true;
    highlightCode(code, language, isDarkMode).then((html) => {
      if (mounted) {
        setHighlightedCode(html);
      }
    });
    return () => { mounted = false; };
  }, [code, language, isDarkMode]);

  if (!highlightedCode) {
    return (
      <code className={cn('text-xs leading-[24px] whitespace-pre-wrap break-all', className)}>
        {code}
      </code>
    );
  }

  return (
    <div
      className={cn('shiki-container', className)}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '12px',
        lineHeight: '24px'
      }}
    />
  );
}
