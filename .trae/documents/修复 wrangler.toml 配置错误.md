## 修复 wrangler.toml 配置错误

### 问题分析

Cloudflare Pages 部署时发现以下配置错误：

1. **警告**：`build.commands` 字段不支持
2. **警告**：`vars.NODE_VERSION` 应放在 `env.production.vars` 中
3. **错误**：`routes` 配置不适用于 Pages 项目

### 修复方案

修改 `wrangler.toml` 文件：

- 删除 `build.commands` 字段
- 删除 `[[routes]]` 配置块
- 将 `NODE_VERSION` 移至 `env.production.vars`
- 简化配置结构

修复后重新部署。