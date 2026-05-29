import { describe, expect, it } from 'vitest';

import { normalizeTokenColors } from '@/lib/generator/normalize';
import type { VibeTokens } from '@/lib/types/tokens';

const baseTokens: VibeTokens = {
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
      enabled: false,
      angle: 135,
      stops: []
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
      lift: 4,
      brighten: 0.05,
      shadowBoost: 0.3
    },
    active: {
      press: 2,
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
  },
  input: {
    height: 40,
    radius: 8,
    borderWidth: 1,
    focusRingWidth: 2,
    focusRingOffset: 2,
    placeholderOpacity: 0.5
  },
  badge: {
    radius: 9999,
    paddingX: 8,
    paddingY: 2,
    fontSize: 12,
    fontWeight: 500,
    variant: 'solid'
  },
  avatar: {
    size: 40,
    radius: 9999,
    borderWidth: 2,
    fallbackBg: '#6366f1',
    fallbackText: '#ffffff'
  },
  checkbox: {
    size: 20,
    radius: 4,
    borderWidth: 2,
    checkSize: 12,
    indicatorStyle: 'check'
  }
};

describe('interaction normalization', () => {
  it('converts legacy negative hover lift values into positive amplitudes', () => {
    const normalized = normalizeTokenColors({
      ...baseTokens,
      interaction: {
        ...baseTokens.interaction,
        hover: {
          ...baseTokens.interaction.hover,
          lift: -6
        }
      }
    });

    expect(normalized.interaction.hover.lift).toBe(6);
  });

  it('preserves positive hover lift values', () => {
    const normalized = normalizeTokenColors(baseTokens);

    expect(normalized.interaction.hover.lift).toBe(4);
  });
});
