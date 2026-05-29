# Cloudflare Workers 部署指南

本文档提供将 VibeUI Generator 部署到 Cloudflare Workers 的完整操作指引。

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [本地测试](#本地测试)
- [正式部署](#正式部署)
- [常见问题](#常见问题)

---

## 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | 18.x+ | 推荐 20.x |
| npm | 9.x+ | 或使用 pnpm/yarn |
| Git | 2.x | 用于版本控制 |
| Cloudflare 账户 | - | 需要已验证的账户 |
| Wrangler CLI | 4.x | Cloudflare 命令行工具 |

检查当前环境版本：

```bash
node --version
npm --version
git --version
```

---

## 快速开始

```bash
# 1. 克隆并进入项目
git clone https://github.com/your-username/VibeUIgenerator.git
cd VibeUIgenerator

# 2. 安装依赖
npm install

# 3. 登录 Cloudflare
npx wrangler login

# 4. 构建并部署
npx @opennextjs/cloudflare build
npx wrangler deploy
```

---

## 详细部署步骤

### 第一步：安装依赖

```bash
npm install
```

项目使用以下关键依赖：
- `@opennextjs/cloudflare` - OpenNext Cloudflare 适配器
- `wrangler` - Cloudflare CLI
- `esbuild` - 构建工具

### 第二步：配置文件

项目包含以下配置文件：

**`open-next.config.ts`** - OpenNext 配置：
```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

**`wrangler.toml`** - Cloudflare Workers 配置：
```toml
name = "vibeui-generator"
main = ".open-next/worker.js"
compatibility_date = "2024-11-18"
compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[vars]
NEXT_PUBLIC_APP_NAME = "VibeUI Generator"
```

**`next.config.js`** - Next.js 配置：
```javascript
const nextConfig = {
  output: 'standalone',  // 必须为 standalone
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['shiki'],
};

module.exports = nextConfig;
```

### 第三步：构建项目

```bash
npx @opennextjs/cloudflare build
```

构建完成后会在 `.open-next/` 目录生成：
- `worker.js` - Cloudflare Worker 入口
- `assets/` - 静态资源

### 第四步：部署

```bash
npx wrangler deploy
```

部署成功后会显示 Worker URL：
```
https://vibeui-generator.<your-subdomain>.workers.dev
```

---

## 本地测试

### 使用 Next.js 开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 验证基本功能。

### 使用 Wrangler 本地预览

```bash
# 先构建
npx @opennextjs/cloudflare build

# 本地预览
npx wrangler dev
```

### 测试清单

| 功能 | 验证方法 | 预期结果 |
|------|----------|----------|
| 页面加载 | 访问首页 | 正常显示，无错误 |
| 主题切换 | 点击亮/暗模式 | 正确切换 |
| 参数调整 | 拖动滑块 | 视觉实时变化 |
| 代码高亮 | 切换到 Code 标签 | 正确着色 |
| 预设加载 | 点击不同预设 | 正确应用样式 |
| 响应式布局 | 调整浏览器宽度 | 正确适配 |

---

## 正式部署

### 方法一：使用 Wrangler CLI（推荐）

```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 构建
npx @opennextjs/cloudflare build

# 3. 部署
npx wrangler deploy
```

### 方法二：使用 GitHub Actions CI/CD

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build with OpenNext
        run: npx @opennextjs/cloudflare build

      - name: Deploy to Cloudflare Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**配置密钥**（在 GitHub 仓库设置中）：

| 密钥名 | 值来源 |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard > My Profile > API Tokens |

---

## 常见问题

### Q1：构建失败，提示 "Cannot find package 'esbuild'"

**解决方案**：
```bash
npm install --save-dev esbuild
```

### Q2：构建失败，提示 "No open-next.config.ts file"

**解决方案**：确保项目根目录有 `open-next.config.ts` 文件：
```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

### Q3：构建失败，提示 "pages-manifest.json" 错误

**解决方案**：确保 `next.config.js` 中 `output` 为 `standalone`：
```javascript
output: 'standalone',
```

### Q4：部署后页面 404

**解决方案**：
1. 确认 `wrangler.toml` 包含 `main = ".open-next/worker.js"`
2. 确认 `[assets]` 配置正确
3. 重新构建并部署

### Q5：Shiki 代码高亮不工作

**解决方案**：确保 `lib/generator/highlight.ts` 中设置了 `bundle: true`：
```typescript
highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['typescript', 'vue', 'html', 'css', 'javascript', 'json'],
  bundle: true
});
```

### Q6：自定义域名配置

**在 Cloudflare Dashboard 中配置**：

1. 进入 **Workers & Pages** > vibeui-generator
2. 点击 **Settings** > **Triggers** > **Custom Domains**
3. 添加您的域名
4. 配置 DNS 记录

---

## 快速命令参考

```bash
# 开发
npm run dev                              # Next.js 开发服务器

# 构建
npx @opennextjs/cloudflare build         # 构建 OpenNext 包

# 部署
npx wrangler login                       # 登录 Cloudflare
npx wrangler deploy                      # 部署 Worker
npx wrangler deploy --env production     # 部署到生产环境

# 监控
npx wrangler tail                        # 实时日志
npx wrangler versions list               # 查看版本历史

# 回滚
npx wrangler rollback [version-id]       # 回滚到指定版本
```

---

## 相关链接

- [OpenNext Cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

**最后更新**：2026年5月

**适用版本**：Next.js 15.x / @opennextjs/cloudflare 1.x / Wrangler 4.x
