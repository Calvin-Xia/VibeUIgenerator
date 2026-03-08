declare module 'culori' {
  export interface ParsedColor {
    mode?: string;
    alpha?: number;
    [key: string]: string | number | undefined;
  }

  export function parse(color: string): ParsedColor | undefined;
  export function formatHex(color: ParsedColor): string | undefined;
  export function wcagContrast(foreground: string, background: string): number;
}
