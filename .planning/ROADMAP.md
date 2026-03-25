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

<details>
<summary>✅ v1.5 Refinamento de Copy e Conversao (Phases 11-14) — SHIPPED 2026-03-24</summary>

- [x] Phase 11: Backend Schema Cleanup (1/1 plans) — completed 2026-03-24
- [x] Phase 12: Copy Rewrite & Identity Sweep (2/2 plans) — completed 2026-03-24
- [x] Phase 13: Structural Template Changes (2/2 plans) — completed 2026-03-24
- [x] Phase 14: Form Frontend & CTA Pass (1/1 plans) — completed 2026-03-24

Full details: `.planning/milestones/v1.5-ROADMAP.md`

</details>

---

## v1.6 Upgrade de Identidade Visual

### Phases

- [x] **Phase 15: Paleta e Gradientes** — Nova paleta azul vibrante + CTA cyan + gradientes sutis aplicados em toda a LP (completed 2026-03-25)
- [x] **Phase 16: Tipografia** — Plus Jakarta Sans substitui Inter com CLS verificado em preview build (gap closure in progress) (completed 2026-03-25)
- [x] **Phase 17: SectionGuarantee** — Nova secao dedicada de garantia 7 dias com selo dourado inserida no fluxo de conversao (completed 2026-03-25)
- [x] **Phase 18: Avatares nos Depoimentos** — Fotos circulares e fallback de iniciais integrados ao layout de chat bubble (completed 2026-03-25)
- [x] **Phase 19: FAQ Visual** — FAQ redesenhado com cards numerados, hierarquia visual e acessibilidade preservada (completed 2026-03-25)

### Phase Details

#### Phase 15: Paleta e Gradientes
**Goal**: Toda a LP exibe a nova identidade visual premium — azul vibrante, CTA cyan, fundo levemente azulado e gradientes sutis de aviacao
**Depends on**: Nothing (first phase of milestone)
**Requirements**: PAL-01, PAL-02, PAL-03, PAL-04
**Success Criteria** (what must be TRUE):
  1. O azul principal visivel em todos os headers, backgrounds de secao e elementos de marca e #1D4ED8 (ou equivalente no `@theme {}`) — o navy abafado #1a3a5c nao aparece em nenhum lugar
  2. Todos os botoes de CTA exibem a cor cyan #06B6D4 (ou equivalente aprovado) — o laranja #e67e22 nao aparece em nenhum botao
  3. Hero, SectionPrice e SectionGuarantee exibem gradientes sutis em tons de azul — sem cores genericas arco-iris
  4. Qualquer texto sobre fundo azul ou cyan passa WCAG AA (4.5:1 minimo para texto normal) verificado no WebAIM contrast checker
**Plans**: 1 plan
Plans:
- [x] 15-01-PLAN.md — Token swap + gradient utilities + component updates

#### Phase 16: Tipografia
**Goal**: A LP exibe Plus Jakarta Sans em toda a hierarquia tipografica, com CLS < 0.1 confirmado em preview build
**Depends on**: Phase 15
**Requirements**: TIPO-01, TIPO-02, TIPO-03
**Success Criteria** (what must be TRUE):
  1. A fonte carregada no browser para headings e body text e Plus Jakarta Sans — Inter nao aparece no painel Network como download ativo
  2. Headings (h1, h2, h3) usam peso e tamanho visivelmente mais impactantes que o layout anterior — a hierarquia e legivel sem esforco em mobile
  3. Lighthouse CLS score e < 0.1 em `nuxt preview` (nao dev server) — sem layout shift visivelmente detectavel durante carregamento
**Plans**: 2 plans
Plans:
- [x] 16-01-PLAN.md — Font swap (Plus Jakarta Sans) + heading hierarchy
- [x] 16-02-PLAN.md — Gap closure: harden font config (global:true, processCSSVariables:true) + build verification

#### Phase 17: SectionGuarantee
**Goal**: Uma secao dedicada de garantia 7 dias esta inserida entre SectionPrice e SectionFAQ, visivel no fluxo de decisao de compra
**Depends on**: Phase 15
**Requirements**: GAR-01, GAR-02, GAR-03
**Success Criteria** (what must be TRUE):
  1. Ao scrollar a pagina, o visitante encontra uma secao com o selo dourado (PNG existente) antes de chegar ao FAQ — a garantia nao e apenas um footnote no preco
  2. O copy da secao comunica claramente "7 dias, 100% do valor devolvido" sem ambiguidade
  3. A secao esta posicionada imediatamente apos SectionPrice (acima do FAQ) confirmado pela ordem em `app.vue`
**Plans**: 1 plan
Plans:
- [x] 17-01-PLAN.md — SectionGuarantee component + app.vue wiring + SectionPrice cleanup

#### Phase 18: Avatares nos Depoimentos
**Goal**: Cada depoimento WhatsApp exibe uma foto circular ou avatar com iniciais, tornando os testimonials visivelmente mais credíveis
**Depends on**: Phase 15
**Requirements**: DEP-01, DEP-02, DEP-03
**Success Criteria** (what must be TRUE):
  1. Cada chat bubble de depoimento tem um avatar circular visivel — um circulo com iniciais coloridas ou foto real da pessoa
  2. Quando nenhuma foto esta disponivel, o avatar exibe as iniciais do nome com cor de fundo deterministica — nao exibe broken image ou espaco vazio
  3. O layout do chat bubble com avatar integrado e legivel e bem proporcionado em mobile 375px — o avatar nao empurra o texto para fora da area util
**Plans**: 1 plan
Plans:
- [x] 18-01-PLAN.md — Avatar data model + photo imports + chat bubble layout integration

#### Phase 19: FAQ Visual
**Goal**: O FAQ exibe um design premium com cards numerados e hierarquia visual clara, mantendo navegacao por teclado funcional
**Depends on**: Phase 15, Phase 16
**Requirements**: FAQ-01, FAQ-02, FAQ-03
**Success Criteria** (what must be TRUE):
  1. Cada item do FAQ e visualmente distinguivel como um card individual — numeracao ou icone identifica a ordem; o design nao parece um accordion generico
  2. A pergunta e a resposta tem hierarquia visual clara — a pergunta e mais proeminente (peso, tamanho ou cor) que o texto da resposta
  3. Navegacao por teclado funciona: Tab move o foco entre triggers, Enter/Space abre e fecha, cada trigger ativo exibe focus ring visivel
**Plans**: 1 plan
Plans:
- [x] 19-01-PLAN.md — Numbered card redesign + visual hierarchy + focus ring accessibility

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
| 11. Backend Schema Cleanup | v1.5 | 1/1 | Complete | 2026-03-24 |
| 12. Copy Rewrite & Identity Sweep | v1.5 | 2/2 | Complete | 2026-03-24 |
| 13. Structural Template Changes | v1.5 | 2/2 | Complete | 2026-03-24 |
| 14. Form Frontend & CTA Pass | v1.5 | 1/1 | Complete | 2026-03-24 |
| 15. Paleta e Gradientes | v1.6 | 1/1 | Complete | 2026-03-25 |
| 16. Tipografia | v1.6 | 2/2 | Complete    | 2026-03-25 |
| 17. SectionGuarantee | v1.6 | 1/1 | Complete    | 2026-03-25 |
| 18. Avatares nos Depoimentos | v1.6 | 1/1 | Complete    | 2026-03-25 |
| 19. FAQ Visual | v1.6 | 1/1 | Complete   | 2026-03-25 |

---
*Roadmap created: 2026-03-21*
*Last updated: 2026-03-25 — Phase 17 planned (1 plan)*
