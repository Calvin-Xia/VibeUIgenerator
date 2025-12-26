## 问题分析

**原因**：Zustand 的 persist 中间件在恢复状态时会覆盖整个 `presets` 对象。函数（如 `setBuiltIn`）在序列化/反序列化过程中丢失，导致恢复后为 `undefined`。

## 修复方案

将预设相关函数（`setBuiltIn`、`addSavedPreset`、`removeSavedPreset`、`toggleFavorite`）移到 `createActions` 中，而不是放在 `presets` 状态对象里。

## 需要修改的文件

1. `lib/store/vibeStore.ts` - 将预设函数移到 `createActions` 中
2. `components/inspector/InspectorPanel.tsx` - 使用 `actions.setBuiltIn` 而不是 `presets.setBuiltIn`
3. `components/presets/PresetPanel.tsx` - 更新使用 `actions` 中的预设函数