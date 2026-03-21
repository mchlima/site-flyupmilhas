# Phase 1: Foundation & Infrastructure - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffold running in production with SSR, all media served from Cloudflare R2 with image optimization, Fastify backend endpoints for lead capture (POST /leads) protected by CORS and rate limiting, and SEO meta layer in place — before any user-facing content sections are built.

</domain>

<decisions>
## Implementation Decisions

### Nuxt Version & Scaffold
- **D-01:** Use Nuxt 4 (not Nuxt 3) — Nuxt 3 enters security-only maintenance ending July 2026, greenfield project should start on current major version
- **D-02:** Use `app/` directory structure (Nuxt 4 default) — `app/app.vue` as single entry point, no `pages/` directory needed for single-page LP
- **D-03:** Install Nuxt UI v4 (bundles Tailwind CSS v4) — do NOT install Tailwind separately, let Nuxt UI manage it
- **D-04:** Configure design tokens in CSS (Tailwind v4 is CSS-first, no `tailwind.config.js`) — set brand colors: azul aviacao (primary), branco gelo/cinza ultra claro (background), laranja/dourado (CTA accent)
- **D-05:** Typography: Inter font via `@fontsource/inter` or Google Fonts — fallback to system sans-serif

### R2 Asset Strategy
- **D-06:** Reference R2 assets via absolute URL to public R2 bucket — no `@nuxt/image` custom provider needed for MVP
- **D-07:** Images should be pre-optimized (WebP format, appropriate dimensions) before upload to R2 — avoid runtime transformation dependency
- **D-08:** R2 bucket accessible via custom subdomain (e.g., `cdn.flyupmilhas.com`) configured in Cloudflare DNS

### Fastify Endpoint Contract
- **D-09:** POST /leads endpoint accepts JSON body: `{ nome: string, whatsapp: string, gastoMensal: string, objetivo: "executiva" | "economia" | "renda-extra" }`
- **D-10:** Response: 200 `{ success: true, id: string }` on success, 400 on validation error, 429 on rate limit
- **D-11:** CORS via `@fastify/cors` with explicit origin whitelist (LP domain only)
- **D-12:** Rate limiting via `@fastify/rate-limit` — 5 requests per minute per IP on /leads endpoint
- **D-13:** Honeypot field: include `website` field in schema — if populated, reject silently (return 200 but don't store)

### Deployment Target
- **D-14:** Deploy Nuxt to Cloudflare Pages with SSR (Nitro preset: `cloudflare-pages`)
- **D-15:** Fastify backend deployed separately (existing infrastructure — not part of this LP project scope)

### SEO & Performance Baseline
- **D-16:** SEO via `@nuxtjs/seo` module — meta tags, Open Graph, structured data (LocalBusiness schema for consultoria)
- **D-17:** Performance target: LCP < 2s on mobile 3G, PageSpeed score 90+
- **D-18:** No analytics in Phase 1 — deferred to v2 (LGPD consent banner needed)

### Claude's Discretion
- Exact Nitro configuration details
- ESLint/Prettier setup
- Git hooks configuration
- Exact rate limit tuning beyond the 5/min baseline
- Loading/error page design for the scaffold phase

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `docs/PRD.md` — Original product requirements document with design specs, copy direction, and section structure
- `.planning/PROJECT.md` — Synthesized project context, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — v1 requirements with REQ-IDs mapped to phases

### Research
- `.planning/research/STACK.md` — Technology recommendations with versions and rationale
- `.planning/research/ARCHITECTURE.md` — System structure, component boundaries, build order
- `.planning/research/PITFALLS.md` — Domain pitfalls including SSR double-fetch, CORS, R2 image optimization

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — patterns will be established in this phase

### Integration Points
- Fastify backend (existing, external) — POST /leads endpoint to be created or confirmed
- Cloudflare R2 bucket — asset storage, needs DNS configuration for custom subdomain
- Cloudflare Pages — deployment target for Nuxt SSR

</code_context>

<specifics>
## Specific Ideas

- Research recommends `$fetch` (not `useFetch`) for form submission — `useFetch` is for SSR data loading, `$fetch` for user-triggered actions
- Establish the `$fetch` vs `useFetch` convention in this phase to prevent double-fetch pitfall in later phases
- Use native MongoDB driver via `@fastify/mongodb` instead of Mongoose — single collection, no schema abstraction needed

</specifics>

<deferred>
## Deferred Ideas

- LGPD consent banner — needed before any analytics/tracking (v2)
- Cloudflare Image Transformations — depends on Cloudflare plan tier, pre-optimize images for now
- WhatsApp Business API notification on lead submission — v2 feature

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-infrastructure*
*Context gathered: 2026-03-21*
