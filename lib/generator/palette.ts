import { parse, formatHex } from 'culori';

interface Color {
  h: number;
  s: number;
  l: number;
}

function hexToHsl(hex: string): Color | null {
  const parsed = parse(hex);
  if (!parsed) return null;

  if (parsed.mode === 'hsl') {
    return {
      h: Number(parsed.h ?? 0),
      s: Number(parsed.s ?? 0) * 100,
      l: Number(parsed.l ?? 0) * 100
    };
  }

  if (parsed.mode === 'rgb') {
    const r = Number(parsed.r ?? 0) / 255;
    const g = Number(parsed.g ?? 0) / 255;
    const b = Number(parsed.b ?? 0) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
      return { h: 0, s: 0, l: l * 100 };
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  return null;
}

function hslToHex(h: number, s: number, l: number): string {
  return formatHex({ mode: 'hsl', h, s: s / 100, l: l / 100 }) ?? '#000000';
}

export function generateComplementary(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  return [
    hex,
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
  ];
}

export function generateAnalogous(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
  ];
}

export function generateTriadic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  return [
    hex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
  ];
}

export function generateSplitComplementary(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  return [
    hex,
    hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
  ];
}

export function generateTetradic(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  return [
    hex,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
  ];
}

export function generateMonochromatic(hex: string, steps: number = 5): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];

  const colors: string[] = [];
  const lightnessStep = (90 - 20) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    colors.push(hslToHex(hsl.h, hsl.s, 20 + lightnessStep * i));
  }

  return colors;
}

export type PaletteType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

export function generatePalette(hex: string, type: PaletteType): string[] {
  switch (type) {
    case 'complementary': return generateComplementary(hex);
    case 'analogous': return generateAnalogous(hex);
    case 'triadic': return generateTriadic(hex);
    case 'split-complementary': return generateSplitComplementary(hex);
    case 'tetradic': return generateTetradic(hex);
    case 'monochromatic': return generateMonochromatic(hex);
    default: return [hex];
  }
}
