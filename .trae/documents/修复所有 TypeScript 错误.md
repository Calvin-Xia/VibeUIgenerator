## 修复所有 TypeScript 和 Lint 错误

### 错误列表及修复方案

**1. ExportButtons.tsx** - 移除不存在的 `generateCSS` 导入

**2. export.ts (line 103)** - 类型不匹配，将 string 传给对象参数
- 检查 `shadowToString` 函数调用

**3. index.ts (line 102, 140)** - `webkitBackdropFilter` 改为 `WebkitBackdropFilter`

**4. vibeStore.ts** - 多处类型错误
- `applyPreset`, `randomize`, `importJSON`, `loadFromURL`, `reset` 中的 state 类型问题
- `setSelectedState` 中 `StoreState` 不能赋给 `ComponentState`

### 修复步骤

1. 移除未使用的导入
2. 修复类型定义
3. 添加类型断言
4. 验证所有修复