---
phase: 04-visual-overhaul-navigation
plan: 01
subsystem: navigation
tags: [header, navigation, mobile-menu, smart-sticky, css-tokens, wcag, ssr-safe]

# Dependency graph
requires:
  - app/composables/useScroll.ts (Phase 2)
  - app/assets/css/main.css @theme tokens (Phase 1)
provides:
  - Updated --color-brand-bg token (#F9FAFB, Tailwind gray-50)
  - scroll-margin-top: 72px rule for all section[id] elements
  - AppHeader with smart-sticky scroll behavior (hides on scroll-down, shows on scroll-up)
  - Desktop nav: 4 anchor links + orange CTA button
  - Mobile hamburger: fullscreen navy overlay with centered links + CTA
  - SSR-safe: import.meta.client guards on all browser APIs
affects: [all sections with id anchors, SectionLeadForm CTA target]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - smart-sticky header via scroll direction detection with passive listener
    - opacity/pointer-events overlay pattern (no v-if on mobile menu)
    - import.meta.client guard for scroll and keyboard listeners
    - WCAG 2.5.5 AA: min-h-[44px] min-w-[44px] on hamburger touch target

# Key files
key-files:
  created: []
  modified:
    - app/assets/css/main.css
    - app/components/App/AppHeader.vue

# Key decisions
decisions:
  - "scroll-margin-top: 72px on section[id] prevents fixed header overlapping anchored section content (64px header + 8px breathing room)"
  - "opacity/pointer-events on mobile overlay over v-if: avoids DOM create/destroy CLS, SSR-safe since ref(false) initializes identically on server and client"
  - "{ passive: true } on scroll listener: browser scroll optimization, no jank"
  - "SCROLL_THRESHOLD = 64: matches header height — smart-sticky only activates after scrolling past header"

# Metrics
metrics:
  duration: 1 min
  completed_date: "2026-03-21"
  tasks_completed: 2
  files_modified: 2
---

# Phase 04 Plan 01: Background Token Fix and Smart Sticky Header Summary

**One-liner:** Smart-sticky AppHeader with desktop anchor nav and mobile fullscreen overlay, plus #F9FAFB background token and scroll-margin-top anchor offset.

## What Was Built

**Task 1 — CSS token and anchor offset (a72e0fc)**
- Changed `--color-brand-bg` from `#f8f9fa` to `#F9FAFB` (Tailwind gray-50). The warm/yellow tint on the old value is eliminated. The `html` background-color references `var(--color-brand-bg)` and updates automatically.
- Added `section[id] { scroll-margin-top: 72px; }` rule. All anchored sections (sobre, como-funciona, depoimentos, faq, formulario) now account for the 64px fixed header height plus 8px breathing room when scrolled-to from nav links.

**Task 2 — AppHeader rebuild (b7eb6dc)**
- Complete replacement of the minimal placeholder AppHeader with a full navigation component.
- Fixed positioning (`position: fixed; top: 0; z-index: 50`) with navy brand background.
- Smart-sticky scroll detection: scroll listener with `{ passive: true }` inside `import.meta.client` guard. Header stays visible when scrollY < 64px; hides on scroll-down past threshold; reappears on scroll-up.
- Desktop nav (md breakpoint+): four anchor link buttons (Sobre, Como Funciona, Depoimentos, FAQ) calling `navigate(anchor)` + CTA button "Quero minha Consultoria" in brand orange.
- Mobile hamburger: `i-heroicons-bars-3` / `i-heroicons-x-mark` toggle with 44px touch target. Fullscreen navy overlay controlled via `opacity-100 pointer-events-auto` / `opacity-0 pointer-events-none` (never `v-if`). Closes on anchor tap, X tap, or Escape key.
- Accessibility: `aria-modal="true"`, `aria-hidden` bound to overlay, `aria-label` and `aria-expanded` on hamburger button.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan has no placeholder data or hardcoded stubs affecting rendered output.

## Verification

- `grep "brand-bg: #F9FAFB" app/assets/css/main.css` → match confirmed
- `grep "scroll-margin-top" app/assets/css/main.css` → match confirmed
- `grep -c "import.meta.client" app/components/App/AppHeader.vue` → 1 (inside single if block)
- `grep "process.client" app/components/App/AppHeader.vue` → no match (PASS)
- `pnpm nuxt build` → completed successfully, `✨ Build complete!`

## Self-Check: PASSED

- [x] `app/assets/css/main.css` exists and contains updated token
- [x] `app/components/App/AppHeader.vue` exists with 100+ lines (full rebuild)
- [x] Commit a72e0fc (Task 1) confirmed in git log
- [x] Commit b7eb6dc (Task 2) confirmed in git log
- [x] Build succeeds without errors
