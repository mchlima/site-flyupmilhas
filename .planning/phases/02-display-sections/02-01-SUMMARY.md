---
phase: 02-display-sections
plan: 01
subsystem: ui
tags: [nuxt4, vue, tailwind, composables, ssr, r2, scroll, hero, expert]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure
    provides: design tokens (brand colors), R2 runtimeConfig pattern, NuxtImg setup, app.vue shell
provides:
  - useScroll composable with SSR-safe scrollTo(id) utility
  - SectionHero full-viewport hero with headline, subheadline, and CTA
  - SectionExpert expert bio with R2 placeholder photo, 3 metrics, and secondary CTA
affects:
  - 02-02 (SectionMethod — uses same UButton/useScroll pattern)
  - 02-03 (SectionSocial/SectionFAQ — same section shell pattern)
  - 03-01 (lead form — #formulario anchor target for CTAs)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useScroll composable pattern with import.meta.client guard for SSR safety
    - Section shell pattern with id, bg-[var(--color-brand-bg)], py-12 md:py-24 px-6
    - R2 asset URL via useRuntimeConfig().public.r2BaseUrl for environment-agnostic CDN references
    - TODO comment markers for placeholder content awaiting Marcio's real data

key-files:
  created:
    - app/composables/useScroll.ts
    - app/components/Section/SectionHero.vue
    - app/components/Section/SectionExpert.vue
  modified: []

key-decisions:
  - "Plain <button> instead of UButton for CTA — avoids Nuxt UI import complexity while matching exact color token usage"
  - "document.getElementById inside import.meta.client guard — mandatory for SSR safety in Nuxt 4"
  - "No hero image in MVP hero section — strong typography + CTA contrast per D-05"
  - "All placeholder content marked with TODO comments — easy swap when Marcio provides real data"

patterns-established:
  - "useScroll pattern: export function useScroll() { function scrollTo(id) { if (import.meta.client) { ... } } return { scrollTo } }"
  - "Section shell: <section id='[name]' class='bg-[var(--color-brand-bg)] py-12 md:py-24 px-6'><div class='max-w-5xl mx-auto'>...</div></section>"
  - "R2 image: const r2Base = useRuntimeConfig().public.r2BaseUrl; :src=`${r2Base}/filename.webp`"

requirements-completed: [HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, AUTH-01, AUTH-02]

# Metrics
duration: 8min
completed: 2026-03-21
---

# Phase 2 Plan 01: Hero and Expert Sections Summary

**SSR-safe useScroll composable + full-viewport SectionHero with brand-primary headline and orange CTA + SectionExpert with R2 placeholder photo, 3 numeric metrics, and secondary CTA — all mobile-responsive with Tailwind design tokens**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-21T06:03:20Z
- **Completed:** 2026-03-21T06:11:00Z
- **Tasks:** 3
- **Files modified:** 3 created

## Accomplishments

- useScroll composable with `import.meta.client` guard preventing SSR ReferenceError on `document`
- SectionHero with `min-h-screen`, exact Portuguese headline in brand-primary, orange CTA scrolling to `#formulario`
- SectionExpert with 2-column responsive grid, R2 placeholder photo, 3 metrics row, bio paragraph, and secondary CTA — all with TODO markers for easy content swap

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useScroll composable** - `ca6455d` (feat)
2. **Task 2: Build SectionHero component** - `c546a5b` (feat)
3. **Task 3: Build SectionExpert component** - `c3773cc` (feat)

## Files Created/Modified

- `app/composables/useScroll.ts` — scrollTo(id: string) utility guarded by import.meta.client; returns { scrollTo }
- `app/components/Section/SectionHero.vue` — full-viewport hero with h1 headline, subheadline p, CTA button scrolling to #formulario
- `app/components/Section/SectionExpert.vue` — expert bio section with NuxtImg R2 photo, flex metrics row, bio text, secondary CTA

## Decisions Made

- Used plain `<button>` instead of Nuxt UI `UButton` for CTA buttons to avoid any potential import complexity while achieving exact same visual result with Tailwind token classes
- `document.getElementById` call placed inside `if (import.meta.client)` guard — not `process.client` (deprecated in Nuxt 4)
- No hero image in MVP per D-05 — clean off-white background with strong typography contrast
- All 3 TODO markers added as specified in plan for content awaiting from Marcio

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- `app/components/Section/SectionExpert.vue` line 18: `:src="\`${r2Base}/marcio-placeholder.webp\`"` — placeholder R2 path; real photo must be uploaded to R2 and path updated when Marcio provides photo
- `app/components/Section/SectionExpert.vue` line 39-51: Metrics `5M+`, `12`, `R$80k+` are placeholder numbers with TODO markers — await real data from Marcio
- `app/components/Section/SectionExpert.vue` line 33-35: Bio paragraph is placeholder copy with TODO marker — await real bio from Marcio

All stubs are intentional per D-11 and D-30, with clear TODO comments. They do not prevent the plan's structural goal (building the sections with the correct layout and wiring). A future content-swap task or Phase 2 continuation will replace them.

## Issues Encountered

None - all files created without errors.

## Next Phase Readiness

- useScroll composable is available globally (Nuxt auto-import) for all remaining Phase 2 sections
- SectionHero and SectionExpert are ready to be wired into app.vue replacing SectionPlaceholder
- `#formulario` anchor target still needed — will be provided by Phase 3 lead form section
- Content from Marcio (photo, real metrics, real bio) is the critical path for finalization

---
*Phase: 02-display-sections*
*Completed: 2026-03-21*
