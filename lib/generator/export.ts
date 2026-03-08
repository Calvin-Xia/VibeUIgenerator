import { VibeTokens } from '@/lib/types/tokens';
import { hexToRgb, withOpacity } from './color';
import { shadowFromElevation } from './shadow';

export type ExportFormat = 'react' | 'vue' | 'html' | 'tailwind' | 'css' | 'json';

export interface ExportResult {
  code: string;
  filename: string;
  language: string;
}

interface ResolvedCardExportStyles {
  backgroundColor: string;
  border: string;
  borderRadius: number;
  padding: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
  color: string;
  boxShadow: string;
  transition: string;
  cursor: 'pointer';
  hoverLift: number;
  glowBorderRadius: number;
  backdropFilter?: string;
  webkitBackdropFilter?: string;
}

function resolveCardExportStyles(tokens: VibeTokens): ResolvedCardExportStyles {
  const { theme, effects, interaction, card } = tokens;

  let backgroundColor = withOpacity(theme.palette.surface, card.surfaceAlpha);
  let border = `${effects.border.width}px solid ${withOpacity(theme.palette.border, card.borderAlpha)}`;
  let backdropFilter: string | undefined;
  let webkitBackdropFilter: string | undefined;

  if (effects.glass.enabled) {
    backgroundColor = withOpacity(theme.palette.surface, effects.glass.opacity);
    border = `${effects.border.width}px solid ${withOpacity(theme.palette.border, 0.2)}`;
    backdropFilter = `blur(${effects.glass.blur}px) saturate(${effects.glass.saturation})`;
    webkitBackdropFilter = backdropFilter;
  }

  return {
    backgroundColor,
    border,
    borderRadius: card.radius,
    padding: card.padding,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeight,
    letterSpacing: `${theme.typography.letterSpacing}em`,
    color: theme.palette.text,
    boxShadow: shadowFromElevation({
      elevation: effects.shadow.elevation,
      softness: effects.shadow.softness,
      spread: effects.shadow.spread,
      color: effects.shadow.color
    }),
    transition: `all ${interaction.transition.duration}ms ${interaction.transition.easing}`,
    cursor: 'pointer',
    hoverLift: 2,
    glowBorderRadius: card.radius + 8,
    backdropFilter,
    webkitBackdropFilter
  };
}

function renderReactCardBackdropLines(styles: ResolvedCardExportStyles): string {
  if (!styles.backdropFilter || !styles.webkitBackdropFilter) {
    return '';
  }

  return `
    backdropFilter: '${styles.backdropFilter}',
    WebkitBackdropFilter: '${styles.webkitBackdropFilter}',`;
}

function renderVueCardBackdropLines(styles: ResolvedCardExportStyles): string {
  if (!styles.backdropFilter || !styles.webkitBackdropFilter) {
    return '';
  }

  return `
  backdropFilter: '${styles.backdropFilter}',
  WebkitBackdropFilter: '${styles.webkitBackdropFilter}',`;
}

function renderCssCardBackdropLines(styles: ResolvedCardExportStyles): string {
  if (!styles.backdropFilter || !styles.webkitBackdropFilter) {
    return '';
  }

  return `
  backdrop-filter: ${styles.backdropFilter};
  -webkit-backdrop-filter: ${styles.webkitBackdropFilter};`;
}

function generateReactButtonComponent(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button } = tokens;

  const mainShadow = shadowFromElevation({
    elevation: effects.shadow.elevation,
    softness: effects.shadow.softness,
    spread: effects.shadow.spread,
    color: effects.shadow.color
  });

  const hoverShadow = shadowFromElevation({
    elevation: Math.min(effects.shadow.elevation + 2, 24),
    softness: effects.shadow.softness,
    spread: effects.shadow.spread + 2,
    color: effects.shadow.color
  });

  const code = `'use client';

import React, { useState } from 'react';

export interface VibeButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const buttonStyles = {
  solid: {
    backgroundColor: '${theme.palette.accent}',
    color: '${button.override.text || theme.palette.text}',
    border: '${effects.border.width}px solid ${withOpacity(theme.palette.border, effects.border.opacity)}',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '${theme.palette.accent}',
    border: '${effects.border.width}px solid ${theme.palette.accent}',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '${theme.palette.accent}',
    border: 'transparent',
  }
};

export function VibeButton({
  variant = 'solid',
  size = 'md',
  disabled = false,
  children = 'Click Me',
  onClick
}: VibeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const sizeMap = {
    sm: { height: ${Math.round(button.height * 0.75)}, padding: '6px 12px', fontSize: '${Math.round(theme.typography.fontSize * 0.875)}px' },
    md: { height: ${button.height}, padding: '${theme.spacing.paddingY}px ${theme.spacing.paddingX}px', fontSize: '${theme.typography.fontSize}px' },
    lg: { height: ${Math.round(button.height * 1.25)}, padding: '16px 24px', fontSize: '${Math.round(theme.typography.fontSize * 1.125)}px' }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    height: sizeMap[size].height,
    padding: sizeMap[size].padding,
    fontFamily: '${theme.typography.fontFamily}',
    fontSize: sizeMap[size].fontSize,
    fontWeight: ${theme.typography.fontWeight},
    letterSpacing: '${theme.typography.letterSpacing}em',
    borderRadius: ${button.radius}px,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all ${interaction.transition.duration}ms ${interaction.transition.easing}',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    transform: isActive ? 'scale(0.98)' : isHovered ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isHovered ? '${hoverShadow}' : '${mainShadow}',
    ...buttonStyles[variant]
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default VibeButton;
`;

  return {
    code,
    filename: 'vibebutton.tsx',
    language: 'typescript'
  };
}

function generateReactCardComponent(tokens: VibeTokens): ExportResult {
  const styles = resolveCardExportStyles(tokens);

  const code = `'use client';

import React, { useState } from 'react';

export interface VibeCardProps {
  children?: React.ReactNode;
}

export function VibeCard({
  children = 'Card Content'
}: VibeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: ${styles.padding},
    fontFamily: '${styles.fontFamily}',
    fontSize: ${styles.fontSize},
    fontWeight: ${styles.fontWeight},
    letterSpacing: '${styles.letterSpacing}',
    borderRadius: ${styles.borderRadius},
    border: '${styles.border}',
    backgroundColor: '${styles.backgroundColor}',
    color: '${styles.color}',
    boxShadow: '${styles.boxShadow}',
    transition: '${styles.transition}',
    cursor: '${styles.cursor}',
    transform: isHovered ? 'translateY(-${styles.hoverLift}px)' : 'translateY(0)'${renderReactCardBackdropLines(styles)}
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

export default VibeCard;
`;

  return {
    code,
    filename: 'vibecard.tsx',
    language: 'typescript'
  };
}

export function generateReactComponent(tokens: VibeTokens, componentType: 'button' | 'card' = 'button'): ExportResult {
  return componentType === 'button'
    ? generateReactButtonComponent(tokens)
    : generateReactCardComponent(tokens);
}

function generateVueButtonComponent(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button } = tokens;

  const code = `<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isHovered = ref(false);
const isActive = ref(false);

const sizeMap = {
  sm: { height: ${Math.round(button.height * 0.75)}, padding: '6px 12px', fontSize: '${Math.round(theme.typography.fontSize * 0.875)}px' },
  md: { height: ${button.height}, padding: '${theme.spacing.paddingY}px ${theme.spacing.paddingX}px', fontSize: '${theme.typography.fontSize}px' },
  lg: { height: ${Math.round(button.height * 1.25)}, padding: '16px 24px', fontSize: '${Math.round(theme.typography.fontSize * 1.125)}px' }
};

const baseStyles = computed(() => ({
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: '0.5em',
  height: sizeMap[props.size].height,
  padding: sizeMap[props.size].padding,
  fontFamily: '${theme.typography.fontFamily}',
  fontSize: sizeMap[props.size].fontSize,
  fontWeight: ${theme.typography.fontWeight},
  letterSpacing: '${theme.typography.letterSpacing}em',
  borderRadius: '${button.radius}px',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  transition: 'all ${interaction.transition.duration}ms ${interaction.transition.easing}',
  opacity: props.disabled ? 0.5 : 1,
  pointerEvents: props.disabled ? 'none' : 'auto' as const,
  transform: isActive.value ? 'scale(0.98)' : isHovered.value ? 'scale(1.02)' : 'scale(1)',
  backgroundColor: props.variant === 'solid' ? '${theme.palette.accent}' : 'transparent',
  color: props.variant === 'solid' ? '${button.override.text || theme.palette.text}' : '${theme.palette.accent}',
  border: '${effects.border.width}px solid ${withOpacity(theme.palette.border, effects.border.opacity)}',
  boxShadow: isHovered.value ? '0 8px 16px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.1)'
}));

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<template>
  <button
    :style="baseStyles"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    @click="handleClick"
    :disabled="disabled"
  >
    <slot>Click Me</slot>
  </button>
</template>

<style scoped>
button {
  outline: none;
}
</style>
`;

  return {
    code,
    filename: 'vibebutton.vue',
    language: 'vue'
  };
}

function generateVueCardComponent(tokens: VibeTokens): ExportResult {
  const styles = resolveCardExportStyles(tokens);

  const code = `<script setup lang="ts">
import { ref, computed } from 'vue';

const isHovered = ref(false);

const baseStyles = computed(() => ({
  display: 'flex' as const,
  flexDirection: 'column' as const,
  padding: '${styles.padding}px',
  fontFamily: '${styles.fontFamily}',
  fontSize: '${styles.fontSize}px',
  fontWeight: ${styles.fontWeight},
  letterSpacing: '${styles.letterSpacing}',
  borderRadius: '${styles.borderRadius}px',
  border: '${styles.border}',
  backgroundColor: '${styles.backgroundColor}',
  color: '${styles.color}',
  boxShadow: '${styles.boxShadow}',
  transition: '${styles.transition}',
  cursor: '${styles.cursor}',
  transform: isHovered.value ? 'translateY(-${styles.hoverLift}px)' : 'translateY(0)'${renderVueCardBackdropLines(styles)}
}));
</script>

<template>
  <div
    :style="baseStyles"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <slot>Card Content</slot>
  </div>
</template>
`;

  return {
    code,
    filename: 'vibecard.vue',
    language: 'vue'
  };
}

export function generateVueComponent(tokens: VibeTokens, componentType: 'button' | 'card' = 'button'): ExportResult {
  return componentType === 'button'
    ? generateVueButtonComponent(tokens)
    : generateVueCardComponent(tokens);
}

function generateHTMLButtonSnippet(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button } = tokens;

  const code = `<!-- VibeUI Button - Generated by VibeUI Generator -->

<style>
.vibe-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  height: ${button.height}px;
  padding: ${theme.spacing.paddingY}px ${theme.spacing.paddingX}px;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize}px;
  font-weight: ${theme.typography.fontWeight};
  letter-spacing: ${theme.typography.letterSpacing}em;
  border-radius: ${button.radius}px;
  border: ${effects.border.width}px solid ${withOpacity(theme.palette.border, effects.border.opacity)};
  background-color: ${button.variant === 'solid' ? theme.palette.accent : 'transparent'};
  color: ${button.override.text || theme.palette.text};
  cursor: pointer;
  transition: all ${interaction.transition.duration}ms ${interaction.transition.easing};
  outline: none;
}

.vibe-button:hover {
  transform: translateY(-${interaction.hover.lift}px);
  filter: brightness(${1 + interaction.hover.brighten});
}

.vibe-button:active {
  transform: translateY(${interaction.active.press}px);
  filter: brightness(${1 - interaction.active.darken});
}

.vibe-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

${effects.glow.enabled ? `
.vibe-button.has-glow {
  position: relative;
}

.vibe-button.has-glow::before {
  content: '';
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, ${withOpacity(theme.palette.accent, 0x40 / 255)} 0%, transparent 70%);
  border-radius: ${button.radius + 8}px;
  z-index: -1;
  opacity: 0.5;
  filter: blur(12px);
}
` : ''}
</style>

<!-- Button HTML -->
<button class="vibe-button ${button.variant !== 'solid' ? 'variant-' + button.variant : ''}${effects.glow.enabled ? ' has-glow' : ''}"${button.variant !== 'solid' ? '\n  data-variant="' + button.variant + '"' : ''}>
  Click Me
</button>
`;

  return {
    code,
    filename: 'vibe-button.html',
    language: 'html'
  };
}

function generateHTMLCardSnippet(tokens: VibeTokens): ExportResult {
  const styles = resolveCardExportStyles(tokens);
  const { theme, effects } = tokens;

  const code = `<!-- VibeUI Card - Generated by VibeUI Generator -->

<style>
.vibe-card {
  display: flex;
  flex-direction: column;
  padding: ${styles.padding}px;
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize}px;
  font-weight: ${styles.fontWeight};
  letter-spacing: ${styles.letterSpacing};
  border-radius: ${styles.borderRadius}px;
  border: ${styles.border};
  background-color: ${styles.backgroundColor};
  color: ${styles.color};
  box-shadow: ${styles.boxShadow};
  transition: ${styles.transition};
  cursor: ${styles.cursor};${renderCssCardBackdropLines(styles)}
}

.vibe-card:hover {
  transform: translateY(-${styles.hoverLift}px);
}

${effects.glow.enabled ? `
.vibe-card.has-glow {
  position: relative;
}

.vibe-card.has-glow::before {
  content: '';
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, ${withOpacity(theme.palette.accent, 0x40 / 255)} 0%, transparent 70%);
  border-radius: ${styles.glowBorderRadius}px;
  z-index: -1;
  opacity: 0.5;
  filter: blur(12px);
}
` : ''}
</style>

<!-- Card HTML -->
<div class="vibe-card${effects.glow.enabled ? ' has-glow' : ''}">
  <h3>Card Title</h3>
  <p>Card content goes here. You can add any HTML content inside the card.</p>
</div>
`;

  return {
    code,
    filename: 'vibe-card.html',
    language: 'html'
  };
}

export function generateHTMLSnippets(tokens: VibeTokens, componentType: 'button' | 'card' = 'button'): ExportResult {
  return componentType === 'button'
    ? generateHTMLButtonSnippet(tokens)
    : generateHTMLCardSnippet(tokens);
}

export function generateTailwindConfig(tokens: VibeTokens): ExportResult {
  const { theme, effects, button, card } = tokens;

  const code = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        vibe: {
          accent: '${theme.palette.accent}',
          background: '${theme.palette.bg}',
          surface: '${theme.palette.surface}',
          text: '${theme.palette.text}',
          mutedText: '${theme.palette.mutedText}',
          border: '${theme.palette.border}',
        }
      },
      borderRadius: {
        'vibe-btn': '${button.radius}px',
        'vibe-card': '${card.radius}px',
      },
      boxShadow: {
        'vibe': '0 ${effects.shadow.elevation}px ${effects.shadow.elevation * 2}px rgba(0,0,0,0.1)',
        'vibe-hover': '0 ${effects.shadow.elevation + 4}px ${(effects.shadow.elevation + 4) * 2}px rgba(0,0,0,0.15)',
      },
      fontFamily: {
        'vibe': ['${theme.typography.fontFamily}'],
      },
      fontSize: {
        'vibe': ['${theme.typography.fontSize}px', { lineHeight: '${Math.round(theme.typography.fontSize * 1.5)}px' }],
      },
    }
  },
  plugins: [],
}
`;

  return {
    code,
    filename: 'tailwind.config.js',
    language: 'javascript'
  };
}

export function generateCSSVariables(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button, card } = tokens;
  const rgb = hexToRgb(theme.palette.accent);
  const cardRgb = hexToRgb(theme.palette.surface);

  const code = `:root {
  /* Theme Colors */
  --v-accent: ${theme.palette.accent};
  --v-accent-rgb: ${rgb?.r ?? 99}, ${rgb?.g ?? 102}, ${rgb?.b ?? 241};
  --v-background: ${theme.palette.bg};
  --v-surface: ${theme.palette.surface};
  --v-surface-rgb: ${cardRgb?.r ?? 30}, ${cardRgb?.g ?? 41}, ${cardRgb?.b ?? 59};
  --v-text: ${theme.palette.text};
  --v-muted-text: ${theme.palette.mutedText};
  --v-border: ${theme.palette.border};

  /* Button Styles */
  --v-btn-height: ${button.height}px;
  --v-btn-radius: ${button.radius}px;
  --v-btn-padding-x: ${theme.spacing.paddingX}px;
  --v-btn-padding-y: ${theme.spacing.paddingY}px;

  /* Card Styles */
  --v-card-radius: ${card.radius}px;
  --v-card-padding: ${card.padding}px;

  /* Typography */
  --v-font-family: ${theme.typography.fontFamily};
  --v-font-size: ${theme.typography.fontSize}px;
  --v-font-weight: ${theme.typography.fontWeight};
  --v-letter-spacing: ${theme.typography.letterSpacing}em;

  /* Interactions */
  --v-transition-duration: ${interaction.transition.duration}ms;
  --v-transition-easing: ${interaction.transition.easing};
  --v-hover-lift: ${interaction.hover.lift}px;
  --v-hover-brighten: ${interaction.hover.brighten};
  --v-active-press: ${interaction.active.press}px;
  --v-active-darken: ${interaction.active.darken};

  /* Effects */
  --v-border-width: ${effects.border.width}px;
  --v-border-opacity: ${effects.border.opacity};
  --v-shadow-elevation: ${effects.shadow.elevation};
  --v-shadow-softness: ${effects.shadow.softness};
  --v-shadow-spread: ${effects.shadow.spread};

  ${effects.glow.enabled ? `
  /* Glow Effect */
  --v-glow-size: ${effects.glow.size}px;
  --v-glow-opacity: ${effects.glow.opacity};
  ` : ''}

  ${effects.glass.enabled ? `
  /* Glass Effect */
  --v-glass-blur: ${effects.glass.blur}px;
  --v-glass-opacity: ${effects.glass.opacity};
  --v-glass-saturation: ${effects.glass.saturation};
  ` : ''}

  ${effects.noise.enabled ? `
  /* Noise Effect */
  --v-noise-intensity: ${effects.noise.intensity};
  ` : ''}
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --v-background: ${theme.mode === 'dark' ? theme.palette.bg : '#0f172a'};
  }
}
`;

  return {
    code,
    filename: 'vibe-variables.css',
    language: 'css'
  };
}

export function generateJSONTokens(tokens: VibeTokens): ExportResult {
  const code = JSON.stringify({
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    theme: {
      mode: tokens.theme.mode,
      palette: tokens.theme.palette,
      radius: tokens.theme.radius,
      spacing: tokens.theme.spacing,
      typography: tokens.theme.typography
    },
    button: tokens.button,
    card: tokens.card,
    effects: {
      border: tokens.effects.border,
      shadow: tokens.effects.shadow,
      glow: tokens.effects.glow,
      glass: tokens.effects.glass,
      noise: tokens.effects.noise,
      gradient: tokens.effects.gradient
    },
    interaction: tokens.interaction
  }, null, 2);

  return {
    code,
    filename: 'vibe-tokens.json',
    language: 'json'
  };
}

export function generateAllExports(tokens: VibeTokens, componentType: 'button' | 'card' = 'button'): Record<ExportFormat, ExportResult> {
  return {
    react: generateReactComponent(tokens, componentType),
    vue: generateVueComponent(tokens, componentType),
    html: generateHTMLSnippets(tokens, componentType),
    tailwind: generateTailwindConfig(tokens),
    css: generateCSSVariables(tokens),
    json: generateJSONTokens(tokens)
  };
}


