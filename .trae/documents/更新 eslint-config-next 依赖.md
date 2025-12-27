## 更新弃用的 npm 依赖包

### 问题分析

当前 `eslint-config-next@14.2.5` 依赖旧版 ESLint 生态系统：
- `eslint@8.57.1` (ESLint 9.x 已发布，8.x 不再支持)
- `@humanwhocodes/object-schema@2.0.3` (应使用 @eslint/object-schema)
- `@humanwhocodes/config-array@0.13.0` (应使用 @eslint/config-array)

### 修复方案

将 `eslint-config-next` 更新到与 Next.js 15.x 兼容的版本：

```bash
npm install eslint-config-next@latest --save-dev
```

### 预期效果

- 消除 ESLint 8.x 弃用警告
- 与 Next.js 15.5.2 更好地兼容