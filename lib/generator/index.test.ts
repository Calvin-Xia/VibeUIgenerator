import { describe, expect, it } from 'vitest';

import { getCanvasStyles } from '@/lib/generator';
import type { VibeTokens } from '@/lib/types/tokens';

const tokens: VibeTokens = {
  schemaVersion: '1.0.0',
  theme: {
    mode: 'light',
    palette: {
      accent: '#6366f1',
      accent2: '#8b5cf6',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      mutedText: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0
    },
    radius: {
      baseRadius: 12
    },
    spacing: {
      paddingX: 24,
      paddingY: 12,
      cardPadding: 24
    }
  },
  effects: {
    shadow: {
      elevation: 8,
      softness: 0.3,
      spread: -2,
      color: '#1e293b'
    },
    border: {
      width: 1,
      opacity: 1
    },
    glass: {
      enabled: false,
      blur: 12,
      opacity: 0.3,
      saturation: 1.2
    },
    gradient: {
      enabled: true,
      angle: 135,
      stops: [
        { color: '#f0f9ff', pos: 0 },
        { color: '#e0f2fe', pos: 100 }
      ]
    },
    noise: {
      enabled: false,
      intensity: 0.03
    },
    glow: {
      enabled: false,
      size: 24,
      opacity: 0.15
    }
  },
  interaction: {
    transition: {
      duration: 200,
      easing: 'ease-out'
    },
    hover: {
      lift: 2,
      brighten: 0.05,
      shadowBoost: 0.3
    },
    active: {
      press: 1,
      darken: 0.08
    }
  },
  button: {
    variant: 'solid',
    height: 44,
    radius: 8,
    override: {}
  },
  card: {
    radius: 16,
    padding: 24,
    surfaceAlpha: 1,
    borderAlpha: 0.5
  }
};

describe('canvas styles', () => {
  it('uses backgroundImage instead of background shorthand when gradients are enabled', () => {
    const styles = getCanvasStyles(tokens);

    expect(styles.backgroundColor).toBe(tokens.theme.palette.bg);
    expect(styles.backgroundImage).toBe('linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)');
    expect('background' in styles).toBe(false);
  });

  it('resets backgroundImage to none when gradients are disabled', () => {
    const styles = getCanvasStyles({
      ...tokens,
      effects: {
        ...tokens.effects,
        gradient: {
          ...tokens.effects.gradient,
          enabled: false
        }
      }
    });

    expect(styles.backgroundColor).toBe(tokens.theme.palette.bg);
    expect(styles.backgroundImage).toBe('none');
    expect('background' in styles).toBe(false);
  });
});
