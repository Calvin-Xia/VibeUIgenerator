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
