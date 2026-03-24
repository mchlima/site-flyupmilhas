# Roadmap: Fly Up Milhas

**Project:** High-conversion landing page for miles mentorship
**Core Value:** Convert visitors into mentorship clients via authority, trust, and real results
**Granularity:** Coarse

---

## Milestones

<details>
<summary>✅ v1.0 MVP Launch (Phases 1-3) — SHIPPED 2026-03-21</summary>

- [x] Phase 1: Foundation & Infrastructure (3/3 plans) — completed 2026-03-21
- [x] Phase 2: Display Sections (3/3 plans) — completed 2026-03-21
- [x] Phase 3: Lead Form & Conversion (1/1 plan) — completed 2026-03-21

Full details: `.planning/milestones/v1.0-ROADMAP.md` (if archived) or git history

</details>

<details>
<summary>✅ v1.1 Refinamento Visual (Phases 4-5) — SHIPPED 2026-03-21</summary>

- [x] Phase 4: Visual Overhaul & Navigation (3/3 plans) — completed 2026-03-21
- [x] Phase 5: Form Polish & Footer (1/1 plan) — completed 2026-03-21

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>✅ v1.2 Polimento de Conteudo e Layout (Phase 6) — SHIPPED 2026-03-21</summary>

- [x] Phase 6: Content & Layout Polish (2/2 plans) — completed 2026-03-21

Full details: `.planning/milestones/v1.2-ROADMAP.md`

</details>

<details>
<summary>✅ v1.3 Alinhamento de Conteudo com Mentoria (Phases 7-8) — SHIPPED 2026-03-22</summary>

- [x] Phase 7: Content Overhaul (3/3 plans) — completed 2026-03-22
- [x] Phase 8: New Sections (2/2 plans) — completed 2026-03-22

Full details: `.planning/milestones/v1.3-ROADMAP.md`

</details>

<details>
<summary>✅ v1.4 Logo, Acentuação e Form Design (Phases 9-10) — SHIPPED 2026-03-22</summary>

- [x] Phase 9: Logo, Accents & Form Redesign (2/2 plans) — completed 2026-03-22
- [x] Phase 10: Footer & Instagram (1/1 plan) — completed 2026-03-22

Full details: `.planning/milestones/v1.4-ROADMAP.md`

</details>

---

## v1.5 Refinamento de Copy e Conversao

**Goal:** Apply client feedback (Marcio) to optimize copy, offer structure, and conversion across the entire LP

### Phases

- [x] **Phase 11: Backend Schema Cleanup** - Remove gastoMensal/objetivo fields, add email, purge renda-extra from codebase (completed 2026-03-24)
- [x] **Phase 12: Copy Rewrite & Identity Sweep** - Rewrite Hero, About, Method, FAQ copy; remove all Marcio name references site-wide (completed 2026-03-24)
- [x] **Phase 13: Structural Template Changes** - WhatsApp-style testimonials, negative qualification cards, bold keywords, pricing + guarantee block (completed 2026-03-24)
- [x] **Phase 14: Form Frontend & CTA Pass** - Sync form to 3-field schema, add security badge, apply progressive CTA copy (completed 2026-03-24)

---

## Phase Details

### Phase 11: Backend Schema Cleanup
**Goal**: The backend Fastify schema accepts a 3-field lead payload (nome, email, whatsapp) without errors, and the strings "renda-extra", "gastoMensal", and "objetivo" do not exist anywhere in the server or app source.
**Depends on**: Nothing (must execute first — all form frontend work depends on this)
**Requirements**: FORM-01, IDEN-02
**Success Criteria** (what must be TRUE):
  1. POST /leads with `{ nome, email, whatsapp }` returns 200 with no validation errors
  2. POST /leads with a `gastoMensal` or `objetivo` field included is either ignored or accepted gracefully (fields no longer in schema)
  3. `grep -ri "renda.extra" app/ server/` returns zero results outside node_modules
  4. `grep -ri "gastoMensal\|objetivo" app/ server/` returns zero results outside node_modules
  5. The Zod schema in `server/leads/schema.ts` contains `email: z.string().email()` and compiles without TypeScript errors
**Plans**: 1 plan

Plans:
- [x] 11-01-PLAN.md — Schema cleanup (remove gastoMensal/objetivo, add email) + renda-extra purge from SectionAbout

### Phase 12: Copy Rewrite & Identity Sweep
**Goal**: The LP presents the updated headline, subheadline, About section, Method details, and FAQ — with no occurrence of "Marcio" or "renda extra" anywhere in rendered text.
**Depends on**: Nothing (pure template and data changes; independent of Phase 11)
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, ABOUT-05, METH-01, METH-02, FAQ-01, IDEN-01
**Success Criteria** (what must be TRUE):
  1. Hero displays the headline "Aprenda a viajar de classe executiva pagando ate 80% menos, mesmo comecando do zero" and the updated subheadline
  2. Hero CTA reads "Quero comecar agora" with microcopy below the button
  3. SectionAbout displays the title "Viaje mais. Gaste menos. Use milhas do jeito certo." with 3 cards (conforto, economia, estrategia) and no "renda extra" card or text
  4. SectionMethod displays "30 dias", "3 encontros/mes" and "Suporte via WhatsApp" as visible information on the page
  5. FAQ questions address beginner pain points (not existing power-users), and no occurrence of "Marcio" or "renda extra" is present in any rendered section
**Plans**: 2 plans

Plans:
- [x] 12-01-PLAN.md — Hero + About copy rewrite (headline, subheadline, CTA, microcopy, About layout with 3 cards)
- [x] 12-02-PLAN.md — Method + FAQ rewrite + identity sweep (enriched steps, beginner FAQ, remove Marcio references)

### Phase 13: Structural Template Changes
**Goal**: SectionSocialProof renders chat-bubble testimonials, SectionForWhom includes a "Para quem NAO e" block, ProgramContent items have bold keywords, and SectionPrice shows the real price and 7-day guarantee.
**Depends on**: Phase 12 (sections must be stable before visual layer is finalized; pricing depends on confirmed copy constants)
**Requirements**: SOCL-01, SOCL-02, SOCL-03, FORW-01, PROG-01, PROG-02, PRCE-01, PRCE-02, PRCE-03
**Success Criteria** (what must be TRUE):
  1. SectionSocialProof renders testimony text inside WhatsApp-style chat bubbles and displays the title "Casos reais de quem ja aplicou"; bubbles render correctly at 375px, 390px, and 412px viewport widths
  2. SectionForWhom shows a "Para quem NAO e" block with 3 negative qualification cards below the positive qualification cards
  3. ProgramContent items display bold keywords (rendered via v-html with hardcoded strings) and the updated subtitle appears above the list
  4. SectionPrice displays "R$ 299,90 no PIX" and "ate 10x no cartao" as hard-coded strings (never computed values), with a dedicated guarantee block reading "Garantia de 7 dias — 100% do valor devolvido"
**Plans**: 2 plans

Plans:
- [x] 13-01-PLAN.md — SocialProof WhatsApp chat bubbles + ProgramContent bold keywords and subtitle
- [x] 13-02-PLAN.md — ForWhom negative qualification cards + SectionPrice split layout with pricing and guarantee

### Phase 14: Form Frontend & CTA Pass
**Goal**: The security badge appears below the form submit button, and every CTA button on the page has distinct progressive copy matching its scroll position.
**Depends on**: Phase 11 (backend schema must be updated before removing gastoMensal from the frontend), Phase 13 (sections must be stable before CTA text is finalized)
**Requirements**: FORM-02, FORM-03, FORM-04, CTA-01, CTA-02, CTA-03
**Success Criteria** (what must be TRUE):
  1. The lead form renders exactly 3 visible fields (nome, email, whatsapp)
  2. The text "Preencha o formulario e entraremos em contato em ate 24h pelo WhatsApp" appears in the form section
  3. A "Seus dados estao seguros" badge with a lock icon appears directly below the submit button, outside the UForm component
  4. The hero CTA reads "Quero comecar agora", the mid-page CTA reads "Quero entender melhor", and the final CTA reads "Quero entrar na mentoria"
  5. The form submit button reads "Quero comecar minha mentoria"
**Plans**: 1 plan

Plans:
- [x] 14-01-PLAN.md — Security badge + progressive CTA copy + submit button text

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | v1.0 | 3/3 | Complete | 2026-03-21 |
| 2. Display Sections | v1.0 | 3/3 | Complete | 2026-03-21 |
| 3. Lead Form & Conversion | v1.0 | 1/1 | Complete | 2026-03-21 |
| 4. Visual Overhaul & Navigation | v1.1 | 3/3 | Complete | 2026-03-21 |
| 5. Form Polish & Footer | v1.1 | 1/1 | Complete | 2026-03-21 |
| 6. Content & Layout Polish | v1.2 | 2/2 | Complete | 2026-03-21 |
| 7. Content Overhaul | v1.3 | 3/3 | Complete | 2026-03-22 |
| 8. New Sections | v1.3 | 2/2 | Complete | 2026-03-22 |
| 9. Logo, Accents & Form Redesign | v1.4 | 2/2 | Complete | 2026-03-22 |
| 10. Footer & Instagram | v1.4 | 1/1 | Complete | 2026-03-22 |
| 11. Backend Schema Cleanup | v1.5 | 1/1 | Complete    | 2026-03-24 |
| 12. Copy Rewrite & Identity Sweep | v1.5 | 2/2 | Complete    | 2026-03-24 |
| 13. Structural Template Changes | v1.5 | 2/2 | Complete    | 2026-03-24 |
| 14. Form Frontend & CTA Pass | v1.5 | 1/1 | Complete   | 2026-03-24 |

---
*Roadmap created: 2026-03-21*
*Last updated: 2026-03-24 — Phase 14 planned (1 plan)*
