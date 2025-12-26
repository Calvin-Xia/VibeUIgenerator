## 问题

`presets.isFavorite` 函数在 persist 恢复后丢失。

## 修复方案

1. 在 `vibeStore.ts` 中将 `isFavorite` 函数添加到 `createActions` 中
2. 在 `PresetPanel.tsx` 中使用 `actions.isFavorite` 替代 `presets.isFavorite`