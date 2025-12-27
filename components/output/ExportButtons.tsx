'use client';

import { useState } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';
import { generateCSSVariables, generateHTMLSnippets, generateReactComponent, generateVueComponent, generateTailwindConfig, generateJSONTokens, generateAllExports } from '@/lib/generator/export';
import { ExportModal } from './ExportModal';
import { cn } from '@/lib/utils';
import { Code2, Copy, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { ExportFormat } from '@/lib/generator/export';

interface ExportButtonsProps {
  activeTab?: string;
}

export function ExportButtons({ activeTab = 'css' }: ExportButtonsProps) {
  const tokens = useVibeStore(state => state.tokens);
  const selectedComponent = useVibeStore(state => state.ui.selectedComponent);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copying, setCopying] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case 'css': return generateCSSVariables(tokens).code;
      case 'tailwind': return generateTailwindConfig(tokens).code;
      case 'html': return generateHTMLSnippets(tokens, selectedComponent).code;
      case 'react': return generateReactComponent(tokens, selectedComponent).code;
      case 'vue': return generateVueComponent(tokens, selectedComponent).code;
      case 'json': return generateJSONTokens(tokens).code;
      default: return generateCSSVariables(tokens).code;
    }
  };

  const getFilename = () => {
    switch (activeTab) {
      case 'css': return 'vibe-variables.css';
      case 'tailwind': return 'tailwind.config.js';
      case 'html': return `vibe-${selectedComponent}.html`;
      case 'react': return `vibe-${selectedComponent}.tsx`;
      case 'vue': return `vibe-${selectedComponent}.vue`;
      case 'json': return 'vibe-tokens.json';
      default: return `vibe-${selectedComponent}.css`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setCopying(true);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard'
      });
      setTimeout(() => setCopying(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = () => {
    const code = getCode();
    const filename = getFilename();

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: `${filename} downloaded`
    });
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowExportModal(true)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          <Code2 className="h-4 w-4" />
          <span className="hidden sm:inline">Export All</span>
        </button>

        <button
          onClick={handleCopy}
          disabled={copying}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          <Copy className={cn('h-4 w-4', copying && 'text-green-500')} />
          <span className="hidden sm:inline">{copying ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        defaultComponent={selectedComponent}
      />
    </>
  );
}
