## 修复 React 水合错误 #418 和 #423

### 问题分析

**错误 #418/423** 表示服务器和客户端渲染内容不一致：

1. **Zustand persist** - 使用 `localStorage` 持久化，但服务器渲染时 localStorage 为空，客户端水合后恢复数据导致不匹配
2. **createPortal** - `TopBar.tsx` 中的 `document.body` 在服务器上不存在

### 修复方案

1. **添加 hydration 钩子** - 创建 `useHydrated` hook 检查客户端挂载状态
2. **修复 TopBar.tsx** - 使用 `suppressHydrationWarning` 或条件渲染
3. **修复 persist store** - 确保水合完成前不渲染依赖持久化数据的内容

### 关键代码

```typescript
// useHydrated hook
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
```