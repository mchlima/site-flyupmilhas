---
phase: 12-copy-rewrite-identity-sweep
plan: "02"
subsystem: frontend-copy
tags: [copy, method, faq, identity-sweep, sectionmethod, sectionfaq, sectionleadform]
dependency_graph:
  requires: []
  provides: [METH-01, METH-02, FAQ-01, IDEN-01]
  affects: [SectionMethod.vue, SectionFAQ.vue, SectionLeadForm.vue]
tech_stack:
  added: []
  patterns: [inline-data-array-rewrite, info-bar-flex-layout]
key_files:
  created: []
  modified:
    - app/components/Section/SectionMethod.vue
    - app/components/Section/SectionFAQ.vue
    - app/components/Section/SectionLeadForm.vue
decisions:
  - "Method info bar uses flex-wrap with 3 stat items (30 dias, 3 encontros/mês, Suporte via WhatsApp) between subtitle and steps grid"
  - "Method subtitle updated to emphasize 30-day outcome, not journey framing"
  - "FAQ expanded from 5 to 6 questions; price (R$ 299,90), guarantee (7 dias), and payment flow now explicitly covered"
  - "SectionLeadForm subtitle changed to brand-neutral 'entraremos em contato' (no personal name)"
  - "WhatsApp URL text changed from 'Ola%20Marcio%2C' to 'Ola%2C' — brand-neutral greeting"
  - "AppFooter TODO comment retains 'Marcio' (acceptable — not rendered text per D-26)"
metrics:
  duration: "2 minutes"
  completed_date: "2026-03-24"
  tasks: 3
  files_modified: 3
---

# Phase 12 Plan 02: Method, FAQ & Identity Sweep Summary

Enriched SectionMethod with visible info bar (30 dias, 3 encontros/mês, Suporte via WhatsApp) and transformation-focused step descriptions; rewrote SectionFAQ with 6 beginner-targeted Q&As including price, guarantee, and payment flow; swept all "Marcio" references from SectionLeadForm rendered text and WhatsApp URL.

## What Was Built

### Task 1: SectionMethod copy enrichment (METH-01, METH-02)

- Added visible info bar between subtitle and steps grid with 3 stat items: "30 dias / Duração", "3 encontros/mês / Dias a combinar", "Suporte via WhatsApp / Sim, incluso"
- Updated subtitle from "Sua jornada na mentoria Fly Up Milhas" to "Em 30 dias, você sai com uma estratégia pronta para economizar de verdade nas suas viagens."
- Rewrote all 4 step descriptions to convey transformation and opportunity (per client: "quero vender transformação e visão de oportunidade")
- Updated footer text: removed "quinzenais" (biweekly) — now reads "suporte contínuo via WhatsApp" consistent with 3/month frequency
- All icons, conditional class bindings (step.number === '04'), and bento grid layout preserved

### Task 2: SectionFAQ rewrite (FAQ-01)

- Replaced 5 generic questions with 6 beginner-focused Q&As targeting: price, starting from zero, card requirements, timeline, guarantee, payment flow
- Guarantee (7 dias, reembolso total) explicitly mentioned in two questions
- "nossa equipe" used throughout — zero personal name references
- Removed TODO comment "replace with real Q&A from Marcio"
- UAccordion component, :ui prop, and template slots preserved unchanged

### Task 3: SectionLeadForm identity sweep (IDEN-01)

- Subtitle changed from "Preencha e Marcio entra em contato..." to "Preencha o formulário e entraremos em contato em até 24h pelo WhatsApp."
- WhatsApp URL text changed from `Ola%20Marcio%2C%20quero%20saber%20mais...` to `Ola%2C%20quero%20saber%20mais...`
- TODO comment updated: "Marcio's real WhatsApp number" → "real WhatsApp number"
- All form fields, validation schema, honeypot, submit handler, and WhatsApp CTA button preserved

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 24984a2 | feat(12-02): enrich SectionMethod copy — info bar, step descriptions, subtitle |
| 2 | 29f7078 | feat(12-02): rewrite SectionFAQ with beginner-focused Q&A (FAQ-01) |
| 3 | 158347a | feat(12-02): identity sweep — remove Marcio from SectionLeadForm (IDEN-01) |

## Deviations from Plan

None — plan executed exactly as written.

## Identity Sweep Results

Final grep across all rendered (wired) sections:

| Component | Marcio/Márcio count |
|-----------|---------------------|
| SectionHero.vue | 0 |
| SectionAbout.vue | 0 |
| SectionMethod.vue | 0 |
| SectionFAQ.vue | 0 |
| SectionLeadForm.vue | 0 |
| AppHeader.vue | 0 |
| AppFooter.vue | 1 (TODO comment only — not rendered text, acceptable per D-26) |

SectionSocialProof.vue excluded (Phase 13 scope). SectionExpert.vue excluded (dead code, not wired in app.vue per D-25).

## Known Stubs

None. All data is wired. The 55XXXXXXXXXXX WhatsApp number placeholder is a pre-launch blocker tracked in STATE.md, not a stub in the component rendering sense.

## Self-Check: PASSED

Files exist:
- app/components/Section/SectionMethod.vue — FOUND
- app/components/Section/SectionFAQ.vue — FOUND
- app/components/Section/SectionLeadForm.vue — FOUND

Commits exist:
- 24984a2 — FOUND
- 29f7078 — FOUND
- 158347a — FOUND
