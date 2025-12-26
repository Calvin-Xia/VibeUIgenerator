## 问题分析

**错误信息**：`Couldn't find any 'pages' or 'app' directory`

**原因**：Next.js 默认在项目根目录查找 `app` 或 `pages` 目录，但当前文件结构是 `apps/web/app/`

## 修复方案

1. 将 `apps/web/app/` 目录内容移动到根目录的 `app/` 目录
2. 更新 `tailwind.config.ts` 中的 content 路径
3. 更新 `tsconfig.json` 中的路径别名
4. 删除不再需要的 `apps/web` 目录
5. 更新导入路径引用

## 需要修改的文件

- `apps/web/app/globals.css` → `app/globals.css`
- `apps/web/app/layout.tsx` → `app/layout.tsx`
- `apps/web/app/page.tsx` → `app/page.tsx`
- `tailwind.config.ts` - 更新 content 路径
- `tsconfig.json` - 更新 path 别名