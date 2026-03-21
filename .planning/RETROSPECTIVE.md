# Retrospective

## Milestone: v1.0 — MVP Launch

**Shipped:** 2026-03-21
**Phases:** 3 | **Plans:** 7

### What Was Built
- Nuxt 4 SSR scaffold with Cloudflare Pages preset and Tailwind v4 design tokens
- Fastify 5 POST /leads with Zod validation, MongoDB, CORS, honeypot, rate limiting
- Full landing page: Hero, Expert bio, Como Funciona, Social Proof, Pricing, FAQ
- 4-field lead form with phone masking and WhatsApp CTA

### What Worked
- Coarse granularity kept plans focused (2-3 tasks per plan)
- Design tokens established early prevented style drift across components
- Shared Zod schema between frontend and backend eliminated validation mismatches

### What Was Inefficient
- SectionExpert was built in v1.0 then replaced by SectionAbout in v1.1 — could have been avoided with earlier content direction from client
- UButton caused centering issues that required replacement with plain button in v1.1

### Patterns Established
- `import.meta.client` guard for browser APIs (not `process.client`)
- Plain buttons over UButton for precise styling control
- `var(--color-brand-*)` token system for all brand colors

### Key Lessons
- Get content direction (company vs. personal brand) before building bio sections
- Nuxt UI v4 component internals (Reka UI) can interfere with precise styling — test early

---

## Milestone: v1.1 — Refinamento Visual

**Shipped:** 2026-03-21
**Phases:** 2 | **Plans:** 4

### What Was Built
- Smart sticky header with anchor nav and mobile hamburger
- Bento grid card layout across About, Method sections
- SectionAbout replacing SectionExpert (company-focused, renda extra)
- FAQ contrast fix, background color correction
- Navy form card with centered button
- Split footer with Agencia 201 credit

### What Worked
- UI-SPEC design contract caught typography violations (5th font size, 3rd weight) before execution
- Phase 4 parallel execution (Wave 1: 2 agents) saved significant time
- Context discussion questions kept scope tight — no feature creep

### What Was Inefficient
- Phase directory for Phase 5 wasn't auto-created by the tool, required manual mkdir
- `roadmap get-phase 5` returned `found: false` despite phase existing — tool limitation with v1.1 section format

### Patterns Established
- Navy card for conversion emphasis (form, pricing)
- 4 font sizes max, 2 weights max (enforced by UI checker)
- Orange accent reserved for CTA only (5 specific uses listed)

### Key Lessons
- UI-SPEC verification loop is worth the cost for frontend phases — catches design system violations before code is written
- Small phases (like Phase 5 with 1 plan) can skip research and UI-SPEC without risk

---

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 |
|--------|------|------|
| Phases | 3 | 2 |
| Plans | 7 | 4 |
| Avg tasks/plan | 2.0 | 1.75 |
| Verification pass rate | 100% | 100% |
| Revision loops | 0 | 1 (UI-SPEC typography) |

---
*Last updated: 2026-03-21*
