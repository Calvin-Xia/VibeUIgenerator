'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { getButtonStyles, getCardStyles, getCanvasStyles } from '@/lib/generator';
import { CanvasBackground } from './CanvasBackground';
import { ButtonPreview } from './ButtonPreview';
import { CardPreview } from './CardPreview';
import { PreviewSwitch } from './PreviewSwitch';
import { toPng } from 'html-to-image';
import { Download, MousePointer2, Layout, Box } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function PreviewCanvas() {
  const tokens = useVibeStore(state => state.tokens);
  const ui = useVibeStore(state => state.ui);
  const selectedComponent = useVibeStore(state => state.ui.selectedComponent);
  const version = useVibeStore(state => state.ui.version);
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const canvasStyles = useMemo(() => getCanvasStyles(tokens), [tokens, version]);
  const buttonStyles = useMemo(() => getButtonStyles(tokens), [tokens, version]);
  const cardStyles = useMemo(() => getCardStyles(tokens), [tokens, version]);

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: tokens.theme.palette.bg,
        pixelRatio: 2,
        skipAutoScale: true
      });

      const link = document.createElement('a');
      link.download = `vibeui-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({ title: 'PNG exported!', description: 'Image downloaded successfully' });
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-background/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <PreviewSwitch />
        </div>
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export PNG
        </button>
      </div>

      <div className="flex flex-1 overflow-auto bg-muted/30 p-4 lg:p-8">
        <motion.div
          ref={canvasRef}
          style={canvasStyles}
          className="relative mx-auto w-full max-w-2xl min-h-[400px] flex items-center justify-center rounded-2xl border shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CanvasBackground />

          <div className="relative z-10 flex flex-col items-center gap-8 p-8">
            <AnimatePresence mode="wait">
              {selectedComponent === 'button' && (
                <motion.div
                  key="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <ButtonPreview styles={buttonStyles} />
                </motion.div>
              )}
              {selectedComponent === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <CardPreview styles={cardStyles} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-4 right-4 z-20 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
            VibeUI Generator
          </div>
        </motion.div>
      </div>
    </div>
  );
}
