import { describe, it, expect } from 'vitest';
import {
  createHistory,
  pushEntry,
  undo,
  redo,
  getCurrentTokens,
  canUndo,
  canRedo,
  getHistoryLength,
  getCurrentIndex,
  clearHistory
} from './history';
import { VibeTokens } from '@/lib/types/tokens';

const createMockTokens = (accent: string = '#6366f1'): VibeTokens => ({
  schemaVersion: '1.0.0',
  theme: {
    mode: 'light',
    palette: {
      accent,
      bg: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      mutedText: '#64748b',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 0
    },
    radius: { baseRadius: 12 },
    spacing: { paddingX: 24, paddingY: 12, cardPadding: 24 }
  },
  effects: {
    shadow: { elevation: 8, softness: 0.3, spread: -2, color: '#1e293b' },
    border: { width: 1, opacity: 1 },
    glass: { enabled: false, blur: 12, opacity: 0.3, saturation: 1.2 },
    gradient: { enabled: true, angle: 135, stops: [] },
    noise: { enabled: false, intensity: 0.03 },
    glow: { enabled: true, size: 24, opacity: 0.15 }
  },
  interaction: {
    transition: { duration: 200, easing: 'ease-out' },
    hover: { lift: 2, brighten: 0.05, shadowBoost: 0.3 },
    active: { press: 1, darken: 0.08 }
  },
  button: { variant: 'solid', height: 44, radius: 8, override: {} },
  card: { radius: 16, padding: 24, surfaceAlpha: 1, borderAlpha: 0.5 },
  input: {
    height: 40,
    radius: 8,
    borderWidth: 1,
    focusRingWidth: 2,
    focusRingOffset: 2,
    placeholderOpacity: 0.5
  },
  badge: {
    radius: 9999,
    paddingX: 8,
    paddingY: 2,
    fontSize: 12,
    fontWeight: 500,
    variant: 'solid'
  },
  avatar: {
    size: 40,
    radius: 9999,
    borderWidth: 2,
    fallbackBg: '#6366f1',
    fallbackText: '#ffffff'
  },
  checkbox: {
    size: 20,
    radius: 4,
    borderWidth: 2,
    checkSize: 12,
    indicatorStyle: 'check'
  }
});

describe('History Module', () => {
  it('creates empty history with default max size', () => {
    const history = createHistory();
    expect(history.entries).toHaveLength(0);
    expect(history.currentIndex).toBe(-1);
    expect(history.maxSize).toBe(50);
  });

  it('creates history with custom max size', () => {
    const history = createHistory(10);
    expect(history.maxSize).toBe(10);
  });

  it('pushes first entry to history', () => {
    const tokens = createMockTokens();
    let history = createHistory();
    history = pushEntry(history, tokens, 'Initial state');

    expect(history.entries).toHaveLength(1);
    expect(history.currentIndex).toBe(0);
    expect(history.entries[0].description).toBe('Initial state');
  });

  it('stores deep copy of tokens', () => {
    const tokens = createMockTokens();
    let history = createHistory();
    history = pushEntry(history, tokens, 'Initial');

    tokens.theme.palette.accent = '#ff0000';
    expect(history.entries[0].tokens.theme.palette.accent).toBe('#6366f1');
  });

  it('undoes to previous state', () => {
    const initialTokens = createMockTokens();
    const modifiedTokens = createMockTokens('#ff0000');

    let history = createHistory();
    history = pushEntry(history, initialTokens, 'Initial');
    history = pushEntry(history, modifiedTokens, 'Changed accent');

    history = undo(history);

    expect(history.currentIndex).toBe(0);
    expect(getCurrentTokens(history)?.theme.palette.accent).toBe('#6366f1');
  });

  it('redoes to next state', () => {
    const initialTokens = createMockTokens();
    const modifiedTokens = createMockTokens('#ff0000');

    let history = createHistory();
    history = pushEntry(history, initialTokens, 'Initial');
    history = pushEntry(history, modifiedTokens, 'Changed accent');
    history = undo(history);
    history = redo(history);

    expect(history.currentIndex).toBe(1);
    expect(getCurrentTokens(history)?.theme.palette.accent).toBe('#ff0000');
  });

  it('does not undo past first entry', () => {
    const tokens = createMockTokens();
    let history = createHistory();
    history = pushEntry(history, tokens, 'Initial');
    history = undo(history);

    expect(history.currentIndex).toBe(0);
  });

  it('does not redo past last entry', () => {
    const tokens = createMockTokens();
    let history = createHistory();
    history = pushEntry(history, tokens, 'Initial');
    history = redo(history);

    expect(history.currentIndex).toBe(0);
  });

  it('discards redo history on new push after undo', () => {
    const tokens = createMockTokens();

    let history = createHistory();
    history = pushEntry(history, tokens, 'Step 1');
    history = pushEntry(history, tokens, 'Step 2');
    history = pushEntry(history, tokens, 'Step 3');
    history = undo(history);
    history = undo(history);
    history = pushEntry(history, tokens, 'New branch');

    expect(history.entries).toHaveLength(2);
    expect(history.currentIndex).toBe(1);
    expect(history.entries[1].description).toBe('New branch');
  });

  it('respects max size limit', () => {
    let history = createHistory(3);

    for (let i = 0; i < 5; i++) {
      history = pushEntry(history, createMockTokens(`#${i}${i}${i}${i}${i}${i}`), `Step ${i}`);
    }

    expect(history.entries).toHaveLength(3);
    expect(history.currentIndex).toBe(2);
    expect(history.entries[0].description).toBe('Step 2');
  });

  it('reports canUndo correctly', () => {
    let history = createHistory();
    history = pushEntry(history, createMockTokens(), 'Initial');

    expect(canUndo(history)).toBe(false);

    history = pushEntry(history, createMockTokens('#ff0000'), 'Step 1');
    expect(canUndo(history)).toBe(true);

    history = undo(history);
    expect(canUndo(history)).toBe(false);
  });

  it('reports canRedo correctly', () => {
    let history = createHistory();
    history = pushEntry(history, createMockTokens(), 'Initial');

    expect(canRedo(history)).toBe(false);

    history = pushEntry(history, createMockTokens('#ff0000'), 'Step 1');
    history = undo(history);
    expect(canRedo(history)).toBe(true);

    history = redo(history);
    expect(canRedo(history)).toBe(false);
  });

  it('returns correct history length', () => {
    let history = createHistory();
    expect(getHistoryLength(history)).toBe(0);

    history = pushEntry(history, createMockTokens(), 'Step 1');
    expect(getHistoryLength(history)).toBe(1);

    history = pushEntry(history, createMockTokens('#ff0000'), 'Step 2');
    expect(getHistoryLength(history)).toBe(2);
  });

  it('returns correct current index', () => {
    let history = createHistory();
    expect(getCurrentIndex(history)).toBe(-1);

    history = pushEntry(history, createMockTokens(), 'Step 1');
    expect(getCurrentIndex(history)).toBe(0);

    history = pushEntry(history, createMockTokens('#ff0000'), 'Step 2');
    expect(getCurrentIndex(history)).toBe(1);

    history = undo(history);
    expect(getCurrentIndex(history)).toBe(0);
  });

  it('returns null for getCurrentTokens when empty', () => {
    const history = createHistory();
    expect(getCurrentTokens(history)).toBeNull();
  });

  it('clears history', () => {
    let history = createHistory();
    history = pushEntry(history, createMockTokens(), 'Step 1');
    history = pushEntry(history, createMockTokens('#ff0000'), 'Step 2');

    history = clearHistory();

    expect(history.entries).toHaveLength(0);
    expect(history.currentIndex).toBe(-1);
  });
});
