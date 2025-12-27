## 迁移 ESLint 配置到 Flat Config 格式

### 问题分析

ESLint 9.x 使用新的 Flat Config 格式（`eslint.config.mjs`），旧的 `.eslintrc.json` 格式不再完全兼容。

### 修复方案

1. **删除旧配置**：删除 `.eslintrc.json`
2. **创建新配置**：创建 `eslint.config.mjs` 使用 flat config 格式
3. **更新配置内容**：
   - 使用 `next/core-web-vitals` 扩展
   - 添加 TypeScript 特定规则
   - 配置自定义规则

### 新配置示例

```javascript
import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';

export default tseslint.config: ['.(
  { ignoresnext/', 'node_modules/', 'out/'] },
  ...next({ root: true }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    }
  }
);