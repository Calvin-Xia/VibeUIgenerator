## 修复 TypeScript 编译错误

### 问题分析

构建失败，TypeScript 报错：
```
Property 'setBuiltIn' does not exist on type 'PresetsState'
```

错误位置：`app/page.tsx:38`

### 修复步骤

1. 检查 `vibeStore.ts` 中 `PresetsState` 类型定义
2. 检查 `createActions` 中的 `setBuiltIn` action 定义
3. 确保 action 正确附加到 store
4. 修复类型定义或代码逻辑