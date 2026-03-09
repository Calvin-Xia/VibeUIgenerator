import { formatHex, parse, wcagContrast } from 'culori';

const SIX_DIGIT_HEX_REGEX = /^#[0-9a-f]{6}$/;

export function isSixDigitHexColor(value: string): boolean {
  return SIX_DIGIT_HEX_REGEX.test(value);
}

export function normalizeToSixDigitHex(color: string): string | null {
  if (typeof color !== 'string') {
    return null;
  }

  const parsed = parse(color.trim());
  if (!parsed) {
    return null;
  }

  const alpha = typeof parsed.alpha === 'number' ? parsed.alpha : 1;
  if (alpha < 1) {
    return null;
  }

  const hex = formatHex(parsed);
  if (!hex) {
    return null;
  }

  const normalized = hex.toLowerCase();
  return isSixDigitHexColor(normalized) ? normalized : null;
}

export function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeToSixDigitHex(color);
  if (!normalized) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16)
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((value) => {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function hexToHsla(color: string): { h: number; s: number; l: number; a: number } {
  const rgb = hexToRgb(color);
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

export function hslaToHex(h: number, s: number, l: number): string {
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

  const toHex = (value: number) => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function adjustLightness(color: string, amount: number): string {
  const hsla = hexToHsla(color);
  const newL = Math.max(0, Math.min(100, hsla.l + amount * 100));
  return hslaToHex(hsla.h, hsla.s, newL);
}

export function adjustSaturation(color: string, amount: number): string {
  const hsla = hexToHsla(color);
  const newS = Math.max(0, Math.min(100, hsla.s + amount * 100));
  return hslaToHex(hsla.h, newS, hsla.l);
}

export function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
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
  const gradientStops = sorted.map((stop) => `${stop.color} ${stop.pos}%`).join(', ');
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
