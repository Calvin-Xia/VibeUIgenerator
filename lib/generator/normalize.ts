import LZString from 'lz-string';
import { VibeTokens } from '@/lib/types/tokens';

const SCHEMA_VERSION = '1.0.0';

export function encodeToURL(tokens: VibeTokens): string {
  const json = JSON.stringify(tokens);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeFromURL(encoded: string): VibeTokens | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const tokens = JSON.parse(decompressed) as VibeTokens;

    if (!validateTokens(tokens)) {
      console.warn('Invalid tokens schema');
      return null;
    }

    return tokens;
  } catch (error) {
    console.error('Failed to decode URL:', error);
    return null;
  }
}

export function validateTokens(tokens: unknown): tokens is VibeTokens {
  if (!tokens || typeof tokens !== 'object') return false;

  const t = tokens as Record<string, unknown>;

  if (t.schemaVersion !== SCHEMA_VERSION) {
    console.warn(`Schema version mismatch: expected ${SCHEMA_VERSION}, got ${t.schemaVersion}`);
  }

  if (!t.theme || typeof t.theme !== 'object') return false;
  if (!t.effects || typeof t.effects !== 'object') return false;
  if (!t.interaction || typeof t.interaction !== 'object') return false;
  if (!t.button || typeof t.button !== 'object') return false;
  if (!t.card || typeof t.card !== 'object') return false;

  return true;
}

export function exportToJSON(tokens: VibeTokens, pretty: boolean = true): string {
  return JSON.stringify(tokens, null, pretty ? 2 : 0);
}

export function importFromJSON(json: string): VibeTokens | null {
  try {
    const tokens = JSON.parse(json) as VibeTokens;
    if (!validateTokens(tokens)) return null;
    return tokens;
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

    const schemes = JSON.parse(stored) as VibeTokens[];
    return schemes.filter(validateTokens).slice(0, 10);
  } catch {
    return [];
  }
}

export function addRecentScheme(tokens: VibeTokens): void {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentSchemes();
    const exists = recent.some(
      (s) => JSON.stringify(s) === JSON.stringify(tokens)
    );

    if (!exists) {
      const updated = [tokens, ...recent].slice(0, 10);
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

    const presets = JSON.parse(stored) as VibeTokens[];
    return presets.filter(validateTokens);
  } catch {
    return [];
  }
}

export function savePreset(tokens: VibeTokens, name: string): void {
  if (typeof window === 'undefined') return;

  try {
    const saved = getSavedPresets();
    const newPreset = { ...tokens, _presetName: name, _createdAt: Date.now() };
    const updated = [newPreset, ...saved];
    localStorage.setItem('vibeui:savedPresets', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save preset:', error);
  }
}
