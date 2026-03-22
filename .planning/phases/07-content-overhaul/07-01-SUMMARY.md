---
phase: 07-content-overhaul
plan: "01"
subsystem: ui
tags: [nuxt, vue, hero, seo, copy, mentoria]

# Dependency graph
requires:
  - phase: 06-content-layout-polish
    provides: Hero, AppHeader, AppFooter, app.vue with consultoria copy baseline
provides:
  - Pain point chips above hero headline (3 muted outline badges)
  - Hero subheadline and CTA updated to mentoria framing
  - AppHeader desktop + mobile CTA labels updated to "Quero dar o primeiro passo"
  - AppFooter WhatsApp URL text param changed from consultoria to mentoria
  - useSeoMeta title/description/OG/Twitter updated to mentoria
  - schema.org description updated, priceRange removed
  - formulario section aria-label changed to mentoria
affects: [08-new-sections]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Muted pain-point chip: rounded-full border with brand-primary/30 opacity and text-muted color"

key-files:
  created: []
  modified:
    - app/components/Section/SectionHero.vue
    - app/components/App/AppHeader.vue
    - app/components/App/AppFooter.vue
    - app/app.vue

key-decisions:
  - "Pain point chips use muted outline style (border-primary/30 + text-muted) to frame, not compete with, the headline"
  - "priceRange removed from schema.org per D-16/EDIT-02 (price hidden)"
  - "WhatsApp URL text param encoded as mentoria%20Fly%20Up%20Milhas for brand alignment"

patterns-established:
  - "Pain point chip: text-xs md:text-sm px-3 py-1 rounded-full border border-[var(--color-brand-primary)]/30 text-[var(--color-brand-text-muted)]"

requirements-completed: [COPY-01, COPY-02, COPY-03]

# Metrics
duration: 1min
completed: "2026-03-22"
---

# Phase 07 Plan 01: Content Overhaul — Hero, Header, Footer, SEO Summary

**Pain point chips added above hero h1; all CTAs, SEO meta, and schema.org migrated from "consultoria" to "mentoria" with zero occurrences remaining**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-22T02:06:52Z
- **Completed:** 2026-03-22T02:08:09Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Hero section now opens with 3 muted pain-point chips ("Viajar de aviao e caro", "Milhas e so para quem tem cartao black", "Nao sei por onde comecar") before the headline
- Subheadline, all 3 CTA buttons (hero + header desktop + header mobile), footer WhatsApp URL text, all SEO meta, and schema.org description updated to "mentoria"
- priceRange removed from schema.org per D-16 (price is intentionally hidden on this LP)
- Zero occurrences of "consultoria" remain in any of the 4 modified files

## Task Commits

Each task was committed atomically:

1. **Task 1: Add pain point chips to SectionHero and update copy** - `f1822c8` (feat)
2. **Task 2: Update AppHeader CTAs, AppFooter WhatsApp text, and app.vue SEO meta** - `1b48c55` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `app/components/Section/SectionHero.vue` - Pain point chips added above h1; subheadline rewritten for mentoria; CTA label changed
- `app/components/App/AppHeader.vue` - Desktop and mobile CTA labels changed to "Quero dar o primeiro passo"
- `app/components/App/AppFooter.vue` - WhatsApp href text param changed from consultoria to mentoria Fly Up Milhas
- `app/app.vue` - All useSeoMeta fields updated to mentoria; schema.org description updated, priceRange removed; formulario aria-label changed

## Decisions Made

- Pain point chips use muted outline style (border brand-primary at 30% opacity + text-muted color) so they frame rather than compete with the headline
- priceRange removed from schema.org per D-16/EDIT-02 — price visibility is intentionally hidden on this LP
- WhatsApp URL text param encoded as `mentoria%20Fly%20Up%20Milhas` for direct brand identification

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero, header, footer, and SEO are fully aligned to the mentoria product framing
- Phase 08 (new sections: programmatic content + audience fit) can proceed
- Open: Marcio's WhatsApp number still placeholder (55XXXXXXXXXXX) — needs real number before launch

---
*Phase: 07-content-overhaul*
*Completed: 2026-03-22*
