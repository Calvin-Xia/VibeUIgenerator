## 问题分析

**类型错误原因**：
1. `TokenSetter` 类型定义错误 - 期望 `Partial<VibeTokens>` 但实际需要更新整个 `StoreState`
2. `set` 回调参数类型是 `StoreState` 不是 `VibeTokens`
3. 返回值类型不匹配 - 应该返回 `Partial<StoreState>` 而不是 `Partial<VibeTokens>`

**状态同步问题**：
需要一种更可靠的方式来触发 React 重新渲染。

## 修复方案

1. **移除 `TokenSetter` 类型**，直接使用 Zustand 的 `SetState<StoreState>`
2. **重写 `createTokenActions` 函数**，正确更新 store
3. **使用 `ui.version` 递增** 强制触发重新渲染
4. **修复所有 `set` 调用的类型**

## 需要修改的文件

- `lib/store/vibeStore.ts` - 完整重写 store 实现