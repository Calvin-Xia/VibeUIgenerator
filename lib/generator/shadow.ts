import { hexToRgb, withOpacity } from './color';

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
