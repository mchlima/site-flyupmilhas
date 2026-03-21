---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: — MVP Launch
status: unknown
last_updated: "2026-03-21T08:17:47.643Z"
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 7
  completed_plans: 7
---

# State: Fly Up Milhas

## Project Reference

**Core Value:** Converter visitantes em clientes da consultoria VIP atraves de uma LP de alta conversao
**Current Focus:** Phase 05 — form-polish-footer

---

## Current Position

Phase: 05 (form-polish-footer) — COMPLETE
Plan: 1 of 1 (complete)

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| v1.1 requirements mapped | 12/12 | 12/12 |
| v1.1 phases defined | 2 | 2 |
| v1.1 plans complete | — | 0 |
| Background tint | None (off-white) | Not verified |
| FAQ contrast ratio | 4.5:1+ WCAG AA | Not measured |
| Phase 04-visual-overhaul-navigation P02 | 6 | 3 tasks | 3 files |
| Phase 04-visual-overhaul-navigation P01 | 1 | 2 tasks | 2 files |
| Phase 04 P03 | 1 min | 2 tasks | 2 files |
| Phase 05 P01 | 8 | 2 tasks | 3 files |

### v1.0 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01-foundation-infrastructure P01 | 5 min | 2 tasks | 12 files |
| Phase 01-foundation-infrastructure P02 | 5 min | 2 tasks | 5 files |
| Phase 01-foundation-infrastructure P03 | 2 min | 2 tasks | 2 files |
| Phase 02-display-sections P01 | 8 min | 3 tasks | 3 files |
| Phase 02-display-sections P02 | 2 min | 2 tasks | 2 files |
| Phase 02-display-sections P03 | 2 min | 3 tasks | 3 files |
| Phase 03-lead-form-conversion P01 | 3 min | 3 tasks | 3 files |

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
| tailwindcss installed as direct dep | @import "tailwindcss" in CSS requires package resolution even when declared as @nuxt/ui peer dep | Confirmed — implemented in 01-01 |
| @takumi-rs/wasm@^1.0.0-beta.3 required | nuxt-og-image (in @nuxtjs/seo) needs WASM renderer; Nitro build fails without it | Confirmed — implemented in 01-01 |
| zod v3 pinned (not v4) | v4 API changed; research specifies v3 stable for shared schema between frontend and Fastify | Confirmed — implemented in 01-01 |
| useSeoMeta replaces useHead | SSR-safe, deduplicates meta tags, @nuxtjs/seo convention | Confirmed — implemented in 01-03 |
| NuxtImg r2Base from runtimeConfig | Keeps CDN URL environment-agnostic, no hardcoded URLs in templates | Confirmed — implemented in 01-03 |
| fetchpriority=high + loading=eager on LCP image | Mandatory for PageSpeed 90+ mobile target (INFR-04) | Confirmed — implemented in 01-03 |
| Plain button over UButton for CTA | Achieves exact design token usage without Nuxt UI import complexity | Confirmed — implemented in 02-01 |
| import.meta.client in useScroll (not process.client) | Nuxt 4 compatible SSR safety pattern; process.client deprecated | Confirmed — implemented in 02-01 |
| No hero image in MVP | Strong typography + CTA contrast sufficient; avoids LCP complexity for text-primary sections | Confirmed — implemented in 02-01 |
| SectionPrice dark navy background | Departs from alternating pattern to create urgency/conversion contrast at pricing moment | Confirmed — implemented in 02-03 |
| UAccordion single-open behavior for FAQ | Better mobile reading flow than multiple-open accordion | Confirmed — implemented in 02-03 |
| formulario anchor stub in app.vue | Phase 3 SectionLeadForm target; all CTA scroll calls confirmed working | Confirmed — implemented in 02-03 |
| USelect uses items prop (not options) with value-key/label-key | Nuxt UI v4 Select.vue source confirmed; options prop does not exist in v4 | Confirmed — implemented in 03-01 |
| simple-icons @iconify-json not installed — inline SVG for WhatsApp CTA | Package absent; inline SVG path used in both CTA button instances | Confirmed — implemented in 03-01 |
| WhatsApp CTA URL defined as constant with TODO marker | WHATSAPP_URL = wa.me/55XXXXXXXXXXX; Marcio's real number required before launch | Open — needs Marcio's number |
| Bento grid replaces flat section layout (v1.1) | Modern visual pattern; cards with rounded corners improve perceived quality and scannability | Confirmed — implemented in 04-01/04-02/04-03 |
| SectionExpert replaced by SectionAbout (v1.1) | Milestone requirement: company story + renda extra value prop, not personal bio | Confirmed — wired in app.vue in 04-03 |
| :class conditional binding for bento step variant | Avoids duplicate markup; single v-for with conditional class for navy vs white card variants | Confirmed — implemented in 04-03 |
| pt-16 on main#main-content | 64px offset prevents fixed header from overlapping SectionHero content | Confirmed — implemented in 04-03 |
| opacity/pointer-events overlay over v-if for mobile menu | SSR-safe (ref(false) identical on server+client), avoids DOM CLS on each toggle | Confirmed — implemented in 04-01 |
| scroll-margin-top: 72px on section[id] | Prevents fixed 64px header overlapping anchored section content; 8px breathing room | Confirmed — implemented in 04-01 |
| SCROLL_THRESHOLD=64 for smart-sticky | Matches header height; smart-sticky activates only after full header has been scrolled past | Confirmed — implemented in 04-01 |
| Plain button over UButton for form submit | UButton Reka UI internals fight explicit centering classes; native button with flex guarantees text alignment | Confirmed — implemented in 05-01 |
| template #label slot on UFormField for white labels | UFormField label text not reachable via class on the component root; slot injection is the Nuxt UI v4 pattern | Confirmed — implemented in 05-01 |
| Footer navy background as visual bookend | Header and footer both navy creates consistent page frame; off-white body sits between two navy anchors | Confirmed — implemented in 05-01 |

### Critical Pre-Build Blockers

- [ ] Confirm Nuxt 4 acceptable (changes directory structure vs Nuxt 3 reference in PROJECT.md)
- [ ] Confirm Cloudflare plan includes Image Transformations (fallback: Squoosh/sharp pre-optimization only)
- [ ] Confirm Fastify deployment topology — same domain subdomain or cross-origin? (determines CORS vs proxy strategy)
- [ ] Collect content from Marcio before Phase 2: average client savings figure, monthly capacity, named testimonials with specific R$/route/cabin data, personal results story, WhatsApp number, professional photo
- [ ] Confirm guarantee offer (Marcio must explicitly agree before including in copy)
- [ ] Confirm copy for "Sobre a Fly Up Milhas" section — company founding story, renda extra framing, key differentiators

### Technical Pitfalls to Watch

1. Cloudflare Image Transformations must be enabled in dashboard BEFORE uploading assets — cannot be applied retroactively
2. CORS: form submissions are client-to-server and enforce CORS; SSR fetches bypass it — test from real browser on staging URL
3. Hydration mismatch: wrap browser-only logic in `<ClientOnly>` or `if (import.meta.client)`; test with `nuxt build && nuxt preview` not `nuxt dev`
4. Hero image: set `fetchpriority="high"` and `loading="eager"` — never lazy-load the LCP element
5. Honeypot field name must be agreed between frontend and backend before Phase 3
6. Hamburger menu (Phase 4): use `<ClientOnly>` or `import.meta.client` guard for any transition/animation state to avoid SSR hydration mismatch
7. Bento grid (Phase 4): validate layout at 375px, 768px, and 1280px — CSS Grid areas can break at intermediate breakpoints

### Architecture Constraints

- `app.vue` is the entire application shell — no `pages/` directory
- All media > 20 KB on Cloudflare R2, never in `assets/images/`
- API base URL via `runtimeConfig.public.apiBase` from env var — never hardcoded
- Form locked at exactly 4 fields: Nome, WhatsApp, gastos mensais, objetivo

---

## Session Continuity

**Last action:** Phase 05-01 complete — form navy card, spacing, centered button, footer redesign (2026-03-21)
**Next action:** v1.1 milestone complete — awaiting client content and launch approval

**Context for next session:**

- v1.0 all complete (phases 1-3, 7 plans, 26/26 requirements)
- Phase 4 all complete (3/3 plans): background token, AppHeader, SectionAbout, FAQ contrast, SectionMethod bento, app.vue assembly
- Phase 5 complete (1/1 plan): form navy card, field spacing, centered button, footer with Agencia 201 credit
- v1.1 milestone COMPLETE — all planned visual refinements shipped
- Open: Marcio's WhatsApp number (55XXXXXXXXXXX placeholder in SectionLeadForm.vue and AppFooter.vue)
- Open: Real content (photo, metrics, testimonials) still needed for launch
- Open: Agencia 201 URL confirmation (https://agencia201.com.br assumed)
- NUXT_PUBLIC_R2_BASE_URL=https://cdn.flyupmilhas.com.br must be set in .env for local preview

---
*State initialized: 2026-03-21*
*Last updated: 2026-03-21 — v1.1 roadmap defined, phases 4-5 added*
