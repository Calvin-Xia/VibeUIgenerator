# lib/store/ — Zustand State Management

## OVERVIEW

Single-file Zustand store with persist middleware managing all app state: tokens, UI toggles, and preset collections.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Modify token state shape | `vibeStore.ts` lines 13-107 | `DEFAULT_TOKENS` constant |
| Add/change store actions | `vibeStore.ts` lines 291-485 | `createActions(set, get)` factory |
| Change persistence logic | `vibeStore.ts` lines 199-250 | `sanitizePersistedState()` |
| Adjust validation | `vibeStore.ts` lines 158-165 | `normalizeTokensOrNull()` |
| Modify randomization | `vibeStore.ts` lines 338-363 | `createRNG(seed)` for determinism |
| Add WCAG checking | `vibeStore.ts` lines 488-491 | `useContrastRatio()` hook |
| Update tests | `vibeStore.test.ts` | Co-located, Vitest |

## CONVENTIONS

**Action creation**: Actions live in `createActions(set, get)`, not inline in `create()`. This separates the store definition from action logic. Components import actions via `useVibeStore.getState()`.

**Validation gate**: Every token mutation passes through `normalizeTokensOrNull()`. Invalid updates silently discard with a console warning, returning `{}` to skip the set call.

**Deep cloning**: Use `cloneValue()` (JSON.parse/stringify) before mutating token objects. Never mutate state in place.

**Version counter**: `ui.version` increments on every token change. Used to trigger re-renders in consumers that need to detect token updates.

**Preset normalization**: `normalizePreset()` validates and normalizes presets before storage. `normalizePersistedPreset()` handles deserialization from localStorage, checking each field type explicitly.

**Partialize**: Only `tokens`, `presets.saved`, and `presets.favorites` persist. UI state (`selectedComponent`, `showBackground`, etc.) is ephemeral.

**Rehydration**: `onRehydrateStorage` sets `ui.initialized = true` after localStorage loads. Guard against rendering before this flag.

## ANTI-PATTERNS

**DO NOT** add new top-level keys to `StoreState` without updating `partialize` if the new state should persist.

**DO NOT** bypass `normalizeTokensOrNull()` when setting tokens. It catches invalid color values and malformed structures.

**DO NOT** mutate `DEFAULT_TOKENS` directly. It's reused as a template via `cloneValue()`.

**DO NOT** call `set()` with stale state in async contexts. Use `get()` inside actions to read current state.

**DO NOT** add server-side logic. This store runs client-only. No `'use client'` needed (it's imported by client components).
