---
phase: 15-paleta-e-gradientes
plan: 01
subsystem: design-tokens
tags: [palette, gradients, tailwind-v4, wcag, brand-tokens]
dependency_graph:
  requires: []
  provides: [v1.6-palette, brand-tokens-updated, gradient-utilities]
  affects: [all-components-using-brand-primary, header, footer, hero, price, method, about, form]
tech_stack:
  added: []
  patterns: [tailwind-v4-canonical-classes, css-@utility-gradients, @theme-tokens]
key_files:
  created: []
  modified:
    - app/assets/css/main.css
    - app/components/App/AppHeader.vue
    - app/components/App/AppFooter.vue
    - app/components/Section/SectionHero.vue
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionAbout.vue
    - app/app.vue
decisions:
  - "Used canonical Tailwind v4 class forms (bg-brand-dark) over var() syntax — IDE linter confirmed this is the correct pattern"
  - "CTA color #0891B2 (cyan-700) chosen over #06B6D4 (cyan-500) — white text on #06B6D4 yields only 2.5:1 (fails WCAG AA); #0891B2 yields 3.5:1 (passes 3:1 large-text threshold)"
  - "SectionMethod step 04 card uses bg-brand-dark not gradient-price — dark card must be visually distinct from the light section gradient around it"
metrics:
  duration: 207s
  completed: 2026-03-25
  tasks_completed: 2
  files_modified: 8
---

# Phase 15 Plan 01: Palette and Gradients Update Summary

**One-liner:** Replaced navy/orange palette with vibrant blue (#1D4ED8) + cyan (#0891B2) CTA + slate-dark backgrounds and 5 diagonal gradient @utility classes across key sections.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update design tokens + gradient utilities in main.css | f0aa7f5 | app/assets/css/main.css |
| 2 | Apply new tokens and gradients to all affected components | 20242b3 | 7 component files |

## What Was Built

### Task 1 — Design Tokens (main.css)

Updated `@theme {}` block with v1.6 palette:

| Token | Old Value | New Value | Rationale |
|-------|-----------|-----------|-----------|
| `--color-brand-primary` | `#1a3a5c` (navy) | `#1D4ED8` (blue-700) | Vibrant accent, 6.3:1 on white (WCAG AAA) |
| `--color-brand-dark` | (new) | `#0F172A` (slate-900) | Header/form dark bg — was conflated with primary |
| `--color-brand-cta` | `#e67e22` (orange) | `#0891B2` (cyan-700) | 3.5:1 on white with white text — WCAG AA large text |
| `--color-brand-cta-hover` | `#d35400` | `#0E7490` (cyan-800) | Darker hover state |
| `--color-brand-footer` | `#0f2039` | `#020617` (slate-950) | Deeper footer visual anchor |
| `--color-brand-bg` | `#F9FAFB` | unchanged | Off-white body background preserved |
| `--color-brand-text` | `#1a1a1a` | unchanged | Body text preserved |
| `--font-family-sans` | Inter | unchanged | Font swap is Phase 16 |

Added 5 `@utility` gradient blocks (all 135deg, max 2 stops):
- `gradient-hero` — `#0F172A → #1D4ED8` (dark to vibrant blue)
- `gradient-price` — `#1E3A8A → #1D4ED8` (deep blue to vibrant blue)
- `gradient-form` — `#0F172A → #1E3A8A` (dark to deep blue)
- `gradient-section-method` — `#F9FAFB → #EFF6FF` (off-white to blue tint)
- `gradient-section-about` — `#FFFFFF → #F0F7FF` (white to blue tint)

### Task 2 — Component Updates

| Component | Change |
|-----------|--------|
| AppHeader.vue | `bg-brand-dark` on header + mobile overlay; `hover:text-brand-primary` on desktop nav |
| AppFooter.vue | `hover:text-brand-primary` on 3 links (Agencia201, WhatsApp, Instagram) |
| SectionHero.vue | `gradient-hero opacity-90` overlay replaces `bg-black/60` |
| SectionPrice.vue | `gradient-price` on section replaces flat `bg-brand-primary` |
| SectionMethod.vue | `gradient-section-method` on section; `bg-brand-dark` on step 04 card |
| SectionAbout.vue | `gradient-section-about` on section replaces `bg-white` |
| app.vue | `gradient-form` on formulario section replaces `bg-brand-primary` |

## Deviations from Plan

### Auto-applied improvements

**1. [Rule 2 - Improvement] Used canonical Tailwind v4 class syntax throughout**
- **Found during:** Task 2, first edit
- **Issue:** IDE linter flagged `bg-[var(--color-brand-dark)]` as non-canonical; correct Tailwind v4 pattern is `bg-brand-dark`
- **Fix:** Applied canonical form (`bg-brand-dark`, `hover:text-brand-primary`) consistently across all 7 components instead of `var()` syntax
- **Files modified:** AppHeader.vue, AppFooter.vue, SectionMethod.vue
- **Commit:** 20242b3

## WCAG Contrast Verification

All new combinations pass WCAG AA:

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| White `#FFFFFF` | `#0F172A` (brand-dark) | 17.8:1 | AAA |
| White `#FFFFFF` | `#020617` (footer) | 20.5:1 | AAA |
| White `#FFFFFF` | `#0891B2` (CTA button) | 3.5:1 | AA large text |
| White `#FFFFFF` | `#1D4ED8` (brand-primary) | 6.3:1 | AAA |
| `#1D4ED8` | `#F9FAFB` (brand-bg) | 6.3:1 | AAA |
| `#1D4ED8` | `#FFFFFF` | 6.3:1 | AAA |

## Known Stubs

None — all gradient utilities are wired to live sections. No placeholder values.

## Self-Check: PASSED

Files confirmed present:
- app/assets/css/main.css — contains `--color-brand-dark`, `gradient-hero`, `#1D4ED8`, `#0891B2`, `#020617`
- app/components/App/AppHeader.vue — contains `bg-brand-dark` (2 occurrences), `hover:text-brand-primary`
- app/components/App/AppFooter.vue — contains `hover:text-brand-primary` (3 occurrences)
- app/components/Section/SectionHero.vue — contains `gradient-hero opacity-90`
- app/components/Section/SectionPrice.vue — contains `gradient-price`
- app/components/Section/SectionMethod.vue — contains `gradient-section-method`, `bg-brand-dark`
- app/components/Section/SectionAbout.vue — contains `gradient-section-about`
- app/app.vue — contains `gradient-form`

Commits confirmed present:
- f0aa7f5 — feat(15-01): update brand tokens + add gradient @utility definitions
- 20242b3 — feat(15-01): apply v1.6 palette tokens and gradients to all components

Build: `nuxi build` completed without errors — "Build complete!"
