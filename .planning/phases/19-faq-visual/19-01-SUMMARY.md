---
phase: 19-faq-visual
plan: "01"
subsystem: SectionFAQ
tags: [faq, accordion, visual-hierarchy, accessibility, keyboard-nav]
dependency_graph:
  requires: []
  provides: [FAQ-01, FAQ-02, FAQ-03]
  affects: [app/components/Section/SectionFAQ.vue]
tech_stack:
  added: []
  patterns:
    - UAccordion :ui prop with explicit focus-visible ring classes
    - Zero-padded index display with String.padStart(2, '0')
    - Chevron rotation via group-data-[state=open]:rotate-180
key_files:
  modified:
    - app/components/Section/SectionFAQ.vue
decisions:
  - "Kept var() token syntax over canonical shorthand — matches plan spec and existing component patterns site-wide"
  - "UAccordion :ui replaces default classes entirely — focus ring must be explicit"
metrics:
  duration: 61s
  completed: "2026-03-25"
  tasks: 2
  files: 1
---

# Phase 19 Plan 01: FAQ Visual Redesign Summary

**One-liner:** Numbered white cards (01-06) with font-semibold questions, muted answers, rotating chevron, and explicit keyboard focus ring via UAccordion :ui prop.

## What Was Built

Rewrote `SectionFAQ.vue` template to transform the plain accordion into a numbered card layout. Each FAQ item now renders as a visually distinct white card with:

- Zero-padded number (01-06) in brand-primary blue left of the question
- Question text: font-semibold text-base in brand-text color
- Answer text: text-sm in brand-text-muted, indented (pl-14) to align past the number column
- Chevron icon rotating 180deg on open state using `group-data-[state=open]:rotate-180`
- `space-y-3` wrapper for 12px gaps between cards
- Explicit `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-primary)]` in the UAccordion `:ui` trigger class string (prevents silent focus ring removal since :ui replaces not merges)

Script setup (faqItems array) unchanged.

## Tasks

| # | Name | Status | Commit |
|---|------|--------|--------|
| 1 | Redesign SectionFAQ with numbered cards and visual hierarchy | Done | a79ce48 |
| 2 | Verify FAQ visual design and keyboard accessibility | Auto-approved | — |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. All 6 FAQ items display real content wired directly from the faqItems array.

## Self-Check: PASSED

- SectionFAQ.vue: FOUND
- Commit a79ce48: FOUND
