---
phase: 04-visual-overhaul-navigation
plan: 02
subsystem: sections
tags: [bento-grid, accessibility, wcag, social-proof, company-section]
dependency_graph:
  requires: []
  provides: [SectionAbout, SectionSocialProof-cleaned, SectionFAQ-wcag]
  affects: [app.vue, page layout]
tech_stack:
  added: []
  patterns:
    - Bento grid with md:col-span-2 hero card + three equal-billing 1x1 value prop cards
    - UAccordion #content slot override for WCAG AA text contrast compliance
key_files:
  created:
    - app/components/Section/SectionAbout.vue
  modified:
    - app/components/Section/SectionSocialProof.vue
    - app/components/Section/SectionFAQ.vue
decisions:
  - SectionAbout uses icons-only (i-heroicons-*) — no R2 images needed per D-21
  - Renda Extra card uses color-brand-cta (orange) icon to visually differentiate while maintaining equal card size
  - mb-12 removed from testimonial grid after comprovante block removal (no content below grid)
metrics:
  duration: 6 min
  completed_date: "2026-03-21"
  tasks: 3
  files: 3
---

# Phase 04 Plan 02: SectionAbout, SocialProof Cleanup, FAQ Contrast Summary

**One-liner:** Company bento grid section replacing personal bio, comprovante screenshot removed from social proof, FAQ text WCAG AA compliant via UAccordion content slot override.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create SectionAbout with bento grid value props | 2f54354 | app/components/Section/SectionAbout.vue |
| 2 | Remove comprovante screenshot from SectionSocialProof | 74b5560 | app/components/Section/SectionSocialProof.vue |
| 3 | Fix FAQ text contrast for WCAG AA compliance | 872b03f | app/components/Section/SectionFAQ.vue |

## What Was Built

### SectionAbout.vue (new)

Company-focused "Sobre a Fly Up Milhas" section with bento grid layout:
- Hero card (2 columns wide, navy background) with company tagline and mission copy
- Three equal-billing 1x1 white value prop cards: Viagens Executivas, Economia Familiar, Renda Extra com Milhas
- All cards use `rounded-xl` per D-08
- Section anchor id is `sobre` (not `especialista`) per D-24
- No personal photo or bio (company focus per D-18, D-19)
- Icons from `i-heroicons-*` only (only installed set)
- CTA button uses `useScroll()` composable to scroll to `formulario`
- SectionExpert.vue preserved in repo as reference

### SectionSocialProof.vue (cleaned)

Removed the entire "Comprovante de resultado" block per D-25:
- Removed `<p>` with "Comprovante de resultado" label
- Removed `<NuxtImg>` with `resultado-placeholder.webp` source
- Removed `useRuntimeConfig()` and `r2Base` refs (no longer used in this component)
- Removed `mb-12` from testimonial grid (no content below it now)
- Both testimonial cards unchanged per D-26

### SectionFAQ.vue (contrast fix)

WCAG AA compliance fix for accordion content text per D-03 and VISL-03:
- Replaced plain `<UAccordion :items="faqItems" />` with slotted version
- `#content` slot template overrides default muted gray with `text-[var(--color-brand-text)]` (#1a1a1a)
- Contrast ratio: 16.5:1 (far exceeds WCAG AA minimum 4.5:1)
- `faqItems` array, section heading, section layout unchanged

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

## Known Stubs

- SectionAbout hero card copy: `<!-- TODO: replace with final copy from Marcio -->` — placeholder company description in the navy hero card. Content pending Marcio's input.
- All three value prop card texts are finalized in structure but use placeholder descriptive copy (not client-provided content).
- Note: stubs do NOT prevent the plan's goal from being achieved — the section renders correctly with placeholder copy; copy replacement is a content task, not a code task.

## Self-Check: PASSED

- [x] `app/components/Section/SectionAbout.vue` — EXISTS
- [x] `app/components/Section/SectionExpert.vue` — EXISTS (preserved)
- [x] Commits 2f54354, 74b5560, 872b03f — all present in git log
- [x] "Comprovante de resultado" — absent from SectionSocialProof.vue
- [x] `color-brand-text` — present in SectionFAQ.vue content slot
- [x] All three value props (Viagens Executivas, Economia Familiar, Renda Extra com Milhas) — present in SectionAbout.vue
