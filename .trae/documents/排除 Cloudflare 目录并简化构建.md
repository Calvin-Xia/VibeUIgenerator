## 排除 Cloudflare 函数目录，构建主应用

### 问题

1. `eslint-config-next@16` API 变化导致 ESLint 配置错误
2. `@cloudflare/next-on-pages` 新版本可能已移除 `createPagesFunctionHandler`

### 修复方案

1. <br />
2. **简化 ESLint 配置**：直接使用 typescript-eslint 默认配置

### 预期效果

* 构建成功通过

* 主应用可以正常运行

* cloudflare需要部署

