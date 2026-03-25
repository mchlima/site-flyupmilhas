---
gsd_state_version: 1.0
milestone: v1.6
milestone_name: Upgrade de Identidade Visual
status: unknown
last_updated: "2026-03-25T02:27:58.114Z"
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 1
  completed_plans: 1
---

# State: Fly Up Milhas

## Project Reference

**Core Value:** Converter visitantes em clientes da mentoria Fly Up Milhas atraves de uma LP de alta conversao
**Current Focus:** Phase 15 — paleta-e-gradientes

---

## Current Position

Phase: 16
Plan: Not started

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| v1.6 requirements mapped | 16/16 | 16/16 |
| v1.6 phases defined | 5 | 5 |
| v1.6 plans complete | — | 0 |
| WCAG AA contrast (new palette) | all pass | Verified (Phase 15 P01) |
| CLS after font swap | < 0.1 | Not verified |
| Gradient repaint (4x CPU throttle) | no red rects | Not verified |
| FAQ keyboard nav | Tab/Enter/Space work | Not verified |
| Phase 15 P01 | 207s | 2 tasks | 8 files |

### v1.5 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 12-copy-rewrite-identity-sweep P01 | 71s | 2 tasks | 2 files |
| Phase 12 P02 | 2 | 3 tasks | 3 files |
| Phase 13-structural-template-changes P02 | 3 | 2 tasks | 2 files |
| Phase 13 P01 | 80s | 2 tasks | 2 files |
| Phase 14-form-frontend-cta-pass P01 | 58s | 2 tasks | 3 files |

### v1.4 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 09-logo-accents-form P01 | 2min | 2 tasks | 7 files |
| Phase 09-logo-accents-form P02 | 1 | 1 tasks | 2 files |
| Phase 10 P01 | 2 | 2 tasks | 2 files |

### v1.3 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 07 P01 | 1 | 2 tasks | 4 files |
| Phase 07 P02 | 4 | 2 tasks | 3 files |
| Phase 07 P03 | 2 | 2 tasks | 5 files |
| Phase 08-new-sections P01 | 1 | 2 tasks | 2 files |
| Phase 08-new-sections P02 | 2min | 2 tasks | 2 files |

### v1.2 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 06-content-layout-polish P01 | — | 3 tasks | 4 files |
| Phase 06-content-layout-polish P02 | — | 2 tasks | 4 files |

### v1.1 History (all complete)

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 04-visual-overhaul-navigation P01 | 1 min | 2 tasks | 2 files |
| Phase 04-visual-overhaul-navigation P02 | 6 min | 3 tasks | 3 files |
| Phase 04-visual-overhaul-navigation P03 | 1 min | 2 tasks | 2 files |
| Phase 05-form-polish-footer P01 | 8 min | 2 tasks | 3 files |

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
| "consultoria" → "mentoria" migration (v1.3) | Product is a mentorship with biweekly sessions, not a one-time consultancy; copy must reflect reality | Confirmed — Phase 7 complete (zero occurrences site-wide) |
| CTA label "Quero dar o primeiro passo" (v1.3) | Old site CTA confirmed; softer entry barrier than "Quero minha Consultoria" | Confirmed — Phase 7 complete (7 CTA locations updated) |
| gastoMensal field removed (v1.5) | Client feedback: simplify form to 3 fields; gastoMensal adds friction with no qualifying value | Confirmed — Phase 11 complete |
| Price as hard-coded strings (v1.5) | JS arithmetic on 299.90 produces floating-point errors; Brazilian format uses comma separator | Confirmed — Phase 13 |
| Security badge outside UForm (v1.5) | UForm expects UFormField children; badge inside causes unexpected spacing from Reka UI internals | Confirmed — Phase 14 |
| Progressive CTA copy per position (v1.5) | 15-30% lift documented; hero/mid/final CTAs should match visitor intent at each scroll depth | Confirmed — Phase 14 |
| Token namespace must use --color-brand-* (v1.6) | --color-primary silently overwrites Nuxt UI semantic system; all focus rings and interactive states break | Pending — Phase 15 |
| No tailwind.config.ts (v1.6) | Nuxt UI v4 manages Tailwind v4 via CSS-first path; a JS config file causes conflicts | Confirmed — architecture |
| Font swap must update nuxt.config.ts AND @theme {} simultaneously (v1.6) | One without the other causes double-load or missing CLS fallback metrics | Pending — Phase 16 |
| CSS-only initials avatar as default for testimonials (v1.6) | NuxtImg photo path requires Cloudflare Image Transformations confirmation; initials work immediately | Pending — Phase 18 |

### Critical Pre-Build Blockers

- [ ] Confirm Cloudflare plan includes Image Transformations (fallback: Squoosh/sharp pre-optimization only)
- [ ] Confirm Fastify deployment topology — same domain subdomain or cross-origin? (determines CORS vs proxy strategy)
- [ ] Collect WhatsApp testimonial screenshots from Marcio with LGPD consent (or use CSS bubble fallback with text he provides)
- [ ] Replace 55XXXXXXXXXXX WhatsApp placeholder with Marcio's real number before launch
- [ ] Replace Agencia 201 URL placeholder with real URL before launch
- [ ] Verify logo-fly-up-milhas.png reads correctly on new vibrant blue header background after Phase 15

### v1.6 Execution Notes

| Note | Detail |
|------|--------|
| Phase 15 exit gate | WCAG contrast check mandatory: every new token against every background (white, off-white, navy, dark hero overlay) |
| Phase 16 exit gate | Lighthouse CLS < 0.1 on `nuxt preview` (NOT dev server) |
| Phase 18 exit gate | If real photos added: verify Cloudflare Image Transformations active before using NuxtImg |
| Phase 19 exit gate | Manual keyboard Tab/Enter/Space navigation test through all FAQ items |
| Gradient limit | Max 2 color stops, max 3 sections — more causes mobile repaint cost on low-end Android |
| No neon blues | Avoid #00BFFF / #00B4D8 — tech startup, not premium travel |
| UAccordion :ui prop | Replaces (not merges) default class string — focus-visible:ring-2 must be explicitly included |

### v1.5 Copy Constants (single source of truth)

| Constant | Value |
|----------|-------|
| Price PIX | R$ 299,90 |
| Price installment | ate 10x de R$ 29,99 |
| Duration | 30 dias |
| Meetings | 3 encontros/mes |
| Support | via WhatsApp |
| Guarantee | 7 dias — 100% devolvido |
| CTA hero | Quero comecar agora |
| CTA mid | Quero entender melhor |
| CTA final | Quero entrar na mentoria |

### Technical Pitfalls to Watch (v1.6)

1. Token namespace collision: never use `--color-primary`; always `--color-brand-*`
2. Vibrant blue WCAG: `#3B82F6` (blue-500) is 3.0:1 against white — fails AA; use blue-700 `#1D4ED8` (6.3:1) for primary
3. Font double-load: update `nuxt.config.ts` fonts.families AND `@theme {}` in the same commit
4. Gradient paint cost: max 2 color stops; never combine with `filter: blur()`; run Chrome paint flashing audit
5. UAccordion focus ring: `:ui` prop replaces default class; always include `focus-visible:ring-2 focus-visible:ring-offset-2`
6. CTA on multiple backgrounds: `#06B6D4` must pass AA on all 4 contexts (dark hero, white, off-white, navy)

### Architecture Constraints

- `app.vue` is the entire application shell — no `pages/` directory
- All media > 20 KB on Cloudflare R2, never in `assets/images/`
- API base URL via `runtimeConfig.public.apiBase` from env var — never hardcoded
- Form locked at exactly 3 fields: nome, email, whatsapp
- All brand tokens in `app/assets/css/main.css` under `@theme {}` — no hardcoded hex values in component templates
- No `tailwind.config.ts` — Nuxt UI v4 manages Tailwind v4 via CSS-first path

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260323-me4 | Use bg-hero image as Hero section background with text contrast overlay | 2026-03-23 | a2ca962 | [260323-me4](./quick/260323-me4-use-bg-hero-image-as-hero-section-backgr/) |
| 260323-mwb | Add planning images to ForWhom section (2-column layout) | 2026-03-23 | 7ca7811 | [260323-mwb](./quick/260323-mwb-add-planning-images-to-forwhom-section-2/) |
| 260323-n1d | ForWhom: family image left, info cards right, harmonize layout | 2026-03-23 | 0025a18 | [260323-n1d](./quick/260323-n1d-forwhom-family-image-left-info-cards-rig/) |
| 260324-3z6 | Increase header logo height from h-8 to h-10 | 2026-03-24 | b9c730d | [260324-3z6](./quick/260324-3z6-o-logo-no-header-deve-ter-h-10/) |
| 260324-bpx | Add CTA button at end of SectionMethod | 2026-03-24 | e05ea65 | [260324-bpx](./quick/260324-bpx-insira-um-cta-no-fim-da-sessao-como-func/) |
| 260324-cpx | Add subtitle copy to SectionSocialProof | 2026-03-24 | 8884d11 | — |

---

## Session Continuity

**Last action:** Phase 15 P01 complete — v1.6 palette (blue/cyan) + gradient utilities applied across all sections
**Next action:** Phase 16 (typography)

**Reading flow (current):** Hero > About > ProgramContent > ForWhom > Method > SocialProof > Price > FAQ > Form
**v1.6 insert:** SectionGuarantee will be added between SectionPrice and SectionFAQ (Phase 17)
**Nav links:** Sobre, Conteudo, Como Funciona, Depoimentos, FAQ
**Open:** Marcio's WhatsApp number (55XXXXXXXXXXX placeholder in SectionLeadForm.vue and AppFooter.vue)
**Open:** Real content (photo, metrics, testimonials) still needed for launch
**Open:** Agencia 201 URL confirmation (https://agencia201.com.br assumed)
**Open:** NUXT_PUBLIC_R2_BASE_URL=https://cdn.flyupmilhas.com.br must be set in .env for local preview

---
*State initialized: 2026-03-21*
*Last updated: 2026-03-25 — Phase 15 P01 complete (palette + gradients)*
