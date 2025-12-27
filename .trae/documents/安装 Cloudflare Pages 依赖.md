## 安装缺失的 Cloudflare Pages 依赖

### 问题

`functions/[[path]].ts` 导入了 `@cloudflare/next-on-pages/next-dev`，但 package.json 中缺少此依赖。

### 修复方案

安装 `@cloudflare/next-on-pages` 包作为开发依赖：

```bash
npm install @cloudflare/next-on-pages --save-dev
```

这将支持 Cloudflare Pages 的本地开发环境。