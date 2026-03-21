---
phase: 05-form-polish-footer
plan: 01
subsystem: frontend-ui
tags: [form, footer, visual-polish, navy-card, responsive]
dependency_graph:
  requires: []
  provides: [form-navy-card, footer-credit, footer-whatsapp]
  affects: [SectionLeadForm, AppFooter, app.vue]
tech_stack:
  added: []
  patterns: [navy-card-wrapper, plain-button-over-UButton, template-label-slot, inline-svg-icon]
key_files:
  created: []
  modified:
    - app/components/Section/SectionLeadForm.vue
    - app/components/App/AppFooter.vue
    - app/app.vue
decisions:
  - "Plain button over UButton for submit preserves exact centering without Nuxt UI internal style interference"
  - "template #label slot used on UFormField to inject text-white without breaking Nuxt UI label rendering"
  - "section#formulario background changed to bg-transparent; navy card provides its own visual container"
  - "Footer uses same navy bg as header, creating visual bookend framing"
metrics:
  duration: 8m
  completed: "2026-03-21T08:16:00Z"
  tasks: 2
  files_modified: 3
requirements:
  - FORM-01
  - FORM-02
  - FOOT-01
---

# Phase 05 Plan 01: Form Polish and Footer Summary

**One-liner:** Navy card wrapper on lead form with white text and centered button, plus navy footer with Agencia 201 credit and WhatsApp contact link.

## What Was Built

### Task 1: Form navy card wrapper, spacing fix, and button centering
**Commit:** `0c15b7e`

- Wrapped entire form content (heading + form/success state) in `bg-[var(--color-brand-primary)] rounded-xl p-8 sm:p-10` card
- Changed `max-w-xl mx-auto` outer div to remove `px-4 py-12` (padding now from card + outer section)
- h2 heading changed from `text-[var(--color-brand-primary)]` to `text-white`
- Subtitle paragraph changed to `text-white/80`
- Used `<template #label>` slots on all four UFormField elements to inject `text-white` labels
- Field gap increased from `space-y-4` to `space-y-6` (16px to 24px)
- Replaced UButton with plain `<button>` using `flex items-center justify-center` for guaranteed text centering
- Loading state shows "Enviando..." text instead of spinner
- Success state icon changed to `text-green-400`, text to `text-white`/`text-white/80`
- WhatsApp CTA links (success state + below form) changed to `border-white/30 text-white hover:bg-white/10`
- Error banner changed to `bg-red-500/20 border-red-400/30 text-red-200` for navy background visibility
- `app.vue` section#formulario changed from `bg-[var(--color-brand-bg)]` to `bg-transparent`

### Task 2: Footer redesign with Agencia 201 credit and WhatsApp link
**Commit:** `5e24563`

- Full rewrite of AppFooter.vue (5 lines → 25 lines)
- Navy background (`bg-[var(--color-brand-primary)]`) matching AppHeader visual language
- Inner container: `max-w-6xl mx-auto px-6 py-8`
- Two-column desktop layout: `flex flex-col md:flex-row md:justify-between md:items-center gap-4`
- Left column: copyright line + "Desenvolvido por Agencia 201" link (opens in new tab)
- Right column: WhatsApp link with inline SVG icon (same path data as SectionLeadForm)
- Mobile: stacked + centered (`text-center md:text-left` on left column)
- Both external links include `target="_blank" rel="noopener noreferrer"` for security

## Verification

- `pnpm run build` passes with zero errors (verified twice — after each task)
- Navy card: 1 match for `bg-[var(--color-brand-primary)]` in SectionLeadForm.vue
- Field gap: 1 match for `space-y-6` in SectionLeadForm.vue
- White text: 11 matches for `text-white` in SectionLeadForm.vue
- Centered button: 3 matches for `justify-center` in SectionLeadForm.vue
- No remaining `space-y-4` in SectionLeadForm.vue
- `bg-transparent` confirmed in app.vue formulario section
- Footer: navy bg, two-column layout, Agencia 201 link, WhatsApp link all verified via grep

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Plain button over UButton for submit | UButton applies its own internal padding and layout via Reka UI; a plain button with explicit flex classes guarantees text centering without overrides |
| template #label slot for UFormField | UFormField renders label via slot; `class` on UFormField itself doesn't cascade to label text; slot injection is the correct Nuxt UI v4 pattern |
| bg-transparent on section#formulario | Navy card is now the visual container; off-white bg on the outer section would bleed around the rounded card corners |
| Footer navy bg as visual bookend | Header and footer both navy creates a consistent frame; the white/off-white body content sits between two navy blocks |

## Deviations from Plan

None — plan executed exactly as written. All 10 sub-actions for Task 1 and 7 sub-actions for Task 2 implemented as specified.

## Known Stubs

| Stub | File | Detail |
|------|------|--------|
| WhatsApp number | `app/components/Section/SectionLeadForm.vue` line 5 | `55XXXXXXXXXXX` placeholder — Marcio's real number needed before launch |
| WhatsApp number | `app/components/App/AppFooter.vue` line 13 | Same placeholder in footer link |
| Agencia 201 URL | `app/components/App/AppFooter.vue` line 8 | `https://agencia201.com.br` — TODO comment to confirm URL |

These stubs do not prevent the plan's goal (visual polish). The WhatsApp number stub is pre-existing and tracked in STATE.md open items.

## Self-Check: PASSED

- [x] `app/components/Section/SectionLeadForm.vue` exists and contains navy card, space-y-6, text-white
- [x] `app/components/App/AppFooter.vue` exists and contains Agencia 201, wa.me, md:flex-row
- [x] `app/app.vue` contains `bg-transparent` on formulario section
- [x] Commit `0c15b7e` exists (Task 1)
- [x] Commit `5e24563` exists (Task 2)
- [x] Build passes with zero errors
