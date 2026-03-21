---
phase: 06-content-layout-polish
plan: "02"
subsystem: layout-ux
tags: [section-method, section-price, back-to-top, ux, content]
dependency_graph:
  requires: []
  provides: [back-to-top-component, enriched-price-grid, steps-only-method]
  affects: [app/app.vue, SectionMethod, SectionPrice]
tech_stack:
  added: []
  patterns:
    - import.meta.client SSR guard for scroll listener
    - passive scroll event listener for performance
    - Vue Transition fade for visibility animation
    - col-span-2 sm:col-span-1 centering for odd grid items on mobile
key_files:
  created:
    - app/components/BackToTop.vue
  modified:
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionPrice.vue
    - app/app.vue
decisions:
  - "BackToTop uses window.scrollTo directly (not useScroll composable) because useScroll.scrollTo accepts an element ID, not a scroll position"
  - "SCROLL_THRESHOLD=300 — standard convention matching plan spec; higher than header SCROLL_THRESHOLD=64 so button only appears after meaningful scroll depth"
  - "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 with col-span-2 sm:col-span-1 on 5th item centers it on smallest breakpoint without extra wrapper"
metrics:
  duration: "~2 min"
  completed: "2026-03-21T08:58:18Z"
  tasks: 2
  files: 4
requirements:
  - CONT-06
  - UX-01
---

# Phase 06 Plan 02: Content Consolidation and Back-to-Top Summary

**One-liner:** Removed 'O que esta incluido' offer block from SectionMethod, consolidated into SectionPrice with 5 enriched items, and added floating back-to-top button with SSR-safe scroll listener.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Remove offer block from SectionMethod, enrich SectionPrice to 5 items | 5bdb11e | SectionMethod.vue, SectionPrice.vue |
| 2 | Create BackToTop floating button component | 05b8333 | BackToTop.vue, app.vue |

## What Was Built

### Task 1: Content Consolidation

**SectionMethod.vue:**
- Removed the entire `<div class="bg-white rounded-xl shadow p-8">` offer block (containing "O que esta incluido" heading, 3 list items, and entregaveis paragraph)
- Removed `mb-8` from steps grid container — section's own `py-12 md:py-24` padding handles spacing
- Result: steps-only layout, clean and focused on the 4-step process

**SectionPrice.vue:**
- Expanded included grid from 3 to 5 items
- Added "Lista de cartoes recomendados" and "Suporte na primeira emissao" (with proper accents)
- Updated grid classes from `grid-cols-1 md:grid-cols-3` to `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`
- 5th item uses `col-span-2 sm:col-span-1` to center on smallest breakpoint (2-col layout)

### Task 2: BackToTop Component

**app/components/BackToTop.vue** (new file):
- Floating button: `fixed bottom-6 right-6 z-50`, round (w-12 h-12 rounded-full)
- Brand CTA background `bg-[var(--color-brand-cta)]` with hover state
- `i-heroicons-chevron-up` icon (w-6 h-6)
- `aria-label="Voltar ao topo"` for accessibility
- Appears after scrolling past 300px (`SCROLL_THRESHOLD = 300`)
- `import.meta.client` guard wraps scroll listener for SSR safety
- Passive scroll event listener (`{ passive: true }`) for performance
- Cleanup via `onUnmounted` inside `onMounted` callback
- Fade `<Transition>` animation (opacity 0.3s ease)
- `window.scrollTo({ top: 0, behavior: 'smooth' })` on click

**app/app.vue:**
- `<BackToTop />` added after `<AppFooter />` inside `<UApp>`
- Nuxt auto-import handles component resolution

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `pnpm build` completes without errors (build output: "Build complete!")
- SectionMethod.vue: 0 occurrences of "O que est" (grep returns 0)
- SectionPrice.vue: 5 divs with `text-white/80` class
- SectionPrice.vue: Contains "primeira emiss" and "recomendados"
- SectionPrice.vue: Uses `md:grid-cols-5`
- BackToTop.vue: All acceptance criteria met (chevron-up, smooth scroll, SSR guard, SCROLL_THRESHOLD=300, fixed bottom-right, brand CTA color, aria-label)
- app.vue: Contains `<BackToTop />`

## Self-Check: PASSED

- app/components/BackToTop.vue: FOUND
- app/components/Section/SectionMethod.vue: FOUND (offer block removed)
- app/components/Section/SectionPrice.vue: FOUND (5 items)
- app/app.vue: FOUND (BackToTop wired)
- Commit 5bdb11e: FOUND
- Commit 05b8333: FOUND

## Known Stubs

None — all content is real. Grid items use production copy with proper Portuguese accents.
