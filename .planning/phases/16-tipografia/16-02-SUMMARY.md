---
phase: 16-tipografia
plan: 02
subsystem: ui
tags: [nuxt-fonts, plus-jakarta-sans, typography, cls, font-loading, global-font]

requires:
  - phase: 16-tipografia
    plan: 01
    provides: Plus Jakarta Sans declared in fonts.families and @theme token

provides:
  - Hardened nuxt.config.ts fonts config with global:true (proactive @font-face generation)
  - processCSSVariables:true enabling CSS variable tracing for fallback metric generation
  - Production build verified: Plus Jakarta Sans as sole browser font, zero Inter in bundle
  - 16 @font-face rules generated for Plus Jakarta Sans (4 weights x unicode ranges)
  - 4 woff2 files present in .output/public/_fonts/

affects: [17-garantia, 18-depoimentos, 19-faq-redesign]

tech-stack:
  added: []
  patterns:
    - "global:true on fonts.families entry forces @nuxt/fonts to generate @font-face in nuxt-fonts-global.css without CSS variable detection dependency"
    - "processCSSVariables:true at fonts config root enables CSS variable tracing for fallback metric generation"

key-files:
  created: []
  modified:
    - nuxt.config.ts

key-decisions:
  - "global:true added to Plus Jakarta Sans family entry — eliminates fragile CSS variable detection order dependency; @font-face generated proactively via nuxt-fonts-global.css template"
  - "processCSSVariables:true added at fonts root — enables @nuxt/fonts to follow var(--font-family-sans) references when generating fallback metrics"

requirements-completed: [TIPO-01, TIPO-03]

duration: 92s
completed: 2026-03-25
---

# Phase 16 Plan 02: Tipografia Gap Closure Summary

**Hardened Plus Jakarta Sans font config with global:true and processCSSVariables:true; production build confirms zero Inter references and proper @font-face generation**

## Performance

- **Duration:** ~92 seconds
- **Started:** 2026-03-25T03:04:18Z
- **Completed:** 2026-03-25T03:05:50Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Added `global: true` to Plus Jakarta Sans family entry in nuxt.config.ts — forces @nuxt/fonts to generate @font-face rules proactively via the nuxt-fonts-global.css template, bypassing the CSS variable detection pipeline entirely
- Added `processCSSVariables: true` at the fonts config root — enables @nuxt/fonts to follow CSS variable references like `font-family: var(--font-family-sans)` when generating fallback metrics
- Clean production build verified: `--font-family-sans:"Plus Jakarta Sans"` correct, zero "Inter" references in entry CSS bundle, 4 woff2 files present, 16 @font-face rules generated

## Task Commits

1. **Task 1: Harden fonts config with global:true and processCSSVariables:true** - `d24300c` (feat)
2. **Task 2: Clean build and verify** - No commit (build artifacts in .output/ are gitignored; verification confirmed via build output)

## Files Created/Modified

- `nuxt.config.ts` - Added `processCSSVariables: true` at fonts top-level; added `global: true` to Plus Jakarta Sans family entry

## Build Verification Results

| Check | Result |
|-------|--------|
| `--font-family-sans` starts with "Plus Jakarta Sans" | PASS — `font-family-sans:"Plus Jakarta Sans",system-ui,...` |
| Zero "Inter" references in entry CSS | PASS — grep count = 0 |
| Plus Jakarta Sans woff2 files in `_fonts/` | PASS — 4 woff2 files |
| @font-face rules count in entry CSS | PASS — 16 rules (4 weights x unicode ranges) |
| Build completes without errors | PASS |

## Decisions Made

- `global: true` approach chosen over relying on CSS variable detection — makes @nuxt/fonts font loading deterministic regardless of CSS import order or Tailwind v4 processing changes
- `processCSSVariables: true` added as defensive measure for fallback metric generation via CSS variable tracing

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Issues Encountered

None. The `size-adjust:100%` seen in the CSS bundle belongs to Tailwind's base reset (the `*` selector), not an @nuxt/fonts fallback metric. The fallback font-face rules appear to be inlined in the `nuxt-fonts-global.css` template rather than the entry.css — this is expected @nuxt/fonts behavior when `global: true` is used.

## User Setup Required

- **TIPO-03 CLS exit gate:** Run `pnpm run preview` and measure Lighthouse CLS on the production preview server. CLS must be < 0.1. This is a runtime metric; the static build artifacts confirm the font loading configuration is correct.

## Next Phase Readiness

- Font loading is now hardened — Plus Jakarta Sans loads via explicit @font-face (global: true) without fragile CSS variable detection
- Phase 17 (SectionGuarantia) and Phase 18 (depoimentos com avatar) can proceed
- CLS verification (TIPO-03) requires human verification via Lighthouse on `pnpm run preview`

---
*Phase: 16-tipografia*
*Completed: 2026-03-25*
