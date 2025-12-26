## 问题分析

### 问题 1：左侧选项无法修改 & 黑夜模式无法切换
**原因**：`setToken` 函数的返回值类型不匹配。`set` 期望返回 `Partial<StoreState>`，但函数直接返回 `VibeTokens` 对象，导致 Zustand 无法正确更新状态。

### 问题 2：Save 选项无法保存
**原因**：`addSavedPreset` 函数在调用时 `actions` 可能还未初始化完成，或者状态更新有问题。

---

## 修复方案

### 1. 修复 `vibeStore.ts` 中的 `setToken` 函数
```typescript
// 当前错误代码
return newTokens;  // 返回的是 VibeTokens，不是 Partial<StoreState>

// 修复为
return { tokens: newTokens };
```

### 2. 修复 `addSavedPreset` 函数的实现
确保它正确使用 `set` 更新预设状态。

---

## 需要修改的文件

1. `lib/store/vibeStore.ts` - 修复 `setToken` 和 `addSavedPreset` 函数