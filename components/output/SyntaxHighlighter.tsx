'use client';

import { useState, useEffect } from 'react';
import { highlightCode } from '@/lib/generator/highlight';
import { useVibeStore } from '@/lib/store/vibeStore';
import { cn } from '@/lib/utils';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

export function SyntaxHighlighter({ code, language, className }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const isDarkMode = useVibeStore((state) => state.tokens.theme.mode === 'dark');

  useEffect(() => {
    let mounted = true;

    highlightCode(code, language, isDarkMode).then((html) => {
      if (mounted) {
        setHighlightedCode(html);
      }
    });

    return () => {
      mounted = false;
    };
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
