---
phase: 01-foundation-infrastructure
plan: 03
subsystem: infra
tags: [seo, schema-org, open-graph, nuxtjs-seo, nuxt-image, r2, cloudflare, performance, lcp]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure/01-01
    provides: Nuxt 4 scaffold with nuxt.config.ts (site config, runtimeConfig, @nuxtjs/seo module), app.vue shell, SectionPlaceholder.vue stub
provides:
  - SEO meta layer (Open Graph, Twitter Card) server-rendered via useSeoMeta in app.vue
  - LocalBusiness/ProfessionalService schema.org JSON-LD via useSchemaOrg in app.vue
  - R2 image pipeline: NuxtImg with absolute CDN URL + fetchpriority=high + loading=eager in SectionPlaceholder.vue
affects:
  - Phase 2 sections (inherit SEO meta pattern from app.vue, add page-level overrides)
  - Phase 3 lead form (SectionPlaceholder.vue replaced by real hero with NuxtImg pattern)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useSeoMeta in app.vue for global SSR-safe meta (no useHead)"
    - "useSchemaOrg + defineLocalBusiness for JSON-LD schema injection"
    - "NuxtImg with :src via useRuntimeConfig() r2BaseUrl for R2 image references"
    - "fetchpriority=high + loading=eager on above-fold LCP image element"

key-files:
  created: []
  modified:
    - app/app.vue
    - app/components/Section/SectionPlaceholder.vue

key-decisions:
  - "useSeoMeta replaces useHead (Plan 01 placeholder) — useSeoMeta is SSR-safe and deduplicates meta tags automatically"
  - "defineLocalBusiness with @type ProfessionalService matches consultancy service category for schema.org accuracy"
  - "r2Base from useRuntimeConfig().public.r2BaseUrl keeps CDN URL environment-agnostic (dev/staging/prod)"

patterns-established:
  - "Pattern: SEO meta via useSeoMeta (not useHead) — all future pages should follow this pattern"
  - "Pattern: NuxtImg :src via r2Base composable — all R2 images use runtimeConfig, never hardcoded URLs"
  - "Pattern: LCP element always has fetchpriority=high and loading=eager — never lazy-load the hero image"

requirements-completed: [INFR-02, INFR-03, INFR-04]

# Metrics
duration: 2min
completed: 2026-03-21
---

# Phase 01 Plan 03: SEO Meta + R2 Image Pipeline Summary

**Open Graph, Twitter Card, and ProfessionalService JSON-LD schema wired via @nuxtjs/seo; R2 image pipeline validated with NuxtImg fetchpriority=high LCP pattern**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-21T05:38:14Z
- **Completed:** 2026-03-21T05:39:07Z
- **Tasks:** 2 auto + 1 auto-approved checkpoint
- **Files modified:** 2

## Accomplishments

- Replaced placeholder `useHead` in `app.vue` with full `useSeoMeta` call covering OG title/description/image/type/url/locale and Twitter Card — all SSR-safe and server-rendered
- Added `useSchemaOrg` with `defineLocalBusiness` ProfessionalService schema (name, url, priceRange R$200, areaServed Brasil, knowsAbout array) — injects JSON-LD block in `<head>`
- Updated `SectionPlaceholder.vue` with `NuxtImg` referencing R2 URL via `useRuntimeConfig().public.r2BaseUrl`, with `fetchpriority="high"` and `loading="eager"` for LCP optimization

## Task Commits

Each task was committed atomically:

1. **Task 1: SEO meta and LocalBusiness schema in app.vue** - `271497b` (feat)
2. **Task 2: R2 test image with LCP performance attributes** - `cdd898e` (feat)
3. **Task 3: Checkpoint (auto-approved)** - no code changes

## Files Created/Modified

- `app/app.vue` - Replaced useHead with useSeoMeta (OG + Twitter Card) and useSchemaOrg (ProfessionalService JSON-LD)
- `app/components/Section/SectionPlaceholder.vue` - Added NuxtImg with R2 absolute URL pattern, fetchpriority=high, loading=eager

## Decisions Made

- Used `useSeoMeta` (not `useHead`) — it deduplicates tags on SSR and is the @nuxtjs/seo convention
- Schema `@type: ProfessionalService` (more specific than LocalBusiness for a consulting business) as specified in plan
- `r2Base` from `runtimeConfig.public.r2BaseUrl` ensures the CDN URL is environment-configurable via `NUXT_PUBLIC_R2_BASE_URL` — no hardcoded URLs in templates

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- `SectionPlaceholder.vue` NuxtImg references `${r2Base}/test-placeholder.webp` — this is an intentional test image for R2 pipeline validation. The actual image must be uploaded to R2 before the pipeline can be manually verified. Phase 2/3 will replace this component with real hero content.
- `r2Base` will render an empty string in local dev unless `NUXT_PUBLIC_R2_BASE_URL` is set in `.env` — this is expected and documented in STATE.md under Technical Pitfalls.

## Issues Encountered

None — both composables (`useSeoMeta`, `useSchemaOrg`, `defineLocalBusiness`) are auto-imported by `@nuxtjs/seo` module with no additional configuration required.

## User Setup Required

**R2 image upload required before manual checkpoint verification:**
1. Create or obtain a test WebP image (1200x675px, ~85% quality)
2. Upload to Cloudflare R2 bucket as `test-placeholder.webp`
3. Confirm public access at `https://cdn.flyupmilhas.com.br/test-placeholder.webp`
4. Set `NUXT_PUBLIC_R2_BASE_URL=https://cdn.flyupmilhas.com.br` in `.env` for local preview

**OG image also required:**
- Upload `og-image.jpg` (1200x630px) to R2 at `https://cdn.flyupmilhas.com.br/og-image.jpg`

## Next Phase Readiness

- SEO meta layer complete — Phase 2 sections can add `useSeoMeta` overrides per-page if needed
- R2 image pattern established — Phase 2/3 hero images follow the same `NuxtImg + r2Base` pattern
- Remaining Phase 1 acceptance criteria (build/preview, PageSpeed 90+, browser DevTools check) require manual verification at staging — blocked on R2 image upload and Cloudflare Pages deployment

## Self-Check: PASSED

- app/app.vue: FOUND
- app/components/Section/SectionPlaceholder.vue: FOUND
- .planning/phases/01-foundation-infrastructure/01-03-SUMMARY.md: FOUND
- Commit 271497b: FOUND
- Commit cdd898e: FOUND

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-03-21*
