import LZString from 'lz-string';
import { VibeTokens } from '@/lib/types/tokens';
import { isSixDigitHexColor, normalizeToSixDigitHex } from './color';

const SCHEMA_VERSION = '1.0.0';
const THEME_MODES = new Set(['light', 'dark']);
const BUTTON_VARIANTS = new Set(['solid', 'outline', 'ghost']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneTokens(tokens: VibeTokens): VibeTokens {
  return JSON.parse(JSON.stringify(tokens)) as VibeTokens;
}

function assertRecord(value: unknown, path: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${path} must be an object`);
  }
}

function assertString(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`${path} must be a string`);
  }
}

function assertHexColor(value: unknown, path: string): asserts value is string {
  assertString(value, path);
  if (!isSixDigitHexColor(value)) {
    throw new Error(`${path} must be a 6-digit hex color`);
  }
}

function assertNumber(value: unknown, path: string): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${path} must be a number`);
  }
}

function assertBoolean(value: unknown, path: string): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${path} must be a boolean`);
  }
}


function assertOptionalHexColor(value: unknown, path: string): void {
  if (value !== undefined) {
    assertHexColor(value, path);
  }
}

function assertEnum<T extends string>(value: unknown, path: string, allowed: ReadonlySet<T>): asserts value is T {
  if (typeof value !== 'string' || !allowed.has(value as T)) {
    throw new Error(`${path} must be one of ${Array.from(allowed).join(', ')}`);
  }
}

function assertGradientStops(value: unknown, path: string): void {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array`);
  }

  value.forEach((stop, index) => {
    assertRecord(stop, `${path}[${index}]`);
    assertString(stop.color, `${path}[${index}].color`);
    assertNumber(stop.pos, `${path}[${index}].pos`);
  });
}

function normalizeRequiredHexColor(value: string, path: string): string {
  const normalized = normalizeToSixDigitHex(value);
  if (!normalized) {
    throw new Error(`${path} must be a 6-digit hex color`);
  }

  return normalized;
}

function normalizeOptionalHexColor(value: string | undefined, path: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return normalizeRequiredHexColor(value, path);
}

export function normalizeTokenColors(tokens: VibeTokens): VibeTokens {
  const normalized = cloneTokens(tokens);

  normalized.theme.palette.accent = normalizeRequiredHexColor(normalized.theme.palette.accent, 'theme.palette.accent');
  normalized.theme.palette.accent2 = normalizeOptionalHexColor(normalized.theme.palette.accent2, 'theme.palette.accent2');
  normalized.theme.palette.bg = normalizeRequiredHexColor(normalized.theme.palette.bg, 'theme.palette.bg');
  normalized.theme.palette.surface = normalizeRequiredHexColor(normalized.theme.palette.surface, 'theme.palette.surface');
  normalized.theme.palette.text = normalizeRequiredHexColor(normalized.theme.palette.text, 'theme.palette.text');
  normalized.theme.palette.mutedText = normalizeRequiredHexColor(normalized.theme.palette.mutedText, 'theme.palette.mutedText');
  normalized.theme.palette.border = normalizeRequiredHexColor(normalized.theme.palette.border, 'theme.palette.border');

  normalized.effects.shadow.color = normalizeRequiredHexColor(normalized.effects.shadow.color, 'effects.shadow.color');

  normalized.interaction.hover.lift = Math.abs(normalized.interaction.hover.lift);

  normalized.button.override.bg = normalizeOptionalHexColor(normalized.button.override.bg, 'button.override.bg');
  normalized.button.override.text = normalizeOptionalHexColor(normalized.button.override.text, 'button.override.text');
  normalized.button.override.border = normalizeOptionalHexColor(normalized.button.override.border, 'button.override.border');

  return normalized;
}

function tryNormalizeTokens(tokens: unknown): VibeTokens | null {
  try {
    const normalized = normalizeTokenColors(tokens as VibeTokens);
    return validateTokens(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

function getTokenValidationError(tokens: unknown): string | null {
  try {
    assertRecord(tokens, 'tokens');

    assertString(tokens.schemaVersion, 'schemaVersion');
    if (tokens.schemaVersion !== SCHEMA_VERSION) {
      throw new Error(`schemaVersion must equal ${SCHEMA_VERSION}`);
    }

    assertRecord(tokens.theme, 'theme');
    assertEnum(tokens.theme.mode, 'theme.mode', THEME_MODES);

    assertRecord(tokens.theme.palette, 'theme.palette');
    assertHexColor(tokens.theme.palette.accent, 'theme.palette.accent');
    assertOptionalHexColor(tokens.theme.palette.accent2, 'theme.palette.accent2');
    assertHexColor(tokens.theme.palette.bg, 'theme.palette.bg');
    assertHexColor(tokens.theme.palette.surface, 'theme.palette.surface');
    assertHexColor(tokens.theme.palette.text, 'theme.palette.text');
    assertHexColor(tokens.theme.palette.mutedText, 'theme.palette.mutedText');
    assertHexColor(tokens.theme.palette.border, 'theme.palette.border');

    assertRecord(tokens.theme.typography, 'theme.typography');
    assertString(tokens.theme.typography.fontFamily, 'theme.typography.fontFamily');
    assertNumber(tokens.theme.typography.fontSize, 'theme.typography.fontSize');
    assertNumber(tokens.theme.typography.fontWeight, 'theme.typography.fontWeight');
    assertNumber(tokens.theme.typography.letterSpacing, 'theme.typography.letterSpacing');

    assertRecord(tokens.theme.radius, 'theme.radius');
    assertNumber(tokens.theme.radius.baseRadius, 'theme.radius.baseRadius');

    assertRecord(tokens.theme.spacing, 'theme.spacing');
    assertNumber(tokens.theme.spacing.paddingX, 'theme.spacing.paddingX');
    assertNumber(tokens.theme.spacing.paddingY, 'theme.spacing.paddingY');
    assertNumber(tokens.theme.spacing.cardPadding, 'theme.spacing.cardPadding');

    assertRecord(tokens.effects, 'effects');

    assertRecord(tokens.effects.shadow, 'effects.shadow');
    assertNumber(tokens.effects.shadow.elevation, 'effects.shadow.elevation');
    assertNumber(tokens.effects.shadow.softness, 'effects.shadow.softness');
    assertNumber(tokens.effects.shadow.spread, 'effects.shadow.spread');
    assertHexColor(tokens.effects.shadow.color, 'effects.shadow.color');

    assertRecord(tokens.effects.border, 'effects.border');
    assertNumber(tokens.effects.border.width, 'effects.border.width');
    assertNumber(tokens.effects.border.opacity, 'effects.border.opacity');

    assertRecord(tokens.effects.glass, 'effects.glass');
    assertBoolean(tokens.effects.glass.enabled, 'effects.glass.enabled');
    assertNumber(tokens.effects.glass.blur, 'effects.glass.blur');
    assertNumber(tokens.effects.glass.opacity, 'effects.glass.opacity');
    assertNumber(tokens.effects.glass.saturation, 'effects.glass.saturation');

    assertRecord(tokens.effects.gradient, 'effects.gradient');
    assertBoolean(tokens.effects.gradient.enabled, 'effects.gradient.enabled');
    assertNumber(tokens.effects.gradient.angle, 'effects.gradient.angle');
    assertGradientStops(tokens.effects.gradient.stops, 'effects.gradient.stops');

    assertRecord(tokens.effects.noise, 'effects.noise');
    assertBoolean(tokens.effects.noise.enabled, 'effects.noise.enabled');
    assertNumber(tokens.effects.noise.intensity, 'effects.noise.intensity');

    assertRecord(tokens.effects.glow, 'effects.glow');
    assertBoolean(tokens.effects.glow.enabled, 'effects.glow.enabled');
    assertNumber(tokens.effects.glow.size, 'effects.glow.size');
    assertNumber(tokens.effects.glow.opacity, 'effects.glow.opacity');

    assertRecord(tokens.interaction, 'interaction');

    assertRecord(tokens.interaction.transition, 'interaction.transition');
    assertNumber(tokens.interaction.transition.duration, 'interaction.transition.duration');
    assertString(tokens.interaction.transition.easing, 'interaction.transition.easing');

    assertRecord(tokens.interaction.hover, 'interaction.hover');
    assertNumber(tokens.interaction.hover.lift, 'interaction.hover.lift');
    assertNumber(tokens.interaction.hover.brighten, 'interaction.hover.brighten');
    assertNumber(tokens.interaction.hover.shadowBoost, 'interaction.hover.shadowBoost');

    assertRecord(tokens.interaction.active, 'interaction.active');
    assertNumber(tokens.interaction.active.press, 'interaction.active.press');
    assertNumber(tokens.interaction.active.darken, 'interaction.active.darken');

    assertRecord(tokens.button, 'button');
    assertEnum(tokens.button.variant, 'button.variant', BUTTON_VARIANTS);
    assertNumber(tokens.button.height, 'button.height');
    assertNumber(tokens.button.radius, 'button.radius');
    assertRecord(tokens.button.override, 'button.override');
    assertOptionalHexColor(tokens.button.override.bg, 'button.override.bg');
    assertOptionalHexColor(tokens.button.override.text, 'button.override.text');
    assertOptionalHexColor(tokens.button.override.border, 'button.override.border');

    assertRecord(tokens.card, 'card');
    assertNumber(tokens.card.radius, 'card.radius');
    assertNumber(tokens.card.padding, 'card.padding');
    assertNumber(tokens.card.surfaceAlpha, 'card.surfaceAlpha');
    assertNumber(tokens.card.borderAlpha, 'card.borderAlpha');

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Unknown token validation error';
  }
}

export function encodeToURL(tokens: VibeTokens): string {
  const json = JSON.stringify(tokens);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeFromURL(encoded: string): VibeTokens | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const tokens = JSON.parse(decompressed) as unknown;
    return tryNormalizeTokens(tokens);
  } catch (error) {
    console.error('Failed to decode URL:', error);
    return null;
  }
}

export function validateTokens(tokens: unknown): tokens is VibeTokens {
  const error = getTokenValidationError(tokens);

  if (error) {
    console.warn(`Invalid tokens schema: ${error}`);
    return false;
  }

  return true;
}

export function exportToJSON(tokens: VibeTokens, pretty: boolean = true): string {
  return JSON.stringify(tokens, null, pretty ? 2 : 0);
}

export function importFromJSON(json: string): VibeTokens | null {
  try {
    const tokens = JSON.parse(json) as unknown;
    return tryNormalizeTokens(tokens);
  } catch {
    return null;
  }
}

export function generateShareableURL(tokens: VibeTokens, baseUrl?: string): string {
  const encoded = encodeToURL(tokens);
  const url = new URL(baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : ''));
  url.searchParams.set('s', encoded);
  return url.toString();
}

export function getRecentSchemes(): VibeTokens[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('vibeui:recentSchemes');
    if (!stored) return [];

    const schemes = JSON.parse(stored) as unknown[];
    return schemes
      .map((scheme) => tryNormalizeTokens(scheme))
      .filter((scheme): scheme is VibeTokens => scheme !== null)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export function addRecentScheme(tokens: VibeTokens): void {
  if (typeof window === 'undefined') return;

  try {
    const normalized = tryNormalizeTokens(tokens);
    if (!normalized) {
      return;
    }

    const recent = getRecentSchemes();
    const exists = recent.some(
      (scheme) => JSON.stringify(scheme) === JSON.stringify(normalized)
    );

    if (!exists) {
      const updated = [normalized, ...recent].slice(0, 10);
      localStorage.setItem('vibeui:recentSchemes', JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to save recent scheme:', error);
  }
}

export function getSavedPresets(): VibeTokens[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('vibeui:savedPresets');
    if (!stored) return [];

    const presets = JSON.parse(stored) as unknown[];
    return presets
      .map((preset) => tryNormalizeTokens(preset))
      .filter((preset): preset is VibeTokens => preset !== null);
  } catch {
    return [];
  }
}

export function savePreset(tokens: VibeTokens, name: string): void {
  if (typeof window === 'undefined') return;

  try {
    const normalized = tryNormalizeTokens(tokens);
    if (!normalized) {
      return;
    }

    const saved = getSavedPresets();
    const newPreset = { ...normalized, _presetName: name, _createdAt: Date.now() };
    const updated = [newPreset, ...saved];
    localStorage.setItem('vibeui:savedPresets', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save preset:', error);
  }
}

