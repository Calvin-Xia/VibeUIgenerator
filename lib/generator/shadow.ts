import { hexToRgb, rgbToHex, withOpacity } from './color';

export interface ShadowParams {
  elevation: number;
  softness: number;
  spread: number;
  color: string;
}

export function shadowFromElevation(params: ShadowParams): string {
  const { elevation, softness, spread, color } = params;
  const rgb = hexToRgb(color);
  if (!rgb) return 'none';

  const y = Math.max(1, 1 + elevation * 0.8);
  const blur = Math.max(4, 4 + elevation * 1.8 + softness * 20);
  const baseColor = withOpacity(color, 0.15 + elevation * 0.02);

  const shadows: string[] = [];

  shadows.push(`0 ${y}px ${blur}px ${spread}px ${baseColor}`);

  if (elevation > 4) {
    const glowOpacity = 0.08 + softness * 0.1;
    shadows.push(`0 ${y * 2}px ${blur * 2}px ${spread + 4}px ${withOpacity(color, glowOpacity)}`);
  }

  if (elevation > 8) {
    const topShadow = withOpacity(color, 0.05);
    shadows.push(`0 -${y / 2}px ${blur / 2}px ${spread}px ${topShadow}`);
  }

  return shadows.join(', ');
}

export function generateMultiLayerShadow(
  elevation: number,
  softness: number,
  spread: number,
  baseColor: string
): string {
  const layers: string[] = [];

  for (let i = 1; i <= Math.ceil(elevation / 4); i++) {
    const factor = i / Math.ceil(elevation / 4);
    const layerSpread = spread * (1 - factor * 0.3);
    const opacity = 0.12 * (1 - factor * 0.5) * (1 + softness * 0.3);
    const layerY = i * 2 * (1 + softness * 0.2);
    const layerBlur = 4 + i * 4 + softness * 10;

    const layerColor = withOpacity(baseColor, opacity);
    layers.push(`0 ${layerY}px ${layerBlur}px ${layerSpread}px ${layerColor}`);
  }

  return layers.join(', ');
}

export function generateGlowShadow(
  size: number,
  opacity: number,
  color: string
): string {
  const rgb = hexToRgb(color);
  if (!rgb) return 'none';

  const glowColor = withOpacity(color, opacity);
  return `0 0 ${size}px ${size / 2}px ${glowColor}`;
}

export function generateInnerShadow(
  elevation: number,
  color: string
): string {
  const rgb = hexToRgb(color);
  if (!rgb) return 'none';

  const opacity = 0.1 + elevation * 0.02;
  const insetY = elevation * 0.5;
  const blur = elevation * 2;

  return `inset 0 ${insetY}px ${blur}px ${withOpacity(color, opacity)}`;
}

export function generateLayeredShadows(
  elevation: number,
  softness: number,
  spread: number,
  color: string,
  options?: {
    includeGlow?: boolean;
    includeInset?: boolean;
    glowSize?: number;
    glowOpacity?: number;
  }
): string {
  const shadows: string[] = [];

  const mainShadow = shadowFromElevation({ elevation, softness, spread, color });
  shadows.push(mainShadow);

  if (options?.includeGlow && elevation > 2) {
    const glow = generateGlowShadow(
      options.glowSize ?? 20,
      options.glowOpacity ?? 0.15,
      color
    );
    shadows.push(glow);
  }

  if (options?.includeInset) {
    const inset = generateInnerShadow(elevation, color);
    shadows.push(inset);
  }

  return shadows.join(', ');
}
