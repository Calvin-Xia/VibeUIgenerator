declare module 'culori' {
  export function wcagContrast(foreground: string, background: string): number;
  export function hexToRgb(hex: string): { r: number; g: number; b: number } | null;
  export function rgbToHex(r: number, g: number, b: number): string;
  export function hslToHex(h: number, s: number, l: number): string;
  export function hexToHsl(hex: string): { h: number; s: number; l: number } | null;
  export function formatHex(color: string): string;
  export function parseColor(color: string): any;
}
