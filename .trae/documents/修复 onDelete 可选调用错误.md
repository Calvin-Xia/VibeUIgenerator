## 修复 onDelete 可能未定义的错误

### 问题分析

`PresetPanel.tsx:130` 中 `onDelete()` 被调用，但 `onDelete` 是可选属性（可能为 `undefined`），TypeScript 发出警告。

### 修复方案

使用可选链操作符 `?.()` 确保安全调用：

```typescript
// 修复前
onDelete();

// 修复后
onDelete?.();
```

这确保当 `onDelete` 为 `undefined` 时不会抛出运行时错误。