# Roadmap: Fly Up Milhas

**Project:** High-conversion landing page for miles consultancy
**Core Value:** Convert visitors into R$200 consultancy clients via authority, trust, and real results
**Granularity:** Coarse
**Total v1 Requirements:** 26
**Coverage:** 26/26 ✓

---

## Phases

- [ ] **Phase 1: Foundation & Infrastructure** - Project scaffold, asset pipeline, backend endpoints, and SEO/performance baseline
- [ ] **Phase 2: Display Sections** - All static content sections (hero, expert bio, method, social proof, price anchoring, FAQ)
- [ ] **Phase 3: Lead Form & Conversion** - Lead qualification form, Fastify integration, WhatsApp CTA, end-to-end submission flow

---

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: The project runs in production with SSR, all media served from R2 with image optimization, backend endpoints protected and live, and SEO meta layer in place — before any user-facing content is built.
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, BACK-01, BACK-02, BACK-03
**Success Criteria** (what must be TRUE):
  1. Running `nuxt build && nuxt preview` produces a working SSR page with no hydration warnings in the console
  2. An image uploaded to the Cloudflare R2 bucket renders in the browser as a WebP with correct dimensions via `<NuxtImg>`, confirmed in DevTools network tab
  3. A test POST to `/leads` from a browser on the staging URL returns 200 and creates a MongoDB document — no CORS error, no 500
  4. A test POST to `/leads` from the same IP beyond the rate limit returns 429
  5. The page scores 90+ on PageSpeed mobile in a `nuxt build && nuxt preview` run, and LCP is under 2.5s on a 3G throttled profile
**Plans:** 2/3 plans executed

Plans:
- [x] 01-01-PLAN.md — Nuxt 4 scaffold, dependencies, design tokens, app shell (INFR-01)
- [x] 01-02-PLAN.md — Fastify POST /leads with CORS, rate limiting, MongoDB (BACK-01, BACK-02, BACK-03)
- [ ] 01-03-PLAN.md — R2 image pipeline, SEO meta, LocalBusiness schema, performance validation (INFR-02, INFR-03, INFR-04)

### Phase 2: Display Sections
**Goal**: A visitor scrolling the full page sees a compelling, trust-building narrative — hero headline, expert credentials with real numbers, the 4-step method, testimonials with specific savings, price with value anchoring, and FAQ — all correctly styled and mobile-responsive.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, AUTH-01, AUTH-02, METD-01, METD-02, SOCL-01, SOCL-02, CTA-02, CTA-03
**Success Criteria** (what must be TRUE):
  1. On a 375px mobile viewport, the hero headline and CTA button are fully visible above the fold without horizontal scroll, using Inter or Geist at the configured weight
  2. The expert section shows Marcio's photo (served from R2), specific numeric results (milhas acumuladas, paises, economia), and the CTA button scrolls to the lead form anchor
  3. The "Como Funciona" section displays exactly 4 labeled steps (Diagnostico, Estrategia, Execucao, Voo) in a visual flow that is readable on mobile and desktop
  4. The social proof section shows at least two testimonials with real first name, city, R$ savings or route + cabin class, and one result screenshot served from R2
  5. The price (R$200) is visible in context with a value anchor ("passagens que custam R$3.000+ emitidas por menos") and the FAQ section renders 5-7 questions in expandable or static format
**Plans**: TBD

### Phase 3: Lead Form & Conversion
**Goal**: A visitor can fill out the 4-field qualification form on mobile, submit it successfully, receive a confirmation message, and reach Marcio via WhatsApp — with every submission stored in MongoDB and protected from bots and spam.
**Depends on**: Phase 2
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, CTA-01
**Success Criteria** (what must be TRUE):
  1. On a mobile device, the WhatsApp and gasto mensal fields trigger the numeric keyboard (`inputmode="numeric"`) and the WhatsApp field enforces the Brazilian phone format before allowing submission
  2. Submitting the form with an empty required field shows an inline validation error and does not send a request to the backend
  3. A valid form submission on the staging URL creates a MongoDB document and shows the user a success message ("Recebi! Marcio vai te chamar no WhatsApp em ate 24h") with no CORS error in the browser console
  4. A form with the honeypot field filled (simulated bot) is rejected at the Fastify layer and never written to MongoDB
  5. Clicking the WhatsApp CTA button opens `wa.me/` in the WhatsApp app with a pre-filled message identifying the visitor as a lead from the landing page
**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 2/3 | In Progress|  |
| 2. Display Sections | 0/? | Not started | - |
| 3. Lead Form & Conversion | 0/? | Not started | - |

---

## Coverage Map

| Requirement | Phase | Category |
|-------------|-------|----------|
| INFR-01 | Phase 1 | Infrastructure |
| INFR-02 | Phase 1 | Infrastructure |
| INFR-03 | Phase 1 | Infrastructure |
| INFR-04 | Phase 1 | Infrastructure |
| BACK-01 | Phase 1 | Backend |
| BACK-02 | Phase 1 | Backend |
| BACK-03 | Phase 1 | Backend |
| HERO-01 | Phase 2 | Hero & Branding |
| HERO-02 | Phase 2 | Hero & Branding |
| HERO-03 | Phase 2 | Hero & Branding |
| HERO-04 | Phase 2 | Hero & Branding |
| HERO-05 | Phase 2 | Hero & Branding |
| AUTH-01 | Phase 2 | Autoridade |
| AUTH-02 | Phase 2 | Autoridade |
| METD-01 | Phase 2 | Metodo |
| METD-02 | Phase 2 | Metodo |
| SOCL-01 | Phase 2 | Prova Social |
| SOCL-02 | Phase 2 | Prova Social |
| CTA-02 | Phase 2 | CTA & Conversao |
| CTA-03 | Phase 2 | CTA & Conversao |
| LEAD-01 | Phase 3 | Formulario |
| LEAD-02 | Phase 3 | Formulario |
| LEAD-03 | Phase 3 | Formulario |
| LEAD-04 | Phase 3 | Formulario |
| LEAD-05 | Phase 3 | Formulario |
| CTA-01 | Phase 3 | CTA & Conversao |

**Total mapped: 26/26 ✓**

---
*Roadmap created: 2026-03-21*
*Last updated: 2026-03-21 after Phase 1 planning*
