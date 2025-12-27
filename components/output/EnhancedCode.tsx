'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const lines = code.split('\n');
  const lineCountArray = Array.from({ length: lineCount }, (_, i) => i + 1);

  useEffect(() => {
    setLineCount(lines.length);
  }, [code]);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleScroll = useCallback(() => {
    if (codeScrollRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = codeScrollRef.current.scrollTop;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('flex rounded-lg border bg-muted/30 overflow-hidden', className)}
      style={{ maxHeight }}
    >
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          className="flex flex-col border-r bg-muted/50 text-right select-none overflow-hidden"
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
              className="leading-[24px] text-xs text-muted-foreground font-mono tabular-nums pr-3"
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
        className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
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
