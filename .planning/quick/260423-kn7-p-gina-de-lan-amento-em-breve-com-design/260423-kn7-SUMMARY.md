---
phase: quick-260423-kn7
plan: 01
subsystem: ui

tags: [nuxt4, runtimeConfig, feature-flag, seo, landing-page, coming-soon]

requires: []
provides:
  - Runtime-flagged coming-soon teaser at `/` (default on)
  - `runtimeConfig.public.comingSoon` togglable via `NUXT_PUBLIC_COMING_SOON` env var
  - Full-viewport dark teaser component (logo + headline + ambient glow motion)
  - noindex/nofollow meta when teaser active
affects: [launch, seo, environment-config]

tech-stack:
  added: []
  patterns:
    - "Feature-flag pattern via runtimeConfig.public + useRuntimeConfig() + computed()"
    - "Conditional <Component v-if /> swap preserves existing sections untouched"
    - "Minimal SEO meta (title + description + noindex/nofollow) for pre-launch teaser"

key-files:
  created:
    - app/components/ComingSoon.vue
  modified:
    - nuxt.config.ts
    - app/pages/index.vue

key-decisions:
  - "comingSoon flag defaults to true (immediate site hide on deploy); flip NUXT_PUBLIC_COMING_SOON=false at launch"
  - "Teaser uses noindex, nofollow to prevent Google from indexing 'em breve' copy during pre-launch window"
  - "Only `/` is gated — admin/pagamento/encontros routes remain accessible for pre-launch ops"
  - "No countdown timer or email capture — user requested minimal teaser, avoids commitment/backend coupling"
  - "Logo reuses existing ~/assets/img/logo-fly-up-milhas.webp (same asset AppHeader uses)"
  - "Full takeover (fixed inset-0) — no header/footer on teaser to avoid leaking navigation/links"

patterns-established:
  - "Feature-flag pattern: add key to runtimeConfig.public in nuxt.config.ts, consume via useRuntimeConfig().public in scripts, Nuxt auto-maps to NUXT_PUBLIC_{KEY} env var"
  - "Branded teaser pattern: scoped CSS with CSS vars mapped to brand tokens (#0F172A navy, #1D4ED8 blue, #0E7490 cyan), radial-gradient + blur drift animation for depth without JS"

requirements-completed: [QUICK-260423-KN7]

duration: 106s
completed: 2026-04-23
---

# Quick 260423-kn7: Página de Lançamento "Em Breve" Summary

**Runtime-flagged coming-soon teaser at `/` with dark navy brand palette, ambient blue/cyan glow motion, and noindex meta — togglable via NUXT_PUBLIC_COMING_SOON env var without code changes**

## Performance

- **Duration:** 106s
- **Started:** 2026-04-23T17:53:48Z
- **Completed:** 2026-04-23T17:55:34Z
- **Tasks:** 1
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- Branded pre-launch teaser renders at `/` by default (full-viewport dark takeover with logo, "Em breve" headline, ambient glow animation)
- `runtimeConfig.public.comingSoon` flag added (default `true`, flippable via `NUXT_PUBLIC_COMING_SOON=false`)
- Existing landing (all 12 sections + header/footer/BackToTop) preserved verbatim in the `else` branch — flip flag to restore full site with zero code changes
- noindex/nofollow meta emitted only when teaser active; full SEO stack + schema.org preserved for real landing
- `/admin`, `/pagamento`, `/encontros` routes untouched (remain accessible for pre-launch ops)

## Task Commits

1. **Task 1: Add comingSoon flag + ComingSoon component + gate index page** - `3aea20e` (feat)

## Files Created/Modified

- `app/components/ComingSoon.vue` — Full-viewport dark teaser. Logo + eyebrow badge ("Algo novo está decolando") + "Em breve." gradient headline + subtitle + divider + "@flyupmilhas" footer. Two animated blurred glows (primary blue-700, secondary cyan-800) drift with CSS keyframes. Fade-in entrance. Scoped styles, responsive logo height at md breakpoint.
- `nuxt.config.ts` — Added `comingSoon: true` inside `runtimeConfig.public` (Nuxt auto-maps to `NUXT_PUBLIC_COMING_SOON` env var).
- `app/pages/index.vue` — Added `useRuntimeConfig()` read + `isComingSoon` computed. Branched SEO: minimal + noindex when teaser active, full SEO + schema.org when landing active. Template now `<ComingSoon v-if="isComingSoon" />` vs `<div v-else>...full landing...</div>` (preserves exact current section list including `<section id="formulario">` wrapper around `SectionCustomerForm`, `AppHeader`, `AppFooter`, `BackToTop`).

## Decisions Made

- **Logo path verified as `.webp` (not `.png`):** Plan referenced `logo-fly-up-milhas.webp` — confirmed by grepping the codebase (AppHeader, admin login, pagamento, encontros, avaliacao all use `.webp`). Used same asset for brand consistency.
- **Preserved existing `<section id="formulario">` wrapper:** Current `index.vue` wraps `SectionCustomerForm` in a `<section id="formulario" aria-label="Formulário de mentoria" class="gradient-form py-16 px-6">` block — kept verbatim in the else-branch (plan snippet showed a flatter structure; followed the constraint to mirror actual current template).
- **`BackToTop` component only rendered on landing, not teaser:** Teaser is single-screen fixed viewport — back-to-top has nothing to scroll, would be visual noise.

## Deviations from Plan

None — plan executed exactly as written. Logo asset extension (`.webp`) verified against codebase before use; exact current section list in `index.vue` mirrored from the file (as required by executor constraints).

## Issues Encountered

None.

## User Setup Required

**To flip the site live at launch:**

Set environment variable in hosting dashboard (Vercel / Cloudflare / wherever deployed):

```
NUXT_PUBLIC_COMING_SOON=false
```

Redeploy (or hot-restart, depending on host). Full landing will render with zero code changes.

**To verify locally:**

```bash
# Teaser (default):
pnpm dev
# Visit http://localhost:3002/ — should show dark "Em breve" screen

# Full landing:
NUXT_PUBLIC_COMING_SOON=false pnpm dev
# Visit http://localhost:3002/ — should show full landing
```

## Next Phase Readiness

- Site can ship to production now with teaser shown by default
- `/admin`, `/pagamento`, `/encontros` still reachable for pre-launch customer/payment ops
- When ready to launch: flip `NUXT_PUBLIC_COMING_SOON=false` in hosting env + redeploy
- All existing v1.6 phases (Phase 19 FAQ redesign, remaining backlog) unaffected — teaser is orthogonal to landing work

## Self-Check: PASSED

- [x] `nuxt.config.ts` contains `comingSoon: true` in `runtimeConfig.public` (verified: build output includes comingSoon flag path)
- [x] `app/components/ComingSoon.vue` exists
- [x] `app/pages/index.vue` modified with conditional render
- [x] Task 1 commit `3aea20e` exists in git log
- [x] `pnpm build` completed without errors
- [x] Build output contains rendered teaser SSR markup ("Em breve", "Algo novo está decolando", "@flyupmilhas") and noindex meta
- [x] No Section*.vue, AppHeader, AppFooter, or BackToTop files touched

---
*Quick: 260423-kn7-p-gina-de-lan-amento-em-breve-com-design*
*Completed: 2026-04-23*
