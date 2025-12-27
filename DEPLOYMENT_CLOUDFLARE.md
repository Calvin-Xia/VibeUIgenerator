# Cloudflare Pages 部署指南

本文档提供将 VibeUI Generator 部署到 Cloudflare Pages 的完整操作指引。

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [本地测试](#本地测试)
- [正式部署](#正式部署)
- [常见问题](#常见问题)

---

## 环境要求

在开始部署之前，请确保您的开发环境满足以下要求：

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | 20.x | Cloudflare Pages 推荐版本 |
| npm | 9.x+ | 或使用 pnpm/yarn |
| Git | 2.x | 用于版本控制 |
| Cloudflare 账户 | - | 需要已验证的账户 |
| Wrangler CLI | 3.x | Cloudflare 命令行工具 |

检查当前环境版本：

```bash
node --version    # 应显示 v20.x.x
npm --version     # 应显示 9.x 或更高
git --version     # 应显示 2.x 或更高
```

---

## 快速开始

如果您已经熟悉 Cloudflare Pages 部署，可以使用以下简化命令完成部署：

```bash
# 1. 克隆并进入项目
git clone https://github.com/your-username/VibeUIgenerator.git
cd VibeUIgenerator

# 2. 安装依赖
npm install

# 3. 升级 Next.js 版本（必需）
npm install next@15.5.2 react@18.3.1 react-dom@18.3.1

# 4. 安装 Cloudflare 适配器
npm install --save-dev @cloudflare/next-on-pages

# 5. 登录 Cloudflare
npx wrangler login

# 6. 构建并部署
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=vibeui-generator
```

---

## 详细部署步骤

### 第一步：项目兼容性检查

检查当前项目与 Cloudflare Pages 的兼容性：

```bash
# 查看项目当前依赖版本
cat package.json | grep -E '"next"|"react"|"react-dom"'
```

**版本要求**：
- Next.js：14.3.0 - 15.5.2（超出范围需要降级）
- React：18.x（推荐）
- Node.js：18.x 或 20.x

如果 Next.js 版本不在支持范围内，需要降级：

```bash
# 降级到兼容版本
npm install next@15.5.2 react@18.3.1 react-dom@18.3.1
```

### 第二步：安装 Cloudflare 适配器

```bash
# 安装 next-on-pages 适配器
npm install --save-dev @cloudflare/next-on-pages
```

**验证安装**：

```bash
# 检查安装的版本
npx next-on-pages --version
```

### 第三步：创建 Cloudflare Pages Functions

在项目根目录创建 `functions` 目录和路由文件：

```bash
mkdir -p functions
```

创建 `functions/[[path]].ts` 文件：

```typescript
import { createPagesFunctionHandler } from '@cloudflare/next-on-pages/next-dev';

export const onRequest = createPagesFunctionHandler({
  // 可选配置
  // assets: {
  //   bucketDirectory: './public',
  //   cacheControl: 'public, max-age=3600',
  // },
});
```

此文件负责处理所有 Next.js 页面的 Cloudflare Pages 路由。

### 第四步：更新 Next.js 配置

修改 `next.config.js` 文件：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Cloudflare Pages 优化配置
  images: {
    // 禁用图片优化（Cloudflare 会处理）
    unoptimized: true,
  },
  
  // 将不兼容 Node.js 的包标记为外部依赖
  serverExternalPackages: ['shiki'],
};

module.exports = nextConfig;
```

**配置说明**：
- `images.unoptimized`：禁用 Next.js 图片优化，改用 Cloudflare 的图片处理
- `serverExternalPackages`：标记需要特殊处理的依赖包

### 第五步：创建 Wrangler 配置文件

在项目根目录创建 `wrangler.toml` 文件：

```toml
# 项目名称（将在 Cloudflare 控制台显示）
name = "vibeui-generator"

# 兼容日期（使用较新的日期以获得更多功能）
compatibility_date = "2024-11-18"

# 兼容标志
compatibility_flags = ["nodejs_compat"]

# Next.js 构建输出目录
pages_build_output_dir = ".vercel/output/static"

# 环境变量
[vars]
NEXT_PUBLIC_APP_NAME = "VibeUI Generator"

# 生产环境变量覆盖
[env.production.vars]
NEXT_PUBLIC_APP_NAME = "VibeUI Generator"
```

**配置参数详解**：

| 参数 | 说明 | 示例值 |
|------|------|--------|
| `name` | 项目名称 | `"vibeui-generator"` |
| `compatibility_date` | 兼容日期 | `"2024-11-18"` |
| `compatibility_flags` | 运行时标志 | `["nodejs_compat"]` |
| `pages_build_output_dir` | 构建输出目录 | `".vercel/output/static"` |

**重要提示**：
- Cloudflare Pages 不支持 `build.commands` 字段
- Cloudflare Pages 不支持 `routes` 配置
- 环境变量应在 `[vars]` 和 `[env.production.vars]` 中分别定义

### 第六步：更新依赖处理

确保 `lib/generator/highlight.ts` 已配置为 WebAssembly 模式：

```typescript
// 关键配置：使用 bundle: true
highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['typescript', 'vue', 'html', 'css', 'javascript', 'json'],
  bundle: true  // 必须设置为 true
});
```

**降级处理**：

```typescript
export async function highlightCode(code: string, language: string, isDarkMode: boolean = true): Promise<string> {
  const hl = await getHighlighterInstance();

  if (!hl) {
    return escapeHtml(code); // 降级为纯文本
  }

  // ... 正常逻辑
}
```

---

## 本地测试

### 方式一：使用 Next.js 开发服务器（基础测试）

```bash
npm run dev
```

访问 http://localhost:3000 验证基本功能。

### 方式二：使用 Wrangler 本地预览（推荐）

```bash
# 安装 wrangler（如果尚未安装）
npm install -g wrangler

# 本地预览
npx wrangler pages dev .vercel/output/static --compatibility-flag=nodejs_compat
```

访问显示的 URL（通常是 http://127.0.0.1:8788）进行测试。

### 方式三：使用 next-on-pages CLI

```bash
# 安装 next-on-pages CLI
npm install -g @cloudflare/next-on-pages

# 本地预览
npx @cloudflare/next-on-pages --preview
```

### 测试清单

在本地环境中验证以下功能：

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

### 方法一：使用 Wrangler CLI 部署

```bash
# 1. 登录 Cloudflare（如果尚未登录）
npx wrangler login

# 2. 构建项目
npm run build

# 3. 部署到 Cloudflare Pages
npx wrangler pages deploy .vercel/output/static --project-name=vibeui-generator
```

**首次部署提示**：如果项目不存在，Wrangler 会询问是否创建。

### 方法二：使用 GitHub 集成（推荐）

1. **推送代码到 GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **连接 Cloudflare Pages**

   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 **Pages** > **Create a project**
   - 选择 **Connect to Git**
   - 选择您的 GitHub 仓库

3. **配置构建设置**

   | 设置项 | 值 |
   |--------|-----|
   | Framework preset | Next.js |
   | Build command | `npm run build` |
   | Build output directory | `.vercel/output/static` |
   | Node.js version | 20.x |

4. **添加环境变量**（如有需要）

   进入 **Settings** > **Environment variables**，添加：

   ```
   NEXT_PUBLIC_APP_NAME = VibeUI Generator
   ```

5. **部署**

   点击 **Save and Deploy** 开始部署。

### 方法三：使用 GitHub Actions CI/CD

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

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

      - name: Build project
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: vibeui-generator
          directory: .vercel/output/static
          cleanup: true
```

**配置密钥**（在 GitHub 仓库设置中）：

| 密钥名 | 值来源 |
|--------|--------|
| `CF_API_TOKEN` | Cloudflare API Token |
| `CF_ACCOUNT_ID` | Cloudflare Dashboard > Workers & Pages > Account ID |

---

## 常见问题

### Q1：部署失败，提示 "next-swc.win32-x64-msvc.node" 错误

**问题**：Windows 系统文件锁定导致 npm 无法更新二进制文件。

**解决方案**：

```bash
# 关闭所有可能占用文件的程序（VS Code 终端等）
# 删除 node_modules
rm -rf node_modules

# 重新安装
npm install
```

### Q2：Shiki 代码高亮不工作

**问题**：Cloudflare Workers 环境无法加载 WebAssembly。

**解决方案**：

确保 `lib/generator/highlight.ts` 中设置了 `bundle: true`：

```typescript
highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['typescript', 'vue', 'html', 'css', 'javascript', 'json'],
  bundle: true  // 必须设置为 true
});
```

同时添加降级处理：

```typescript
if (!hl) {
  return escapeHtml(code); // 降级为纯文本
}
```

### Q3：样式丢失或 CSS 未加载

**问题**：Tailwind CSS 样式未正确生成。

**解决方案**：

1. 确保 `tailwind.config.ts` 正确配置
2. 检查构建日志是否有 CSS 错误
3. 清除缓存后重新构建：

```bash
rm -rf .next node_modules/.cache
npm run build
```

### Q4：API 路由返回 404

**问题**：Cloudflare Pages Functions 未正确处理 API 路由。

**解决方案**：

1. 确认 `functions/[[path]].ts` 文件存在且内容正确
2. 检查 API 路由路径是否正确
3. 查看 Cloudflare Dashboard 中的 Functions 日志

### Q5：图片导出功能不工作

**问题**：`html-to-image` 库依赖浏览器 DOM API。

**解决方案**：

在 Cloudflare Pages 环境中，图片导出功能需要特殊处理。建议：

1. 禁用服务器端导出
2. 使用客户端 Canvas 实现
3. 或使用 Cloudflare Images 服务

### Q6：部署后页面加载缓慢

**问题**：首次加载时间较长。

**解决方案**：

1. 启用 Cloudflare 缓存
2. 优化静态资源
3. 使用 CDN 加速：

```toml
# wrangler.toml
[build]
commands = "npm run build"

[env.production.vars]
NEXT_PUBLIC_APP_NAME = "VibeUI Generator"
```

### Q7：如何回滚到之前的部署？

**方法一：通过 Dashboard**

1. 进入 Cloudflare Dashboard > Pages > vibeui-generator
2. 点击 **Deployments** 标签
3. 选择之前的部署版本
4. 点击 **Roll back to this deployment**

**方法二：通过 Wrangler**

```bash
# 查看部署历史
npx wrangler pages deployment list --project-name=vibeui-generator

# 回滚到指定版本
npx wrangler pages deployment rollback <deployment-id> --project-name=vibeui-generator
```

### Q8：自定义域名配置

**在 Cloudflare Dashboard 中配置**：

1. 进入 **Pages** > vibeui-generator > **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名
4. 选择 **Cloudflare managed** 证书
5. 添加 DNS 记录

**DNS 配置示例**：

| 类型 | 名称 | 目标 | 代理 |
|------|------|------|------|
| CNAME | vibeui.yourdomain.com | vibeui-generator.pages.dev | ✅ |

---

## 性能优化建议

### 1. 启用压缩

Cloudflare Pages 自动启用 Gzip/Brotli 压缩。

### 2. 配置缓存策略

在 `functions/[[path]].ts` 中添加缓存头：

```typescript
export async function onRequest(context) {
  const response = await context.next();
  
  if (context.request.url.includes('/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}
```

### 3. 优化图片

由于禁用了 Next.js 图片优化，建议：

1. 使用小尺寸图片
2. 使用 WebP 格式
3. 延迟加载非关键图片

---

## 监控和维护

### 查看日志

```bash
# 实时日志
npx wrangler pages deployment tail --project-name=vibeui-generator

# 查看最近部署
npx wrangler pages deployment list --project-name=vibeui-generator
```

### 分析性能

使用 Cloudflare Analytics：

1. 访问 Cloudflare Dashboard > Pages > vibeui-generator
2. 查看 **Analytics** 标签
3. 分析访问量、带宽、缓存命中率等指标

---

## 技术支持

如果遇到本文档未涵盖的问题：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 查看 [next-on-pages GitHub](https://github.com/cloudflare/next-on-pages)
3. 搜索或提交 [GitHub Issues](https://github.com/cloudflare/next-on-pages/issues)

---

## 快速命令参考

```bash
# 开发
npm run dev                    # Next.js 开发服务器
npx wrangler pages dev .vercel/output/static  # Cloudflare 预览

# 构建
npm run build                  # 构建 Next.js 应用
npm run pages:build           # 构建并部署

# 部署
npx wrangler login            # 登录 Cloudflare
npx wrangler pages deploy .vercel/output/static --project-name=vibeui-generator  # 部署

# 监控
npx wrangler pages deployment list --project-name=vibeui-generator  # 查看部署
npx wrangler pages deployment tail --project-name=vibeui-generator  # 实时日志

# 帮助
npx wrangler --help           # Wrangler 帮助
npx next-on-pages --help      # next-on-pages 帮助
```

---

**最后更新**：2024年12月

**适用版本**：Next.js 14.3+ / next-on-pages 1.x / Cloudflare Pages
