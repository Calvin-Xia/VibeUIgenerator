## 修复计划：`props is not defined` 错误

### 问题诊断
在 `lib/generator/export.ts` 的 `generateVueComponent` 函数中，生成的 Vue 组件代码模板里，第184行的 border 属性使用了模板字符串中的 `${props.variant === 'outline' ...}`，但由于外层已经是模板字符串，导致解析错误。

### 修复方案
修改 `generateVueComponent` 函数中生成的 Vue 代码模板，将 border 属性改为使用更简单的逻辑，避免嵌套的三元表达式导致的解析问题。

**修改文件**: `lib/generator/export.ts`

**修改内容**:
- 在 `baseStyles` computed 属性中，简化 border 属性的生成逻辑
- 将 `${props.variant === 'outline' ? theme.palette.accent : withOpacity(theme.palette.border, effects.border.opacity)}` 改为直接使用 CSS 变量或固定值