'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import { cn } from '@/lib/utils';

interface ButtonPreviewProps {
  styles: React.CSSProperties;
}

export function ButtonPreview({ styles }: ButtonPreviewProps) {
  const version = useVibeStore(state => state.ui.version);
  const tokens = useVibeStore(state => state.tokens);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const variant = tokens.button.variant;
  const effects = tokens.effects;

  const getHoverStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          filter: 'brightness(1.1)'
        };
      case 'outline':
        return {
          backgroundColor: `${tokens.theme.palette.accent}15`
        };
      case 'ghost':
        return {
          backgroundColor: `${tokens.theme.palette.accent}10`
        };
      default:
        return {};
    }
  };

  const getActiveStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          filter: 'brightness(0.95)'
        };
      case 'outline':
      case 'ghost':
        return {
          backgroundColor: `${tokens.theme.palette.accent}25`
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex flex-col items-center gap-4" key={version}>
      <div className="flex items-center gap-4">
        <motion.button
          style={{
            ...styles,
            ...(isHovered ? getHoverStyles() : {}),
            ...(isActive ? getActiveStyles() : {})
          }}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            variant === 'solid' && effects.glow.enabled && 'has-glow',
            isFocused && 'ring-2 ring-offset-2'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isActive ? 'Pressed!' : isHovered ? 'Hovered!' : 'Click Me'}
        </motion.button>

        <motion.button
          style={{ ...styles, opacity: 0.6 }}
          className="inline-flex items-center justify-center gap-2 cursor-not-allowed"
          disabled
        >
          Disabled
        </motion.button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Hover</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span>Focus</span>
        </div>
      </div>
    </div>
  );
}
