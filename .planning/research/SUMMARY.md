# Project Research Summary

**Project:** Fly Up Milhas — High-Conversion Landing Page
**Domain:** Service sales LP — miles/travel consultancy, Brazilian market
**Researched:** 2026-03-24 (v1.5 update — supersedes 2026-03-21 summary)
**Confidence:** HIGH

## Executive Summary

Fly Up Milhas is a single-page high-conversion landing page for a personal miles consultancy (R$ 299,90) targeting Brazilian consumers. The product is a 1-month VIP mentorship with WhatsApp support and strategy sessions. Research confirms this is a well-understood product type in the Brazilian infoprodutor market, with established conversion patterns that are both technically achievable and already partially implemented in the existing Nuxt 4 codebase. The v1.5 milestone is a copy rewrite and conversion optimization pass on a working foundation — the recommended approach is to build incrementally on what exists rather than scaffold from scratch.

The stack is locked and fully installed: Nuxt 4.4.2 + Nuxt UI v4.5.1 + Tailwind v4 + Fastify 5 (existing backend). No new dependencies are required for v1.5. All six new conversion features — WhatsApp-style testimonials, PIX/installment pricing display, 7-day guarantee block, negative qualification cards, progressive CTAs, and form security badge — are implementable with the current stack through pure template and data changes. The only technically risky operation is the synchronized 3-file schema change to remove the `objetivo` dropdown field. This must be executed in strict order (backend schema first) to avoid validation failures during the deployment window.

The primary risks are not technical. They are copy consistency across 10+ components edited in isolation, and the availability of client assets — specifically WhatsApp testimonial screenshots from Marcio with LGPD consent. The conversion research confirms the Brazilian market has specific table-stakes expectations: PIX pricing display, WhatsApp-style social proof, and a 7-day guarantee. Missing any of these in 2026 actively hurts conversion. The differentiators for Fly Up Milhas are progressive CTA copy variation (15-30% lift, rare in the BR niche) and specific result numbers in testimonials, which competitors consistently avoid.

---

## Key Findings

### Recommended Stack

The stack is already installed and correct. No new packages needed for v1.5. The existing dependency set is `nuxt ^4.4.2`, `@nuxt/ui ^4.5.1`, `tailwindcss ^4.2.2` (peer dep managed by Nuxt UI), `zod ^3.x`, `@nuxtjs/seo ^4.x`, `@nuxt/image ^2.x`. The Fastify 5 backend handles POST /leads with `@fastify/mongodb`, `@fastify/cors`, and `@fastify/rate-limit` — existing, not to be rebuilt. Cloudflare R2 handles image assets via `@nuxt/image`'s Cloudflare provider.

For details see: `.planning/research/STACK.md`

**Core technologies:**
- **Nuxt 4** (`^4.4.2`): SSR framework — SEO-critical; separate `app/` and `server/` TypeScript projects prevent type bleed; Nuxt 3 is on EOL trajectory (security-only until July 2026)
- **@nuxt/ui 4** (`^4.5.1`): Component library — ships Tailwind v4, Reka UI primitives, UForm/UInput for lead capture; no separate Tailwind config needed
- **Zod** (`^3.x`): Schema validation — shared between `useLeadForm.ts` and `server/leads/schema.ts`; single source of truth for lead payload shape
- **@nuxt/image** (`^2.x`): Image optimization — Cloudflare R2 provider; mandatory for Core Web Vitals on Brazilian mobile traffic
- **Fastify 5** (existing): POST /leads endpoint with rate-limiting and CORS; integrate, do not rebuild

**Nothing to add for v1.5.** Chat bubbles are pure Tailwind CSS. Pricing display is static markup. Guarantee badge uses `UIcon` already in `@nuxt/ui`. `v-html` with hardcoded strings is safe for the programmatic content items.

### Expected Features

For details see: `.planning/research/FEATURES.md`

**Must have (table stakes in Brazilian mentorship market):**
- WhatsApp-style testimonial display — Brazilian buyers expect screenshot-style social proof; generic quote cards read as unauthentic in this niche
- PIX + installment pricing display (R$ 299,90 / 10x R$ 29,99) — mandatory for any Brazilian digital product above R$ 100; PIX icon/badge expected
- 7-day guarantee block — legally expected under CDC Art. 49 (direito de arrependimento); absence actively hurts conversion
- Benefit-focused hero with single CTA above the fold
- Expert bio with real credentials and personal redemption results
- Mobile-first layout — 70-80% of Brazilian traffic is mobile
- Lead capture form: 3 fields after v1.5 simplification (nome, whatsapp, gastoMensal)

**Should have (differentiators or near-table-stakes):**
- "Para quem NAO e" negative qualification cards — near-table-stakes for 1:1 mentorship; improves lead quality by filtering misfit prospects
- Progressive CTA copy per page position — 15-30% conversion lift documented; rare in the BR mentorship market (genuine differentiator)
- Form security badge ("Seus dados estao seguros") — 23-42% form conversion lift when placed directly below submit button
- Price anchoring against redemption value — frames R$ 299,90 against R$ 3.000+ in potential flight savings

**Defer (post-launch or v2+):**
- Multi-page funnel (thank you page, blog) — @nuxt/content only if needed; not in scope
- A/B testing — use `useRuntimeConfig` feature flags, never a client-side A/B library
- WhatsApp floating CTA button — viable with `<a href="https://wa.me/55...">`, defer until conversion baseline established
- Cloudflare Turnstile CAPTCHA — add only if bot spam exceeds what @fastify/rate-limit handles

**Anti-features (explicitly do not build):**
- Navigation menu with external links — every exit link is a conversion leak
- Fake strikethrough pricing — Brazilian buyers detect and distrust fabricated discounts; damages personal brand
- Countdown timer (fake urgency) — destroys trust with tech-aware milhas audience
- Multiple trust badges — Baymard data: 17 badges → 2.1% conversion; 6 badges → 3.4%; one shield badge is optimal

### Architecture Approach

For details see: `.planning/research/ARCHITECTURE.md`

The existing architecture is a single-page Nuxt 4 SSR app with no `pages/` directory. All content composes through `app/app.vue` → 12 standalone SFC components in scroll order. Two composables handle the only shared logic: `useLeadForm` (Zod schema + $fetch POST to Fastify) and `useScroll` (smooth scroll to `#formulario`). Brand tokens are defined in `app/assets/css/main.css` under `@theme {}`. The architecture is well-suited for v1.5 — most changes are template-only with no new composables, shared state, or routing needed.

**Current section component order (app.vue):**
1. `AppHeader` — sticky smart nav with CTA
2. `SectionHero` — first impression, CTA above fold
3. `SectionAbout` — expert credibility bento grid
4. `SectionProgramContent` — 8-item curriculum with icons
5. `SectionForWhom` — positive qualification cards (+ negative in v1.5)
6. `SectionMethod` — 4-step process flow
7. `SectionSocialProof` — testimonials (rebuilding to WhatsApp bubble style in v1.5)
8. `SectionPrice` — offer, pricing, guarantee block (adding real prices in v1.5)
9. `SectionFAQ` — beginner-focused objections
10. `SectionLeadForm` — 3-field lead capture with security badge

**Only one v1.5 change touches the backend:** `SectionLeadForm` field removal (`objetivo` dropdown) requires coordinated updates across `server/leads/schema.ts`, `app/composables/useLeadForm.ts`, and the form component — in that order.

### Critical Pitfalls

For details see: `.planning/research/PITFALLS.md`

1. **Schema desync when removing the `objetivo` field** — the field exists in 3 files that must change atomically. Update `server/leads/schema.ts` first, then `app/composables/useLeadForm.ts`, then `SectionLeadForm.vue`. Updating only the UI component causes silent 400 errors or invisible field submissions in the backend.

2. **`renda-extra` not fully purged** — removing "renda extra" sounds like a copy task but the string `'renda-extra'` is an enum value in Zod schemas in 3 locations plus a bento card in SectionAbout. Run `grep -r "renda.extra" app/ server/` after all changes; zero results expected outside `node_modules`.

3. **Copy inconsistency across 10+ components** — price, duration, guarantee, and CTA text spread across the full LP will drift without a reference. Define a copy constants table (price: `R$ 299,90`, installments: `10x de R$ 29,99`, duration: `30 dias`, meetings: `3 encontros`, guarantee: `7 dias — 100% devolvido`) before touching any component.

4. **WhatsApp chat bubble CSS breaks on 375px mobile** — bubble components copied from UI kits assume fixed-width containers. Use `max-width: min(85%, 400px)` on bubbles; add `word-break: break-word; overflow-wrap: anywhere` to bubble text. Test at 375px/390px/412px. Never use WhatsApp green `#25D366` as a brand token — hardcode it only in the bubble component.

5. **Price display floating-point formatting** — `10x de R$ 29,99` must be a hard-coded string, not computed at runtime (`29.99 * 10 = 299.9000000000001` in JavaScript). Brazilian formatting uses `,` as decimal separator — `R$ 299,90` not `R$ 299.90`. Hard-code all price strings as literals.

6. **Security badge inside `<UForm>`** — Nuxt UI's `<UForm>` expects `<UFormField>` children in its default slot. Placing the security badge inside `<UForm>` causes unexpected spacing. Place it outside the `<UForm>` tag in the parent container, directly below the submit button.

---

## Implications for Roadmap

Based on combined research, the v1.5 build follows a 6-phase order determined by: backend-first for schema changes, parallelizable display-only work, and a final CTA copy pass after sections are stable.

### Phase 1: Backend Schema Cleanup (Blocks Form Work)
**Rationale:** The Zod schema is the contract between frontend and backend. Removing `objetivo` and purging `renda-extra` from the Fastify schema must precede any frontend changes. If the frontend form is updated first (omitting `objetivo`) while the backend still validates it as required, Fastify returns 400 and leads are silently lost.
**Delivers:** Updated `server/leads/schema.ts` — `objetivo` field removed, `renda-extra` enum value purged; Fastify accepts 3-field POST without errors; grep for `renda.extra` returns zero results
**Addresses:** Form simplification (4 → 3 fields), product positioning cleanup (no "renda extra" angle)
**Avoids:** Pitfall M1 (schema desync), Pitfall M2 (renda-extra enum remnants)

### Phase 2: Copy Rewrite — Pure Text Sections
**Rationale:** These changes are fully independent of each other and of the backend. They are safe to ship incrementally. Critically: define the copy constants table before editing any component to prevent price/guarantee inconsistencies across sections.
**Delivers:** Updated SectionHero (new headline, subheadline, pain point chips), SectionAbout (renda extra card removed, hero card copy rewritten), SectionFAQ (replaced with beginner-focused milhas objections), SectionMethod (30-day duration + 3 meetings + WhatsApp support added)
**Uses:** No new stack elements — template and data array changes only
**Avoids:** Pitfall M3 (copy inconsistency) by establishing the constants reference table before the first edit

### Phase 3: Structural Template Changes
**Rationale:** These sections require template restructuring beyond copy changes but have no backend or state dependencies. The WhatsApp bubble component has the highest visual and mobile-responsiveness complexity — build and test it at 375px before moving to Phase 4.
**Delivers:** SectionSocialProof rebuilt as WhatsApp-style chat bubbles with "Casos reais de quem ja aplicou" title; SectionForWhom extended with `negativeCards` array and "Esta mentoria NAO e para voce se..." block; SectionProgramContent with bold keywords via `v-html`, updated subtitle
**Implements:** WhatsApp chat bubble inline in SectionSocialProof; extract to `app/components/UI/ChatBubble.vue` only if 3+ bubble types are needed
**Avoids:** Pitfall M4 (mobile bubble breakage) — 375px/390px/412px viewport test is mandatory before phase completion

### Phase 4: Pricing and Offer Clarity
**Rationale:** SectionPrice is the conversion moment — it must reflect real pricing and contain the guarantee block. This section depends only on confirmed client data (already confirmed in PROJECT.md: R$ 299,90 PIX / 10x R$ 29,99), not on other phases. The guarantee belongs inside SectionPrice, not in a separate standalone section.
**Delivers:** SectionPrice with real pricing display (hard-coded strings), PIX / installment two-option layout (stacked on mobile, side-by-side on md:), 7-day guarantee block with shield icon, updated progressive CTA text
**Uses:** `UIcon` with `i-heroicons-shield-check` (already in @nuxt/ui); Tailwind flex column → row responsive layout
**Avoids:** Pitfall M5 (floating-point price formatting, mobile flex wrapping) — format check and 375px test before completing phase

### Phase 5: Form Simplification (Requires Phase 1 Complete)
**Rationale:** The 3-file coordinated change (`useLeadForm.ts` schema update + `SectionLeadForm.vue` template) must follow Phase 1 (Fastify schema already updated). Adding the security badge is part of this phase — placement outside `<UForm>` in the parent container.
**Delivers:** `useLeadForm.ts` with `objetivo` removed from schema and TypeScript types; `SectionLeadForm.vue` with `objetivo` USelect removed, `state` object simplified, security badge placed below submit button outside `<UForm>`; `nuxt build` passes TypeScript check with no errors
**Implements:** 3-field form (nome, whatsapp, gastoMensal); security badge with `i-heroicons-lock-closed` at `w-5 h-5` minimum
**Avoids:** Pitfall M6 (badge inside UForm causing layout issues), schema desync (TypeScript build serves as verification gate)

### Phase 6: CTA Variation Pass
**Rationale:** Progressive CTA copy is cosmetic cleanup that requires all sections to be stable first. This is the final pass that unifies the CTA strategy. All CTAs continue using `useScroll.scrollTo('formulario')` unchanged — only copy differs.
**Delivers:** Distinct CTA copy at each page position: SectionHero ("Quero dar o primeiro passo"), SectionAbout/SectionProgramContent mid-page ("Quero aprender na pratica"), SectionPrice ("Quero comecar agora"), AppHeader ("Comecar agora"); `data-cta-position` attribute added to each CTA button; `<!-- anchor: do not rename -->` comment on `section#formulario`
**Avoids:** Pitfall M7 (CTA copy change breaks scroll target; position tracking for future analytics)

### Phase Ordering Rationale

- **Phase 1 is non-negotiable first** — backend schema is a hard dependency for form work; no other phase blocks on it except Phase 5
- **Phases 2-3 are fully parallelizable** within themselves; individual section edits have no inter-component dependencies
- **Phase 4 depends only on confirmed client data**, not on other phases; can overlap with Phase 2-3 work
- **Phase 5 depends on Phase 1** being deployed (or at minimum running locally with updated schema before frontend changes)
- **Phase 6 is always last** — CTA text should only be finalized after all sections it links to are complete and stable

### Research Flags

Phases with well-documented patterns (no research-phase needed):
- **Phase 1:** Zod + Fastify schema synchronization — standard pattern already in use in this codebase
- **Phase 2:** Copy rewrites — content decisions only; no technical uncertainty
- **Phase 4:** Pricing display — completely resolved; hard-code strings, responsive flex layout
- **Phase 6:** CTA variation — pure copy work with `useScroll` already handling all scroll logic

Phases that may benefit from a targeted check during planning:
- **Phase 3 (WhatsApp Bubble):** If Marcio provides real screenshot images (PNG/WebP) rather than CSS bubbles, `@nuxt/image` integration for testimonial images needs a check — specifically aspect ratio handling and mobile cropping behavior for WhatsApp screenshots at various phone resolutions
- **Phase 5 (Form):** Confirm which field is removed — `objetivo` or `gastoMensal`. ARCHITECTURE.md clearly states `objetivo` (the dropdown with enum values `executiva | economia | renda-extra`) is removed. PITFALLS.md M1 contains a naming inconsistency that references `gastoMensal`. Verify before executing Phase 1 schema changes.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages installed, versions verified against official releases; no new dependencies required for v1.5 |
| Features | HIGH | Multiple BR market sources; Brazilian payment, social proof, and guarantee patterns well-documented; conversion lift numbers have multiple confirming sources |
| Architecture | HIGH | Based on direct codebase inspection of all relevant files; component map is ground truth, not inference |
| Pitfalls | HIGH | Code-verified; pitfalls derived from reading actual file contents (`server/leads/schema.ts`, `useLeadForm.ts`, SFCs); not abstract framework warnings |

**Overall confidence:** HIGH

### Gaps to Address

- **Field removal ambiguity:** ARCHITECTURE.md says remove `objetivo` (the dropdown with `renda-extra` enum). PITFALLS.md M1 says `gastoMensal` is removed. These contradict. The intent is almost certainly to remove `objetivo` (which contains the `renda-extra` value being phased out), keeping `gastoMensal`. Confirm before any Phase 1 schema work.

- **WhatsApp testimonial screenshots:** Marcio must provide real client screenshots with LGPD consent before Phase 3 can finalize. The CSS bubble fallback is ready for authentic testimonial text he provides, but if screenshot images are needed, this is a content dependency that can delay the phase.

- **Hero headline and subheadline final copy:** v1.5 hero rewrite requires confirmed copy from Marcio. Phase 2 can proceed with placeholder content but cannot ship without client sign-off on the new headline direction.

- **Negative qualification copy:** The "Para quem NAO e" cards in Phase 3 require 3 negative qualifiers from Marcio. Keep to 3 maximum — more than 4 creates doubt in qualified prospects.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection (2026-03-24): `app/app.vue`, `app/composables/useLeadForm.ts`, `server/leads/schema.ts`, all Section SFCs, `app/assets/css/main.css`
- https://github.com/nuxt/nuxt/releases — Nuxt 4.4.2 verified current as of March 2026
- https://github.com/nuxt/ui/releases — Nuxt UI 4.5.1 verified current
- https://endoflife.date/nuxt — Nuxt 3 EOL July 31, 2026 confirmed
- https://ui.nuxt.com/docs/getting-started/installation/nuxt — Nuxt UI v4 install and compatibility requirements
- https://vuejs.org/guide/best-practices/security.html — v-html safety rules (developer-controlled content)

### Secondary (MEDIUM confidence)
- https://blog.greatpages.com.br/post/landing-page-para-infoprodutos — Brazilian LP qualification + pricing display patterns
- https://www.rebill.com/en/blog/main-payment-methods-in-brazil — PIX dominance in Brazilian digital products
- https://smartsmssolutions.com/resources/blog/business/trust-badges-boost-conversion — Security badge conversion data (23-42% lift near form fields)
- https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages — Progressive CTA variation lift (15-30%)
- https://www.engagebay.com/blog/sales-page/ — Disqualification section psychology and lead quality improvement
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns

### Tertiary (MEDIUM-LOW confidence)
- https://thiagoregismkt.com.br/conteudos/landing-page-alta-conversao-estrategias/ — Brazilian conversion optimization patterns
- Baymard Institute (cited via FEATURES.md) — badge saturation conversion data (17 badges vs 6 badges comparison)
- https://tailwindflex.com/@simon-scheffer/whatsapp-like-chat-design — WhatsApp CSS bubble Tailwind pattern reference

---

*Research completed: 2026-03-24*
*Ready for roadmap: yes*
