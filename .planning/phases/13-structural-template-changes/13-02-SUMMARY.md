---
phase: 13-structural-template-changes
plan: "02"
subsystem: ui
tags: [nuxt, vue, tailwind, landing-page, conversion, pricing]

# Dependency graph
requires:
  - phase: 13-01
    provides: SectionForWhom and SectionPrice base components established
provides:
  - Negative qualification section with 3 red-tinted x-mark cards in SectionForWhom
  - Separator heading "Essa mentoria não é para todos" in SectionForWhom
  - SectionPrice split lg:grid-cols-2 layout (benefits left, price card right)
  - Hard-coded "R$ 299,90" price string with no JS arithmetic
  - Guarantee block with shield-check icon and 7-day refund promise
affects:
  - Phase 14 (CTA copy, security badge placement)
  - Any copy review touching SectionForWhom or SectionPrice

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Negative qualification cards use red-50/red-200/red-500 tokens vs positive cards bg-white/gray-100/brand-cta
    - Price values hard-coded as string literals in template — never JS variables or computed props
    - Split grid (lg:grid-cols-2) for pricing sections with benefits column left, action column right
    - Guarantee block placed below price card in same column for visual proximity to CTA

key-files:
  created: []
  modified:
    - app/components/Section/SectionForWhom.vue
    - app/components/Section/SectionPrice.vue

key-decisions:
  - "negativeCards uses i-heroicons-x-mark (not x-circle) — solid X is visually stronger for disqualification"
  - "Price 'R$ 299,90' hard-coded as template string literal to avoid float precision errors (JS 299.90 * 10 = 2999.0000000000005)"
  - "Guarantee block placed outside price card div but inside right column — visually anchors trust signal to pricing"

patterns-established:
  - "Negative qualification pattern: red-50 bg, red-200 border, red-500 icon, x-mark icon name"
  - "Price display pattern: hard-coded string in template, never computed"

requirements-completed:
  - FORW-01
  - PRCE-01
  - PRCE-02
  - PRCE-03

# Metrics
duration: 3min
completed: 2026-03-24
---

# Phase 13 Plan 02: Negative Cards + Price Split Layout Summary

**Negative qualification cards (red x-mark) added to SectionForWhom; SectionPrice rewritten with split layout, hard-coded R$ 299,90, and 7-day guarantee block**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-24T05:28:20Z
- **Completed:** 2026-03-24T05:31:30Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- SectionForWhom now shows 3 red-tinted negative qualification cards (x-mark icons) below a separator heading, filtering out low-intent visitors before they reach the form
- SectionPrice rewritten from centered single-column to lg:grid-cols-2 split — benefits list left, white price card + guarantee right
- Price displayed as a hard-coded template string "R$ 299,90" with no JS arithmetic — eliminates float precision errors
- Guarantee block with shield-check icon and 100% refund copy provides trust signal adjacent to the CTA

## Task Commits

Each task was committed atomically:

1. **Task 1: Add negative qualification cards to SectionForWhom** - `e554bd0` (feat)
2. **Task 2: Rewrite SectionPrice with split layout, pricing, and guarantee** - `9c6fe85` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `app/components/Section/SectionForWhom.vue` — Added negativeCards array, separator heading, 3-column red card grid
- `app/components/Section/SectionPrice.vue` — Full rewrite: benefits with icons, split layout, hard-coded price, guarantee block

## Decisions Made
- Used `i-heroicons-x-mark` (solid X) over `x-circle` for stronger visual disqualification signal
- Price "R$ 299,90" placed as a bare template string — not a reactive ref or computed — per v1.5 pitfall #3
- Guarantee block placed outside the white price card but inside the right column, creating visual proximity to CTA without competing with it for whitespace

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- SectionForWhom and SectionPrice are complete per v1.5 requirements
- Phase 14 can proceed: security badge placement (outside UForm) and progressive CTA copy (hero/mid/final variants)
- Marcio's WhatsApp number still needed before launch (55XXXXXXXXXXX placeholder active)

## Known Stubs

None - all data is hard-coded copy from client PDF. No dynamic data sources needed.

## Self-Check: PASSED

- FOUND: app/components/Section/SectionForWhom.vue
- FOUND: app/components/Section/SectionPrice.vue
- FOUND: .planning/phases/13-structural-template-changes/13-02-SUMMARY.md
- Commit e554bd0: verified in git log
- Commit 9c6fe85: verified in git log

---
*Phase: 13-structural-template-changes*
*Completed: 2026-03-24*
