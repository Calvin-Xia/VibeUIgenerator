import { VibeTokens, GeneratedStyles } from '@/lib/types/tokens';
import { hexToRgb, withOpacity, adjustLightness, generateGradientStops } from './color';
import { shadowFromElevation, generateGlowShadow } from './shadow';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateHTMLSnippets,
  generateReactComponent,
  generateVueComponent,
  generateJSONTokens,
  generateAllExports
} from './export';

export {
  generateCSSVariables,
  generateTailwindConfig,
  generateHTMLSnippets,
  generateReactComponent,
  generateVueComponent,
  generateJSONTokens,
  generateAllExports
};

export function generateVibeStyles(tokens: VibeTokens): GeneratedStyles {
  const cssVars = generateCSSVariables(tokens);
  const tailwindLayer = generateTailwindConfig(tokens);
  const htmlSnippet = generateHTMLSnippets(tokens, 'button');

  return {
    cssVars: JSON.parse(cssVars.code.replace(/--[\s\S]*?: [\s\S]*?;/g, (match) => {
      const [name, value] = match.split(':');
      return `"${name.trim().replace('--', '')}": "${value.trim()}",`;
    })),
    cssText: '',
    tailwindLayer: tailwindLayer.code,
    htmlSnippet: { button: htmlSnippet.code, card: htmlSnippet.code }
  };
}

export function getButtonStyles(tokens: VibeTokens): React.CSSProperties {
  const { theme, effects, interaction, button } = tokens;
  const buttonVariant = button.variant;
  
  let buttonBg: string;
  let buttonText: string;
  let buttonBorder: string;
  const borderColor = withOpacity(theme.palette.border, effects.border.opacity);

  switch (buttonVariant) {
    case 'solid':
      buttonBg = button.override.bg || theme.palette.accent;
      buttonText = button.override.text || tokens.theme.palette.text;
      buttonBorder = button.override.border || theme.palette.border;
      break;
    case 'outline':
      buttonBg = 'transparent';
      buttonText = button.override.text || theme.palette.accent;
      buttonBorder = button.override.border || theme.palette.accent;
      break;
    case 'ghost':
      buttonBg = 'transparent';
      buttonText = button.override.text || theme.palette.accent;
      buttonBorder = 'transparent';
      break;
    default:
      buttonBg = theme.palette.accent;
      buttonText = tokens.theme.palette.text;
      buttonBorder = theme.palette.border;
  }

  const actualBorderColor = withOpacity(buttonBorder, effects.border.opacity);
  const mainShadow = shadowFromElevation({
    elevation: effects.shadow.elevation,
    softness: effects.shadow.softness,
    spread: effects.shadow.spread,
    color: effects.shadow.color
  });

  const styles: React.CSSProperties = {
    height: button.height,
    padding: `${theme.spacing.paddingY}px ${theme.spacing.paddingX}px`,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeight,
    letterSpacing: `${theme.typography.letterSpacing}em`,
    borderRadius: button.radius,
    border: `${effects.border.width}px solid ${actualBorderColor}`,
    backgroundColor: buttonBg,
    color: buttonText,
    boxShadow: mainShadow,
    transition: `all ${interaction.transition.duration}ms ${interaction.transition.easing}`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    outline: 'none'
  };

  if (effects.glass.enabled) {
    styles.backdropFilter = `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`;
    styles.webkitBackdropFilter = `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`;
    styles.backgroundColor = withOpacity(tokens.theme.palette.surface, effects.glass.opacity);
    styles.border = `${effects.border.width}px solid ${withOpacity(tokens.theme.palette.border, 0.2)}`;
  }

  return styles;
}

export function getCardStyles(tokens: VibeTokens): React.CSSProperties {
  const { theme, effects, interaction, card } = tokens;
  const cardBg = withOpacity(tokens.theme.palette.surface, card.surfaceAlpha);
  const cardBorder = withOpacity(tokens.theme.palette.border, card.borderAlpha);

  const mainShadow = shadowFromElevation({
    elevation: effects.shadow.elevation,
    softness: effects.shadow.softness,
    spread: effects.shadow.spread,
    color: effects.shadow.color
  });

  const styles: React.CSSProperties = {
    backgroundColor: cardBg,
    border: `${effects.border.width}px solid ${cardBorder}`,
    borderRadius: card.radius,
    padding: card.padding,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeight,
    letterSpacing: `${theme.typography.letterSpacing}em`,
    color: theme.palette.text,
    boxShadow: mainShadow,
    transition: `all ${interaction.transition.duration}ms ${interaction.transition.easing}`,
    display: 'flex',
    flexDirection: 'column'
  };

  if (effects.glass.enabled) {
    styles.backdropFilter = `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`;
    styles.webkitBackdropFilter = `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`;
    styles.backgroundColor = withOpacity(tokens.theme.palette.surface, effects.glass.opacity);
    styles.border = `${effects.border.width}px solid ${withOpacity(tokens.theme.palette.border, 0.2)}`;
  }

  return styles;
}

export function getCanvasStyles(tokens: VibeTokens): React.CSSProperties {
  const { theme, effects } = tokens;

  const bgStyle: React.CSSProperties = {
    backgroundColor: theme.palette.bg,
    transition: 'background-color 300ms ease'
  };

  if (effects.gradient.enabled) {
    bgStyle.background = generateGradientStops(
      effects.gradient.angle,
      effects.gradient.stops
    );
  }

  return bgStyle;
}
