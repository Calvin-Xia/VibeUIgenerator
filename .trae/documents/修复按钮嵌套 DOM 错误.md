## 修复 DOM 嵌套错误

### 问题分析

在 PresetCard 组件中存在 HTML 规范违反：
```
<button> cannot contain a nested <button>
```

位置：`PresetCard.tsx` 第 52-85 行
- 外层 `<button onClick={onApply}>` 用于应用预设
- 内层 `<button onClick={onToggleFavorite}>` 用于收藏切换

### 修复方案

将内层的收藏按钮 `<button>` 改为可访问的 `<div role="button">`，保持相同的功能和样式。

### 修复步骤

1. 将内层 `<button>` 改为 `<div role="button" tabIndex={0}>`
2. 添加键盘事件处理（Enter 和 Space 键）
3. 保持原有的样式和功能
4. 同样修复删除按钮（另一个嵌套的 button）