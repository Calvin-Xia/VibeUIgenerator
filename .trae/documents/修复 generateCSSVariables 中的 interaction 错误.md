## 修复计划：一次性修复所有 `interaction` 未定义错误

### 问题诊断
检查 `lib/generator/export.ts` 中所有函数的解构赋值：

| 函数 | 解构语句 | 是否包含 interaction | 是否需要 |
|------|---------|---------------------|---------|
| `generateReactComponent` | `const { theme, effects, interaction, button, card } = tokens;` | ✅ | - |
| `generateVueComponent` | `const { theme, effects, interaction, button, card } = tokens;` | ✅ | - |
| `generateHTMLSnippets` | `const { theme, effects, interaction, button, card } = tokens;` | ✅ | - |
| `generateTailwindConfig` | `const { theme, effects, button, card } = tokens;` | ❌ | 不需要（未使用） |
| `generateCSSVariables` | `const { theme, effects, button, card } = tokens;` | ❌ | **需要修复** |
| `generateJSONTokens` | 使用 `tokens.*` 直接访问 | - | 不需要 |

### 修复方案
修改 `generateCSSVariables` 函数的解构语句，添加 `interaction`：
```javascript
const { theme, effects, interaction, button, card } = tokens;
```

**修改文件**: `lib/generator/export.ts` 第362行