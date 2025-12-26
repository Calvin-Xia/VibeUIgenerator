'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
  styles: React.CSSProperties;
}

export function CardPreview({ styles }: CardPreviewProps) {
  const version = useVibeStore(state => state.ui.version);
  const tokens = useVibeStore(state => state.tokens);
  const [isHovered, setIsHovered] = useState(false);
  const effects = tokens.effects;

  return (
    <motion.div
      style={styles}
      className={cn(
        'w-72 cursor-pointer',
        effects.glow.enabled && 'has-glow'
      )}
      key={version}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        y: isHovered ? -2 : 0
      }}
      transition={{ duration: tokens.interaction.transition.duration / 1000 }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: tokens.theme.palette.accent }}
          >
            UI
          </div>
          <div className="space-y-1">
            <div
              className="h-4 rounded"
              style={{
                backgroundColor: tokens.theme.palette.mutedText,
                opacity: 0.3,
                width: '120px'
              }}
            />
            <div
              className="h-3 rounded"
              style={{
                backgroundColor: tokens.theme.palette.mutedText,
                opacity: 0.2,
                width: '80px'
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div
            className="h-3 rounded"
            style={{
              backgroundColor: tokens.theme.palette.mutedText,
              opacity: 0.2
            }}
          />
          <div
            className="h-3 rounded"
            style={{
              backgroundColor: tokens.theme.palette.mutedText,
              opacity: 0.2,
              width: '85%'
            }}
          />
          <div
            className="h-3 rounded"
            style={{
              backgroundColor: tokens.theme.palette.mutedText,
              opacity: 0.2,
              width: '60%'
            }}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <motion.button
            style={{
              height: 32,
              paddingInline: 16,
              borderRadius: 6,
              backgroundColor: tokens.theme.palette.accent,
              color: tokens.button.override.text || tokens.theme.palette.text,
              fontWeight: tokens.theme.typography.fontWeight,
              border: 'none'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Action
          </motion.button>
          <motion.button
            style={{
              height: 32,
              paddingInline: 16,
              borderRadius: 6,
              backgroundColor: 'transparent',
              color: tokens.theme.palette.text,
              fontWeight: tokens.theme.typography.fontWeight,
              border: `1px solid ${tokens.theme.palette.border}`
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
