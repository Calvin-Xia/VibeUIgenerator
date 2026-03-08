import { describe, expect, it } from 'vitest';

import { hexToRgb, normalizeToSixDigitHex, withOpacity } from '@/lib/generator/color';

describe('color normalization', () => {
  it('normalizes supported CSS colors to six-digit hex', () => {
    expect(normalizeToSixDigitHex('#ABCDEF')).toBe('#abcdef');
    expect(normalizeToSixDigitHex('hsl(0, 100%, 50%)')).toBe('#ff0000');
    expect(normalizeToSixDigitHex('rgb(0, 128, 255)')).toBe('#0080ff');
  });

  it('rejects invalid or alpha-bearing colors', () => {
    expect(normalizeToSixDigitHex('not-a-color')).toBeNull();
    expect(normalizeToSixDigitHex('rgba(255, 0, 0, 0.5)')).toBeNull();
    expect(normalizeToSixDigitHex('hsla(120, 100%, 50%, 0.5)')).toBeNull();
  });

  it('parses legacy colors when deriving rgb and rgba output', () => {
    expect(hexToRgb('hsl(120, 100%, 50%)')).toEqual({ r: 0, g: 255, b: 0 });
    expect(withOpacity('rgb(255, 0, 0)', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });
});
