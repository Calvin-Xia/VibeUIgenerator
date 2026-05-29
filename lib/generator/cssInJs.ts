import { VibeTokens } from '@/lib/types/tokens';
import { ExportResult } from './export';
import { shadowFromElevation } from './shadow';

function buildThemeObject(tokens: VibeTokens): string {
  const { theme, effects, button } = tokens;
  const shadow = shadowFromElevation({
    elevation: effects.shadow.elevation,
    softness: effects.shadow.softness,
    spread: effects.shadow.spread,
    color: effects.shadow.color
  });

  return `{
    colors: {
      accent: '${theme.palette.accent}',
      background: '${theme.palette.bg}',
      surface: '${theme.palette.surface}',
      text: '${theme.palette.text}',
      mutedText: '${theme.palette.mutedText}',
      border: '${theme.palette.border}'
    },
    typography: {
      fontFamily: '${theme.typography.fontFamily}',
      fontSize: '${theme.typography.fontSize}px',
      fontWeight: ${theme.typography.fontWeight},
      letterSpacing: '${theme.typography.letterSpacing}em'
    },
    spacing: {
      horizontal: '${theme.spacing.paddingX}px',
      vertical: '${theme.spacing.paddingY}px'
    },
    borderRadius: {
      button: '${button.radius}px',
      card: '${tokens.card.radius}px'
    },
    shadows: {
      elevation: '${shadow}'
    }
  }`;
}

function buildButtonStyles(): string {
  return `display: inline-flex;
  align-items: center;
  justify-content: center;
  height: \${theme.typography.fontSize * 3}px;
  padding: \${theme.spacing.vertical} \${theme.spacing.horizontal};
  font-family: \${theme.typography.fontFamily};
  font-size: \${theme.typography.fontSize};
  font-weight: \${theme.typography.fontWeight};
  letter-spacing: \${theme.typography.letterSpacing};
  border-radius: \${theme.borderRadius.button};
  background-color: \${theme.colors.accent};
  color: \${theme.colors.text};
  border: none;
  cursor: pointer;
  transition: all 200ms ease-out;`;
}

function buildHoverAndActive(): string {
  return `&:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }`;
}

export function generateStyledComponents(tokens: VibeTokens): ExportResult {
  const themeObj = buildThemeObject(tokens);
  const buttonStyles = buildButtonStyles();
  const hoverActive = buildHoverAndActive();

  const code = `import styled from 'styled-components';

export const theme = ${themeObj};

export const VibeButton = styled.button\`
  ${buttonStyles}

  ${hoverActive}
\`;

export default theme;
`;

  return {
    code,
    filename: 'theme.ts',
    language: 'typescript'
  };
}

export function generateEmotion(tokens: VibeTokens): ExportResult {
  const themeObj = buildThemeObject(tokens);
  const buttonStyles = buildButtonStyles();
  const hoverActive = buildHoverAndActive();

  const code = `import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const theme = ${themeObj};

export const buttonStyles = css\`
  ${buttonStyles}
\`;

export const VibeButton = styled.button\`
  \${buttonStyles}

  ${hoverActive}
\`;

export default theme;
`;

  return {
    code,
    filename: 'theme.ts',
    language: 'typescript'
  };
}
