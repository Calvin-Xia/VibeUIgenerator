'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { EnhancedCode } from './EnhancedCode';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'css', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Copied!', description: 'Code copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  return (
    <div className="relative group">
      <EnhancedCode
        code={code}
        language={language}
        showLineNumbers={true}
        className="rounded-lg"
      />
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {filename && (
          <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm">
            {filename}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="rounded-md bg-background/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
