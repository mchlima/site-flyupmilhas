---
phase: quick-260423-jmg
plan: 01
subsystem: section-provas
tags: [ui, carousel, responsive, nuxt-ui, section-provas]
requires:
  - "@nuxt/ui ^4.5.1 (UCarousel component, already installed)"
provides:
  - "Swipeable/arrow-navigated proof gallery on SectionProvas"
affects:
  - "app/components/Section/SectionProvas.vue"
tech_stack_added: []
tech_stack_patterns:
  - "Nuxt UI UCarousel with responsive :ui.item basis classes (basis-full lg:basis-1/3) for per-breakpoint slides-per-view"
  - "v-slot destructure { item } keeps the existing card template intact with only prop-name rename from card.X to item.X"
key_files_created: []
key_files_modified:
  - "app/components/Section/SectionProvas.vue"
decisions:
  - "UCarousel over custom scroll-snap: zero new code (arrows/dots built-in), SSR-safe, matches existing Nuxt UI design language"
  - "basis-full lg:basis-1/3 pl-4 + lg:-mx-4 on root: reproduces original gap-6 visual rhythm without losing carousel gutters"
  - "arrows + dots both enabled: arrows satisfy the explicit desktop 'botão' requirement; dots give mobile position feedback without extra markup"
  - "h-full on card root: embla stretches slides to tallest sibling, preventing ragged card heights across a 3-up row"
metrics:
  duration_seconds: 71
  tasks_completed: 1
  files_modified: 1
  completed_date: "2026-04-23"
---

# Quick 260423-jmg: Transform SectionProvas into Carousel Summary

Converted the "Exemplos reais de passagens emitidas com milhas" gallery from a static 3-column CSS grid into a Nuxt UI UCarousel with breakpoint-aware slides-per-view (3 on desktop + arrow controls, 1 on mobile with swipe + pagination dots), while keeping all 5 SSR-rendered proof cards and every surrounding copy block byte-identical.

## What Changed

- `app/components/Section/SectionProvas.vue`: replaced the `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">` block with a `<UCarousel v-slot="{ item }" :items="cards" :ui="{ item: 'basis-full lg:basis-1/3 pl-4' }" arrows dots class="lg:-mx-4">`, renamed the slot loop variable from `card.*` to `item.*` (required by UCarousel slot contract), and added `h-full` to the card root so the 3-up row stays flush.

## Why

- Mobile UX: the original stacked layout forced visitors through ~5 full-card vertical scroll heights inside a section with no other hook — carousel reduces that to one card-height plus a tactile swipe affordance that usually lifts mid-page engagement.
- Desktop: 3 visible + an arrow keeps the initial density users already recognize, but uncovers cards 4 and 5 (Brasília → Rio, Recife → Maceió) that were previously hidden below the fold on 1366×768 laptops.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| UCarousel instead of raw embla / scroll-snap | Already installed via @nuxt/ui ^4.5.1; built-in `arrows` + `dots` props satisfy both breakpoint requirements with zero JS authored in the component |
| `basis-full lg:basis-1/3 pl-4` + `lg:-mx-4` on root | Reproduces the previous `gap-6` look (24px gutter) without breaking embla's transform math on slide widths |
| Both `arrows` and `dots` enabled on all breakpoints | Arrows are the "botão" the brief asks for on desktop; dots give mobile swipers a visible position cue. Nuxt UI auto-hides arrows/dots when not needed (e.g. already at end), so no extra conditionals required |
| `h-full` on card root | Embla slides default to intrinsic height; cards with different image heights caused a ragged bottom edge in the 3-up layout until we stretched them |

## Dependencies

- Requires `@nuxt/ui ^4.5.1` — already in `package.json`, already bundled in the current build. No install step.

## Verification

- `pnpm build` completed successfully (Nitro output built end-to-end, no TypeScript or Vue template errors).
- `grep -c "UCarousel"` on the component returned 2 (open + close tags present).
- `grep -c "prova[1-5]"` on the component returned 5 (all original imports and array references intact).
- Section heading text, intro paragraph, impact phrase, and disclaimer are byte-identical to pre-change (diff only touches the grid → carousel region).

## Deviations from Plan

None - plan executed exactly as written.

## Commits

- `89234aa`: `feat(quick-260423-jmg): convert SectionProvas grid to UCarousel`

## Self-Check: PASSED

- File exists: `app/components/Section/SectionProvas.vue` — FOUND
- Commit exists: `89234aa` — FOUND
- UCarousel element present in template — FOUND (line 84)
- All 5 proof imports (prova1..prova5) present in script — FOUND
- `pnpm build` completes without errors — CONFIRMED
