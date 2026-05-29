'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import { getButtonStyles, getCardStyles, getCanvasStyles } from '@/lib/generator';
import { CanvasBackground } from './CanvasBackground';
import { ButtonPreview } from './ButtonPreview';
import { CardPreview } from './CardPreview';
import { InputPreview } from './InputPreview';
import { BadgePreview } from './BadgePreview';
import { AvatarPreview } from './AvatarPreview';
import { CheckboxPreview } from './CheckboxPreview';
import { PreviewSwitch } from './PreviewSwitch';
import { ResponsiveFrame } from './ResponsiveFrame';
import { toPng } from 'html-to-image';
import { Download, Smartphone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PreviewContentProps {
  selectedComponent: string;
  buttonStyles: React.CSSProperties;
  cardStyles: React.CSSProperties;
}

function PreviewContent({ selectedComponent, buttonStyles, cardStyles }: PreviewContentProps) {
  return (
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
      {selectedComponent === 'input' && (
        <motion.div
          key="input"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <InputPreview />
        </motion.div>
      )}
      {selectedComponent === 'badge' && (
        <motion.div
          key="badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4"
        >
          <BadgePreview />
        </motion.div>
      )}
      {selectedComponent === 'avatar' && (
        <motion.div
          key="avatar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4"
        >
          <AvatarPreview />
        </motion.div>
      )}
      {selectedComponent === 'checkbox' && (
        <motion.div
          key="checkbox"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4"
        >
          <CheckboxPreview />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PreviewCanvas() {
  const tokens = useVibeStore((state) => state.tokens);
  const selectedComponent = useVibeStore((state) => state.ui.selectedComponent);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [responsiveMode, setResponsiveMode] = useState(false);

  const canvasStyles = useMemo(() => getCanvasStyles(tokens), [tokens]);
  const buttonStyles = useMemo(() => getButtonStyles(tokens), [tokens]);
  const cardStyles = useMemo(() => getCardStyles(tokens), [tokens]);

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
    } catch {
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
          <button
            onClick={() => setResponsiveMode(!responsiveMode)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              responsiveMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <Smartphone className="h-4 w-4" />
            Responsive
          </button>
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
        {responsiveMode ? (
          <ResponsiveFrame>
            <div ref={canvasRef} className="p-4">
              <PreviewContent
                selectedComponent={selectedComponent}
                buttonStyles={buttonStyles}
                cardStyles={cardStyles}
              />
            </div>
          </ResponsiveFrame>
        ) : (
          <motion.div
            ref={canvasRef}
            style={canvasStyles}
            className="relative mx-auto flex min-h-[400px] w-full max-w-2xl items-center justify-center rounded-2xl border shadow-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CanvasBackground />

            <div className="relative z-10 flex flex-col items-center gap-8 p-8">
              <PreviewContent
                selectedComponent={selectedComponent}
                buttonStyles={buttonStyles}
                cardStyles={cardStyles}
              />
            </div>

            <div className="absolute bottom-4 right-4 z-20 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
              VibeUI Generator
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
