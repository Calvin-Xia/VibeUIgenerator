# components/ AGENTS.md

## OVERVIEW
Feature-organized React components for VibeUI Generator. All client-side SPA with barrel exports per subdirectory.

## STRUCTURE
```
components/
├── Root files          # AppShell, MainLayout, ThemeModeObserver, TopBar
├── inspector/          # Parameter controls (sliders, color pickers, toggles)
├── output/             # Code export panel (syntax highlighting, copy, download)
├── presets/            # Preset management panel
├── preview/            # Preview canvas (button/card rendering)
└── ui/                 # shadcn/ui primitives (Radix + CVA + tailwind-merge)
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Modify parameter controls | `inspector/InspectorPanel.tsx` |
| Add new slider/color/toggle | `inspector/SliderRow.tsx`, `ColorPickerRow.tsx`, `ToggleRow.tsx` |
| Change code output format | `output/OutputPanel.tsx`, `CodeTabs.tsx` |
| Adjust syntax highlighting | `output/SyntaxHighlighter.tsx`, `EnhancedCode.tsx` |
| Modify export functionality | `output/ExportButtons.tsx`, `ExportModal.tsx` |
| Change preview rendering | `preview/ButtonPreview.tsx`, `CardPreview.tsx` |
| Update canvas background | `preview/CanvasBackground.tsx` |
| Modify preset selection | `presets/PresetPanel.tsx` |
| Customize UI primitives | `ui/` (button, dialog, input, tabs, toast) |

## CONVENTIONS
**Barrel exports**: Each feature subdirectory exports via `index.ts`. Import from directory:
```typescript
import { InspectorPanel, SliderRow } from '@/components/inspector'
// NOT: import { InspectorPanel } from '@/components/inspector/InspectorPanel'
```

**State access**: Components use Zustand store via `useVibeStore` hook. Access tokens and actions through store selectors.

**Component structure**: Each component is a standalone file with 'use client' directive. No server components.

**UI primitives**: `ui/` contains shadcn/ui components. Do not modify directly unless updating shadcn/ui version.

## ANTI-PATTERNS
**DO NOT** import from individual component files in feature directories. Use barrel exports.

**DO NOT** add new components to root level. Place in appropriate feature subdirectory.

**DO NOT** modify `ui/` primitives without understanding shadcn/ui patterns (Radix, CVA, tailwind-merge).

**DO NOT** create server components. All components must have 'use client' directive.
