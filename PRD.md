# VibeUI Generator - Product Requirements Document

## Executive Summary

VibeUI Generator is a professional frontend component style visual editor that enables designers and developers to create, customize, and export UI component styles through an intuitive real-time interface. The application supports button and card components with comprehensive styling options including colors, typography, shadows, glass effects, gradients, and interactions. Users can export generated code in 6 formats (React, Vue, HTML, CSS Variables, Tailwind Config, JSON) and share configurations via URL compression.

**Current Version**: 1.0.0  
**Architecture**: Next.js 15 App Router SPA (Static Export)  
**Deployment**: Cloudflare Pages via OpenNext adapter  

---

## Problem Statement

### Current State

Frontend developers and designers face significant friction when creating and iterating on UI component styles:

1. **Manual CSS Iteration**: Developers manually write and tweak CSS properties, requiring constant browser refresh to see changes
2. **Cross-Framework Incompatibility**: Style definitions must be manually converted between CSS, Tailwind, React, Vue, and other formats
3. **Design System Overhead**: Creating consistent design tokens requires significant upfront architecture work
4. **Collaboration Barriers**: Sharing design decisions typically requires screenshots or design tool access
5. **Accessibility Blind Spots**: Contrast ratios and WCAG compliance are often checked retroactively

### Pain Points

- **Time Waste**: 30-60 minutes spent on manual style iteration per component
- **Format Fragmentation**: Same styles must be rewritten for different frameworks (CSS → Tailwind → React → Vue)
- **No Live Preview**: CSS changes require browser refresh; no instant feedback loop
- **Sharing Difficulty**: Design decisions are hard to communicate without visual tools
- **Accessibility Afterthought**: WCAG compliance checked manually or skipped entirely

### Opportunity

Build a unified visual editor that:
- Provides instant real-time preview of style changes
- Generates production-ready code in multiple frameworks simultaneously
- Compresses design state into shareable URLs
- Integrates WCAG contrast checking into the design workflow
- Offers curated presets for rapid prototyping

---

## Proposed Solution

### Overview

VibeUI Generator is a single-page application with a 3-column layout:
- **Left Column (Inspector)**: Parameter controls organized in accordion sections (Theme, Effects, Button, Card)
- **Center Column (Preview)**: Live component preview with interactive states (hover, active, focus, disabled)
- **Right Column (Output)**: Code export with syntax highlighting, copy/download, and batch export

The core architecture is **token-driven**: all visual output derives from a `VibeTokens` interface containing ~80 properties organized into 6 categories (Theme, Effects, Interaction, Button, Card, Schema).

### User Stories

#### Story 1: Real-Time Style Customization
**As a** frontend developer  
**I want to** adjust component styles using sliders, color pickers, and toggles  
**So that** I can see instant visual feedback without writing CSS  

**Acceptance Criteria:**
- Given the inspector panel, when I drag a slider, then the preview updates within 16ms (60fps)
- Given a color picker, when I select a color, then the component background/text/border updates immediately
- Given a toggle switch, when I enable glass effect, then the preview shows backdrop-filter blur
- Given multiple parameter changes, when I adjust rapidly, then all changes apply without frame drops

**Priority:** Must Have  
**Story Points:** 13  

**Technical Notes:**
- Uses Zustand store with selector-based subscriptions
- Token mutations pass through `normalizeTokensOrNull()` validation gate
- `ui.version` counter forces re-renders in preview components
- Framer Motion handles spring-based hover/active animations

---

#### Story 2: Multi-Framework Code Export
**As a** developer using React/Vue/Tailwind  
**I want to** export styled components in my framework's syntax  
**So that** I can copy-paste production-ready code into my project  

**Acceptance Criteria:**
- Given configured styles, when I click "React" tab, then I see a complete VibeButton/VibeCard component with TypeScript types
- Given configured styles, when I click "Vue" tab, then I see a Vue 3 SFC with Composition API and `<script setup>`
- Given configured styles, when I click "CSS" tab, then I see `:root` CSS custom properties with all token values
- Given configured styles, when I click "Tailwind" tab, then I see a `tailwind.config.js` with extended theme
- Given configured styles, when I click "HTML" tab, then I see self-contained HTML with inline `<style>` block
- Given configured styles, when I click "JSON" tab, then I see full design tokens as JSON with timestamp
- Given any format, when I click "Copy", then code is copied to clipboard with success toast
- Given any format, when I click "Download", then a file downloads with correct extension (.tsx/.vue/.css/.js/.html/.json)
- Given the export modal, when I click "Download All Formats", then 6 files download sequentially

**Priority:** Must Have  
**Story Points:** 21  

**Technical Notes:**
- 6 generator functions in `lib/generator/export.ts`
- Each returns `ExportResult { code, filename, language }`
- `generateAllExports()` produces `Record<ExportFormat, ExportResult>`
- Shiki syntax highlighting with 6 language support
- Export modal uses `createPortal` for z-index isolation

---

#### Story 3: Preset Management
**As a** designer exploring styles  
**I want to** apply curated presets and save my own  
**So that** I can quickly prototype and reuse successful designs  

**Acceptance Criteria:**
- Given the preset panel, when I click a built-in preset, then all tokens update to match the preset
- Given 12 built-in presets (Glass, Neo-Brutal, Cyber, Y2K, Aurora, Mono, Retro, Noir, Pastel, Clay, Paper, Soft Shadow), each applies a complete token set
- Given a configured style, when I click "Save", then I can name and save it as a custom preset
- Given saved presets, when I click the heart icon, then it toggles favorite status
- Given saved presets, when I click delete, then a confirmation dialog appears before removal
- Given presets, when I refresh the page, then saved presets and favorites persist via localStorage

**Priority:** Must Have  
**Story Points:** 8  

**Technical Notes:**
- Built-in presets loaded from `lib/presets/builtIn.ts`
- Saved presets persisted via Zustand `persist` middleware (partialize)
- Favorites stored as string array of preset IDs
- Preset normalization validates tokens before storage

---

#### Story 4: URL Sharing
**As a** team member sharing designs  
**I want to** generate a shareable URL that restores my exact configuration  
**So that** colleagues can reproduce my design without manual setup  

**Acceptance Criteria:**
- Given a configured style, when I click "Share", then a URL is copied to clipboard with `?s=` parameter
- Given a shared URL, when recipient opens it, then the exact token configuration restores
- Given an invalid share link, when opened, then a toast error appears: "Invalid share link"
- Given a long configuration, when shared, then the URL uses LZ-string compression (typically 200-800 chars)

**Priority:** Should Have  
**Story Points:** 5  

**Technical Notes:**
- `encodeToURL()` uses `lz-string.compressToEncodedURIComponent()`
- `decodeFromURL()` decompresses + validates + normalizes
- URL parameter: `?s=<compressed>`
- Validation gate rejects malformed payloads

---

#### Story 5: Accessibility Checking
**As a** designer concerned with accessibility  
**I want to** see real-time WCAG contrast ratios  
**So that** I can ensure my color choices meet accessibility standards  

**Acceptance Criteria:**
- Given text and background colors, when I adjust either, then the contrast ratio updates in real-time
- Given a contrast ratio, when it's ≥ 4.5:1, then AA badge shows "Pass"
- Given a contrast ratio, when it's ≥ 7:1, then AAA badge shows "Pass"
- Given a contrast ratio, when it's ≥ 3:1, then AA Large badge shows "Pass"
- Given failing contrast, when ratio < 4.5:1, then badges show "Fail" with red indicator

**Priority:** Should Have  
**Story Points:** 3  

**Technical Notes:**
- `getContrastRating()` in `lib/generator/color.ts`
- Uses `culori.wcagContrast()` for WCAG 2.1 calculation
- Returns `{ ratio, aa, aaa, aaaLarge }` boolean flags
- Displayed in `AccessibilityHint` component

---

#### Story 6: PNG Export
**As a** designer creating documentation  
**I want to** export the component preview as a PNG image  
**So that** I can include it in design specs or presentations  

**Acceptance Criteria:**
- Given the preview canvas, when I click "Export PNG", then a PNG file downloads
- Given the export, when rendered, then the image uses 2x pixel ratio for Retina displays
- Given the export, when rendered, then it includes the canvas background effects

**Priority:** Could Have  
**Story Points:** 3  

**Technical Notes:**
- Uses `html-to-image` library's `toPng()` function
- `pixelRatio: 2` for high-DPI rendering
- Captures the `PreviewCanvas` container including `CanvasBackground`

---

#### Story 7: Dark Mode
**As a** user working in different lighting conditions  
**I want to** switch between light and dark themes  
**So that** I can reduce eye strain and preview dark-mode component styles  

**Acceptance Criteria:**
- Given the top bar, when I click the sun/moon icon, then the entire UI switches theme
- Given dark mode, when enabled, then the preview canvas shows dark background
- Given dark mode, when enabled, then the code output uses `github-dark` Shiki theme
- Given light mode, when enabled, then the code output uses `github-light` Shiki theme
- Given theme preference, when I refresh, then the theme persists via token storage

**Priority:** Should Have  
**Story Points:** 5  

**Technical Notes:**
- `ThemeModeObserver` syncs `tokens.theme.mode` to `<html>` classList
- CSS variables in `globals.css` define light/dark values
- Tailwind `darkMode: ['class']` configuration
- Shiki themes: `github-dark`, `github-light`

---

#### Story 8: Responsive Layout
**As a** user on different devices  
**I want to** use the tool on desktop and mobile  
**So that** I can design styles from any device  

**Acceptance Criteria:**
- Given desktop (≥1024px), when viewed, then 3-column layout shows (inspector | preview | presets)
- Given mobile (<1024px), when viewed, then tab-based navigation shows (Inspector | Preview | Code)
- Given mobile, when I tap a tab, then the corresponding panel fills the screen
- Given mobile, when I rotate to landscape, then layout adjusts appropriately

**Priority:** Should Have  
**Story Points:** 8  

**Technical Notes:**
- `MainLayout.tsx` handles responsive switching
- Desktop: CSS Grid with 3 columns
- Mobile: Tab-based switching via `ui.activeTab` state
- Tailwind responsive breakpoints: `lg:` prefix

---

### Non-Functional Requirements

#### Performance
- **Render Performance**: Preview updates within 16ms (60fps) during slider drag
- **Bundle Size**: Initial JS bundle < 500KB gzipped
- **Time to Interactive**: < 3 seconds on 3G connection
- **Export Speed**: Code generation completes within 100ms for all 6 formats

#### Security
- **Input Validation**: All token inputs validated via `normalizeTokensOrNull()`
- **XSS Prevention**: Exported HTML uses `escapeHtml()` for user content
- **No Server-Side State**: Fully client-side SPA, no API endpoints to secure
- **localStorage Safety**: Persisted data sanitized on rehydration

#### Scalability
- **Token Complexity**: Support up to 100+ token properties without performance degradation
- **Preset Storage**: Support up to 50 saved presets in localStorage
- **Export Formats**: Architecture supports adding new formats without refactoring

#### Accessibility
- **WCAG 2.1 AA**: Core UI meets contrast requirements
- **Keyboard Navigation**: All interactive elements focusable and operable via keyboard
- **Screen Reader Support**: ARIA labels on all controls
- **Focus Management**: Visible focus indicators on all interactive elements

---

## Technical Specifications

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                     │
│                    (Static Export Mode)                       │
├─────────────────────────────────────────────────────────────┤
│  app/layout.tsx          │  app/page.tsx (Client Entry)     │
│  (Root Server Layout)    │  (URL Params, Preset Loading)    │
├─────────────────────────────────────────────────────────────┤
│                    AppShell Component                        │
│  ┌──────────┬──────────────────┬──────────────┐            │
│  │ TopBar   │   MainLayout     │              │            │
│  │ (Actions)│ ┌──────────────┐ │              │            │
│  │          │ │ InspectorPanel│ │  PresetPanel │            │
│  │          │ │ (Accordion)  │ │  (Grid)      │            │
│  │          │ ├──────────────┤ │              │            │
│  │          │ │ PreviewCanvas │ │              │            │
│  │          │ │ (Live Preview)│ │              │            │
│  │          │ ├──────────────┤ │              │            │
│  │          │ │ OutputPanel  │ │              │            │
│  │          │ │ (Code Export) │ │              │            │
│  └──────────┴──────────────────┴──────────────┘            │
├─────────────────────────────────────────────────────────────┤
│                    Zustand Store (vibeStore.ts)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ tokens: VibeTokens (80+ properties)                 │   │
│  │ ui: UIState (ephemeral)                             │   │
│  │ presets: PresetsState (partially persisted)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                    ↓ localStorage persist                    │
├─────────────────────────────────────────────────────────────┤
│                    Generator Engine (lib/generator/)         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐ │
│  │ index.ts │ export.ts│ color.ts │shadow.ts │normalize │ │
│  │ (Preview)│ (6 fmts) │ (culori) │ (layers) │ (valid.) │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

#### VibeTokens Interface
```typescript
interface VibeTokens {
  schemaVersion: string;           // '1.0.0'
  theme: ThemeTokens;              // Colors, typography, spacing
  effects: EffectsTokens;          // Shadow, border, glass, gradient, noise, glow
  interaction: InteractionTokens;  // Transition, hover, active
  button: ButtonTokens;            // Variant, height, radius, overrides
  card: CardTokens;                // Radius, padding, alpha values
}
```

#### ThemeTokens
```typescript
interface ThemeTokens {
  mode: 'light' | 'dark';
  palette: {
    accent: string;      // Primary brand color (#rrggbb)
    accent2?: string;    // Secondary accent (optional)
    bg: string;          // Page background
    surface: string;     // Component background
    text: string;        // Primary text
    mutedText: string;   // Secondary text
    border: string;      // Border color
  };
  typography: {
    fontFamily: string;  // CSS font-family
    fontSize: number;    // px
    fontWeight: number;  // 100-900
    letterSpacing: number; // em
  };
  radius: {
    baseRadius: number;  // px, derives button/card radius
  };
  spacing: {
    paddingX: number;    // px
    paddingY: number;    // px
    cardPadding: number; // px
  };
}
```

#### EffectsTokens
```typescript
interface EffectsTokens {
  shadow: {
    elevation: number;   // 0-24, drives shadowFromElevation()
    softness: number;    // 0-1, affects blur/spread
    spread: number;      // -20 to 20
    color: string;       // Shadow color
  };
  border: {
    width: number;       // 0-3px
    opacity: number;     // 0-1
  };
  glass: {
    enabled: boolean;
    blur: number;        // 0-24px
    opacity: number;     // 0-1
    saturation: number;  // 0-2
  };
  gradient: {
    enabled: boolean;
    angle: number;       // 0-360
    stops: Array<{ color: string; pos: number }>;
  };
  noise: {
    enabled: boolean;
    intensity: number;   // 0-1
  };
  glow: {
    enabled: boolean;
    size: number;        // 0-60px
    opacity: number;     // 0-1
  };
}
```

### API Changes

**No API endpoints** - This is a fully client-side SPA with no server-side logic.

### Database Changes

**No database** - State persists via localStorage with Zustand `persist` middleware.

### Dependencies

#### Core Runtime (16 packages)
| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.5.18 | Framework (App Router, static export) |
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | DOM rendering |
| zustand | ^4.5.4 | State management with persist |
| framer-motion | ^11.3.8 | Animations (spring physics, AnimatePresence) |
| shiki | ^1.16.2 | Syntax highlighting (6 languages, 2 themes) |
| culori | ^3.3.0 | Color manipulation (parse, format, WCAG contrast) |
| lz-string | ^1.5.0 | URL-safe string compression |
| html-to-image | ^1.11.11 | DOM-to-PNG export |
| lucide-react | ^0.424.0 | Icon library (~20 icons) |
| clsx | ^2.1.1 | Conditional className joining |
| tailwind-merge | ^2.4.0 | Tailwind class deduplication |
| class-variance-authority | ^0.7.0 | Variant-based class generation |

#### Radix UI Primitives (12 packages)
- @radix-ui/react-accordion (InspectorPanel)
- @radix-ui/react-dialog (ExportModal, PresetPanel)
- @radix-ui/react-select (SelectRow)
- @radix-ui/react-slider (SliderRow)
- @radix-ui/react-switch (ToggleRow)
- @radix-ui/react-tabs (shadcn/ui Tabs)
- @radix-ui/react-toast (shadcn/ui Toast)
- @radix-ui/react-dropdown-menu (unused)
- @radix-ui/react-tooltip (unused)
- @radix-ui/react-toggle (unused)
- @radix-ui/react-toggle-group (unused)
- @radix-ui/react-label (unused)

#### Dev Dependencies (11 packages)
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.5.4 | Type checking (strict mode) |
| tailwindcss | ^3.4.10 | Utility-first CSS |
| postcss | ^8.4.40 | CSS processing |
| autoprefixer | ^10.4.19 | Vendor prefixes |
| eslint | ^9.39.2 | Linting (flat config) |
| eslint-config-next | ^16.1.1 | Next.js ESLint rules |
| typescript-eslint | ^8.50.1 | TypeScript ESLint |
| prettier | ^3.3.3 | Code formatting |
| prettier-plugin-tailwindcss | ^0.6.5 | Tailwind class sorting |
| vitest | ^4.0.18 | Test runner |
| wrangler | ^4.86.0 | Cloudflare CLI |

### Security Considerations

1. **No Server-Side Attack Surface**: Fully static SPA, no API endpoints, no server-side data processing
2. **Input Validation**: All token mutations pass through `normalizeTokensOrNull()` which validates structure, types, and value ranges
3. **XSS Prevention**: Exported HTML uses `escapeHtml()` for user-provided content
4. **localStorage Sanitization**: `sanitizePersistedState()` validates localStorage data on rehydration, discarding malformed payloads
5. **No External Dependencies**: No runtime calls to external APIs or services
6. **CSP Compatibility**: No inline scripts in production (Next.js handles this)

---

## Implementation Roadmap

### Phase 1: Foundation (Current State)
**Status:** ✅ Complete

- [x] Next.js 15 App Router with static export
- [x] Zustand store with persist middleware
- [x] VibeTokens interface (80+ properties)
- [x] Token validation and normalization
- [x] 3-column responsive layout
- [x] Inspector controls (ColorPicker, Slider, Toggle, Select)
- [x] Live preview (Button, Card, Canvas)
- [x] Code export (6 formats)
- [x] Preset management (12 built-in, save/favorite)
- [x] URL sharing with LZ-string compression
- [x] Dark mode with CSS variables
- [x] Accessibility contrast checking
- [x] PNG export

### Phase 2: Enhancement (Proposed)
**Timeline:** 4-6 weeks

#### Feature 1: Additional Component Types
- [ ] Input component styling
- [ ] Badge component styling
- [ ] Avatar component styling
- [ ] Checkbox/Radio component styling

**User Story:** As a developer, I want to style more component types so that I can build complete UIs.

**Technical Impact:**
- Extend `VibeTokens` with new component interfaces
- Add new generator functions in `export.ts`
- Add new preview components in `components/preview/`
- Update `InspectorPanel` with new accordion sections

#### Feature 2: Theme Presets Import/Export
- [ ] Export presets as JSON file
- [ ] Import presets from JSON file
- [ ] Share preset collections via URL

**User Story:** As a designer, I want to share my preset collection so that my team can use consistent styles.

**Technical Impact:**
- Add `exportPresets()` / `importPresets()` to store actions
- Extend URL encoding to support preset arrays
- Add file input/output UI in PresetPanel

#### Feature 3: Undo/Redo System
- [ ] Track token change history (max 50 states)
- [ ] Undo button (Ctrl+Z)
- [ ] Redo button (Ctrl+Shift+Z)
- [ ] Visual history indicator

**User Story:** As a user, I want to undo style changes so that I can experiment without fear.

**Technical Impact:**
- Add `history[]` and `historyIndex` to UIState
- Intercept `setToken` to push to history
- Add `undo()` / `redo()` actions
- Keyboard shortcut handler

#### Feature 4: Responsive Preview
- [ ] Preview at different viewport widths (320px, 768px, 1024px, 1440px)
- [ ] Device frame overlay (phone, tablet, desktop)
- [ ] Orientation toggle (portrait/landscape)

**User Story:** As a designer, I want to preview how components look at different screen sizes.

**Technical Impact:**
- Add viewport width state to UIState
- Wrap PreviewCanvas in resizable container
- Add device frame SVG overlays
- CSS media query preview (show responsive behavior)

### Phase 3: Polish (Proposed)
**Timeline:** 2-3 weeks

#### Feature 5: Animation Customization
- [ ] Easing curve visual editor
- [ ] Duration slider per interaction state
- [ ] Preview animation in slow motion

**User Story:** As a designer, I want fine-grained control over component animations.

#### Feature 6: Color Palette Generator
- [ ] Generate complementary colors from accent
- [ ] Generate analogous, triadic, split-complementary palettes
- [ ] Extract palette from uploaded image

**User Story:** As a designer, I want to generate harmonious color palettes from a single color.

#### Feature 7: Export to Design Tools
- [ ] Export as Figma tokens (JSON)
- [ ] Export as Style Dictionary format
- [ ] Export as CSS-in-JS (styled-components, emotion)

**User Story:** As a designer, I want to export tokens to my design tool so that I can maintain consistency.

#### Feature 8: Collaboration Features
- [ ] Real-time collaboration via WebSocket
- [ ] Commenting on specific token values
- [ ] Version history with branching

**User Story:** As a team, we want to collaborate on design tokens in real-time.

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Time to first meaningful paint | ~2s | < 1.5s | Phase 2 |
| Code export accuracy | 95% | 99% | Phase 2 |
| Preset save/load success rate | 98% | 99.9% | Phase 2 |
| URL share decode success rate | 90% | 98% | Phase 2 |
| Accessibility contrast check accuracy | 100% | 100% | Ongoing |

### User Metrics

- **Adoption Rate:** 1000+ monthly active users within 3 months of launch
- **Engagement:** Average 5+ style iterations per session
- **Retention:** 40% weekly return rate
- **Export Usage:** 60% of sessions result in code export

### Technical Metrics

- **Performance:** < 16ms render time for preview updates
- **Uptime:** 99.9% availability (static hosting)
- **Error Rate:** < 0.1% of token mutations fail validation
- **Bundle Size:** < 500KB gzipped initial load

### Business Metrics

- **GitHub Stars:** 500+ within 6 months
- **Community Presets:** 50+ user-submitted presets
- **Framework Coverage:** Support React, Vue, Svelte, Angular exports

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Score | Mitigation | Owner |
|------|-------------|--------|-------|------------|-------|
| Zustand v4 → v5 breaking changes | Medium | Medium | 4 | Pin to v4, defer upgrade until stable | Dev |
| Next.js 15 → 16 migration | Low | High | 3 | Static export mode minimizes framework coupling | Dev |
| Shiki WASM compatibility | Medium | Medium | 4 | Fallback to plain text if highlighter fails | Dev |
| localStorage quota exceeded | Low | Medium | 2 | Monitor storage usage, implement cleanup | Dev |
| culori library breaking changes | Low | Low | 1 | Pin version, abstract color operations | Dev |
| html-to-image browser compatibility | Medium | Medium | 4 | Feature detection, graceful degradation | Dev |

### Business Risks

| Risk | Probability | Impact | Score | Mitigation | Owner |
|------|-------------|--------|-------|------------|-------|
| Competing tools (Figma, Storybook) | High | High | 9 | Focus on code export and developer workflow | Product |
| Low adoption | Medium | High | 6 | Developer marketing, community building | Marketing |
| Maintenance burden | Medium | Medium | 4 | Comprehensive test coverage, modular architecture | Dev |
| Accessibility compliance gaps | Low | High | 3 | Regular WCAG audits, automated testing | QA |

### Risk Score Matrix

```
              Impact
         Low    Med    High
    ┌────────┬────────┬────────┐
  H │   3    │   6    │   9    │
P   ├────────┼────────┼────────┤
r   M │   2    │   4    │   6    │
o   ├────────┼────────┼────────┤
b   L │   1    │   2    │   3    │
    └────────┴────────┴────────┘
```

---

## Open Questions

1. **Component Scope**: Should we add more component types (Input, Badge, Avatar) or focus on deep customization of existing Button/Card?
2. **Collaboration Priority**: Is real-time collaboration a priority, or is URL sharing sufficient for now?
3. **Design Tool Integration**: How important is Figma/Style Dictionary export for the target audience?
4. **Preset Marketplace**: Should we build a community preset sharing platform?
5. **Mobile Priority**: How important is mobile support given the desktop-centric design workflow?

---

## Appendix

### Related Documents

- [README.md](README.md) - Project overview and usage guide
- [DEPLOYMENT_CLOUDFLARE.md](DEPLOYMENT_CLOUDFLARE.md) - Cloudflare Pages deployment guide
- [AGENTS.md](AGENTS.md) - AI agent knowledge base

### Glossary

| Term | Definition |
|------|------------|
| VibeTokens | Core data interface containing all style properties (~80 fields) |
| Token-Driven Architecture | Pattern where all visual output derives from a single token data structure |
| Preset | A saved VibeTokens configuration with metadata (name, description, tags) |
| Glass Effect | Backdrop-filter blur effect creating frosted glass appearance |
| Elevation | Shadow intensity parameter (0-24) driving multi-layer shadow generation |
| LZ-string | Compression library used to encode VibeTokens into URL-safe strings |
| culori | Color manipulation library providing parse, format, and WCAG contrast functions |
| Shiki | Syntax highlighting engine supporting multiple languages and themes |
| Radix UI | Headless UI primitives providing accessibility and interaction patterns |
| shadcn/ui | Component library pattern using Radix + Tailwind CSS |

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-05-29  
**Author:** VibeUI Generator Team  
**Status:** Draft - Pending Review
