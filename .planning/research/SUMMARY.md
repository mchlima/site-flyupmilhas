# Project Research Summary

**Project:** Fly Up Milhas — High-Conversion Landing Page
**Domain:** Miles/travel consultancy service sales (Brazilian market, R$200 price point)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

Fly Up Milhas is a single-page lead-generation landing page for a 1-on-1 miles consultancy targeting Brazilian consumers. Research confirms that the highest-converting approach for this market is a scroll-based, single-CTA page with SSR delivery (for SEO and Core Web Vitals), a 4-field WhatsApp-qualified lead form, and trust built through specific result numbers rather than generic claims. The Brazilian market has measurably higher trust-dependence than other markets — testimonials with full names, real photos, and R$ savings figures outperform anything generic. Competitors in this niche (PassageiroDePrimeira, ArteDasMilhas) hide pricing, avoid WhatsApp as primary CTA, and provide no specific result numbers; Fly Up Milhas can differentiate on all three simultaneously.

The recommended stack is Nuxt 4 (not Nuxt 3, which hits EOL July 2026) with Nuxt UI v4 for components, Tailwind v4 managed as a peer dependency, and Zod for shared form validation between the Nuxt frontend and the existing Fastify backend. Architecture is deliberately minimal: no `pages/` directory (a single `app.vue` shell with section components), no Pinia store (a `useLeadForm` composable with local reactive state is sufficient), and no Nuxt server proxy unless CORS cannot be resolved at the Fastify layer. All heavy media — expert photos, testimonial screenshots, result prints — must be served from Cloudflare R2 with Image Transformations enabled to protect LCP.

The most important risk to manage is not technical: it is content readiness. The page cannot launch without real numbers from Marcio — average client savings, monthly capacity for honest scarcity messaging, named testimonials with specific outcomes, and WhatsApp contact details. These are non-negotiable blockers that must be resolved before design begins, not after. The second most important risk is LCP: Cloudflare Image Transformations must be enabled before any asset is uploaded, because `<NuxtImg>` does not optimize R2 images without it, and a slow hero image will destroy both Google ranking and paid traffic quality scores.

## Key Findings

### Recommended Stack

Build on Nuxt 4 + Nuxt UI v4. Starting this project on Nuxt 3 would mean hitting security-only maintenance before the product matures (EOL July 31, 2026). Nuxt UI v4 unifies Nuxt UI and Nuxt UI Pro into a single free library with 110+ components, includes Tailwind v4 as a peer dependency, and ships with form components (UForm) that pair directly with Zod — eliminating the need for a separate validation library or VeeValidate. The Fastify backend already exists and should be integrated, not rebuilt: expose a `POST /leads` endpoint, add `@fastify/cors` with explicit origin allowlist, and `@fastify/rate-limit` to prevent bot submissions.

**Core technologies:**
- Nuxt ^4.4.2: SSR framework — SSR by default, cleaner `app/` directory structure, Nuxt 4 is the current supported major
- @nuxt/ui ^4.5.1: Component library bundling Tailwind v4, Reka UI, and UForm/UInput — no separate Tailwind install
- Zod ^3.x: Schema validation shared between Nuxt frontend and Fastify backend — single source of truth for lead payload shape
- @nuxtjs/seo ^2.x: Handles useSeoMeta, sitemap, robots.txt, and OG image in one module — install immediately
- @nuxt/image ^1.x: Critical for Core Web Vitals — serves R2 images with WebP conversion and lazy loading
- Fastify ^5.x (existing): Expose POST /leads; add `@fastify/mongodb`, `@fastify/cors`, `@fastify/rate-limit`
- Cloudflare R2: Asset storage for all media > 20 KB; must enable Cloudflare Image Transformations before use

**Do not use:** Nuxt 3 (EOL approaching), Nuxt UI v2/v3 (superseded), Tailwind v3 separately (conflicts with Nuxt UI v4), axios (Nuxt ships $fetch), Pinia (overkill for single-component form state), @nuxt/content (no Markdown content on this LP), Google Analytics via gtag.js (LGPD risk, performance impact).

### Expected Features

Research confirms the page narrative must flow from trust-building to conversion in order: Hero → Expert Bio → How It Works → Social Proof → Lead Form → Final CTA. Placing the form before social proof is a conversion killer. Price must appear after the value proposition, never at the top.

**Must have (table stakes):**
- Benefit-focused hero headline and subheadline — outcome-first, not service-name-first ("Voe de executiva gastando menos" not "Consultoria de Milhas")
- Single visible CTA above the fold pointing to the lead form — one action, no alternatives competing for attention
- Expert bio with specific results — "Quem e o Marcio" with real numbers, not generic credentials
- Social proof with real names, photos, and specific R$ savings or routes flown — vague testimonials damage trust in Brazil
- 4-step "Como Funciona" visual flow — buyers fear the unknown; visible process removes objection
- Lead qualification form — exactly 4 fields (Nome, WhatsApp, gastos mensais, objetivo); all required; WhatsApp field with Brazilian phone mask and numeric keyboard
- WhatsApp CTA — secondary conversion path via `wa.me/` deep-link with pre-filled message
- Price visibility — R$200 shown prominently near CTA, anchored against value ("passagens que custam R$3.000+ emitidas por menos")
- FAQ section — 5-7 objections pre-handled passively
- Mobile-first responsive layout — 70-80% of Brazilian traffic is mobile
- Page load under 2 seconds — non-negotiable for both conversion and Google ranking

**Should have (competitive differentiators):**
- WhatsApp as primary CTA destination — 148M BR users; 45-60% conversion vs 2-5% for email forms
- Price anchoring with real client average savings data — "meus clientes economizam em media R$X"
- Real scarcity messaging — "Apenas X vagas abertas por mes" based on Marcio's honest capacity
- Specialist's personal redemptions as proof — more authentic than client-only testimonials
- Risk reversal / guarantee — at R$200 this removes the biggest objection with low financial risk for Marcio
- Numeric keyboard on mobile for WhatsApp and spend fields (`inputmode="numeric"`)

**Defer (v1.x, after launch validation):**
- Urgency indicator with real capacity data (requires live data from Marcio)
- Result screenshots / prints of actual passagens emitidas (content dependency)
- A/B test: form vs WhatsApp as primary CTA
- Optional embedded click-to-play video (Marcio intro, YouTube-hosted)

**Defer (v2+):**
- Dynamic vagas counter (requires admin interface)
- Segment-specific landing pages per audience persona
- WhatsApp Business API automated flow

**Anti-features to avoid:**
- Navigation menu or external links (every exit link is a conversion leak)
- Blog / content section (dilutes single conversion goal)
- Social media feed embeds (performance cost, unpredictable content)
- Fake countdown timers (detectable; destroys trust in Brazilian market)
- Video autoplay (blocked on mobile browsers; audio triggers exits)
- Multiple competing CTAs (each additional CTA reduces all others' conversion rates)

### Architecture Approach

The architecture is intentionally minimal for a single-page LP. No `pages/` directory — `app.vue` is the entire application shell, eliminating vue-router overhead (~15 KB gzipped). Section components are grouped under `components/Section/` with Nuxt auto-imports (no explicit registration). The only shared state is the lead form, handled by a `useLeadForm` composable using `reactive()` and `ref()` — no Pinia. The Fastify API is called directly from the browser via `$fetch` after hydration; no Nuxt server proxy is needed if `@fastify/cors` is correctly configured on the Fastify side.

**Major components:**
1. `app.vue` — Root shell; all global SEO meta via `useSeoMeta()`; renders all sections in order
2. `SectionHero` — Above-the-fold headline, subheadline, primary CTA; scrolls to `SectionLeadForm` via `useScroll`
3. `SectionExpert` — Marcio bio, credentials, personal results (pure display, no state)
4. `SectionHowItWorks` — 4-step visual flow: Diagnostico → Estrategia → Execucao → Voo (pure display)
5. `SectionSocialProof` — Testimonial grid/carousel, result screenshots; requires real content from Marcio
6. `SectionLeadForm` — Qualification form; consumes `useLeadForm` composable; shows success/error states
7. `SectionCTA` — Final CTA band with urgency/scarcity copy; scrolls to form
8. `AppHeader` / `AppFooter` — Minimal sticky nav with logo + CTA; legal/contact footer
9. `useLeadForm.ts` — All form state, Zod validation, `$fetch` POST to Fastify, status management
10. `useScroll.ts` — Smooth-scroll helper used by all CTA buttons to reach `#lead-form`

**Key architectural constraints:**
- No `pages/` directory (single-page app, no router needed)
- No Pinia (composable with local state is sufficient)
- No Nuxt server proxy unless CORS cannot be resolved at Fastify layer (proxy doubles latency)
- All media > 20 KB on Cloudflare R2, never in `assets/images/`
- API base URL via `runtimeConfig.public.apiBase` from env var — never hardcoded

### Critical Pitfalls

1. **Nuxt Image optimization silently disabled on Cloudflare** — `<NuxtImg>` does not optimize R2 images unless Cloudflare Image Transformations is explicitly enabled in the dashboard. Without it, the hero image loads at full size (2-4 MB), destroying LCP on mobile. Enable Cloudflare Image Transformations before uploading any assets; pre-optimize all images with Squoosh/sharp before upload regardless (hero under 200 KB, testimonial photos under 60 KB). Set `fetchpriority="high"` and `loading="eager"` on the hero image — never lazy-load the LCP element.

2. **CORS failure silently loses leads** — SSR data fetches bypass browser CORS (server-to-server). Form submissions are client-to-server and enforce CORS. This means the form works perfectly in dev and appears to work after deploy, but fails silently in production if Fastify's `@fastify/cors` is not configured with the production domain as an allowed origin. Leads are lost with no user error. Configure and smoke-test CORS from a real browser on the staging URL before launch.

3. **Hydration mismatch breaks LCP and causes CLS** — Server-rendered HTML that differs from the client produces visible flash, destroys LCP, and creates layout shift. Common triggers: reading `window`/`localStorage` during SSR, using `new Date()` or `Math.random()` in render, conditionals based on browser globals. Always wrap browser-only logic in `<ClientOnly>` or guard with `if (import.meta.client)`. Test with `nuxt build && nuxt preview` — mismatches often don't appear in `nuxt dev`.

4. **Lead form with more than 4 fields kills mobile conversions** — The Brazilian market is predominantly mobile. Each field beyond 4 costs 10-20% of completions. Freeze the form at exactly 4 fields (Nome, WhatsApp, gastos mensais, objetivo). Treat any addition as scope creep that must remove a different field. WhatsApp number is the most critical field — malformed numbers mean Marcio cannot follow up; enforce Brazilian phone format validation before submit.

5. **Weak social proof triggers skepticism, not trust** — Generic testimonials ("Marcio is amazing!"), blurred names, or suspiciously perfect collections actively reduce trust in the Brazilian market. Testimonials must include real first name + city + specific R$ savings or route + cabin class achieved. Collect testimonials before design begins; weak proof discovered after launch costs high recovery effort and conversion suffers until fixed.

## Implications for Roadmap

Based on combined research, the build should follow the dependency sequence identified in ARCHITECTURE.md, grouped into phases that respect content blockers, technical foundations, and conversion-critical delivery order.

### Phase 1: Content Collection and Project Foundation

**Rationale:** Content from Marcio is the single most critical blocker. Testimonials with specific numbers, average savings data for price anchoring, WhatsApp number, capacity for honest scarcity, and personal results cannot be invented. Starting with scaffold + design tokens while content collection runs in parallel avoids blocked time. CTA hierarchy and page narrative must be decided before any component is coded, or sections will be built in isolation with competing CTAs (Pitfall 6).
**Delivers:** Project scaffold (Nuxt 4 + Nuxt UI v4, pnpm, ESLint, TypeScript), nuxt.config.ts with runtimeConfig and @nuxtjs/seo, Tailwind brand tokens (aviation blue, off-white, orange/gold CTA color), `app.vue` shell, AppHeader and AppFooter components. Simultaneously: completed content brief from Marcio with all required data points.
**Addresses features:** Mobile-first responsive layout foundation, SEO meta layer, brand design system
**Avoids:** CTA dilution (hierarchy defined upfront), weak social proof (testimonial collection template provided to Marcio before design begins), hardcoded API URLs (runtimeConfig established from day one)

### Phase 2: Cloudflare R2 and Image Infrastructure

**Rationale:** Image optimization must be configured before any assets are uploaded, not after. If R2 buckets and Cloudflare Image Transformations are configured post-hoc, the risk of serving unoptimized images in production is high (Pitfall 3). Establishing the asset pipeline here protects every subsequent phase that touches media.
**Delivers:** Cloudflare R2 bucket with public custom domain, Cloudflare Image Transformations enabled, `@nuxt/image` configured with R2 provider, custom R2 provider thin wrapper, all Marcio's media pre-optimized and uploaded (hero, bio photo, testimonial photos), `Cache-Control` headers set on R2 objects.
**Uses:** `@nuxt/image ^1.x`, Cloudflare R2 public bucket, Cloudflare Image Transformations dashboard
**Implements:** Asset pipeline described in ARCHITECTURE.md — all media > 20 KB on R2, zero in `assets/images/`

### Phase 3: Static Section Components

**Rationale:** All display-only sections have no dependencies on the Fastify API or lead form state. They can be built in parallel once design tokens and content are available. Building these before the form keeps component work clean and allows a visual walkthrough with the client before wiring up form logic.
**Delivers:** `SectionHero` (headline, subheadline, CTA button), `SectionExpert` (Marcio bio, photo, real results), `SectionHowItWorks` (4-step visual flow), `SectionSocialProof` (testimonials with names/photos/numbers, result screenshots), `SectionCTA` (final CTA band with scarcity copy), `useScroll` composable
**Addresses features:** Hero headline + CTA, expert bio section, "Como Funciona" visual flow, social proof testimonials, price visibility with value anchor, urgency/scarcity messaging
**Avoids:** Hydration mismatch (ClientOnly wrappers applied; build tested with `nuxt build && nuxt preview` before section sign-off)

### Phase 4: Lead Form and Fastify Integration

**Rationale:** The form is the primary conversion mechanism and the most technically complex piece — it depends on Zod schema, Fastify endpoint contract, CORS configuration, honeypot spam protection, and precise mobile UX. It must be built last among the UI components so the Fastify integration can be validated end-to-end before the rest of the page is locked.
**Delivers:** `useLeadForm.ts` composable (Zod validation, $fetch POST, status state machine), `SectionLeadForm.vue` (4 fields, Brazilian phone mask, numeric keyboard on mobile, success/error states, 10-second timeout with friendly error), honeypot field (CSS-hidden, server-side rejection), `@fastify/cors` configured with production domain, `@fastify/rate-limit` on POST /leads (5 submissions per IP per hour), smoke-test from staging browser confirming no CORS error and MongoDB write
**Addresses features:** Lead qualification form, WhatsApp CTA (secondary path), form success confirmation ("Recebi! Marcio vai te chamar no WhatsApp em ate 24h")
**Avoids:** $fetch double-fetching (composable uses $fetch only in user-triggered submit), CORS failure (validated on staging before launch), too many form fields (locked at 4), spam submissions (honeypot + rate limit), missing WhatsApp validation (regex enforced before submit)

### Phase 5: SEO, Performance Audit, and Launch Readiness

**Rationale:** SEO layer (useSeoMeta, OG image, sitemap, robots.txt) is best finalized once all sections and their content are locked — OG title, description, and image must reflect final copy. Performance audit must happen against a production build, not dev mode (hydration mismatches and image optimization status are invisible in dev). The "Looks Done But Isn't" checklist from PITFALLS.md is the acceptance gate.
**Delivers:** useSeoMeta with final title, description, OG image (1200x630, served from R2 or public/), sitemap.xml and robots.txt via @nuxtjs/seo, Nitro route cache rules (maxAge: 3600) for SSR caching under traffic spikes, PageSpeed score above 90 mobile, LCP under 2.5 seconds verified in production, all items on PITFALLS.md "Looks Done But Isn't" checklist verified, Fastify env var confirmed in production (not falling back to localhost)
**Avoids:** All remaining pitfalls — final audit is a systematic check against every pitfall identified in PITFALLS.md

### Phase Ordering Rationale

- Content must be collected before design, not after — weak testimonials discovered post-launch have HIGH recovery cost (PITFALLS.md recovery table)
- Cloudflare image infrastructure before any asset upload — `<NuxtImg>` optimization requires dashboard configuration that cannot be retroactively applied to already-uploaded assets without re-testing
- Display sections before form — avoids mixing concerns; provides visual milestone for client review without form complexity
- Form and Fastify integration before SEO audit — CORS must be validated on a near-production environment, and the SEO layer requires final content to be locked
- Performance audit as its own phase, not folded into component builds — hydration mismatches and LCP regressions are only visible in production builds

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Lead Form + Fastify Integration):** CORS strategy (proxy vs direct) needs a decision based on actual Fastify deployment topology; if Fastify runs on a different subdomain than Nuxt, the proxy approach in PITFALLS.md may be preferred over explicit CORS to keep the POST /leads endpoint private
- **Phase 4 (Lead Form + Fastify Integration):** Honeypot implementation details — server-side rejection must happen at Fastify level, which requires a defined field name convention agreed between frontend and backend
- **Phase 2 (Cloudflare R2):** Cloudflare Image Transformations pricing tier — confirm whether it is included in the existing Cloudflare plan before committing to this as the optimization strategy; fallback is pre-optimization only (Squoosh/sharp)

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Nuxt 4 scaffold with Nuxt UI v4 is extremely well-documented in official docs; nuxi init + module installation is deterministic
- **Phase 3 (Static Sections):** All section components are pure display with Tailwind CSS and Nuxt UI components; straightforward, high-confidence patterns
- **Phase 5 (SEO + Audit):** @nuxtjs/seo is well-documented; PageSpeed/LCP audit process is standard; no novel patterns required

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack (Nuxt 4, Nuxt UI v4, Zod) verified against official release notes and docs; version compatibility table confirmed; Fastify stack is existing, not new |
| Features | HIGH | Brazilian-market-specific data confirmed across multiple sources including BR-specific landing page research; competitor analysis validates the differentiator gaps |
| Architecture | HIGH | Primary sources are official Nuxt docs; single-page LP without pages/ directory is explicitly recommended in official docs; composable pattern is idiomatic Vue/Nuxt |
| Pitfalls | HIGH (technical), MEDIUM (conversion/UX) | Nuxt SSR pitfalls confirmed with GitHub issues and official docs; Cloudflare Image Transformations issue confirmed with specific issue numbers; conversion UX patterns are well-sourced but Brazilian-specific market data has less primary source depth |

**Overall confidence:** HIGH

### Gaps to Address

- **Marcio's content data:** Average client savings figure, monthly capacity, testimonial collection, personal results story, and WhatsApp number are all required before design can be finalized. Establish a content brief and collection deadline before Phase 3 begins — this is the project's critical path, not any technical work.
- **Cloudflare plan tier:** Confirm whether Cloudflare Image Transformations is included in the current plan. If not, pre-optimization via Squoosh/sharp before R2 upload becomes the sole LCP defense strategy (still viable, just requires stricter upload discipline).
- **Fastify deployment topology:** Confirm whether Fastify runs on the same domain (subdomain) as Nuxt in production. If cross-origin, decide between explicit CORS configuration on Fastify vs adding a Nuxt server proxy route before Phase 4 begins.
- **Guarantee offer:** Marcio must explicitly confirm willingness to offer a risk-reversal guarantee before it is included in copy. Do not implement on assumption.
- **Nuxt 4 vs Nuxt 3 clarification:** The original PROJECT.md references "Nuxt 3". This research recommends Nuxt 4 based on EOL timeline. Confirm with the client/team that Nuxt 4 is acceptable before project scaffold begins — it changes the directory structure and requires Nuxt UI v4 (which requires Nuxt 4).

## Sources

### Primary (HIGH confidence)
- https://github.com/nuxt/nuxt/releases — Nuxt 4 version history; v4.4.2 verified current as of March 2026
- https://github.com/nuxt/ui/releases — Nuxt UI v4.5.1 verified current
- https://endoflife.date/nuxt — Nuxt 3 EOL date (July 31, 2026) confirmed
- https://ui.nuxt.com/docs/getting-started/installation/nuxt — Official Nuxt UI v4 install guide
- https://nuxt.com/docs/guide/directory-structure/app — app.vue single-page approach; official recommendation to skip pages/ for LPs
- https://github.com/fastify/fastify-mongodb — @fastify/mongodb official plugin
- https://github.com/fastify/fastify-cors — @fastify/cors official plugin
- https://nuxt.com/docs/3.x/guide/best-practices/hydration — Hydration best practices
- https://image.nuxt.com/providers/cloudflare — @nuxt/image Cloudflare provider
- https://github.com/nuxt/image/issues/1588 — Confirmed issue: NuxtImg optimization not applied on Cloudflare without Image Transformations

### Secondary (MEDIUM confidence)
- https://masteringnuxt.com/blog/when-to-use-fetch-usefetch-or-useasyncdata-in-nuxt-a-comprehensive-guide — $fetch vs useFetch patterns
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns
- https://thiagoregismkt.com.br/conteudos/landing-page-alta-conversao-estrategias/ — Brazilian-market LP conversion research
- https://www.meusiteagora.com.br/Blog/como-usar-depoimentos-e-provas-sociais-em-landing-pages.html — Social proof patterns for BR market
- https://www.braze.com/resources/articles/whatsapp-marketing — WhatsApp conversion data (148M BR users, 45-60% conversion rate)
- https://abmatic.ai/blog/role-of-scarcity-and-urgency-in-landing-page-conversion — Scarcity/urgency conversion lift data
- https://growthfueling.com/landing-page-mistakes-that-kill-conversions-in-2025/ — CTA dilution and conversion mistakes
- https://www.debugbear.com/blog/nuxt-ssr-performance — Nuxt SSR performance patterns

### Tertiary (LOW confidence)
- https://medium.com/@ali_mirzaei/nuxt-js-structure-best-practices-building-robust-vue-js-applications-625ed4e782bb — Community structure patterns; aligned with official docs but treat as secondary validation only
- https://blog.nuxtdojo.com/p/6-building-effective-landing-pages — Community LP patterns for Nuxt; useful directional guidance

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
