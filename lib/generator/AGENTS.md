# generator/

Style generation engine. Transforms `VibeTokens` into CSS properties and exportable code strings.

## WHERE TO LOOK

| Task | File | Key exports |
|------|------|-------------|
| Modify button/card/canvas styles | `index.ts` | `getButtonStyles()`, `getCardStyles()`, `getCanvasStyles()` |
| Add export format | `export.ts` | `generateReactComponent()`, `generateVueComponent()`, `generateCSSVariables()`, etc. |
| Color manipulation | `color.ts` | `withOpacity()`, `hexToRgb()`, `hslaToHex()`, `getContrastRating()` |
| Shadow generation | `shadow.ts` | `shadowFromElevation()` |
| Token normalization/validation | `normalize.ts` | `encodeToURL()`, `loadFromURL()`, `normalizeTokens()` |
| Motion/animation resolution | `interaction.ts` | `resolveInteractionMotion()` |
| Syntax highlighting | `highlight.ts` | Shiki-based, 6 languages |
| Culori type declarations | `culori.d.ts` | Ambient module declaration |

## CONVENTIONS

- Every generator function takes `VibeTokens` as its first argument. No exceptions.
- Return types: `React.CSSProperties` for style functions, `string` for code generators, `ExportResult` objects for export functions.
- `index.ts` is the barrel. Re-exports everything from `export.ts`. Import from `@/lib/generator`, not submodules.
- Tests co-located: `color.test.ts` next to `color.ts`. No `__tests__/` directory.
- Color ops use `culori` exclusively. No raw hex math or manual RGB conversions.
- `culori.d.ts` provides ambient types since culori ships without full TS declarations.

## ANTI-PATTERNS

- **DO NOT** import from `./color` or `./shadow` outside this directory. Use the barrel in `index.ts`.
- **DO NOT** add color logic without using culori. Rolling your own hex/rgb/hsl conversion will drift.
- **DO NOT** hardcode CSS values in generators. All values must derive from `VibeTokens`.
- **DO NOT** modify `ExportFormat` type without updating all 7 generators and `generateAllExports()`.
- **DO NOT** add Shiki theme imports in files other than `highlight.ts`. Keep theme loading isolated.
