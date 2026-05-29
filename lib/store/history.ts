import { VibeTokens } from '@/lib/types/tokens';

export interface HistoryEntry {
  tokens: VibeTokens;
  timestamp: number;
  description: string;
}

export interface HistoryState {
  entries: HistoryEntry[];
  currentIndex: number;
  maxSize: number;
}

export function createHistory(maxSize: number = 50): HistoryState {
  return {
    entries: [],
    currentIndex: -1,
    maxSize
  };
}

export function pushEntry(
  state: HistoryState,
  tokens: VibeTokens,
  description: string
): HistoryState {
  const truncatedEntries = state.entries.slice(0, state.currentIndex + 1);
  
  const newEntry: HistoryEntry = {
    tokens: structuredClone(tokens),
    timestamp: Date.now(),
    description
  };
  
  const entries = [...truncatedEntries, newEntry];
  const trimmedEntries = entries.length > state.maxSize ? entries.slice(-state.maxSize) : entries;
  
  return {
    ...state,
    entries: trimmedEntries,
    currentIndex: trimmedEntries.length - 1
  };
}

export function undo(state: HistoryState): HistoryState {
  if (state.currentIndex <= 0) {
    return state;
  }
  
  return {
    ...state,
    currentIndex: state.currentIndex - 1
  };
}

export function redo(state: HistoryState): HistoryState {
  if (state.currentIndex >= state.entries.length - 1) {
    return state;
  }
  
  return {
    ...state,
    currentIndex: state.currentIndex + 1
  };
}

export function getCurrentTokens(state: HistoryState): VibeTokens | null {
  if (state.currentIndex < 0 || state.currentIndex >= state.entries.length) {
    return null;
  }
  
  return state.entries[state.currentIndex].tokens;
}

export function canUndo(state: HistoryState): boolean {
  return state.currentIndex > 0;
}

export function canRedo(state: HistoryState): boolean {
  return state.currentIndex < state.entries.length - 1;
}

export function getHistoryLength(state: HistoryState): number {
  return state.entries.length;
}

export function getCurrentIndex(state: HistoryState): number {
  return state.currentIndex;
}

export function clearHistory(maxSize?: number): HistoryState {
  return createHistory(maxSize);
}
