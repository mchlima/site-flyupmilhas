---
phase: 02-display-sections
plan: "03"
subsystem: frontend-sections
tags: [price, faq, accordion, assembly, landing-page]
dependency_graph:
  requires: [02-01, 02-02]
  provides: [full-page-assembly, price-section, faq-section, formulario-anchor]
  affects: [app.vue, phase-3-form-integration]
tech_stack:
  added: []
  patterns:
    - UAccordion with :items prop for single-open expandable FAQ
    - Dark background pricing section for conversion contrast
    - Value anchoring pattern (compare to R$3.000+ to reframe R$200)
    - Plain button with brand-cta color (consistent with SectionHero pattern)
    - id="formulario" anchor stub ready for Phase 3 SectionLeadForm
key_files:
  created:
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionFAQ.vue
  modified:
    - app/app.vue
decisions:
  - "SectionPrice uses dark navy (brand-primary) background to create urgency contrast at the pricing moment — departs from strict alternating pattern but justified for conversion"
  - "UAccordion single-open behavior (default) chosen over multiple-open for better mobile reading flow"
  - "5 FAQ items covering the main purchase objections; TODO marker for Marcio to review and add 1-2 more"
  - "formulario stub section uses text 'Formulario em breve...' as visible placeholder — will be replaced by SectionLeadForm in Phase 3"
metrics:
  duration: "2 minutes"
  completed_date: "2026-03-21"
  tasks: 3
  files_changed: 3
---

# Phase 02 Plan 03: Price, FAQ, and Full Assembly Summary

**One-liner:** Full landing page assembled with price anchoring (R$200 vs R$3.000+), 5-item FAQ accordion, and #formulario CTA target ready for Phase 3 form integration.

## What Was Built

### SectionPrice.vue

Price display section on dark navy background for maximum conversion contrast. Implements decision D-20 (R$200 prominent display), D-21 (value anchor comparing to R$3.000+), and D-22 (CTA scrolling to #formulario). Structure: pre-heading, value anchor, large price display, clarification text, 3-column includes summary, CTA button.

### SectionFAQ.vue

FAQ accordion section using Nuxt UI UAccordion component. Implements decisions D-23 (accordion format), D-24 (5 FAQ items addressing purchase objections), D-25 (first-person concise answers). Items cover: spending level compatibility, card tier requirements, satisfaction assurance, meeting format, and result timeline.

### app.vue (updated)

Full page assembly replacing SectionPlaceholder with 6 real sections in correct scroll narrative order: Hero → Expert → Method → SocialProof → Price → FAQ → #formulario stub. Script setup block (useSeoMeta + useSchemaOrg) preserved unchanged.

## Build Result

`npm run build` completed with **exit code 0**.

- Client built in 3387ms (790 modules)
- Server built in 3006ms (761 modules)
- No SSR errors, no hydration warnings
- Existing sourcemap warnings are pre-existing (plugin-level, not our code)

## Final Phase 2 File List

| File | Status | Purpose |
|------|--------|---------|
| app/composables/useScroll.ts | Created in 02-01 | Smooth scroll to anchor composable |
| app/components/Section/SectionHero.vue | Created in 02-01 | Hero with headline and CTA |
| app/components/Section/SectionExpert.vue | Created in 02-01 | Marcio bio with R2 photo and metrics |
| app/components/Section/SectionMethod.vue | Created in 02-02 | 4-step Como Funciona flow |
| app/components/Section/SectionSocialProof.vue | Created in 02-02 | Testimonials and results |
| app/components/Section/SectionPrice.vue | Created in 02-03 | Price anchoring with R$200 CTA |
| app/components/Section/SectionFAQ.vue | Created in 02-03 | UAccordion 5-item FAQ |
| app/app.vue | Modified in 02-03 | Full page assembly with #formulario stub |

## Content Gaps Requiring Marcio Input

These TODOs exist in Phase 2 code and must be resolved before launch:

1. **SectionExpert.vue** — Placeholder photo at `${r2Base}/marcio-placeholder.webp` — real WebP photo must be uploaded to R2
2. **SectionExpert.vue** — Metrics: "5M+ milhas", "12 destinos", "R$80k+ economizados" are placeholders — real numbers needed
3. **SectionExpert.vue** — Bio paragraph marked TODO — real story from Marcio
4. **SectionSocialProof.vue** — Testimonials are placeholder names/cities — real client quotes needed with permission
5. **SectionSocialProof.vue** — Result screenshot at `${r2Base}/resultado-milhas-placeholder.webp` — real screenshot needed
6. **SectionFAQ.vue** — 5 FAQ items are reasonable placeholders — Marcio to review and add 1-2 more (TODO marker in code)

## Phase 3 Handoff Notes

- `id="formulario"` anchor exists in app.vue — all CTA buttons in SectionHero, SectionExpert, and SectionPrice scroll to it
- The formulario section stub is visible at `class="py-16 px-6 bg-[var(--color-brand-bg)]"`
- Phase 3 SectionLeadForm replaces the stub `<div>` inside that section (id="formulario" section element stays)
- Form fields spec: Nome, WhatsApp, gastos mensais, objetivo (4 fields — see STATE.md decision)
- `useLeadForm.ts` composable stub already exists at `app/composables/useLeadForm.ts` from Phase 1
- WhatsApp number and honeypot field name must be agreed with Marcio before Phase 3 implementation

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Placeholder metrics (5M+, 12, R$80k+) | SectionExpert.vue | Awaiting real numbers from Marcio |
| Placeholder photo path | SectionExpert.vue | R2 upload required before staging |
| Placeholder testimonials | SectionSocialProof.vue | Awaiting real client quotes |
| "Formulario em breve..." | app.vue #formulario | Phase 3 will replace with SectionLeadForm |
| FAQ TODO comment | SectionFAQ.vue | Marcio to review and add 1-2 Q&A items |

These stubs do not prevent Phase 2's goal (full page narrative visible in one scroll) — they are content placeholders, not code blockers. The page renders, scrolls correctly, and builds without errors.

## Self-Check: PASSED

- [x] app/components/Section/SectionPrice.vue exists — FOUND
- [x] app/components/Section/SectionFAQ.vue exists — FOUND
- [x] app/app.vue contains id="formulario" — FOUND
- [x] Commit 802e11f (SectionPrice) exists — FOUND
- [x] Commit f3985d2 (SectionFAQ) exists — FOUND
- [x] Commit 9f23bb4 (app.vue assembly) exists — FOUND
- [x] Build exits 0 with no SSR errors — CONFIRMED
