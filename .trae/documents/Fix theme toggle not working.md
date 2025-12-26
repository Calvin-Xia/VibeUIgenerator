## 问题分析

主题切换无效果，可能原因：
1. `setToken` 函数没有正确更新状态
2. 或者是 Zustand 的 `set` 调用有问题

## 修复方案

简化 `setToken` 函数的实现，直接使用更简单的方式更新嵌套属性：

```typescript
setToken: <T>(path: string, value: T) => {
  set((state) => {
    const newTokens = JSON.parse(JSON.stringify(state.tokens));
    const keys = path.split('.');
    let current: any = newTokens;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    return {
      tokens: newTokens,
      ui: { ...state.ui, version: state.ui.version + 1 }
    };
  });
}
```

## 需要修改的文件

- `lib/store/vibeStore.ts` - 修复 `setToken` 实现