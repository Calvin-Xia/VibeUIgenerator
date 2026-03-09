'use client';

import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SyntaxHighlighter } from './SyntaxHighlighter';

interface EnhancedCodeProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

const LINE_HEIGHT = 24;
const PADDING = 12;

export function EnhancedCode({
  code,
  language = 'css',
  className,
  showLineNumbers = true,
  maxHeight = '300px'
}: EnhancedCodeProps) {
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCountArray = Array.from({ length: lines.length }, (_, i) => i + 1);

  const handleScroll = useCallback(() => {
    if (codeScrollRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = codeScrollRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, code]);

  return (
    <div
      className={cn('flex overflow-hidden rounded-lg border bg-muted/30', className)}
      style={{ maxHeight }}
    >
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          className="flex flex-col overflow-hidden border-r bg-muted/50 text-right select-none"
          style={{
            minWidth: '3.5rem',
            paddingTop: PADDING,
            paddingBottom: PADDING,
            flexShrink: 0
          }}
        >
          {lineCountArray.map((num) => (
            <div
              key={num}
              className="pr-3 font-mono text-xs leading-[24px] text-muted-foreground tabular-nums"
              style={{ height: LINE_HEIGHT }}
            >
              {num}
            </div>
          ))}
        </div>
      )}
      <div
        ref={codeScrollRef}
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent flex-1 overflow-x-auto overflow-y-auto"
        style={{
          paddingTop: PADDING,
          paddingBottom: PADDING,
          paddingLeft: PADDING,
          paddingRight: PADDING
        }}
      >
        <SyntaxHighlighter
          code={code}
          language={language}
          className="min-w-fit"
        />
      </div>
    </div>
  );
}
