## 修复 ESLint 和 Cloudflare 导入错误

### 问题分析

1. **ESLint 配置错误**：`eslint-config-next@16` 可能需要不同的导入方式
2. **Cloudflare 导入错误**：`createPagesFunctionHandler` API 可能已变更

### 修复方案

1. **修复 ESLint 配置** - 使用推荐的 flat config 导入方式

2. **修复 Cloudflare 函数** - 更新导入路径或 API

### 预期效果

- 消除 "next is not a function" 错误
- 消除 "createPagesFunctionHandler" 导入错误