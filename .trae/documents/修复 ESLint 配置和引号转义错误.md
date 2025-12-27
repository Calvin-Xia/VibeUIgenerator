## 修复 ESLint 配置错误

### 问题分析

1. **规则未找到错误**：`@typescript-eslint/no-unused-vars` 规则需要 `@typescript-eslint` 包支持
   - 当前 `eslint-config-next` 已包含 TypeScript 规则
   - 自定义规则配置冲突

2. **未转义实体**：`PresetPanel.tsx:120` 有未转义的引号

### 修复方案

1. **`.eslintrc.json`**：移除自定义的 `@typescript-eslint/no-unused-vars` 规则，使用默认配置

2. **`PresetPanel.tsx:120`**：转义引号 `"` → `&quot;`

### 修复步骤

1. 更新 ESLint 配置
2. 转义 JSX 中的引号