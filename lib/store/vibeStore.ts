import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VibeTokens, Preset, ComponentType } from '@/lib/types/tokens';
import { hslaToHex, getContrastRating } from '@/lib/generator/color';
import {
  encodeToURL,
  importFromJSON,
  validateTokens,
  addRecentScheme,
  normalizeTokenColors
} from '@/lib/generator/normalize';

const DEFAULT_TOKENS: VibeTokens = {
  schemaVersion: '1.0.0',
  theme: {
    mode: 'light',
    palette: {
      accent: '#6366f1',
      accent2: '#8b5cf6',
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      mutedText: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0
    },
    radius: {
      baseRadius: 12
    },
    spacing: {
      paddingX: 24,
      paddingY: 12,
      cardPadding: 24
    }
  },
  effects: {
    shadow: {
      elevation: 8,
      softness: 0.3,
      spread: -2,
      color: '#1e293b'
    },
    border: {
      width: 1,
      opacity: 1
    },
    glass: {
      enabled: false,
      blur: 12,
      opacity: 0.3,
      saturation: 1.2
    },
    gradient: {
      enabled: true,
      angle: 135,
      stops: [
        { color: '#f0f9ff', pos: 0 },
        { color: '#e0f2fe', pos: 100 }
      ]
    },
    noise: {
      enabled: false,
      intensity: 0.03
    },
    glow: {
      enabled: true,
      size: 24,
      opacity: 0.15
    }
  },
  interaction: {
    transition: {
      duration: 200,
      easing: 'ease-out'
    },
    hover: {
      lift: 2,
      brighten: 0.05,
      shadowBoost: 0.3
    },
    active: {
      press: 1,
      darken: 0.08
    }
  },
  button: {
    variant: 'solid',
    height: 44,
    radius: 8,
    override: {
      bg: undefined,
      text: undefined,
      border: undefined
    }
  },
  card: {
    radius: 16,
    padding: 24,
    surfaceAlpha: 1,
    borderAlpha: 0.5
  }
};

interface UIState {
  selectedComponent: ComponentType;
  showBackground: boolean;
  showNoise: boolean;
  showGrid: boolean;
  activeTab: 'inspector' | 'preview' | 'code';
  initialized: boolean;
  version: number;
}

interface PresetsState {
  builtIn: Preset[];
  saved: Preset[];
  favorites: string[];
}

interface StoreState {
  tokens: VibeTokens;
  ui: UIState;
  presets: PresetsState;
}

interface PersistedStoreState {
  tokens?: unknown;
  presets?: {
    saved?: unknown;
    favorites?: unknown;
  };
}

function createRNG(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function normalizeTokensOrNull(tokens: unknown): VibeTokens | null {
  try {
    const normalized = normalizeTokenColors(tokens as VibeTokens);
    return validateTokens(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

function normalizePreset(preset: Preset): Preset | null {
  const normalizedTokens = normalizeTokensOrNull(preset.tokens);
  if (!normalizedTokens) {
    return null;
  }

  const normalizedPreset = cloneValue(preset);
  normalizedPreset.tokens = normalizedTokens;
  return normalizedPreset;
}

function normalizePersistedPreset(value: unknown): Preset | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string') return null;
  if (typeof value.name !== 'string') return null;
  if ('description' in value && value.description !== undefined && typeof value.description !== 'string') return null;
  if ('thumbnail' in value && value.thumbnail !== undefined && typeof value.thumbnail !== 'string') return null;
  if ('tags' in value && value.tags !== undefined && !isStringArray(value.tags)) return null;
  if ('isBuiltIn' in value && value.isBuiltIn !== undefined && typeof value.isBuiltIn !== 'boolean') return null;
  if ('createdAt' in value && value.createdAt !== undefined && typeof value.createdAt !== 'number') return null;

  const normalizedTokens = normalizeTokensOrNull(value.tokens);
  if (!normalizedTokens) {
    return null;
  }

  return {
    ...value,
    tokens: normalizedTokens
  } as Preset;
}

function sanitizePersistedState(persistedState: unknown, currentState: StoreState): StoreState {
  if (!isRecord(persistedState)) {
    return currentState;
  }

  const persisted = persistedState as PersistedStoreState;

  let tokens = currentState.tokens;
  if (persisted.tokens !== undefined) {
    const normalizedTokens = normalizeTokensOrNull(persisted.tokens);
    if (normalizedTokens) {
      tokens = normalizedTokens;
    } else {
      console.warn('Discarding invalid persisted tokens payload and falling back to defaults.');
      tokens = cloneValue(DEFAULT_TOKENS);
    }
  }

  let saved = currentState.presets.saved;
  let favorites = currentState.presets.favorites;

  if (isRecord(persisted.presets)) {
    const persistedSaved = persisted.presets.saved;
    if (Array.isArray(persistedSaved)) {
      const validSaved = persistedSaved
        .map((preset) => normalizePersistedPreset(preset))
        .filter((preset): preset is Preset => preset !== null);

      if (validSaved.length !== persistedSaved.length) {
        console.warn('Discarded invalid saved presets from persisted store.');
      }

      saved = validSaved.map((preset) => cloneValue(preset));
    }

    if (persisted.presets.favorites !== undefined) {
      favorites = isStringArray(persisted.presets.favorites)
        ? [...new Set(persisted.presets.favorites)]
        : currentState.presets.favorites;
    }
  }

  return {
    ...currentState,
    tokens,
    presets: {
      ...currentState.presets,
      saved,
      favorites
    }
  };
}

export const useVibeStore = create<StoreState>()(
  persist(
    (): StoreState => ({
      tokens: cloneValue(DEFAULT_TOKENS),
      ui: {
        selectedComponent: 'button',
        showBackground: true,
        showNoise: false,
        showGrid: false,
        activeTab: 'inspector',
        initialized: false,
        version: 0
      },
      presets: {
        builtIn: [],
        saved: [],
        favorites: []
      }
    }),
    {
      name: 'vibeui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        presets: {
          saved: state.presets.saved,
          favorites: state.presets.favorites
        }
      }),
      merge: (persistedState, currentState) => sanitizePersistedState(persistedState, currentState),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.ui.initialized = true;
        }
      }
    }
  )
);

export const createActions = (set: (partial: Partial<StoreState> | ((state: StoreState) => Partial<StoreState>)) => void, get: () => StoreState) => ({
  setToken: <T>(path: string, value: T) => {
    set((state) => {
      const keys = path.split('.');
      const newTokens = cloneValue(state.tokens);
      let current: any = newTokens;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      if (path === 'theme.radius.baseRadius') {
        newTokens.button.radius = Math.min(Math.max(Number(value) - 4, 0), 32);
        newTokens.card.radius = Math.min(Math.max(Number(value) + 4, 0), 48);
      }

      const normalizedTokens = normalizeTokensOrNull(newTokens);
      if (!normalizedTokens) {
        console.warn(`Discarding invalid token update for ${path}.`);
        return {};
      }

      addRecentScheme(normalizedTokens);

      return {
        tokens: normalizedTokens,
        ui: { ...state.ui, version: state.ui.version + 1 }
      };
    });
  },

  applyPreset: (preset: Preset) => {
    const normalizedPreset = normalizePreset(preset);
    if (!normalizedPreset) {
      console.warn('Discarding invalid preset application.');
      return;
    }

    set({
      tokens: normalizedPreset.tokens,
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
    addRecentScheme(normalizedPreset.tokens);
  },

  randomize: (seed?: number) => {
    const rng = seed !== undefined ? createRNG(seed) : Math.random;
    const newTokens = cloneValue(DEFAULT_TOKENS);

    const randomColor = () => {
      const hue = Math.floor(rng() * 360);
      const sat = 50 + Math.floor(rng() * 30);
      const light = 45 + Math.floor(rng() * 20);
      return hslaToHex(hue, sat, light);
    };

    newTokens.theme.palette.accent = randomColor();
    newTokens.effects.shadow.elevation = Math.floor(rng() * 20);
    newTokens.effects.glass.enabled = rng() > 0.5;
    newTokens.effects.glow.enabled = rng() > 0.5;
    newTokens.button.radius = 4 + Math.floor(rng() * 12);
    newTokens.card.radius = 8 + Math.floor(rng() * 16);

    const normalizedTokens = normalizeTokenColors(newTokens);

    set({
      tokens: normalizedTokens,
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
    addRecentScheme(normalizedTokens);
  },

  exportJSON: () => {
    return JSON.stringify(get().tokens, null, 2);
  },

  importJSON: (json: string) => {
    const tokens = importFromJSON(json);
    if (!tokens) {
      return false;
    }

    set({
      tokens,
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
    addRecentScheme(tokens);
    return true;
  },

  getShareURL: () => {
    const tokens = get().tokens;
    const encoded = encodeToURL(tokens);
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/?s=${encoded}`;
  },

  loadFromURL: (tokens: VibeTokens) => {
    const normalizedTokens = normalizeTokensOrNull(tokens);
    if (!normalizedTokens) {
      console.warn('Discarding invalid URL token payload.');
      return;
    }

    set({
      tokens: normalizedTokens,
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
  },

  reset: () => {
    set({
      tokens: cloneValue(DEFAULT_TOKENS),
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
  },

  setBuiltIn: (presets: Preset[]) => {
    const normalizedPresets = presets
      .map((preset) => normalizePreset(preset))
      .filter((preset): preset is Preset => preset !== null);

    if (normalizedPresets.length !== presets.length) {
      console.warn('Discarded invalid built-in presets during load.');
    }

    set((state) => ({
      presets: { ...state.presets, builtIn: normalizedPresets }
    }));
  },

  addSavedPreset: (preset: Preset) => {
    const normalizedPreset = normalizePreset(preset);
    if (!normalizedPreset) {
      console.warn('Discarding invalid saved preset.');
      return;
    }

    set((state) => ({
      presets: { ...state.presets, saved: [normalizedPreset, ...state.presets.saved] }
    }));
  },

  removeSavedPreset: (id: string) => {
    set((state) => ({
      presets: { ...state.presets, saved: state.presets.saved.filter((preset) => preset.id !== id) }
    }));
  },

  toggleFavorite: (id: string) => {
    set((state) => ({
      presets: {
        ...state.presets,
        favorites: state.presets.favorites.includes(id)
          ? state.presets.favorites.filter((favoriteId) => favoriteId !== id)
          : [...state.presets.favorites, id]
      }
    }));
  },

  isFavorite: (id: string) => {
    return get().presets.favorites.includes(id);
  },

  setSelectedComponent: (component: ComponentType) => {
    set((state) => ({
      ui: { ...state.ui, selectedComponent: component }
    }));
  },

  setActiveTab: (tab: 'inspector' | 'preview' | 'code') => {
    set((state) => ({
      ui: { ...state.ui, activeTab: tab }
    }));
  },

  toggleBackground: () => {
    set((state) => ({
      ui: { ...state.ui, showBackground: !state.ui.showBackground }
    }));
  },

  toggleNoise: () => {
    set((state) => ({
      ui: { ...state.ui, showNoise: !state.ui.showNoise }
    }));
  },

  toggleGrid: () => {
    set((state) => ({
      ui: { ...state.ui, showGrid: !state.ui.showGrid }
    }));
  }
});


export function useContrastRatio() {
  const tokens = useVibeStore((state) => state.tokens);
  return getContrastRating(tokens.theme.palette.text, tokens.theme.palette.bg);
}

export { DEFAULT_TOKENS };

