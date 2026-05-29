import { VibeTokens } from '@/lib/types/tokens';
import { ExportResult } from './export';

export function generateStyleDictionary(tokens: VibeTokens): ExportResult {
  const sdTokens = {
    color: {
      brand: {
        primary: { value: tokens.theme.palette.accent },
        secondary: { value: tokens.theme.palette.accent2 || tokens.theme.palette.accent }
      },
      background: {
        primary: { value: tokens.theme.palette.bg },
        secondary: { value: tokens.theme.palette.surface }
      },
      text: {
        primary: { value: tokens.theme.palette.text },
        secondary: { value: tokens.theme.palette.mutedText }
      },
      border: {
        primary: { value: tokens.theme.palette.border }
      }
    },
    size: {
      font: {
        base: { value: `${tokens.theme.typography.fontSize}px` },
        family: { value: tokens.theme.typography.fontFamily },
        weight: {
          normal: { value: String(tokens.theme.typography.fontWeight) }
        }
      },
      spacing: {
        horizontal: { value: `${tokens.theme.spacing.paddingX}px` },
        vertical: { value: `${tokens.theme.spacing.paddingY}px` },
        card: { value: `${tokens.theme.spacing.cardPadding}px` }
      },
      border: {
        radius: {
          button: { value: `${tokens.button.radius}px` },
          card: { value: `${tokens.card.radius}px` },
          input: { value: `${tokens.input.radius}px` }
        }
      }
    },
    animation: {
      duration: {
        fast: { value: `${tokens.interaction.transition.duration}ms` }
      },
      easing: {
        default: { value: tokens.interaction.transition.easing }
      }
    }
  };

  const code = JSON.stringify(sdTokens, null, 2);

  return {
    code,
    filename: 'tokens.json',
    language: 'json'
  };
}
