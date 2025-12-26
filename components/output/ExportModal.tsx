'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import {
  generateReactComponent,
  generateVueComponent,
  generateHTMLSnippets,
  generateTailwindConfig,
  generateCSSVariables,
  generateJSONTokens,
  generateAllExports,
  ExportFormat
} from '@/lib/generator/export';
import { CodePreview } from './CodePreview';
import { cn } from '@/lib/utils';
import {
  X,
  Code2,
  FileCode,
  FileJson,
  FileType,
  Download,
  Copy,
  Check,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultComponent?: 'button' | 'card';
}

const formatInfo: Record<ExportFormat, { icon: React.ReactNode; label: string; description: string }> = {
  react: {
    icon: <Code2 className="h-4 w-4" />,
    label: 'React',
    description: 'React functional component with TypeScript'
  },
  vue: {
    icon: <FileCode className="h-4 w-4" />,
    label: 'Vue',
    description: 'Vue 3 SFC with Composition API'
  },
  html: {
    icon: <FileType className="h-4 w-4" />,
    label: 'HTML',
    description: 'Complete HTML with embedded CSS'
  },
  tailwind: {
    icon: <Code2 className="h-4 w-4" />,
    label: 'Tailwind',
    description: 'Tailwind configuration file'
  },
  css: {
    icon: <FileType className="h-4 w-4" />,
    label: 'CSS',
    description: 'CSS variables and utility classes'
  },
  json: {
    icon: <FileJson className="h-4 w-4" />,
    label: 'JSON',
    description: 'Design tokens as JSON'
  }
};

export function ExportModal({ isOpen, onClose, defaultComponent = 'button' }: ExportModalProps) {
  const tokens = useVibeStore(state => state.tokens);
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('react');
  const [componentType, setComponentType] = useState<'button' | 'card'>(defaultComponent);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentExport = useMemo(() => {
    switch (activeFormat) {
      case 'react': return generateReactComponent(tokens, componentType);
      case 'vue': return generateVueComponent(tokens, componentType);
      case 'html': return generateHTMLSnippets(tokens, componentType);
      case 'tailwind': return generateTailwindConfig(tokens);
      case 'css': return generateCSSVariables(tokens);
      case 'json': return generateJSONTokens(tokens);
      default: return generateReactComponent(tokens, componentType);
    }
  }, [tokens, activeFormat, componentType]);

  const allExports = useMemo(() => generateAllExports(tokens, componentType), [tokens, componentType]);

  useEffect(() => {
    if (copiedFormat) {
      const timer = setTimeout(() => setCopiedFormat(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedFormat]);

  const handleCopy = async (format: ExportFormat) => {
    try {
      await navigator.clipboard.writeText(allExports[format].code);
      setCopiedFormat(format);
      toast({
        title: 'Copied!',
        description: `${formatInfo[format].label} code copied to clipboard`
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = (format: ExportFormat) => {
    const exportData = allExports[format];
    const blob = new Blob([exportData.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: `${exportData.filename} downloaded`
    });
  };

  const handleDownloadAll = async () => {
    setIsGenerating(true);
    try {
      for (const format of Object.keys(allExports) as ExportFormat[]) {
        const exportData = allExports[format];
        const blob = new Blob([exportData.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = exportData.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: 'All files downloaded!',
        description: '6 export files have been downloaded'
      });
    } catch (err) {
      toast({
        title: 'Download failed',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border bg-background shadow-2xl"
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Export Code</h2>
                <p className="text-sm text-muted-foreground">
                  Generate and export {componentType} component in various formats
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Component:</span>
              <div className="flex rounded-md bg-muted p-1">
                {(['button', 'card'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setComponentType(type)}
                    className={cn(
                      'rounded px-3 py-1 text-sm font-medium transition-colors capitalize',
                      componentType === type
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFormatMenu(!showFormatMenu)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {formatInfo[activeFormat].icon}
                <span>{formatInfo[activeFormat].label}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', showFormatMenu && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showFormatMenu && (
                  <motion.div
                    className="absolute right-0 top-full z-20 mt-1 w-64 rounded-md border bg-background py-1 shadow-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {(Object.keys(formatInfo) as ExportFormat[]).map(format => (
                      <button
                        key={format}
                        onClick={() => {
                          setActiveFormat(format);
                          setShowFormatMenu(false);
                        }}
                        className={cn(
                          'flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-muted',
                          activeFormat === format && 'bg-muted'
                        )}
                      >
                        {formatInfo[format].icon}
                        <div>
                          <div className="font-medium">{formatInfo[format].label}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatInfo[format].description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Current format:</span>
                  <span className="font-medium">{formatInfo[activeFormat].label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeFormat)}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                  >
                    {copiedFormat === activeFormat ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(activeFormat)}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <CodePreview
                code={currentExport.code}
                language={currentExport.language}
                filename={currentExport.filename}
                className="min-h-[300px] max-h-[400px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
            <button
              onClick={handleDownloadAll}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Download All Formats</span>
            </button>
            <div className="text-sm text-muted-foreground">
              {Object.keys(allExports).length} formats available
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
