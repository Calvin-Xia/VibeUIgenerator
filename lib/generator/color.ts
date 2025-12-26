import { wcagContrast } from 'culori';

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function hexToHsla(hex: string): { h: number; s: number; l: number; a: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0, a: 1 };

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100, a: 1 };
}

export function hslaToHex(h: number, s: number, l: number, a: number = 1): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const alphaHex = a < 1 ? toHex(a * 255) : '';
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

export function adjustLightness(hex: string, amount: number): string {
  const hsla = hexToHsla(hex);
  const newL = Math.max(0, Math.min(100, hsla.l + amount * 100));
  return hslaToHex(hsla.h, hsla.s, newL, hsla.a);
}

export function adjustSaturation(hex: string, amount: number): string {
  const hsla = hexToHsla(hex);
  const newS = Math.max(0, Math.min(100, hsla.s + amount * 100));
  return hslaToHex(hsla.h, newS, hsla.l, hsla.a);
}

export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export function getContrastRatio(foreground: string, background: string): number {
  return wcagContrast(foreground, background);
}

export function getContrastRating(foreground: string, background: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaaLarge: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 3
  };
}

export function generateGradientStops(
  angle: number,
  stops: Array<{ color: string; pos: number }>
): string {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const gradientStops = sorted.map(s => `${s.color} ${s.pos}%`).join(', ');
  return `linear-gradient(${angle}deg, ${gradientStops})`;
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return color1;

  const r = rgb1.r + (rgb2.r - rgb1.r) * factor;
  const g = rgb1.g + (rgb2.g - rgb1.g) * factor;
  const b = rgb1.b + (rgb2.b - rgb1.b) * factor;

  return rgbToHex(r, g, b);
}
