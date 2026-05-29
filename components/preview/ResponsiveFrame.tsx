'use client';

import { motion } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Monitor as MonitorWide, RotateCcw } from 'lucide-react';
import { useResponsive, ViewportSize, VIEWPORT_CONFIGS } from '@/lib/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface ResponsiveFrameProps {
  children: React.ReactNode;
}

export function ResponsiveFrame({ children }: ResponsiveFrameProps) {
  const {
    viewport,
    setViewport,
    toggleOrientation,
    width,
    height,
    config
  } = useResponsive();

  const viewportIcons: Record<ViewportSize, React.ReactNode> = {
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
    desktop: <Monitor className="h-4 w-4" />,
    wide: <MonitorWide className="h-4 w-4" />
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-1">
          {(Object.keys(VIEWPORT_CONFIGS) as ViewportSize[]).map(size => (
            <button
              key={size}
              onClick={() => setViewport(size)}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewport === size
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
              title={VIEWPORT_CONFIGS[size].label}
            >
              {viewportIcons[size]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {width} × {height}
          </span>
          <button
            onClick={toggleOrientation}
            className="p-2 rounded-md hover:bg-secondary"
            title="Toggle orientation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <motion.div
          className="relative border rounded-lg overflow-hidden shadow-lg"
          animate={{
            width,
            height: Math.min(height, 600)
          }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {viewport === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-foreground/20 rounded-b-full" />
          )}

          <div
            className="w-full h-full overflow-auto"
            style={{
              fontSize: config.deviceScale > 1 ? '16px' : '14px'
            }}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
