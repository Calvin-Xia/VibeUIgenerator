# VibeUI Generator

VibeUI Generator 是一个可视化 CSS 组件样式生成器，支持实时调整 Button 和 Card 组件的视觉效果，并一键导出 CSS、Tailwind CSS、HTML 和 JSON 代码。项目采用 Next.js 14 + TypeScript + TailwindCSS 构建，提供了丰富的预设和灵活的参数自定义功能。

## 功能特性

- **实时可视化调参**：通过滑杆、颜色选择器等控件实时调整组件样式
- **多格式导出**：支持导出 React 组件、Vue 组件、CSS Variables、原生 CSS、Tailwind 配置、HTML 片段和 JSON 设计令牌
- **代码预览与复制**：内置代码预览面板，支持语法高亮、一键复制和下载
- **批量导出**：支持一次性导出所有格式的代码文件
- **12+ 内置预设**：包含 Glass、Neo-Brutal、Cyber、Y2K、Aurora 等多种风格预设
- **URL 分享功能**：将当前配置编码为可分享链接，打开链接即可还原方案
- **PNG 导出**：一键导出组件预览图为 PNG 图片
- **响应式设计**：支持桌面端三栏布局和移动端切换视图
- **辅助功能检查**：实时显示文字对比度是否满足 WCAG 2.1 标准

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn 或 pnpm 包管理器

### 安装步骤

克隆项目仓库并安装依赖：

```bash
git clone https://github.com/your-username/VibeUIgenerator.git
cd VibeUIgenerator
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000 即可使用。

### 构建生产版本

```bash
npm run build
npm run start
```

## 项目结构

```
VibeUIgenerator/
├── app/
│   ├── layout.tsx              # 根布局文件
│   ├── page.tsx                # 主页面组件
│   └── globals.css             # 全局样式
├── components/
│   ├── AppShell.tsx            # 应用外壳组件
│   ├── TopBar.tsx              # 顶部导航栏（包含导出按钮）
│   ├── MainLayout.tsx          # 主布局组件
│   ├── ThemeModeObserver.tsx   # 主题模式观察器
│   ├── inspector/              # 参数面板组件
│   │   ├── InspectorPanel.tsx  # 面板容器
│   │   ├── ColorPickerRow.tsx  # 颜色选择器
│   │   ├── SliderRow.tsx       # 滑杆控件
│   │   ├── SelectRow.tsx       # 下拉选择器
│   │   ├── ToggleRow.tsx       # 开关控件
│   │   └── AccessibilityHint.tsx # 辅助功能提示
│   ├── preview/                # 预览画布组件
│   │   ├── PreviewCanvas.tsx   # 画布容器
│   │   ├── ButtonPreview.tsx   # 按钮预览
│   │   ├── CardPreview.tsx     # 卡片预览
│   │   ├── CanvasBackground.tsx # 画布背景
│   │   └── PreviewSwitch.tsx   # 预览切换控件
│   ├── output/                 # 代码输出面板
│   │   ├── OutputPanel.tsx     # 输出面板容器
│   │   ├── CodeBlock.tsx       # 代码块显示
│   │   ├── CodePreview.tsx     # 代码预览组件
│   │   ├── CodeTabs.tsx        # 代码格式标签页
│   │   ├── ExportButtons.tsx   # 导出操作按钮
│   │   └── ExportModal.tsx     # 导出模态框
│   ├── presets/                # 预设管理面板
│   │   └── PresetPanel.tsx     # 预设面板
│   └── ui/                     # shadcn/ui 基础组件
├── lib/
│   ├── generator/              # 样式生成引擎
│   │   ├── index.ts            # 主生成器入口
│   │   ├── export.ts           # 代码导出生成器（React/Vue/HTML/CSS/Tailwind/JSON）
│   │   ├── color.ts            # 颜色工具函数
│   │   ├── shadow.ts           # 阴影生成算法
│   │   └── normalize.ts        # URL 编解码
│   ├── store/
│   │   └── vibeStore.ts        # Zustand 状态管理
│   ├── presets/
│   │   └── builtIn.ts          # 内置预设数据
│   ├── types/
│   │   └── tokens.ts           # TypeScript 类型定义
│   └── utils.ts                # 工具函数
├── public/                     # 静态资源
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Tokens 数据结构

VibeUI 使用层次化的 Tokens 结构来描述组件样式，所有样式生成都基于这套数据结构。

### 完整 Tokens 结构

```typescript
interface VibeTokens {
  schemaVersion: string;           // 版本号，用于兼容升级
  theme: ThemeTokens;              // 主题配置
  effects: EffectsTokens;          // 效果配置
  interaction: InteractionTokens;  // 交互配置
  button: ButtonTokens;            # 按钮组件配置
  card: CardTokens;                # 卡片组件配置
}
```

### ThemeTokens 主题配置

```typescript
interface ThemeTokens {
  mode: 'light' | 'dark';          // 亮色或暗色模式
  palette: {
    accent: string;                // 主色调（十六进制颜色）
    accent2?: string;              // 次要色
    bg: string;                    // 背景色
    surface: string;               // 表面色
    text: string;                  // 文字色
    mutedText: string;             // 次要文字色
    border: string;                // 边框色
  };
  typography: {
    fontFamily: string;            // 字体族
    fontSize: number;              // 字号（px）
    fontWeight: number;            // 字重
    letterSpacing: number;         // 字间距（em）
  };
  radius: {
    baseRadius: number;            // 基础圆角（px）
  };
  spacing: {
    paddingX: number;              // 水平内边距
    paddingY: number;              // 垂直内边距
    cardPadding: number;           // 卡片内边距
  };
}
```

### EffectsTokens 效果配置

```typescript
interface EffectsTokens {
  shadow: {
    elevation: number;             // 阴影高度（0-24）
    softness: number;              // 柔和度（0-1）
    spread: number;                // 扩散范围（-20-20）
    color: string;                 // 阴影颜色
  };
  border: {
    width: number;                 // 边框宽度（0-3）
    opacity: number;               // 边框透明度（0-1）
  };
  glass: {
    enabled: boolean;              // 是否启用毛玻璃
    blur: number;                  // 模糊程度（0-24px）
    opacity: number;               // 背景透明度（0-1）
    saturation: number;            // 饱和度（0-2）
  };
  gradient: {
    enabled: boolean;              // 是否启用渐变
    angle: number;                 // 渐变角度（0-360）
    stops: Array<{                 // 渐变断点
      color: string;
      pos: number;                 // 位置百分比
    }>;
  };
  noise: {
    enabled: boolean;              // 是否启用噪点
    intensity: number;             // 噪点强度（0-1）
  };
  glow: {
    enabled: boolean;              // 是否启用发光效果
    size: number;                  // 发光范围（0-60px）
    opacity: number;               // 发光透明度（0-1）
  };
}
```

### InteractionTokens 交互配置

```typescript
interface InteractionTokens {
  transition: {
    duration: number;              // 过渡时长（ms）
    easing: string;                // 缓动函数
  };
  hover: {
    lift: number;                  // 悬停上移距离（px）
    brighten: number;              // 悬停亮度增量
    shadowBoost: number;           // 阴影增强（0-1）
  };
  active: {
    press: number;                 // 按下内缩距离（px）
    darken: number;                // 按下变暗程度
  };
}
```

## 如何使用导出的代码

### 导出方式

点击顶部导航栏的 **Export** 按钮打开导出面板，支持以下操作：
- **切换组件类型**：在 Button 和 Card 之间切换
- **选择导出格式**：CSS、Tailwind、React、Vue、HTML、JSON
- **复制代码**：点击 Copy 按钮复制到剪贴板
- **下载文件**：点击 Download 保存单个文件
- **批量导出**：点击 Download All 同时下载所有 6 种格式

### 支持的导出格式

| 格式 | 文件扩展名 | 说明 |
|------|-----------|------|
| React | `.tsx` | TypeScript 函数组件，支持 variant、size、disabled props |
| Vue | `.vue` | Vue 3 SFC，使用 Composition API |
| CSS | `.css` | CSS 变量定义文件 |
| Tailwind | `.js` | Tailwind 配置扩展 |
| HTML | `.html` | 包含内联样式的 HTML 片段 |
| JSON | `.json` | 完整的设计令牌数据 |

### CSS Variables 方式

将导出的 CSS Variables 复制到你的项目根目录：

```css
:root {
  --v-mode: light;
  --v-accent: #6366f1;
  --v-bg: #f8fafc;
  --v-surface: #ffffff;
  --v-text: #1e293b;
  --v-radius: 12px;
  --v-shadow: 0 4px 16px -2px rgba(30, 41, 59, 0.15);
  /* ... 更多变量 */
}
```

### 原生 CSS 类方式

```html
<button class="vibe-button variant-solid">
  Click me
</button>

<div class="vibe-card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>
```

### Tailwind CSS 方式

将导出的 Tailwind 配置添加到你的 `tailwind.config.ts`：

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // 从导出代码中复制 color tokens
      },
      boxShadow: {
        'vibe': '0 4px 16px -2px rgba(30, 41, 59, 0.15)',
        'vibe-hover': '0 8px 24px -2px rgba(30, 41, 59, 0.2)',
      },
    },
  },
}
```

然后在组件中使用：

```html
<button class="vibe-btn vibe-btn-solid">
  Click me
</button>
```

### HTML 片段方式

直接复制导出的 HTML 代码到你的项目中：

```html
<button class="vibe-button variant-solid">
  Click me
</button>
```

确保你的项目已包含对应的 CSS 样式。

### React 组件方式

将导出的 React 组件复制到你的项目中：

```tsx
import { VibeButton } from './VibeButton';

function App() {
  return (
    <VibeButton variant="solid" onClick={() => console.log('clicked')}>
      Click Me
    </VibeButton>
  );
}
```

组件支持以下 props：
- `variant`: `'solid' | 'outline' | 'ghost'` - 按钮变体
- `size`: `'sm' | 'md' | 'lg'` - 按钮尺寸
- `disabled`: `boolean` - 是否禁用
- `children`: `React.ReactNode` - 子内容
- `onClick`: `() => void` - 点击回调

### Vue 组件方式

将导出的 Vue 组件复制到你的项目中：

```vue
<script setup lang="ts">
import { VibeButton } from './VibeButton.vue';
</script>

<template>
  <VibeButton variant="solid" @click="handleClick">
    Click Me
  </VibeButton>
</template>
```

组件支持以下 props：
- `variant`: `'solid' | 'outline' | 'ghost'` - 按钮变体
- `size`: `'sm' | 'md' | 'lg'` - 按钮尺寸
- `disabled`: `boolean` - 是否禁用

## 如何添加新预设

在 `lib/presets/builtIn.ts` 文件中添加新的预设对象：

```typescript
{
  id: 'my-custom-preset',          // 唯一标识符
  name: 'My Custom Preset',        // 显示名称
  description: 'A custom preset',  // 描述信息
  tags: ['custom', 'modern'],      // 标签分类
  tokens: {
    schemaVersion: '1.0.0',
    theme: {
      mode: 'light',
      palette: {
        accent: '#your-accent-color',
        bg: '#your-background-color',
        surface: '#your-surface-color',
        text: '#your-text-color',
        // ... 其他颜色
      },
      // ... 其他配置
    },
    effects: { /* ... */ },
    interaction: { /* ... */ },
    button: { /* ... */ },
    card: { /* ... */ },
  },
  isBuiltIn: true                  // 标记为内置预设
}
```

保存后，新预设将自动显示在预设面板中。

## 常见问题

### 分享链接太长怎么办？

分享链接包含了完整的配置数据，采用 lz-string 压缩编码。如果链接过长，建议：

- 使用短链接服务（如 bit.ly）生成短链接
- 直接导出 JSON 文件分享

### 导出图片模糊怎么办？

导出 PNG 时默认使用 2x 的 devicePixelRatio，确保在高清屏幕上清晰可见。如果仍然模糊：

- 检查浏览器缩放比例设置
- 尝试在不同浏览器中导出

### 对比度不足提示如何解读？

工具会根据 WCAG 2.1 标准计算文字与背景的对比度：

- AA 级要求对比度 ≥ 4.5:1（普通文字）或 ≥ 3:1（大号文字）
- AAA 级要求对比度 ≥ 7:1（普通文字）或 ≥ 4.5:1（大号文字）
- 建议优先保证主要文字满足 AA 级标准

### 如何导入他人分享的配置？

点击右侧面板的「Import JSON」按钮，将 JSON 数据粘贴到输入框中即可导入。你也可以通过分享链接自动导入配置。

### 如何重置为默认配置？

点击顶部的随机生成按钮旁边的重置选项，或手动调整各参数恢复默认状态。

## 技术栈

- **框架**：Next.js 14+ (App Router)
- **语言**：TypeScript
- **UI 样式**：TailwindCSS + shadcn/ui
- **状态管理**：Zustand (with persist middleware)
- **动画**：Framer Motion
- **颜色处理**：culori
- **代码高亮**：Shiki
- **图片导出**：html-to-image
- **URL 压缩**：lz-string
- **图标**：Lucide React

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
