'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy, Download } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodePreview({ code, language, filename, className }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!filename) return;

    setDownloading(true);
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      typescript: 'TypeScript',
      vue: 'Vue',
      html: 'HTML',
      javascript: 'JavaScript',
      css: 'CSS',
      json: 'JSON'
    };
    return labels[lang] || lang;
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg border bg-muted/30', className)}>
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            {getLanguageLabel(language)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {filename && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? '...' : 'Download'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre
        ref={codeRef}
        className="overflow-x-auto p-4 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
