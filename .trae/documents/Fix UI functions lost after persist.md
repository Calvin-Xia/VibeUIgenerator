## 问题

`ui` 状态中的函数（如 `setSelectedComponent`、`setActiveTab`）在 persist 恢复后丢失，导致 `PreviewSwitch.tsx` 和 `MainLayout.tsx` 报错。

## 修复方案

1. 将 UI 函数（`setSelectedComponent`、`setActiveTab`、`setInitialized`、`setSelectedState`、`toggleBackground`、`toggleNoise`、`toggleGrid`）添加到 `createActions` 中
2. 更新 `PreviewSwitch.tsx` 使用 `actions.setSelectedComponent`
3. 更新 `MainLayout.tsx` 使用 `actions.setActiveTab`

## 需要修改的文件

1. `lib/store/vibeStore.ts` - 将 UI 函数移到 `createActions`
2. `components/preview/PreviewSwitch.tsx` - 使用 `actions.setSelectedComponent`
3. `components/MainLayout.tsx` - 使用 `actions.setActiveTab`