## 问题分析

**原因**：InspectorPanel 中的控件使用 `useVibeStore.getState().actions.setToken(...)` 直接调用方法，这种方式：
1. 可以更新 store 中的状态
2. **但不会触发 React 组件重新渲染**

因为 React 不知道状态已经改变了，需要通过 Zustand 的订阅机制或 useState/useReducer 来触发渲染。

## 修复方案

修改 `InspectorPanel.tsx`：

1. 使用 Zustand 的选择器获取 actions：`const actions = useVibeStore(state => state.actions)`
2. 在事件处理中使用 `actions.setToken(...)` 而不是 `useVibeStore.getState().actions.setToken(...)`

这样当 actions 被调用时，组件会检测到状态变化并重新渲染。

## 需要修改的文件

- `components/inspector/InspectorPanel.tsx` - 将所有 `useVibeStore.getState().actions.setToken(...)` 改为 `actions.setToken(...)`