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

## Milestone: v1.2 — Polimento de Conteudo e Layout

**Shipped:** 2026-03-21
**Phases:** 1 | **Plans:** 2

### What Was Built
- FAQ accordion labels with WCAG AA contrast
- Form inputs bg-white with visible borders on navy card
- SectionAbout headline reframed as value proposition
- Step 4 renamed to "Autonomia" with independence-focused copy
- Offer block consolidated into SectionPrice (5 items)
- Floating back-to-top button with SSR-safe scroll detection

### What Worked
- Skipping research and UI-SPEC for a pure polish phase saved significant time
- Single phase with 2 parallel plans — fastest milestone yet
- CONTEXT.md decisions were specific enough for zero-ambiguity execution

### What Was Inefficient
- Nothing notable — clean execution for a small scope

### Key Lessons
- Polish milestones with <8 requirements can safely be 1 phase
- UAccordion label styling requires both `ui` prop AND slot override for reliability

---

## Milestone: v1.3 — Alinhamento de Conteudo com Mentoria

**Shipped:** 2026-03-22
**Phases:** 2 | **Plans:** 5

### What Was Built
- Global consultoria→mentoria migration (zero occurrences remaining)
- Pain point chips in hero, CTA "Quero dar o primeiro passo" everywhere
- SectionMethod with 3 encontros quinzenais + Autonomia
- SectionPrice with benefits list, no price
- SectionProgramContent (8 learning items, two-column layout)
- SectionForWhom (5 audience fit cards)

### What Worked
- `--auto` flag enabled seamless plan→execute→verify chain across both phases
- 3 parallel agents in Phase 7 covered 14 files without conflicts (no shared files)
- Old site content document (`docs/OLD_SITE_CONTENT.md`) was the perfect source of truth for copy

### What Was Inefficient
- Some SUMMARY.md one-liners were empty or generic — extraction tool needs improvement

### Key Lessons
- Having the old site content in a markdown file made copy migration deterministic
- Content overhaul phases benefit from splitting by file ownership (no conflicts in parallel execution)

---

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 | v1.2 | v1.3 |
|--------|------|------|------|------|
| Phases | 3 | 2 | 1 | 2 |
| Plans | 7 | 4 | 2 | 5 |
| Avg tasks/plan | 2.0 | 1.75 | 2.0 | 1.8 |
| Verification pass rate | 100% | 100% | 100% | 100% |
| Revision loops | 0 | 1 (UI-SPEC) | 0 | 0 |

---
*Last updated: 2026-03-21*
