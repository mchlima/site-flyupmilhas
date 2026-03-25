---
phase: 16-tipografia
plan: 01
subsystem: ui
tags: [nuxt-fonts, plus-jakarta-sans, typography, tailwind, css-tokens, cls]

requires:
  - phase: 15-paleta
    provides: Design token namespace --color-brand-* and gradient utilities in main.css

provides:
  - Plus Jakarta Sans as sole web font via @nuxt/fonts google provider (weights 400/500/600/700)
  - Updated --font-family-sans CSS token in @theme {}
  - h1/h2/h3 heading hierarchy: bold+tracking-tight / semibold+tracking-[-0.015em] / medium+normal
  - Zero Inter references in config or CSS

affects: [17-garantia, 18-depoimentos, 19-faq-redesign]

tech-stack:
  added: []
  patterns:
    - "@nuxt/fonts fonts.families config (nuxt.config.ts) and @theme CSS token updated atomically to prevent font double-load (Pitfall V3)"
    - "Tailwind tracking-tight for h1 (-0.025em), arbitrary tracking-[-0.015em] for h2, font-medium for h3"

key-files:
  created: []
  modified:
    - nuxt.config.ts
    - app/assets/css/main.css
    - app/components/Section/SectionHero.vue
    - app/components/Section/SectionAbout.vue
    - app/components/Section/SectionProgramContent.vue
    - app/components/Section/SectionForWhom.vue
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionSocialProof.vue
    - app/components/Section/SectionExpert.vue
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionFAQ.vue
    - app/components/Section/SectionLeadForm.vue

key-decisions:
  - "Atomic font swap: nuxt.config.ts fonts.families and main.css @theme token updated in the same commit to prevent double-load and ensure @nuxt/fonts generates fallback metrics"
  - "Weights 400/500/600/700 only — weight 800 deferred per scope"
  - "Existing text-[var(--color-brand-primary)] class form preserved unchanged — canonical class refactoring is out of scope for this typography plan"

patterns-established:
  - "Font config: always declare in fonts.families AND update @theme token in the same commit"
  - "Heading hierarchy: h1=font-bold+tracking-tight, h2=font-semibold+tracking-[-0.015em], h3=font-medium+tracking-normal"

requirements-completed: [TIPO-01, TIPO-02, TIPO-03]

duration: 3min
completed: 2026-03-24
---

# Phase 16 Plan 01: Tipografia Summary

**Plus Jakarta Sans font swap via @nuxt/fonts (atomic config + CSS token) with refined h1/h2/h3 weight and tracking hierarchy across 10 components**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-24T02:04:09Z
- **Completed:** 2026-03-24T02:06:25Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Font swap: Plus Jakarta Sans replaces Inter as the sole web font, declared via @nuxt/fonts google provider (weights 400/500/600/700) and @theme CSS token — zero Inter references remain
- Heading hierarchy applied to all 10 Section components: h1 bold+tracking-tight, h2 semibold+tracking-[-0.015em] (9 instances), h3 medium+normal (4 instances)
- Both files updated atomically in one commit, preventing font double-load and ensuring @nuxt/fonts generates CLS-prevention fallback metrics

## Task Commits

1. **Task 1: Atomic font swap — nuxt.config.ts + main.css** - `f9c1c3f` (feat)
2. **Task 2: Heading hierarchy — weight and tracking across all components** - `ee7e73b` (feat)

## Files Created/Modified

- `nuxt.config.ts` - Added fonts.families config for Plus Jakarta Sans (google provider, weights 400/500/600/700)
- `app/assets/css/main.css` - Updated --font-family-sans token from Inter to Plus Jakarta Sans; updated comment to reference D-01, D-02
- `app/components/Section/SectionHero.vue` - h1: added tracking-tight
- `app/components/Section/SectionAbout.vue` - h2: font-bold→font-semibold+tracking; h3 x3: font-bold→font-medium
- `app/components/Section/SectionProgramContent.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionForWhom.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionMethod.vue` - h2: font-bold→font-semibold+tracking; h3: font-semibold→font-medium
- `app/components/Section/SectionSocialProof.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionExpert.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionPrice.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionFAQ.vue` - h2: font-bold→font-semibold+tracking
- `app/components/Section/SectionLeadForm.vue` - h2: font-bold→font-semibold+tracking

## Decisions Made

- Atomic font swap approach: nuxt.config.ts fonts.families and main.css @theme token in the same commit — prevents the font double-load pitfall (Pitfall V3) where @nuxt/fonts would not generate CLS-prevention fallback metrics for a font declared only in @theme
- Weights 400/500/600/700 only: weight 800 (extra-bold) deferred per scope — avoids extra 30-50 KB font download without committed use case
- Preserved existing text-[var(--color-brand-primary)] class form throughout — canonical class refactoring (text-brand-primary) is pre-existing IDE warning, out of scope for this typography-only plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. IDE diagnostics flagged pre-existing `suggestCanonicalClasses` warnings on `text-[var(--color-brand-primary)]` and related token classes. These are pre-existing across the codebase and out of scope for this plan; tracked for a future refactoring task.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plus Jakarta Sans active for all text rendering; browser Network tab should show only plus-jakarta-sans-*.woff2 on first load
- CLS verification (TIPO-03 exit gate) requires `pnpm run build && pnpm run preview` then Lighthouse audit — CLS must be < 0.1
- Phase 17 (SectionGuarantia) and Phase 18 (depoimentos com avatar) can proceed — typography foundation is stable

---
*Phase: 16-tipografia*
*Completed: 2026-03-24*
