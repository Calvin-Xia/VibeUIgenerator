import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Preset, VibeTokens } from '@/lib/types/tokens';

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(() => null),
  length: 0
};

let storeModule: typeof import('@/lib/store/vibeStore');

function cloneTokens<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type StoreSnapshot = {
  tokens: VibeTokens;
  ui: {
    selectedComponent: 'button' | 'card';
    selectedState: 'default' | 'hover' | 'active' | 'focus';
    showBackground: boolean;
    showNoise: boolean;
    showGrid: boolean;
    activeTab: 'inspector' | 'preview' | 'code';
    initialized: boolean;
    version: number;
  };
  presets: {
    builtIn: Preset[];
    saved: Preset[];
    favorites: string[];
  };
};

function createTestHarness(initialTokens?: VibeTokens) {
  let state: StoreSnapshot = {
    tokens: cloneTokens(initialTokens ?? storeModule.DEFAULT_TOKENS),
    ui: {
      selectedComponent: 'button',
      selectedState: 'default',
      showBackground: true,
      showNoise: false,
      showGrid: false,
      activeTab: 'inspector',
      initialized: true,
      version: 0
    },
    presets: {
      builtIn: [],
      saved: [],
      favorites: []
    }
  };

  const set = (partial: Partial<StoreSnapshot> | ((currentState: StoreSnapshot) => Partial<StoreSnapshot>)) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = {
      ...state,
      ...nextState,
      tokens: nextState.tokens ?? state.tokens,
      ui: nextState.ui ?? state.ui,
      presets: nextState.presets ?? state.presets
    };
  };

  return {
    actions: storeModule.createActions(set as never, () => state as never),
    getState: () => state
  };
}

beforeAll(async () => {
  vi.stubGlobal('localStorage', localStorageMock);
  storeModule = await import('@/lib/store/vibeStore');
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

describe('vibe store color normalization', () => {
  it('stores a six-digit hex accent when randomize runs with a seed', () => {
    const { actions, getState } = createTestHarness();

    actions.randomize(42);

    expect(getState().tokens.theme.palette.accent).toMatch(/^#[0-9a-f]{6}$/);
    expect(getState().tokens.theme.palette.accent.startsWith('hsl')).toBe(false);
  });

  it('normalizes hex-contract colors in setToken before committing state', () => {
    const { actions, getState } = createTestHarness();

    actions.setToken('theme.palette.accent', 'hsl(0, 100%, 50%)');
    actions.setToken('effects.shadow.color', 'rgb(0, 255, 0)');

    expect(getState().tokens.theme.palette.accent).toBe('#ff0000');
    expect(getState().tokens.effects.shadow.color).toBe('#00ff00');
  });

  it('normalizes legacy preset colors during applyPreset', () => {
    const legacyTokens = cloneTokens(storeModule.DEFAULT_TOKENS);
    legacyTokens.theme.palette.accent = 'rgb(255, 0, 0)';
    legacyTokens.theme.palette.bg = 'hsl(0, 0%, 100%)';
    legacyTokens.effects.shadow.color = 'hsl(240, 100%, 50%)';
    legacyTokens.button.override.text = 'rgb(0, 0, 0)';

    const legacyPreset: Preset = {
      id: 'legacy-preset',
      name: 'Legacy Preset',
      tokens: legacyTokens
    };

    const { actions, getState } = createTestHarness();
    actions.applyPreset(legacyPreset);

    expect(getState().tokens.theme.palette.accent).toBe('#ff0000');
    expect(getState().tokens.theme.palette.bg).toBe('#ffffff');
    expect(getState().tokens.effects.shadow.color).toBe('#0000ff');
    expect(getState().tokens.button.override.text).toBe('#000000');
  });

  it('normalizes legacy negative hover lift values during applyPreset', () => {
    const legacyTokens = cloneTokens(storeModule.DEFAULT_TOKENS);
    legacyTokens.interaction.hover.lift = -6;

    const legacyPreset: Preset = {
      id: 'legacy-hover-lift',
      name: 'Legacy Hover Lift',
      tokens: legacyTokens
    };

    const { actions, getState } = createTestHarness();
    actions.applyPreset(legacyPreset);

    expect(getState().tokens.interaction.hover.lift).toBe(6);
  });
});
