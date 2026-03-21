---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-03-21T05:32:18.216Z"
progress:
  total_phases: 3
  completed_phases: 0
  total_plans: 3
  completed_plans: 1
---

# State: Fly Up Milhas

## Project Reference

**Core Value:** Converter visitantes em clientes da consultoria VIP atraves de uma LP de alta conversao
**Current Focus:** Phase 01 — foundation-infrastructure

---

## Current Position

Phase: 01 (foundation-infrastructure) — EXECUTING
Plan: 2 of 3

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Requirements mapped | 26/26 | 26/26 |
| Phases defined | 3 | 3 |
| Plans complete | — | 0 |
| LCP (mobile, 3G) | < 2.5s | Not measured |
| PageSpeed mobile | 90+ | Not measured |

| Phase 01-foundation-infrastructure P02 | 5 min | 2 tasks | 5 files |

---

## Accumulated Context

### Key Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Nuxt 4 (not Nuxt 3) | Nuxt 3 EOL July 31, 2026; Nuxt 4 is current supported major | Pending confirmation with client |
| Nuxt UI v4 | Bundles Tailwind v4 + Reka UI + UForm/Zod integration; no separate install needed | Pending |
| No `pages/` directory | Single-page LP; eliminates vue-router overhead (~15 KB gzipped) | Pending |
| No Pinia | `useLeadForm` composable with local reactive state is sufficient | Pending |
| Direct `$fetch` to Fastify | No Nuxt server proxy unless CORS cannot be resolved at Fastify layer | Pending |
| 4-field form only | Brazilian mobile traffic; each field beyond 4 costs 10-20% completions | Confirmed |
| R2 + Cloudflare Image Transformations | Must be enabled BEFORE any asset upload; `<NuxtImg>` does not optimize without it | Pending confirmation of plan tier |
| @fastify/cors@^11 (not ^10) | Fastify 5 requires cors v11+ for plugin compatibility; v10 fails at startup | Confirmed — implemented in 01-02 |
| Rate limit global:false | POST /leads only rate-limited; other routes unaffected | Confirmed — implemented in 01-02 |
| Honeypot returns HTTP 200 id:'honeypot' | Bots receive success signal, no retry incentive | Confirmed — implemented in 01-02 |

### Critical Pre-Build Blockers

- [ ] Confirm Nuxt 4 acceptable (changes directory structure vs Nuxt 3 reference in PROJECT.md)
- [ ] Confirm Cloudflare plan includes Image Transformations (fallback: Squoosh/sharp pre-optimization only)
- [ ] Confirm Fastify deployment topology — same domain subdomain or cross-origin? (determines CORS vs proxy strategy)
- [ ] Collect content from Marcio before Phase 2: average client savings figure, monthly capacity, named testimonials with specific R$/route/cabin data, personal results story, WhatsApp number, professional photo
- [ ] Confirm guarantee offer (Marcio must explicitly agree before including in copy)

### Technical Pitfalls to Watch

1. Cloudflare Image Transformations must be enabled in dashboard BEFORE uploading assets — cannot be applied retroactively
2. CORS: form submissions are client-to-server and enforce CORS; SSR fetches bypass it — test from real browser on staging URL
3. Hydration mismatch: wrap browser-only logic in `<ClientOnly>` or `if (import.meta.client)`; test with `nuxt build && nuxt preview` not `nuxt dev`
4. Hero image: set `fetchpriority="high"` and `loading="eager"` — never lazy-load the LCP element
5. Honeypot field name must be agreed between frontend and backend before Phase 3

### Architecture Constraints

- `app.vue` is the entire application shell — no `pages/` directory
- All media > 20 KB on Cloudflare R2, never in `assets/images/`
- API base URL via `runtimeConfig.public.apiBase` from env var — never hardcoded
- Form locked at exactly 4 fields: Nome, WhatsApp, gastos mensais, objetivo

---

## Session Continuity

**Last action:** Completed 01-02-PLAN.md — Fastify POST /leads endpoint (2026-03-21)
**Next action:** Continue Phase 01 — Plan 03 (if exists) or transition to Phase 02

**Context for next session:**

- 3 phases defined, 26/26 requirements mapped
- Phase 1 Plan 02 complete: Fastify backend with POST /leads, CORS, rate-limiting, MongoDB, Zod validation
- Fastify server located at server/ — requires MONGODB_URI env var to start
- CORS_STAGING_URL env var available for staging validation (no code change needed)
- Honeypot field name `website` is now locked — frontend Phase 3 must use the same field name
- Content from Marcio is the critical path — should begin collection in parallel with Phase 1 technical work

---
*State initialized: 2026-03-21*
*Last updated: 2026-03-21 after completing 01-02 (Fastify backend endpoint)*
