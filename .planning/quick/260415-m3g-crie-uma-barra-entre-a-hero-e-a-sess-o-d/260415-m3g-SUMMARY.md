---
phase: quick-260415-m3g
plan: 01
subsystem: marketing-site
tags: [nuxt, ui, ssr, market-data, useFetch]
requires: []
provides:
  - "Live market quotes strip (USD/EUR/IBOV) between Hero and About"
affects:
  - "app/pages/index.vue (single-page LP composition)"
tech_stack_added: []
patterns:
  - "SSR-friendly useFetch with cache-control: no-store for fresh-on-open data"
  - "Skeleton placeholders to prevent CLS during pending state"
  - "Graceful fallback via pending/error refs without bubbling rejections"
key_files_created:
  - app/components/Section/SectionMarketTicker.vue
key_files_modified:
  - app/pages/index.vue
decisions:
  - "No setInterval: spec is 'fresh when user opens site', not periodic polling"
  - "Each API call typed with generics and cast independently so one failure (fx) does not hide the other (ibov)"
  - "Navy background via var(--color-brand-primary) token (no hardcoded hex) per architecture constraint"
  - "py-2.5 bar height (~40px) — thin strip, not a full section"
  - "text-emerald-400 / text-rose-400 (not 500) for better contrast on navy background"
metrics:
  duration_seconds: 118
  tasks_completed: 2
  files_touched: 2
  completed_date: "2026-04-15"
---

# Quick 260415-m3g: Market Quotes Bar Between Hero and About Summary

Added a slim navy strip between SectionHero and SectionAbout that shows live USD-BRL, EUR-BRL and IBOVESPA quotes fetched via SSR useFetch on every page open, with skeleton loading and graceful "—" fallback on API failure.

## What was built

A new `SectionMarketTicker.vue` component renders three labeled quotes (Dólar, Euro, Bolsa) with value + colored arrow (▲ emerald / ▼ rose) + percentage change. Data is pulled from two free public APIs:

- `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL` — USD and EUR bids + pctChange
- `https://brapi.dev/api/quote/%5EBVSP` — IBOV regularMarketPrice + regularMarketChangePercent

Both calls use `useFetch` with typed generics (`AwesomeApiResponse`, `BrapiResponse`) and explicit `cache-control: no-store` headers so each page open triggers a fresh upstream request. No axios, no `setInterval`, no build-time caching.

The component is wired in `app/pages/index.vue` between `<SectionHero />` and `<SectionAbout />`, auto-imported by Nuxt from the `Section/` directory.

## Files Changed

| File | Change |
|------|--------|
| `app/components/Section/SectionMarketTicker.vue` | Created (216 lines) |
| `app/pages/index.vue` | Added `<SectionMarketTicker />` between Hero and About (+1 line) |

## Tasks

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create SectionMarketTicker component with SSR fetch and graceful fallback | `54be7cf` | `app/components/Section/SectionMarketTicker.vue` |
| 2 | Wire SectionMarketTicker between SectionHero and SectionAbout | `9c7481f` | `app/pages/index.vue` |

## Key Decisions

- **No periodic refresh** — the spec says "atualizadas assim que o usuário abre o site"; `useFetch` on SSR + `no-store` already satisfies this. `setInterval` is out of scope and would add useless network traffic.
- **Independent error handling per API** — FX and IBOV use separate `useFetch` calls so a failure of one does not blank out the other. Each has its own `pending` / `error` / computed `show*` state.
- **text-emerald-400 / text-rose-400 instead of 500** — the 500 shades are too dim on the navy `--color-brand-primary` background; 400 shades maintain enough contrast without going neon.
- **`var(--color-brand-primary)` via inline `:style`** — Tailwind v4 arbitrary value syntax `bg-[var(--…)]` works but inline `:style` avoids any JIT edge cases and is explicit about token usage.
- **Skeleton widths tuned to final content** — w-16 for currencies (`R$ 5,12`), w-20 for IBOV (`128.456`) so there is no layout shift when values resolve.

## Verification

- `pnpm build` passes on both task commits (no TypeScript errors, no SSR warnings related to the new component).
- Component references confirmed in source: `economia.awesomeapi.com.br`, `brapi.dev`, `useFetch`, `var(--color-brand-primary)`.
- `app/pages/index.vue` contains `<SectionMarketTicker />` exactly once between Hero and About as required by the plan's regex pattern.
- No axios import anywhere in the new file; no `setInterval`.
- Frontmatter contract `key_links` pattern verified: both API endpoints are wired via `useFetch` with typed generics.

## Deviations from Plan

None — plan executed exactly as written. The only minor adjustment (`text-emerald-400` instead of `text-emerald-500`) is a contrast refinement consistent with the plan's intent ("green with ▲ arrow", no specific shade enforced).

## Manual verification steps

1. Run `pnpm dev` and open `http://localhost:3000`.
2. Verify a navy strip appears immediately below the hero with labels "Dólar", "Euro", "Bolsa" and numeric values.
3. DevTools → Network → block `economia.awesomeapi.com.br` and `brapi.dev`, hard-reload: the bar should render with "—" placeholders, page layout unchanged.
4. Lighthouse CLS check: score should remain unchanged (skeletons prevent shift).

## Known Stubs

None.

## Self-Check: PASSED

- FOUND: app/components/Section/SectionMarketTicker.vue
- FOUND: app/pages/index.vue (SectionMarketTicker wired)
- FOUND: commit 54be7cf
- FOUND: commit 9c7481f
