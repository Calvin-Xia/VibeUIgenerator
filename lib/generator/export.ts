import { VibeTokens, ComponentType } from '@/lib/types/tokens';
import { hexToRgb, withOpacity } from './color';
import { resolveInteractionMotion } from './interaction';
import { shadowFromElevation } from './shadow';
import { generateFigmaTokens } from './figma';
import { generateStyleDictionary } from './styleDictionary';
import { generateStyledComponents, generateEmotion } from './cssInJs';

export { generateFigmaTokens } from './figma';
export { generateStyleDictionary } from './styleDictionary';
export { generateStyledComponents, generateEmotion } from './cssInJs';

export type ExportFormat = 'react' | 'vue' | 'html' | 'tailwind' | 'css' | 'json' | 'figma' | 'styleDictionary' | 'styledComponents' | 'emotion';

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
  hoverTranslateY: number;
  glowBorderRadius: number;
  backdropFilter?: string;
  webkitBackdropFilter?: string;
}

function resolveCardExportStyles(tokens: VibeTokens): ResolvedCardExportStyles {
  const { theme, effects, interaction, card } = tokens;
  const interactionMotion = resolveInteractionMotion(interaction);

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
    hoverTranslateY: interactionMotion.hoverTranslateY,
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
  const interactionMotion = resolveInteractionMotion(interaction);

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
    transform: isActive ? 'translateY(${interactionMotion.activeTranslateY}px)' : isHovered ? 'translateY(${interactionMotion.hoverTranslateY}px)' : 'translateY(0)',
    boxShadow: isHovered ? '${hoverShadow}' : '${mainShadow}',
    ...buttonStyles[variant]
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
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
    transform: isHovered ? 'translateY(${styles.hoverTranslateY}px)' : 'translateY(0)'${renderReactCardBackdropLines(styles)}
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

function generateReactInputComponent(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, input } = tokens;

  const code = `'use client';

import React, { useState } from 'react';

export interface VibeInputProps {
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function VibeInput({
  placeholder = 'Enter text...',
  disabled = false,
  value,
  onChange
}: VibeInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyle: React.CSSProperties = {
    height: ${input.height},
    padding: '${theme.spacing.paddingY}px ${theme.spacing.paddingX}px',
    fontFamily: '${theme.typography.fontFamily}',
    fontSize: ${theme.typography.fontSize},
    fontWeight: ${theme.typography.fontWeight},
    letterSpacing: '${theme.typography.letterSpacing}em',
    borderRadius: ${input.radius}px,
    border: '${input.borderWidth}px solid ${withOpacity(theme.palette.border, effects.border.opacity)}',
    backgroundColor: '${theme.palette.surface}',
    color: '${theme.palette.text}',
    outline: 'none',
    transition: 'all ${interaction.transition.duration}ms ${interaction.transition.easing}',
    boxShadow: isFocused
      ? '0 0 0 ${input.focusRingWidth + input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0.25)}'
      : '0 0 0 ${input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0)}',
    borderColor: isFocused ? '${theme.palette.accent}' : '${withOpacity(theme.palette.border, effects.border.opacity)}',
    width: '100%',
    boxSizing: 'border-box' as const,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text'
  };

  return (
    <input
      style={baseStyle}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

export default VibeInput;
`;

  return {
    code,
    filename: 'vibeinput.tsx',
    language: 'typescript'
  };
}

function generateReactBadgeComponent(tokens: VibeTokens): ExportResult {
  const { theme, badge } = tokens;

  const code = `'use client';

import React from 'react';

export interface VibeBadgeProps {
  variant?: 'solid' | 'outline' | 'soft';
  children?: React.ReactNode;
}

export function VibeBadge({
  variant = '${badge.variant}',
  children = 'Badge'
}: VibeBadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '${badge.paddingY}px ${badge.paddingX}px',
    fontFamily: '${theme.typography.fontFamily}',
    fontSize: ${badge.fontSize},
    fontWeight: ${badge.fontWeight},
    borderRadius: ${badge.radius}px,
    lineHeight: 1
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    solid: {
      backgroundColor: '${theme.palette.accent}',
      color: '#ffffff'
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid ${theme.palette.accent}',
      color: '${theme.palette.accent}'
    },
    soft: {
      backgroundColor: '${withOpacity(theme.palette.accent, 0.1)}',
      color: '${theme.palette.accent}'
    }
  };

  return (
    <span style={{ ...baseStyle, ...variantStyles[variant] }}>
      {children}
    </span>
  );
}

export default VibeBadge;
`;

  return {
    code,
    filename: 'vibebadge.tsx',
    language: 'typescript'
  };
}

function generateReactAvatarComponent(tokens: VibeTokens): ExportResult {
  const { theme, avatar } = tokens;

  const code = `'use client';

import React from 'react';

export interface VibeAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function VibeAvatar({
  src,
  alt = 'Avatar',
  fallback = 'AV'
}: VibeAvatarProps) {
  const containerStyle: React.CSSProperties = {
    width: ${avatar.size},
    height: ${avatar.size},
    borderRadius: '${avatar.radius}',
    border: '${avatar.borderWidth}px solid ${theme.palette.border}',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '${avatar.fallbackBg}'
  };

  const fallbackStyle: React.CSSProperties = {
    color: '${avatar.fallbackText}',
    fontSize: ${Math.round(avatar.size * 0.4)},
    fontWeight: 600,
    fontFamily: '${theme.typography.fontFamily}'
  };

  return (
    <div style={containerStyle}>
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={fallbackStyle}>{fallback}</span>
      )}
    </div>
  );
}

export default VibeAvatar;
`;

  return {
    code,
    filename: 'vibeavatar.tsx',
    language: 'typescript'
  };
}

function generateReactCheckboxComponent(tokens: VibeTokens): ExportResult {
  const { theme, checkbox } = tokens;

  const code = `'use client';

import React, { useState } from 'react';

export interface VibeCheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function VibeCheckbox({
  checked: controlledChecked,
  disabled = false,
  onChange,
  label = 'Checkbox'
}: VibeCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setInternalChecked(newValue);
    onChange?.(newValue);
  };

  const boxStyle: React.CSSProperties = {
    width: ${checkbox.size},
    height: ${checkbox.size},
    borderRadius: ${checkbox.radius}px,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    border: '${checkbox.borderWidth}px solid ' + (isChecked ? '${theme.palette.accent}' : '${theme.palette.border}'),
    backgroundColor: isChecked ? '${theme.palette.accent}' : 'transparent',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0
  };

  const indicatorStyle: React.CSSProperties = {
    width: ${checkbox.checkSize},
    height: ${checkbox.checkSize},
    color: '#ffffff'
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '${theme.typography.fontFamily}',
    fontSize: ${theme.typography.fontSize},
    color: '${theme.palette.text}',
    opacity: disabled ? 0.5 : 1,
    marginLeft: '8px'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClick}>
      <div style={boxStyle}>
        {isChecked && (
          '${checkbox.indicatorStyle === 'check'
            ? `<svg style={indicatorStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>`
            : `<div style={{ ...indicatorStyle, backgroundColor: '#ffffff', borderRadius: '50%' }} />`}'
        )}
      </div>
      <span style={labelStyle}>{label}</span>
    </div>
  );
}

export default VibeCheckbox;
`;

  return {
    code,
    filename: 'vibecheckbox.tsx',
    language: 'typescript'
  };
}

export function generateReactComponent(tokens: VibeTokens, componentType: ComponentType = 'button'): ExportResult {
  switch (componentType) {
    case 'button': return generateReactButtonComponent(tokens);
    case 'card': return generateReactCardComponent(tokens);
    case 'input': return generateReactInputComponent(tokens);
    case 'badge': return generateReactBadgeComponent(tokens);
    case 'avatar': return generateReactAvatarComponent(tokens);
    case 'checkbox': return generateReactCheckboxComponent(tokens);
    default: return generateReactButtonComponent(tokens);
  }
}

function generateVueButtonComponent(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button } = tokens;
  const interactionMotion = resolveInteractionMotion(interaction);

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
  transform: isActive.value ? 'translateY(${interactionMotion.activeTranslateY}px)' : isHovered.value ? 'translateY(${interactionMotion.hoverTranslateY}px)' : 'translateY(0)',
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
    @mouseleave="isHovered = false; isActive = false"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    @click="handleClick"
    :disabled="props.disabled"
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
  transform: isHovered.value ? 'translateY(${styles.hoverTranslateY}px)' : 'translateY(0)'${renderVueCardBackdropLines(styles)}
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

function generateVueInputComponent(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, input } = tokens;

  const code = `<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text...',
  disabled: false,
  modelValue: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isFocused = ref(false);

const baseStyles = computed(() => ({
  height: '${input.height}px',
  padding: '${theme.spacing.paddingY}px ${theme.spacing.paddingX}px',
  fontFamily: '${theme.typography.fontFamily}',
  fontSize: '${theme.typography.fontSize}px',
  fontWeight: ${theme.typography.fontWeight},
  letterSpacing: '${theme.typography.letterSpacing}em',
  borderRadius: '${input.radius}px',
  border: '${input.borderWidth}px solid ' + (isFocused.value ? '${theme.palette.accent}' : '${withOpacity(theme.palette.border, effects.border.opacity)}'),
  backgroundColor: '${theme.palette.surface}',
  color: '${theme.palette.text}',
  outline: 'none',
  transition: 'all ${interaction.transition.duration}ms ${interaction.transition.easing}',
  boxShadow: isFocused.value
    ? '0 0 0 ${input.focusRingWidth + input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0.25)}'
    : '0 0 0 ${input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0)}',
  width: '100%',
  boxSizing: 'border-box' as const,
  opacity: props.disabled ? 0.5 : 1,
  cursor: props.disabled ? 'not-allowed' : 'text'
}));

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    :style="baseStyles"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="modelValue"
    @input="handleInput"
    @focus="isFocused = true"
    @blur="isFocused = false"
  />
</template>
`;

  return {
    code,
    filename: 'vibeinput.vue',
    language: 'vue'
  };
}

function generateVueBadgeComponent(tokens: VibeTokens): ExportResult {
  const { theme, badge } = tokens;

  const code = `<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'solid' | 'outline' | 'soft';
}

const props = withDefaults(defineProps<Props>(), {
  variant: '${badge.variant}'
});

const baseStyles = computed(() => ({
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  padding: '${badge.paddingY}px ${badge.paddingX}px',
  fontFamily: '${theme.typography.fontFamily}',
  fontSize: '${badge.fontSize}px',
  fontWeight: ${badge.fontWeight},
  borderRadius: '${badge.radius}px',
  lineHeight: 1,
  ...(props.variant === 'solid' ? {
    backgroundColor: '${theme.palette.accent}',
    color: '#ffffff'
  } : props.variant === 'outline' ? {
    backgroundColor: 'transparent',
    border: '1px solid ${theme.palette.accent}',
    color: '${theme.palette.accent}'
  } : {
    backgroundColor: '${withOpacity(theme.palette.accent, 0.1)}',
    color: '${theme.palette.accent}'
  })
}));
</script>

<template>
  <span :style="baseStyles">
    <slot>Badge</slot>
  </span>
</template>
`;

  return {
    code,
    filename: 'vibebadge.vue',
    language: 'vue'
  };
}

function generateVueAvatarComponent(tokens: VibeTokens): ExportResult {
  const { theme, avatar } = tokens;

  const code = `<script setup lang="ts">
interface Props {
  src?: string;
  alt?: string;
  fallback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Avatar',
  fallback: 'AV'
});

const containerStyle = {
  width: '${avatar.size}px',
  height: '${avatar.size}px',
  borderRadius: '${avatar.radius}',
  border: '${avatar.borderWidth}px solid ${theme.palette.border}',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '${avatar.fallbackBg}'
};

const fallbackStyle = {
  color: '${avatar.fallbackText}',
  fontSize: '${Math.round(avatar.size * 0.4)}px',
  fontWeight: 600,
  fontFamily: '${theme.typography.fontFamily}'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const
};
</script>

<template>
  <div :style="containerStyle">
    <img v-if="src" :src="src" :alt="alt" :style="imageStyle" />
    <span v-else :style="fallbackStyle">{{ fallback }}</span>
  </div>
</template>
`;

  return {
    code,
    filename: 'vibeavatar.vue',
    language: 'vue'
  };
}

function generateVueCheckboxComponent(tokens: VibeTokens): ExportResult {
  const { theme, checkbox } = tokens;

  const code = `<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  label: 'Checkbox'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isChecked = computed(() => props.modelValue);

const boxStyle = computed(() => ({
  width: '${checkbox.size}px',
  height: '${checkbox.size}px',
  borderRadius: '${checkbox.radius}px',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  transition: 'all 150ms ease',
  border: '${checkbox.borderWidth}px solid ' + (isChecked.value ? '${theme.palette.accent}' : '${theme.palette.border}'),
  backgroundColor: isChecked.value ? '${theme.palette.accent}' : 'transparent',
  opacity: props.disabled ? 0.5 : 1,
  flexShrink: 0
}));

const indicatorStyle = {
  width: '${checkbox.checkSize}px',
  height: '${checkbox.checkSize}px',
  color: '#ffffff'
};

const labelStyle = computed(() => ({
  fontFamily: '${theme.typography.fontFamily}',
  fontSize: '${theme.typography.fontSize}px',
  color: '${theme.palette.text}',
  opacity: props.disabled ? 0.5 : 1,
  marginLeft: '8px'
}));

function handleClick() {
  if (!props.disabled) {
    emit('update:modelValue', !isChecked.value);
  }
}
</script>

<template>
  <div style="display: flex; align-items: center" @click="handleClick">
    <div :style="boxStyle">
      ${checkbox.indicatorStyle === 'check'
        ? `<svg v-if="isChecked" :style="indicatorStyle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>`
        : `<div v-if="isChecked" :style="{ ...indicatorStyle, backgroundColor: '#ffffff', borderRadius: '50%' }" />`}
    </div>
    <span :style="labelStyle">{{ label }}</span>
  </div>
</template>
`;

  return {
    code,
    filename: 'vibecheckbox.vue',
    language: 'vue'
  };
}

export function generateVueComponent(tokens: VibeTokens, componentType: ComponentType = 'button'): ExportResult {
  switch (componentType) {
    case 'button': return generateVueButtonComponent(tokens);
    case 'card': return generateVueCardComponent(tokens);
    case 'input': return generateVueInputComponent(tokens);
    case 'badge': return generateVueBadgeComponent(tokens);
    case 'avatar': return generateVueAvatarComponent(tokens);
    case 'checkbox': return generateVueCheckboxComponent(tokens);
    default: return generateVueButtonComponent(tokens);
  }
}

function generateHTMLButtonSnippet(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, button } = tokens;
  const interactionMotion = resolveInteractionMotion(interaction);

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
  transform: translateY(${interactionMotion.hoverTranslateY}px);
  filter: brightness(${1 + interaction.hover.brighten});
}

.vibe-button:active {
  transform: translateY(${interactionMotion.activeTranslateY}px);
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
  transform: translateY(${styles.hoverTranslateY}px);
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

function generateHTMLInputSnippet(tokens: VibeTokens): ExportResult {
  const { theme, effects, interaction, input } = tokens;

  const code = `<!-- VibeUI Input - Generated by VibeUI Generator -->

<style>
.vibe-input {
  height: ${input.height}px;
  padding: ${theme.spacing.paddingY}px ${theme.spacing.paddingX}px;
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize}px;
  font-weight: ${theme.typography.fontWeight};
  letter-spacing: ${theme.typography.letterSpacing}em;
  border-radius: ${input.radius}px;
  border: ${input.borderWidth}px solid ${withOpacity(theme.palette.border, effects.border.opacity)};
  background-color: ${theme.palette.surface};
  color: ${theme.palette.text};
  outline: none;
  transition: all ${interaction.transition.duration}ms ${interaction.transition.easing};
  box-shadow: 0 0 0 ${input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0)};
  width: 100%;
  box-sizing: border-box;
}

.vibe-input:focus {
  border-color: ${theme.palette.accent};
  box-shadow: 0 0 0 ${input.focusRingWidth + input.focusRingOffset}px ${withOpacity(theme.palette.accent, 0.25)};
}

.vibe-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vibe-input::placeholder {
  color: ${withOpacity(theme.palette.mutedText, input.placeholderOpacity)};
}
</style>

<!-- Input HTML -->
<input class="vibe-input" type="text" placeholder="Enter text..." />
`;

  return {
    code,
    filename: 'vibe-input.html',
    language: 'html'
  };
}

function generateHTMLBadgeSnippet(tokens: VibeTokens): ExportResult {
  const { theme, badge } = tokens;

  const code = `<!-- VibeUI Badge - Generated by VibeUI Generator -->

<style>
.vibe-badge {
  display: inline-flex;
  align-items: center;
  padding: ${badge.paddingY}px ${badge.paddingX}px;
  font-family: ${theme.typography.fontFamily};
  font-size: ${badge.fontSize}px;
  font-weight: ${badge.fontWeight};
  border-radius: ${badge.radius}px;
  line-height: 1;
}

.vibe-badge--solid {
  background-color: ${theme.palette.accent};
  color: #ffffff;
}

.vibe-badge--outline {
  background-color: transparent;
  border: 1px solid ${theme.palette.accent};
  color: ${theme.palette.accent};
}

.vibe-badge--soft {
  background-color: ${withOpacity(theme.palette.accent, 0.1)};
  color: ${theme.palette.accent};
}
</style>

<!-- Badge HTML -->
<span class="vibe-badge vibe-badge--${badge.variant}">
  Badge
</span>
`;

  return {
    code,
    filename: 'vibe-badge.html',
    language: 'html'
  };
}

function generateHTMLAvatarSnippet(tokens: VibeTokens): ExportResult {
  const { theme, avatar } = tokens;

  const code = `<!-- VibeUI Avatar - Generated by VibeUI Generator -->

<style>
.vibe-avatar {
  width: ${avatar.size}px;
  height: ${avatar.size}px;
  border-radius: ${avatar.radius};
  border: ${avatar.borderWidth}px solid ${theme.palette.border};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${avatar.fallbackBg};
}

.vibe-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vibe-avatar__fallback {
  color: ${avatar.fallbackText};
  font-size: ${Math.round(avatar.size * 0.4)}px;
  font-weight: 600;
  font-family: ${theme.typography.fontFamily};
}
</style>

<!-- Avatar HTML -->
<div class="vibe-avatar">
  <span class="vibe-avatar__fallback">AV</span>
</div>
`;

  return {
    code,
    filename: 'vibe-avatar.html',
    language: 'html'
  };
}

function generateHTMLCheckboxSnippet(tokens: VibeTokens): ExportResult {
  const { theme, checkbox } = tokens;

  const code = `<!-- VibeUI Checkbox - Generated by VibeUI Generator -->

<style>
.vibe-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.vibe-checkbox__box {
  width: ${checkbox.size}px;
  height: ${checkbox.size}px;
  border-radius: ${checkbox.radius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
  border: ${checkbox.borderWidth}px solid ${theme.palette.border};
  background-color: transparent;
  flex-shrink: 0;
}

.vibe-checkbox__box--checked {
  border-color: ${theme.palette.accent};
  background-color: ${theme.palette.accent};
}

.vibe-checkbox__box--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vibe-checkbox__indicator {
  width: ${checkbox.checkSize}px;
  height: ${checkbox.checkSize}px;
  color: #ffffff;
}

.vibe-checkbox__label {
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize}px;
  color: ${theme.palette.text};
  margin-left: 8px;
}

.vibe-checkbox:disabled .vibe-checkbox__label {
  opacity: 0.5;
}
</style>

<!-- Checkbox HTML -->
<label class="vibe-checkbox">
  <div class="vibe-checkbox__box vibe-checkbox__box--checked">
    ${checkbox.indicatorStyle === 'check'
      ? '<svg class="vibe-checkbox__indicator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>'
      : '<div class="vibe-checkbox__indicator" style="background-color: #ffffff; border-radius: 50%;"></div>'}
  </div>
  <span class="vibe-checkbox__label">Checkbox</span>
</label>
`;

  return {
    code,
    filename: 'vibe-checkbox.html',
    language: 'html'
  };
}

export function generateHTMLSnippets(tokens: VibeTokens, componentType: ComponentType = 'button'): ExportResult {
  switch (componentType) {
    case 'button': return generateHTMLButtonSnippet(tokens);
    case 'card': return generateHTMLCardSnippet(tokens);
    case 'input': return generateHTMLInputSnippet(tokens);
    case 'badge': return generateHTMLBadgeSnippet(tokens);
    case 'avatar': return generateHTMLAvatarSnippet(tokens);
    case 'checkbox': return generateHTMLCheckboxSnippet(tokens);
    default: return generateHTMLButtonSnippet(tokens);
  }
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
  const interactionMotion = resolveInteractionMotion(interaction);
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
  --v-hover-lift: ${interactionMotion.hoverLift}px;
  --v-hover-brighten: ${interaction.hover.brighten};
  --v-active-press: ${interactionMotion.activePress}px;
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

export function generateAllExports(tokens: VibeTokens, componentType: ComponentType = 'button'): Record<ExportFormat, ExportResult> {
  return {
    react: generateReactComponent(tokens, componentType),
    vue: generateVueComponent(tokens, componentType),
    html: generateHTMLSnippets(tokens, componentType),
    tailwind: generateTailwindConfig(tokens),
    css: generateCSSVariables(tokens),
    json: generateJSONTokens(tokens),
    figma: generateFigmaTokens(tokens),
    styleDictionary: generateStyleDictionary(tokens),
    styledComponents: generateStyledComponents(tokens),
    emotion: generateEmotion(tokens)
  };
}
