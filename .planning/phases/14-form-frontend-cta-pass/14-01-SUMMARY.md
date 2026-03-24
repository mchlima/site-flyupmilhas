---
phase: 14-form-frontend-cta-pass
plan: "01"
subsystem: frontend-components
tags: [cta-copy, lead-form, trust-signals, conversion]
dependency_graph:
  requires: []
  provides: [progressive-cta-copy, security-badge]
  affects: [SectionProgramContent, SectionPrice, SectionLeadForm]
tech_stack:
  added: []
  patterns: [UIcon for inline icon, security badge outside UForm]
key_files:
  created: []
  modified:
    - app/components/Section/SectionProgramContent.vue
    - app/components/Section/SectionPrice.vue
    - app/components/Section/SectionLeadForm.vue
decisions:
  - Security badge placed outside UForm (UForm expects UFormField children only)
  - Progressive CTA copy per scroll position: mid='Quero entender melhor', final='Quero entrar na mentoria', form='Quero comecar minha mentoria'
metrics:
  duration: 58s
  completed: "2026-03-24"
  tasks: 2
  files: 3
---

# Phase 14 Plan 01: CTA Copy Update and Security Badge Summary

**One-liner:** Progressive CTA copy (3 distinct scroll-position texts) and trust-signal security badge with lock icon placed outside UForm below submit button.

## What Was Built

Three Vue component modifications implementing the v1.5 CTA copy strategy:

1. **SectionProgramContent.vue** — Mid-page CTA changed from generic "Quero dar o primeiro passo" to intent-matched "Quero entender melhor"
2. **SectionPrice.vue** — Pricing CTA changed to conversion-focused "Quero entrar na mentoria"
3. **SectionLeadForm.vue** — Two changes:
   - Submit button text changed to "Quero comecar minha mentoria"
   - Security badge `<div>` with `i-heroicons-lock-closed` icon and "Seus dados estao seguros" text added as a sibling of `<UForm>`, after the closing `</UForm>` tag

## Requirements Verified

| Requirement | Status | Notes |
|-------------|--------|-------|
| FORM-02 | Verify-only (no change needed) | objetivo field already removed in Phase 11 — form has exactly 3 fields |
| FORM-03 | Verify-only (no change needed) | Form subtitle "Preencha o formulario..." already present from Phase 12 |
| FORM-04 | DONE | Security badge with lock icon below submit button, outside UForm |
| CTA-01 | Verify-only (no change needed) | Hero CTA "Quero comecar agora" confirmed intact |
| CTA-02 | DONE | ProgramContent CTA reads "Quero entender melhor" |
| CTA-03 | DONE | Price CTA reads "Quero entrar na mentoria" |

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | a4c11fd | feat(14-01): update CTA text — ProgramContent and Price sections |
| Task 2 | 9d4d548 | feat(14-01): update form submit text and add security badge |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all 3 CTA changes are wired to real button elements with proper scroll handlers and form submission logic.

## Self-Check: PASSED

- `grep "Quero entender melhor" SectionProgramContent.vue` → 1 match (line 33)
- `grep "Quero entrar na mentoria" SectionPrice.vue` → 1 match (line 49)
- `grep "Quero comecar minha mentoria" SectionLeadForm.vue` → 1 match (line 163)
- `grep "Seus dados" SectionLeadForm.vue` → 1 match (line 170)
- `grep "lock-closed" SectionLeadForm.vue` → 1 match (line 169)
- `grep "Quero dar o primeiro passo"` in all 3 files → 0 matches
- Security badge at line 167-171, after `</UForm>` (line 165), before WhatsApp CTA (line 173)
- Hero CTA "Quero começar agora" confirmed intact (line 45 of SectionHero.vue)
- Form subtitle "Preencha o formulário..." confirmed intact (line 54 of SectionLeadForm.vue)
- Commits a4c11fd and 9d4d548 confirmed in git log
