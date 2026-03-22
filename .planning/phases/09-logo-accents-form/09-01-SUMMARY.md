---
phase: 09-logo-accents-form
plan: 01
subsystem: ui
tags: [vue, nuxt, branding, accessibility, portuguese, i18n]

# Dependency graph
requires:
  - phase: 08-new-sections
    provides: SectionProgramContent and SectionForWhom created — files that needed accent fixes
  - phase: 04-visual-overhaul-navigation
    provides: AppHeader component with nav links — file that received logo + accent fix
provides:
  - Logo PNG displayed in AppHeader replacing text span
  - All visible Portuguese copy properly accented across 6 components
  - Accessible alt text on logo img element
affects: [09-02-form-redesign, any future UI phase touching existing components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Logo as button+img using ~/assets/img alias and scrollTo for SPA navigation"
    - "Nav label accepts accented characters independently of anchor ID (URL-safe anchor)"

key-files:
  created: []
  modified:
    - app/components/App/AppHeader.vue
    - app/components/Section/SectionAbout.vue
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionProgramContent.vue
    - app/components/Section/SectionForWhom.vue
    - app/components/App/AppFooter.vue

key-decisions:
  - "Logo wrapped in button (not anchor) to match existing scrollTo pattern; scrolls to hero section"
  - "Nav anchor 'conteudo-programatico' kept unaccented for URL compatibility; label shows accented 'Conteúdo'"

patterns-established:
  - "Logo in sticky header: button > img with h-8 w-auto sizing on navy background"
  - "Portuguese copy: accent all visible text; never accent anchor IDs (id=, href fragment)"

requirements-completed: [BRAND-01, TEXT-01]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 09 Plan 01: Logo and Portuguese Accent Fixes Summary

**Fly Up Milhas logo PNG added to sticky header replacing text span, and all missing Portuguese accents restored across 7 Vue components (87 word fixes)**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-22T02:46:50Z
- **Completed:** 2026-03-22T02:48:56Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Logo PNG (`logo-fly-up-milhas.png`) now displayed in AppHeader inside a clickable button that scrolls to hero; includes `alt="Fly Up Milhas"` for screen readers
- Nav label "Conteudo" corrected to "Conteúdo" while anchor ID remains `conteudo-programatico` for URL safety
- All visible Portuguese text across SectionAbout, SectionMethod, SectionPrice, SectionProgramContent, SectionForWhom, and AppFooter now has correct accents — zero unaccented words remain in visible copy

## Task Commits

Each task was committed atomically:

1. **Task 1: Add logo to AppHeader (BRAND-01)** - `1e3964e` (feat)
2. **Task 2: Fix all missing Portuguese accents (TEXT-01)** - `16aabd0` (fix)

## Files Created/Modified

- `app/components/App/AppHeader.vue` - Logo img+button replacing text span; 'Conteúdo' nav label
- `app/components/Section/SectionAbout.vue` - é, já, começar, cartões, você, não
- `app/components/Section/SectionMethod.vue` - Diagnóstico, cartões, Início, estratégia (x2), Revisão, alcançados, Você, dúvidas, aplicação
- `app/components/Section/SectionPrice.vue` - período, início, dúvidas, Aplicação, Condições, disponíveis
- `app/components/Section/SectionProgramContent.vue` - não, Estratégias, cartão, crédito, Organização, antecedência, você, prática
- `app/components/Section/SectionForWhom.vue` - está, começando, já, não, segurança, estratégia, é
- `app/components/App/AppFooter.vue` - Agência 201

## Decisions Made

- Logo wrapped in `<button>` (not `<a href="#">`) to match the existing `scrollTo()` composable pattern established in Phase 04
- `h-8 w-auto` sizing (32px tall) chosen for the nav bar — white-on-transparent logo works directly on the navy background without any filter treatment
- Nav label decoupled from anchor ID: label shows accented "Conteúdo", anchor stays `conteudo-programatico` for clean URL fragments

## Deviations from Plan

None — plan executed exactly as written. The comment in AppFooter (`<!-- TODO: Confirm Agencia 201 URL -->`) was also updated to use the accented form as a minor consistency improvement.

## Issues Encountered

None — logo file `logo-fly-up-milhas.png` already existed in `app/assets/img/`, all edits were straightforward text replacements.

## Known Stubs

None — no placeholder data introduced.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Logo and accent fixes complete; ready for Phase 09-02 (form redesign)
- All 7 components have correct Portuguese copy; no further accent audit needed
- Logo is white-on-transparent — depends on the navy header background established in Phase 04

---
*Phase: 09-logo-accents-form*
*Completed: 2026-03-22*
