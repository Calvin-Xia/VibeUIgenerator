# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-29
**Commit:** 0918187
**Branch:** main

## OVERVIEW

VibeUI Generator is a Next.js 15 App Router SPA for visual UI component styling. Users adjust button/card tokens via sliders, preview live, export code in 7 formats. Stack: TypeScript, Tailwind CSS, Zustand, Shiki, Framer Motion. Deploys to Cloudflare Pages.

## STRUCTURE

```
.
├── app/                    # Next.js App Router (3 files: layout, page, globals.css)
├── components/             # React components with barrel exports
│   ├── inspector/          # Parameter panel (sliders, color pickers, toggles)
│   ├── output/             # Code export panel (syntax highlighting, copy, download)
│   ├── presets/            # Preset management panel
│   ├── preview/            # Preview canvas (button/card rendering)
│   └── ui/                 # shadcn/ui primitives (button, dialog, input, tabs, toast)
├── lib/                    # Core logic
│   ├── generator/          # Style generation engine (THE core business logic)
│   ├── presets/            # Built-in preset data (12+ themes)
│   ├── store/              # Zustand state management with persist
│   ├── types/              # TypeScript type definitions (VibeTokens)
│   └── utils.ts            # General utilities
├── functions/              # Cloudflare Pages Functions (passthrough handler)
└── [config files]          # ESLint, Prettier, Tailwind, TypeScript, Vitest, Wrangler
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Modify component styles | `lib/generator/index.ts` | `getButtonStyles()`, `getCardStyles()`, `getCanvasStyles()` |
| Add export format | `lib/generator/export.ts` | 7 generators: React, Vue, CSS, Tailwind, HTML, JSON, All |
| Change color handling | `lib/generator/color.ts` | `withOpacity()`, `hexToRgb()`, `hslaToHex()` |
| Modify shadow logic | `lib/generator/shadow.ts` | `shadowFromElevation()` |
| Adjust token normalization | `lib/generator/normalize.ts` | URL encoding, JSON import, validation |
| Add syntax highlighting | `lib/generator/highlight.ts` | Shiki-based, supports 6 languages |
| Modify state management | `lib/store/vibeStore.ts` | Zustand with persist, localStorage |
| Add new preset | `lib/presets/builtIn.ts` | 12+ built-in presets |
| Change UI components | `components/` | Barrel exports per subdirectory |
| Modify inspector controls | `components/inspector/` | ColorPickerRow, SliderRow, ToggleRow, SelectRow |
| Change preview rendering | `components/preview/` | ButtonPreview, CardPreview, CanvasBackground |
| Update code output | `components/output/` | CodeBlock, SyntaxHighlighter, ExportButtons |
| Edit main page | `app/page.tsx` | Single 'use client' SPA page |
| Modify root layout | `app/layout.tsx` | Inter font, Toaster, ThemeModeObserver |
| Change Tailwind theme | `tailwind.config.ts` | CSS variables via HSL, class-based dark mode |
| Update TypeScript config | `tsconfig.json` | Strict mode, `@/*` path alias |
| Modify ESLint rules | `eslint.config.mjs` | Flat config, `no-explicit-any` disabled |
| Change deployment | `wrangler.toml` | Cloudflare Pages, `.vercel/output/static` |
| Add tests | `lib/**/*.test.ts` | Co-located with source, Vitest |

## CONVENTIONS

**Path aliases**: Use `@/` prefix for all imports (e.g., `@/lib/generator/color`).

**Component structure**: Each subdirectory in `components/` has an `index.ts` barrel export. Import from the directory, not individual files.

**State management**: All state flows through Zustand store (`lib/store/vibeStore.ts`). Actions are created via `createActions()` pattern.

**Token system**: All styling is driven by `VibeTokens` interface (`lib/types/tokens.ts`). Changes to tokens automatically update preview and exports.

**Testing**: Co-locate tests with source files (`*.test.ts`). Use `describe`/`it` blocks from Vitest. Import vitest APIs explicitly (no globals).

**Code formatting**: Prettier with single quotes, semicolons, 2-space indent, 100-char width. Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`.

**Type safety**: `@typescript-eslint/no-explicit-any` is disabled globally. Avoid adding `any` types when possible.

## ANTI-PATTERNS (THIS PROJECT)

**DO NOT** import from individual component files—use barrel exports (`@/components/inspector` not `@/components/inspector/InspectorPanel`).

**DO NOT** modify `VibeTokens` interface without updating `DEFAULT_TOKENS` in `vibeStore.ts` and all generator functions.

**DO NOT** add server components—this is a client-side SPA. All components should have `'use client'` directive.

**DO NOT** use `as any` or `as never` type casts—fix the type instead.

**DO NOT** commit `.trae/` directory changes—this is IDE-specific and should be gitignored.

**DO NOT** modify `functions/[[path]].ts` unless updating Cloudflare deployment—it's a passthrough handler.

## UNIQUE STYLES

**Token-driven architecture**: All visual output (preview, export) is generated from `VibeTokens`. No hardcoded styles in generators.

**Co-located tests**: Tests sit next to source files, not in separate `__tests__/` directories.

**Zustand persist pattern**: Store uses `persist` middleware with `createJSONStorage(() => localStorage)`. Custom `sanitizePersistedState()` handles migration.

**URL sharing**: Tokens are encoded to URL params via `lz-string` compression. `encodeToURL()` and `loadFromURL()` handle serialization.

**Multi-format export**: Single `generateAllExports()` function produces 7 formats from one `VibeTokens` input.

## COMMANDS

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (Next.js static export)
npm run lint         # ESLint check
npm run test         # Vitest test suite
npm run typecheck    # TypeScript type checking (no emit)
```

## NOTES

**Dual deployment**: Project has both GitHub Pages (`.github/workflows/nextjs.yml`) and Cloudflare Pages (`wrangler.toml`) configs. Only GitHub Pages has CI automation.

**Missing scripts**: `npm run pages:build` is referenced in `DEPLOYMENT_CLOUDFLARE.md` but doesn't exist in `package.json`.

**Empty `apps/` directory**: Likely leftover from monorepo consideration. Can be removed.

**No `public/` directory**: README references it but it's missing. No static assets in project.

**No `components.json`**: shadcn/ui components were manually added, not via CLI. Future `npx shadcn add` commands won't work without it.

**Shiki external**: `next.config.js` marks Shiki as `serverExternalPackages`. Primary usage is client-side in `highlight.ts`.

**Deprecated dependency**: `@cloudflare/next-on-pages` is deprecated in favor of `@opennextjs/cloudflare`.

**Security vulnerability**: Next.js 15.5.x has a security vulnerability per `package-lock.json`. Consider upgrading.
