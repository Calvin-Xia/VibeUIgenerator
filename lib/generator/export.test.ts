import { describe, expect, it } from 'vitest';

import { withOpacity } from '@/lib/generator/color';
import {
  generateCSSVariables,
  generateHTMLSnippets,
  generateReactComponent,
  generateVueComponent
} from '@/lib/generator/export';
import { normalizeTokenColors } from '@/lib/generator/normalize';
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
      enabled: false,
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
      enabled: true,
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
    override: {
      bg: undefined,
      text: undefined,
      border: undefined
    }
  },
  card: {
    radius: 16,
    padding: 24,
    surfaceAlpha: 0.9,
    borderAlpha: 0.5
  }
};

const migratedTokens = normalizeTokenColors({
  ...tokens,
  theme: {
    ...tokens.theme,
    palette: {
      ...tokens.theme.palette,
      accent: 'rgb(255, 0, 0)',
      surface: 'hsl(0, 0%, 100%)'
    }
  },
  effects: {
    ...tokens.effects,
    shadow: {
      ...tokens.effects.shadow,
      color: 'rgb(30, 41, 59)'
    }
  },
  interaction: {
    ...tokens.interaction,
    hover: {
      ...tokens.interaction.hover,
      lift: -4
    }
  }
});

describe('export interaction parity', () => {
  it('generates a wrapper-only React card export that uses hover lift tokens', () => {
    const code = generateReactComponent(tokens, 'card').code;

    expect(code).toContain('export interface VibeCardProps');
    expect(code).toContain('children?: React.ReactNode;');
    expect(code).toContain('<div');
    expect(code).toContain(`padding: ${tokens.card.padding}`);
    expect(code).toContain(`borderRadius: ${tokens.card.radius}`);
    expect(code).toContain(`backgroundColor: '${withOpacity(tokens.theme.palette.surface, tokens.card.surfaceAlpha)}'`);
    expect(code).toContain(`border: '${tokens.effects.border.width}px solid ${withOpacity(tokens.theme.palette.border, tokens.card.borderAlpha)}'`);
    expect(code).toContain("transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'");
    expect(code).not.toContain("translateY(-2px)");
    expect(code).not.toContain('variant?:');
    expect(code).not.toContain('sizeMap');
    expect(code).not.toContain('disabled?: boolean;');
    expect(code).not.toContain('onClick?: () => void;');
    expect(code).not.toContain('scale(0.98)');
  });

  it('generates a Vue card export that uses hover lift tokens', () => {
    const code = generateVueComponent(tokens, 'card').code;

    expect(code).toContain('<div');
    expect(code).not.toContain('<card');
    expect(code).toContain(`padding: '${tokens.card.padding}px'`);
    expect(code).toContain(`borderRadius: '${tokens.card.radius}px'`);
    expect(code).toContain(`backgroundColor: '${withOpacity(tokens.theme.palette.surface, tokens.card.surfaceAlpha)}'`);
    expect(code).toContain("transform: isHovered.value ? 'translateY(-4px)' : 'translateY(0)'");
    expect(code).not.toContain("translateY(-2px)");
    expect(code).not.toContain('interface Props');
    expect(code).not.toContain('defineEmits');
    expect(code).not.toContain(':disabled');
    expect(code).not.toContain('variant?:');
    expect(code).not.toContain('disabled?: boolean;');
  });

  it('generates card HTML without button dimensions or fixed hover interactions', () => {
    const code = generateHTMLSnippets(tokens, 'card').code;

    expect(code).toContain('.vibe-card {');
    expect(code).toContain('flex-direction: column;');
    expect(code).toContain(`padding: ${tokens.card.padding}px;`);
    expect(code).toContain(`border-radius: ${tokens.card.radius}px;`);
    expect(code).toContain(`background-color: ${withOpacity(tokens.theme.palette.surface, tokens.card.surfaceAlpha)};`);
    expect(code).toContain(`border: ${tokens.effects.border.width}px solid ${withOpacity(tokens.theme.palette.border, tokens.card.borderAlpha)};`);
    expect(code).toContain('transform: translateY(-4px);');
    expect(code).not.toContain('transform: translateY(-2px);');
    expect(code).not.toContain(`height: ${tokens.button.height}px;`);
    expect(code).not.toContain('align-items: center;');
    expect(code).not.toContain('justify-content: center;');
    expect(code).not.toContain('.vibe-card:active');
    expect(code).not.toContain('.vibe-card:disabled');
  });

  it('returns distinct HTML snippets for button and card exports', () => {
    const buttonHtml = generateHTMLSnippets(tokens, 'button').code;
    const cardHtml = generateHTMLSnippets(tokens, 'card').code;

    expect(buttonHtml).not.toBe(cardHtml);
    expect(buttonHtml).toContain('class="vibe-button');
    expect(cardHtml).toContain('class="vibe-card');
  });

  it('keeps the React button API while using token-driven translateY interactions', () => {
    const code = generateReactComponent(tokens, 'button').code;

    expect(code).toContain("variant?: 'solid' | 'outline' | 'ghost';");
    expect(code).toContain("size?: 'sm' | 'md' | 'lg';");
    expect(code).toContain('disabled?: boolean;');
    expect(code).toContain('const sizeMap = {');
    expect(code).toContain('<button');
    expect(code).toContain("transform: isActive ? 'translateY(2px)' : isHovered ? 'translateY(-4px)' : 'translateY(0)',");
    expect(code).not.toContain('scale(1.02)');
    expect(code).not.toContain('scale(0.98)');
  });

  it('keeps the Vue button API while using token-driven translateY interactions', () => {
    const code = generateVueComponent(tokens, 'button').code;

    expect(code).toContain("variant?: 'solid' | 'outline' | 'ghost';");
    expect(code).toContain("size?: 'sm' | 'md' | 'lg';");
    expect(code).toContain("transform: isActive.value ? 'translateY(2px)' : isHovered.value ? 'translateY(-4px)' : 'translateY(0)',");
    expect(code).not.toContain('scale(1.02)');
    expect(code).not.toContain('scale(0.98)');
  });

  it('emits normalized accent, surface, and interaction CSS variables after migration', () => {
    const code = generateCSSVariables(migratedTokens).code;

    expect(code).toContain('--v-accent: #ff0000;');
    expect(code).toContain('--v-accent-rgb: 255, 0, 0;');
    expect(code).toContain('--v-surface: #ffffff;');
    expect(code).toContain('--v-surface-rgb: 255, 255, 255;');
    expect(code).toContain('--v-hover-lift: 4px;');
    expect(code).toContain('--v-active-press: 2px;');
  });

  it('uses rgba glow colors instead of hex suffix concatenation in HTML exports', () => {
    const buttonCode = generateHTMLSnippets(migratedTokens, 'button').code;
    const cardCode = generateHTMLSnippets(migratedTokens, 'card').code;
    const glowColor = withOpacity(migratedTokens.theme.palette.accent, 0x40 / 255);

    expect(buttonCode).toContain(`background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);`);
    expect(cardCode).toContain(`background: radial-gradient(circle, ${glowColor} 0%, transparent 70%);`);
    expect(buttonCode).not.toContain(`${migratedTokens.theme.palette.accent}40`);
    expect(cardCode).not.toContain(`${migratedTokens.theme.palette.accent}40`);
  });
});
