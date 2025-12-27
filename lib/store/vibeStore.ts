import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VibeTokens, Preset, ComponentType, ComponentState } from '@/lib/types/tokens';
import { generateVibeStyles } from '@/lib/generator';
import { decodeFromURL, encodeToURL, validateTokens, addRecentScheme } from '@/lib/generator/normalize';

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
  selectedState: ComponentState;
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

function createRNG(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const useVibeStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tokens: DEFAULT_TOKENS,
      ui: {
        selectedComponent: 'button',
        selectedState: 'default',
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
      })
    }
  )
);

export const createActions = (set: (partial: Partial<StoreState> | ((state: StoreState) => Partial<StoreState>)) => void, get: () => StoreState) => ({
  setToken: <T>(path: string, value: T) => {
    set((state) => {
      const keys = path.split('.');
      const newTokens = JSON.parse(JSON.stringify(state.tokens));
      let current: any = newTokens;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;

      if (path === 'theme.radius.baseRadius') {
        newTokens.button.radius = Math.min(Math.max(Number(value) - 4, 0), 32);
        newTokens.card.radius = Math.min(Math.max(Number(value) + 4, 0), 48);
      }
      
      addRecentScheme(newTokens);
      
      return {
        tokens: newTokens,
        ui: { ...state.ui, version: state.ui.version + 1 }
      };
    });
  },

  applyPreset: (preset: Preset) => {
    set({
      tokens: JSON.parse(JSON.stringify(preset.tokens)),
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
    addRecentScheme(preset.tokens);
  },

  randomize: (seed?: number) => {
    const rng = seed !== undefined ? createRNG(seed) : Math.random;
    const newTokens = JSON.parse(JSON.stringify(DEFAULT_TOKENS)) as VibeTokens;
    
    const randomColor = () => {
      const hue = Math.floor(rng() * 360);
      const sat = 50 + Math.floor(rng() * 30);
      const light = 45 + Math.floor(rng() * 20);
      return `hsl(${hue}, ${sat}%, ${light}%)`;
    };
    
    newTokens.theme.palette.accent = randomColor();
    newTokens.effects.shadow.elevation = Math.floor(rng() * 20);
    newTokens.effects.glass.enabled = rng() > 0.5;
    newTokens.effects.glow.enabled = rng() > 0.5;
    newTokens.button.radius = 4 + Math.floor(rng() * 12);
    newTokens.card.radius = 8 + Math.floor(rng() * 16);
    
    set({
      tokens: newTokens,
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
    addRecentScheme(newTokens);
  },

  exportJSON: () => {
    return JSON.stringify(get().tokens, null, 2);
  },

  importJSON: (json: string) => {
    try {
      const tokens = JSON.parse(json) as VibeTokens;
      if (!validateTokens(tokens)) {
        return false;
      }
      set({
        tokens,
        ui: { ...get().ui, version: get().ui.version + 1 }
      });
      addRecentScheme(tokens);
      return true;
    } catch {
      return false;
    }
  },

  getShareURL: () => {
    const tokens = get().tokens;
    const encoded = encodeToURL(tokens);
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/?s=${encoded}`;
  },

  loadFromURL: (tokens: VibeTokens) => {
    set({
      tokens: JSON.parse(JSON.stringify(tokens)),
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
  },

  reset: () => {
    set({
      tokens: JSON.parse(JSON.stringify(DEFAULT_TOKENS)),
      ui: { ...get().ui, version: get().ui.version + 1 }
    });
  },

  setBuiltIn: (presets: Preset[]) => {
    set((state) => ({
      presets: { ...state.presets, builtIn: presets }
    }));
  },

  addSavedPreset: (preset: Preset) => {
    set((state) => ({
      presets: { ...state.presets, saved: [preset, ...state.presets.saved] }
    }));
  },

  removeSavedPreset: (id: string) => {
    set((state) => ({
      presets: { ...state.presets, saved: state.presets.saved.filter(p => p.id !== id) }
    }));
  },

  toggleFavorite: (id: string) => {
    set((state) => ({
      presets: {
        ...state.presets,
        favorites: state.presets.favorites.includes(id)
          ? state.presets.favorites.filter(fid => fid !== id)
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

  setSelectedState: (state: ComponentState) => {
    set((currentState) => ({
      ui: { ...currentState.ui, selectedState: state }
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

export function useGeneratedStyles() {
  const tokens = useVibeStore((state) => state.tokens);
  return generateVibeStyles(tokens);
}

export function useContrastRatio() {
  const tokens = useVibeStore((state) => state.tokens);
  const { getContrastRating } = require('@/lib/generator/color');
  return getContrastRating(tokens.theme.palette.text, tokens.theme.palette.bg);
}

export { DEFAULT_TOKENS };
