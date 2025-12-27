# VibeUI Generator

VibeUI Generator 是一个专业的前端组件样式可视化生成器，支持实时调整 Button 和 Card 组件的视觉效果，并一键导出多种格式的代码。项目采用 Next.js 14+ App Router 架构，提供了丰富的预设库和灵活的参数自定义功能，帮助设计师和开发者快速创建符合品牌调性的现代化 UI 组件。

## 功能特性

VibeUI Generator 提供了完整的组件样式设计工作流，从参数调整到代码导出覆盖了整个设计到开发的流程。实时可视化调参功能允许用户通过滑杆、颜色选择器等控件实时调整组件样式，所见即所得地预览效果变化。语法高亮显示功能基于业界标准的 Shiki 引擎实现，支持 React、Vue、HTML、CSS、Tailwind、JSON 等多种编程语言的代码着色，使导出的代码更加易于阅读和理解。强化代码展示功能提供了行号显示、垂直滚动、主题适配等特性，显著提升了代码阅读体验。

多格式导出功能是 VibeUI Generator 的核心能力之一，支持同时导出 React 组件、Vue 组件、CSS Variables、原生 CSS、Tailwind 配置、HTML 片段和 JSON 设计令牌，满足不同技术栈和项目需求。内置的代码预览面板支持语法高亮、一键复制和单文件下载，批量导出功能可以一次性获取所有格式的代码文件，极大提升了开发效率。

项目包含 12 种以上精心设计的内置预设，涵盖 Glass（玻璃态）、Neo-Brutal（新野蛮主义）、Cyber（赛博朋克）、Y2K（千禧年）、Aurora（极光）等多种流行风格，用户可以一键应用预设，也可以基于预设进行二次创作。URL 分享功能将当前配置编码为可分享链接，接收者打开链接即可还原完整的设计方案，方便团队协作和方案评审。

PNG 图片导出功能支持一键生成组件预览图，可直接用于设计文档、演示文稿或社交媒体分享。响应式设计确保应用在桌面端三栏布局和移动端切换视图下都能正常使用。辅助功能检查功能实时计算文字与背景的对比度，根据 WCAG 2.1 标准给出 AA 或 AAA 级别的评分提示，帮助用户创建符合无障碍标准的组件。

## 快速开始

### 环境要求

在开始使用 VibeUI Generator 之前，请确保开发环境满足以下要求。Node.js 版本需要 18.0 或更高版本，推荐使用 20.x LTS 版本以获得最佳兼容性。包管理器可以使用 npm、yarn 或 pnpm 中的任意一种，项目根目录已包含对应的锁文件。Git 版本需要 2.x 或更高版本，用于版本控制和代码管理。

### 安装步骤

克隆项目仓库并安装依赖是最基本的初始化步骤。如果还没有仓库副本，可以使用 git clone 命令从远程仓库获取代码。克隆完成后进入项目目录，执行包管理器的安装命令来下载所有依赖项。首次安装可能需要几分钟时间，取决于网络连接速度和计算机性能。

```bash
# 克隆仓库（请将 your-username 替换为实际的用户名）
git clone https://github.com/your-username/VibeUIgenerator.git
cd VibeUIgenerator

# 使用 npm 安装依赖
npm install

# 或者使用 pnpm（推荐，速度更快）
pnpm install

# 或者使用 yarn
yarn install
```

安装完成后，启动开发服务器进行本地预览。开发服务器支持热重载，代码修改后会自动刷新页面，无需手动刷新浏览器。默认情况下，开发服务器运行在 http://localhost:3000 端口，打开浏览器访问该地址即可开始使用。

```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 构建生产版本

当需要部署到生产环境时，需要先执行构建命令生成优化后的静态资源。构建过程会进行代码压缩、Tree Shaking、代码分割等优化操作，显著减小包体积并提升加载速度。构建完成后，可以使用预览命令在本地测试生产版本的运行效果。

```bash
# 构建生产版本
npm run build

# 预览生产版本（用于测试）
npm run start
```

## 项目结构

VibeUI Generator 采用清晰的目录结构组织代码，按功能模块划分目录，使项目易于维护和扩展。以下是项目根目录下的主要文件和文件夹说明。

```
VibeUIgenerator/
├── .trae/                    # Trae IDE 配置文件和文档
│   └── documents/            # 开发文档和修复记录
├── app/                      # Next.js 14 App Router
│   ├── globals.css           # 全局样式文件
│   ├── layout.tsx            # 根布局组件
│   └── page.tsx              # 主页面组件
├── components/               # React 组件库
│   ├── AppShell.tsx          # 应用外壳组件
│   ├── MainLayout.tsx        # 主布局组件
│   ├── ThemeModeObserver.tsx # 主题模式观察器
│   ├── TopBar.tsx            # 顶部导航栏组件
│   ├── inspector/            # 参数面板组件
│   │   ├── AccessibilityHint.tsx  # 辅助功能提示组件
│   │   ├── ColorPickerRow.tsx     # 颜色选择器行组件
│   │   ├── InspectorPanel.tsx     # 参数面板容器组件
│   │   ├── SelectRow.tsx          # 下拉选择器行组件
│   │   ├── SliderRow.tsx          # 滑杆控件行组件
│   │   ├── ToggleRow.tsx          # 开关控件行组件
│   │   └── index.ts               # 导出入口文件
│   ├── output/               # 代码输出面板组件
│   │   ├── CodeBlock.tsx          # 代码块显示组件
│   │   ├── CodePreview.tsx        # 代码预览组件
│   │   ├── CodeTabs.tsx           # 代码格式标签页组件
│   │   ├── EnhancedCode.tsx       # 强化代码展示组件
│   │   ├── ExportButtons.tsx      # 导出操作按钮组件
│   │   ├── ExportModal.tsx        # 导出模态框组件
│   │   ├── OutputPanel.tsx        # 输出面板容器组件
│   │   ├── SyntaxHighlighter.tsx  # 语法高亮组件
│   │   └── index.ts               # 导出入口文件
│   ├── presets/                   # 预设管理面板组件
│   │   ├── PresetPanel.tsx        # 预设面板组件
│   │   └── index.ts               # 导出入口文件
│   ├── preview/              # 预览画布组件
│   │   ├── ButtonPreview.tsx      # 按钮预览组件
│   │   ├── CanvasBackground.tsx   # 画布背景组件
│   │   ├── CardPreview.tsx        # 卡片预览组件
│   │   ├── PreviewCanvas.tsx      # 预览画布容器组件
│   │   ├── PreviewSwitch.tsx      # 预览切换控件组件
│   │   └── index.ts               # 导出入口文件
│   └── ui/                   # shadcn/ui 基础组件
│       ├── button.tsx              # 按钮组件
│       ├── dialog.tsx              # 对话框组件
│       ├── input.tsx               # 输入框组件
│       ├── tabs.tsx                # 标签页组件
│       ├── toast.tsx               # 提示组件
│       ├── toaster.tsx             # 提示容器组件
│       └── use-toast.ts            # 提示钩子函数
├── functions/                # Cloudflare Pages Functions
│   └── [[path]].ts           # 通用路由捕获文件
├── lib/                      # 核心库和工具
│   ├── generator/            # 样式生成引擎
│   │   ├── color.ts               # 颜色工具函数
│   │   ├── export.ts              # 代码导出生成器
│   │   ├── highlight.ts           # 代码语法高亮器
│   │   ├── index.ts               # 主生成器入口
│   │   ├── normalize.ts           # URL 编解码工具
│   │   └── shadow.ts              # 阴影生成算法
│   ├── presets/              # 预设数据
│   │   └── builtIn.ts             # 内置预设数据
│   ├── store/                # 状态管理
│   │   └── vibeStore.ts           # Zustand 状态存储
│   ├── types/                # TypeScript 类型定义
│   │   └── tokens.ts              # 设计令牌类型定义
│   └── utils.ts              # 通用工具函数
├── public/                   # 静态资源目录
├── .eslintrc.json            # ESLint 配置文件
├── .gitignore                # Git 忽略配置
├── .prettierrc               # Prettier 格式化配置
├── DEPLOYMENT_CLOUDFLARE.md  # Cloudflare Pages 部署指南
├── next.config.js            # Next.js 配置文件
├── package.json              # 项目依赖配置
├── postcss.config.js         # PostCSS 配置文件
├── README.md                 # 项目说明文档
├── tailwind.config.ts        # TailwindCSS 配置
├── tsconfig.json             # TypeScript 配置
└── wrangler.toml             # Cloudflare 部署配置
```

## 使用指南

### 参数面板操作

参数面板是 VibeUI Generator 的核心交互区域，位于应用左侧，提供了丰富的控件来调整组件样式。面板采用 Accordion 折叠布局组织不同类别的参数，包括主题（Theme）、效果（Effects）、按钮（Button）、卡片（Card）等部分，每个部分可以独立展开或折叠，方便在大量参数中快速定位目标项。

主题参数控制整体视觉风格，包括亮色模式和暗色模式的切换，以及调色板的配置。颜色选择器支持十六进制颜色值输入，提供视觉化的颜色拾取界面。滑杆控件用于调整数值型参数，如字体大小、圆角半径、阴影高度等，拖动滑块时预览区域会实时更新效果。开关控件用于切换功能的启用状态，如玻璃态效果、发光效果、渐变背景等。

### 预览区域使用

预览区域位于应用中央，实时显示当前参数配置下的组件效果。对于按钮组件，预览区域展示不同状态的按钮样式，包括默认状态、悬停状态、按下状态和禁用状态。卡片组件的预览展示卡片在当前主题和效果配置下的整体外观，包括背景、阴影、圆角等属性。

画布背景可以配置渐变效果、噪点纹理和发光装饰，这些背景元素与组件预览分离，通过 CanvasBackground 组件独立渲染。预览切换控件允许在按钮预览和卡片预览之间快速切换，对比不同组件类型的效果差异。

### 代码导出功能

代码导出面板位于应用右侧，提供多种格式的代码导出功能。顶部标签页支持切换不同的导出格式，包括 React 组件、Vue 组件、CSS Variables、原生 CSS、Tailwind 配置、HTML 片段和 JSON 设计令牌。每种格式的代码都经过语法高亮处理，便于阅读和理解。

导出按钮组提供复制到剪贴板、单文件下载和批量下载三种操作方式。复制功能一键将当前格式的代码复制到剪贴板，可直接粘贴到编辑器中使用。下载功能生成格式正确的代码文件，支持自定义文件名。批量下载将所有格式的代码打包为 ZIP 文件一次性获取。

### 预设应用

预设面板提供预设的浏览和应用功能。内置预设按风格分类展示，包括 Glass、Neo-Brutal、Cyber、Y2K、Aurora 等类别。每个预设卡片显示预览图和名称，点击即可将当前配置应用到工作区。收藏功能允许将常用预设标记为收藏，方便快速访问。用户还可以保存自定义预设，实现设计方案的复用和分享。

### URL 分享

URL 分享功能将当前的设计配置编码为紧凑的 URL 参数，支持分享给团队成员或在其他设备上打开。点击分享按钮生成包含配置信息的链接，复制链接后可以发送给需要的人。接收者打开链接后，应用会自动解析 URL 参数并还原完整的配置状态，无需手动输入或导入文件。

## Tokens 数据结构

VibeUI Generator 使用层次化的 Tokens 结构来描述组件样式，所有样式生成都基于这套数据结构。理解 Tokens 结构有助于进行高级定制和开发扩展。

### 完整 Tokens 结构

```typescript
interface VibeTokens {
  schemaVersion: string;           // 版本号，用于兼容升级
  theme: ThemeTokens;              // 主题配置
  effects: EffectsTokens;          // 效果配置
  interaction: InteractionTokens;  // 交互配置
  button: ButtonTokens;            // 按钮组件配置
  card: CardTokens;                // 卡片组件配置
}
```

### ThemeTokens 主题配置

主题配置定义了组件的视觉基础，包括颜色、字体、排版等属性。调色板采用 HSL 或十六进制颜色值，支持完整的颜色体系配置。

```typescript
interface ThemeTokens {
  mode: 'light' | 'dark';          // 亮色或暗色模式
  palette: {
    accent: string;                // 主色调
    accent2?: string;              // 次要色（可选）
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

效果配置定义了组件的视觉增强属性，包括阴影、边框、玻璃态、渐变、噪点和发光效果。这些效果可以叠加组合，创造丰富的视觉层次。

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
    enabled: boolean;              // 是否启用玻璃态
    blur: number;                  // 模糊程度（0-24px）
    opacity: number;               // 背景透明度（0-1）
    saturation: number;            // 饱和度（0-2）
  };
  gradient: {
    enabled: boolean;              // 是否启用渐变
    angle: number;                 // 渐变角度（0-360）
    stops: Array<{
      color: string;               // 断点颜色
      pos: number;                 // 断点位置（%）
    }>;
  };
  noise: {
    enabled: boolean;              // 是否启用噪点
    intensity: number;             // 噪点强度（0-1）
  };
  glow: {
    enabled: boolean;              // 是否启用发光
    size: number;                  // 发光范围（0-60px）
    opacity: number;               // 发光透明度（0-1）
  };
}
```

### InteractionTokens 交互配置

交互配置定义了组件的用户交互行为，包括过渡动画、悬停效果和按下效果。这些配置确保组件具有流畅自然的交互反馈。

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

## 导出格式说明

VibeUI Generator 支持七种代码导出格式，每种格式针对不同的使用场景和框架进行了优化。

### React 组件格式

导出的 React 组件采用 TypeScript 编写，包含完整的类型定义。组件支持 variant（变体）、size（尺寸）、disabled（禁用）等 props，可以灵活集成到 React 项目中。

```tsx
import { buttonStyles } from './buttonStyles';

interface VibeButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function VibeButton({
  variant = 'solid',
  size = 'md',
  disabled = false,
  children,
  onClick
}: VibeButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Vue 组件格式

Vue 组件采用 Vue 3 的 Composition API 编写，使用 script setup 语法糖，简洁且性能优异。组件支持 props 定义和事件抛出。

### CSS Variables 格式

CSS Variables 格式导出一组自定义属性，可以在任何 CSS 文件中引入使用。这种格式适合需要精细控制样式的项目。

```css
:root {
  --v-mode: light;
  --v-accent: #6366f1;
  --v-accent2: #8b5cf6;
  --v-bg: #f8fafc;
  --v-surface: #ffffff;
  --v-text: #1e293b;
  --v-muted-text: #64748b;
  --v-border: #e2e8f0;
  --v-radius: 12px;
  --v-shadow: 0 4px 16px -2px rgba(30, 41, 59, 0.15);
}
```

### Tailwind 配置格式

Tailwind 格式导出 theme 扩展配置，可以直接添加到 tailwind.config.ts 中使用。

### HTML 片段格式

HTML 格式导出自包含的内联样式片段，可以直接粘贴到任何 HTML 页面中使用。

### JSON 令牌格式

JSON 格式导出完整的设计令牌数据，适合用于设计系统集成或数据持久化。

## 部署指南

VibeUI Generator 支持多种部署方式，包括 Vercel（官方推荐）、Cloudflare Pages 和传统服务器部署。不同的部署方式适用于不同的场景和需求。

### Vercel 部署（推荐）

Vercel 是 Next.js 的官方托管平台，提供最佳的性能和开发体验。部署流程简单快捷，支持自动预览部署和自定义域名。

1. 将代码推送到 GitHub 仓库
2. 访问 Vercel Dashboard，点击「Add New Project」
3. 选择刚刚推送的仓库
4. 点击「Deploy」开始部署

Vercel 会自动检测 Next.js 项目并配置构建命令，无需额外配置。

### Cloudflare Pages 部署

项目已配置完整的 Cloudflare Pages 部署支持，详细部署指南请参考 DEPLOYMENT_CLOUDFLARE.md 文件。该文档包含了环境要求、详细部署步骤、本地测试方法、常见问题解答等内容。

```bash
# 快速部署命令
npm run build
npx wrangler pages deploy .vercel/output/static --project-name=vibeui-generator
```

## 常见问题

### 分享链接太长怎么办

分享链接包含了完整的配置数据，采用 lz-string 压缩编码，链接长度与配置复杂度成正比。如果链接过长影响使用体验，可以采用以下解决方案。使用短链接服务（如 bit.ly）生成短链接，或者直接导出 JSON 文件通过邮件或即时通讯工具分享。

### 导出图片模糊怎么办

导出 PNG 图片时默认使用 2x 的 devicePixelRatio，确保在高清屏幕上清晰可见。如果导出的图片仍然模糊，请检查浏览器缩放比例设置，尝试在不同浏览器中导出，或调整预览区域的大小后重新导出。

### 对比度不足提示如何解读

工具会根据 WCAG 2.1 标准计算文字与背景的对比度。AA 级要求对比度至少达到 4.5:1（普通文字）或 3:1（大号文字）。AAA 级要求对比度至少达到 7:1（普通文字）或 4.5:1（大号文字）。设计时建议优先保证主要文字满足 AA 级标准，以确保良好的可读性。

### 如何导入他人分享的配置

导入配置有多种方式。点击右侧面板的「Import JSON」按钮，将 JSON 数据粘贴到输入框中即可导入。也可以通过他人分享的链接自动导入配置，应用会检测 URL 参数并还原完整的配置状态。

### 如何重置为默认配置

点击顶部工具栏的重置按钮，或使用键盘快捷键 Ctrl+Shift+R（Windows）或 Cmd+Shift+R（Mac）可以快速恢复默认配置。也可以手动调整各参数恢复到初始状态。

### 预设不生效怎么办

如果应用预设后效果没有正确显示，请检查以下几点。确保预设与当前组件类型兼容（部分预设仅适用于特定组件），尝试刷新页面后重新应用，或检查浏览器控制台是否有错误信息。

## 技术栈

VibeUI Generator 采用现代化的技术栈构建，每个技术选型都经过权衡以满足项目需求。

核心框架使用 Next.js 14+ App Router，这是 React 官方推荐的现代框架架构，提供了服务端渲染、静态生成、文件系统路由等强大功能。开发语言使用 TypeScript，通过完整的类型定义提升代码质量和开发效率。UI 样式采用 TailwindCSS 结合 shadcn/ui 组件库，实现快速样式开发和一致的视觉体验。

状态管理使用 Zustand 配合 persist 中间件，实现响应式状态管理和数据持久化。动画效果使用 Framer Motion 库，提供流畅的过渡动画和交互反馈。颜色处理使用 culori 库，支持多种颜色格式转换和色彩空间操作。

代码语法高亮使用 Shiki 库实现，这是业界公认的高质量代码高亮器，支持多种语言和主题。图片导出使用 html-to-image 库，支持将 DOM 元素渲染为图片。URL 压缩使用 lz-string 库，实现高效的字符串压缩和解压。图标资源来自 Lucide React 库，提供大量高质量的 SVG 图标。

## 贡献指南

欢迎社区开发者为 VibeUI Generator 贡献代码和想法。在开始贡献之前，请阅读以下指南以确保贡献过程顺利。

### 提交 Issue

发现 bug 或有功能建议时，请先搜索是否已有相关的 Issue，避免重复提交。提交新 Issue 时，请详细描述问题或建议，包括复现步骤、预期行为和实际结果。如果是 bug 报告，请提供操作系统、浏览器版本等环境信息。

### 提交 Pull Request

1. Fork 仓库并克隆到本地
2. 创建新分支进行开发，分支命名遵循 feature/xxx 或 fix/xxx 格式
3. 确保代码符合项目的编码规范（ESLint + Prettier）
4. 添加必要的测试和文档
5. 提交时使用清晰的 Commit Message
6. 推送分支并创建 Pull Request

### 开发规范

代码风格遵循 ESLint 和 Prettier 配置，提交前请运行 lint 检查。组件采用函数式组件和 Hooks 模式编写。样式类名使用 TailwindCSS 的原子化类。提交信息使用英文，遵循 Conventional Commits 格式。

## 许可证

本项目采用 MIT 许可证开源，您可以自由使用、修改和分发本项目的代码，但需要保留原始的版权声明和许可证文本。

## 致谢

感谢以下开源项目和社区的贡献：

- Next.js 团队提供优秀的 React 框架
- Tailwind Labs 提供高效的 CSS 框架
- Shiki 团队提供高质量的代码高亮方案
- Radix UI 提供无样式的可访问组件原语
- 所有提交 Issue 和 Pull Request 的社区贡献者

---

最后更新：2025年12月
