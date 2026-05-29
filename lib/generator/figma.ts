import { VibeTokens } from '@/lib/types/tokens';
import { ExportResult } from './export';

interface FigmaToken {
  value: string;
  type: string;
}

interface FigmaTokenGroup {
  [key: string]: FigmaToken | FigmaTokenGroup;
}

export function generateFigmaTokens(tokens: VibeTokens): ExportResult {
  const figmaTokens: FigmaTokenGroup = {
    color: {
      accent: { value: tokens.theme.palette.accent, type: 'color' },
      background: { value: tokens.theme.palette.bg, type: 'color' },
      surface: { value: tokens.theme.palette.surface, type: 'color' },
      text: { value: tokens.theme.palette.text, type: 'color' },
      mutedText: { value: tokens.theme.palette.mutedText, type: 'color' },
      border: { value: tokens.theme.palette.border, type: 'color' }
    },
    typography: {
      fontFamily: { value: tokens.theme.typography.fontFamily, type: 'fontFamily' },
      fontSize: { value: `${tokens.theme.typography.fontSize}px`, type: 'fontSize' },
      fontWeight: { value: String(tokens.theme.typography.fontWeight), type: 'fontWeight' },
      letterSpacing: { value: `${tokens.theme.typography.letterSpacing}em`, type: 'letterSpacing' }
    },
    borderRadius: {
      button: { value: `${tokens.button.radius}px`, type: 'borderRadius' },
      card: { value: `${tokens.card.radius}px`, type: 'borderRadius' },
      input: { value: `${tokens.input.radius}px`, type: 'borderRadius' }
    },
    spacing: {
      paddingX: { value: `${tokens.theme.spacing.paddingX}px`, type: 'spacing' },
      paddingY: { value: `${tokens.theme.spacing.paddingY}px`, type: 'spacing' },
      cardPadding: { value: `${tokens.theme.spacing.cardPadding}px`, type: 'spacing' }
    },
    boxShadow: {
      elevation: {
        value: `0 ${tokens.effects.shadow.elevation}px ${tokens.effects.shadow.elevation * 2}px rgba(0,0,0,0.1)`,
        type: 'boxShadow'
      }
    }
  };

  const code = JSON.stringify(figmaTokens, null, 2);

  return {
    code,
    filename: 'figma-tokens.json',
    language: 'json'
  };
}
