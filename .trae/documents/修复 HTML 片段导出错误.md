## 修复计划：`interaction is not defined` 错误

### 问题诊断
在 `lib/generator/export.ts` 的 `generateHTMLSnippets` 函数中：
- 第224行解构变量时只提取了 `theme, effects, button, card`
- 但模板字符串中多处使用了 `interaction` 变量（第245、250、251、255、256行）

### 修复方案
在解构语句中添加 `interaction` 变量：
```javascript
const { theme, effects, interaction, button, card } = tokens;
```

**修改文件**: `lib/generator/export.ts`