---
phase: 07-content-overhaul
plan: 02
subsystem: sections
tags: [copy, mentoria, content-overhaul, SectionMethod, SectionPrice, SectionAbout]
dependency_graph:
  requires: []
  provides: [encounter-based-method-section, price-benefits-no-price, mentoria-about-copy]
  affects: [app/components/Section/SectionMethod.vue, app/components/Section/SectionPrice.vue, app/components/Section/SectionAbout.vue]
tech_stack:
  added: []
  patterns: [v-for benefits list, conditional class binding bento grid]
key_files:
  created: []
  modified:
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionAbout.vue
decisions:
  - "Benefits list replaces price display in SectionPrice — aligns with variable pricing model from old site (condições especiais)"
  - "Hero card copy sourced verbatim from docs/OLD_SITE_CONTENT.md section 2 — preserves Marcio's authentic voice"
  - "Format subtexto added below bento grid in SectionMethod — communicates quinzenal cadence without restructuring layout"
metrics:
  duration: "~4 min"
  completed_date: "2026-03-21"
  tasks: 2
  files: 3
---

# Phase 07 Plan 02: SectionMethod + SectionPrice + SectionAbout Content Overhaul Summary

**One-liner:** Rewrote 3 content sections to describe the real mentorship format — encounter-based steps, benefits list without price, and mentoria hero copy from old site.

---

## What Was Built

### Task 1 — SectionMethod: Encounter-Based Steps + Format Subtexto (commit: 6bd5b4d)

Replaced the generic Diagnostico/Estrategia/Execucao steps with the 4 actual mentorship milestones:
- Primeiro Encontro: diagnostico completo + inicio da estrategia
- Segundo Encontro: aprofundamento + acompanhamento
- Terceiro Encontro: revisao dos resultados + ajustes finais
- Autonomia: conhecimento para agir sozinho (navy card variant, unchanged)

Updated subtitle from "4 passos para voar em executiva" to "Sua jornada na mentoria Fly Up Milhas".

Added format subtexto below the grid describing: quinzenal cadence, Google Meet, WhatsApp support, and materials.

The bento grid v-for, conditional :class for step 04 navy variant, and all class bindings were preserved unchanged.

### Task 2 — SectionPrice: Benefits List Without Price (commit: d638d3a)

Replaced entire price display block (R$200, R$3.000 anchor, pagamento unico clarification) with:
- Pre-heading changed from "Investimento" to "Comece sua jornada"
- Vertical list of 5 benefits using check-circle icons (check-circle Heroicons)
- "Condicoes especiais disponiveis" note below the list
- CTA updated from "Quero minha Consultoria" to "Quero dar o primeiro passo"
- Navy background preserved, scrollTo('formulario') preserved

### Task 2 — SectionAbout: Mentoria Hero Card Copy (commit: d638d3a)

Replaced TODO placeholder copy in the hero card with verbatim copy from docs/OLD_SITE_CONTENT.md section 2:
"A Fly Up Milhas e uma mentoria criada para quem quer aprender do zero ou organizar o que ja faz..."

CTA updated from "Quero minha Consultoria" to "Quero dar o primeiro passo".

The 3 value prop cards (Viagens Executivas, Economia Familiar, Renda Extra com Milhas) were preserved unchanged.

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Benefits list replaces price display | Variable pricing model from old site (condições especiais); hiding price reduces friction and aligns with Marcio's real offer format |
| Hero card copy verbatim from OLD_SITE_CONTENT.md | Preserves Marcio's authentic voice without paraphrasing |
| Format subtexto below bento grid | Communicates cadence without restructuring the existing layout |

---

## Known Stubs

None — all copy changes are intentional final content from the product brief and old site.

---

## Self-Check: PASSED

Files exist:
- app/components/Section/SectionMethod.vue: FOUND
- app/components/Section/SectionPrice.vue: FOUND
- app/components/Section/SectionAbout.vue: FOUND

Commits exist:
- 6bd5b4d: FOUND (SectionMethod rewrite)
- d638d3a: FOUND (SectionPrice + SectionAbout rewrite)

Verification:
- "consultoria" occurrences in all 3 files: 0
- R$200 in SectionPrice: 0
- 4 encounter steps in SectionMethod: PASS
- "Quero dar o primeiro passo" in Price + About: PASS
