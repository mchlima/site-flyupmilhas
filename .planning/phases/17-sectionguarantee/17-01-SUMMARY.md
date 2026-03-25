---
phase: 17-sectionguarantee
plan: "01"
subsystem: landing-page-sections
tags: [guarantee, trust-signal, conversion, dark-section, component]
dependency_graph:
  requires: [Phase 15 design tokens, Phase 16 typography, selo-garantia7-dias.png]
  provides: [SectionGuarantee.vue, guarantee section in page flow]
  affects: [app.vue page flow, SectionPrice inline guarantee]
tech_stack:
  added: []
  patterns: [pure-display SFC, gradient-form dark background, plain img tag for local assets]
key_files:
  created:
    - app/components/Section/SectionGuarantee.vue
  modified:
    - app/app.vue
    - app/components/Section/SectionPrice.vue
decisions:
  - "Plain img tag (not NuxtImg) for selo-garantia7-dias.png — local asset in app/assets/img, no R2 required"
  - "gradient-form utility reused from lead form section — provides matching dark tone that hides PNG black corners"
  - "SectionPrice inline guarantee kept as one-liner — immediate reassurance adjacent to price without duplicating full copy"
metrics:
  duration: 126s
  tasks: 2
  files: 3
  completed_date: "2026-03-25"
requirements: [GAR-01, GAR-02, GAR-03]
---

# Phase 17 Plan 01: SectionGuarantee Summary

## One-liner

Dedicated dark-gradient guarantee section with golden 7-day seal PNG inserted between price and FAQ, with SectionPrice inline guarantee reduced to one-liner.

## What Was Built

Created `SectionGuarantee.vue` as a pure-display SFC (no script block) featuring:
- `gradient-form` dark background (same utility as lead form section — hides PNG black corners naturally)
- `selo-garantia7-dias.png` at 192px mobile / 256px desktop via plain `<img>` tag
- Responsive split layout: stacked (mobile) → side-by-side (md+)
- Trust copy: headline "Sua tranquilidade é nossa prioridade", body paragraph with 7 days / 100% money-back / no questions language, reinforcement line "7 dias — 100% devolvido"

Wired into `app.vue` immediately after `<SectionPrice />` and before `<SectionFAQ />`.

Reduced SectionPrice inline guarantee from a two-line block (title + description paragraph) to a single line (shield icon + "Garantia incondicional de 7 dias") to eliminate content duplication.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create SectionGuarantee.vue | 5a8fe46 | app/components/Section/SectionGuarantee.vue |
| 2 | Wire into app.vue + reduce SectionPrice | 86ae3ab | app/app.vue, app/components/Section/SectionPrice.vue |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Plain `<img>` not `<NuxtImg>` for seal | Local asset in app/assets/img; Cloudflare Image Transformations not confirmed; NuxtImg would not optimize without it |
| Reuse `gradient-form` utility | Same gradient (#0F172A → #1E3A8A) used by lead form section; dark enough to hide seal PNG black corners without any masking |
| Keep SectionPrice one-liner | Immediate reassurance adjacent to price card is a conversion pattern; removing entirely would weaken the pricing section before the user scrolls down |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — SectionGuarantee renders the real seal image from assets and uses copy constants from STATE.md.

## Self-Check: PASSED

Files created/exist:
- app/components/Section/SectionGuarantee.vue: FOUND
- app/app.vue: FOUND (SectionGuarantee wired)
- app/components/Section/SectionPrice.vue: FOUND (one-liner applied)

Commits verified:
- 5a8fe46 feat(17-01): create SectionGuarantee.vue
- 86ae3ab feat(17-01): wire SectionGuarantee in app.vue and reduce SectionPrice inline guarantee

Production build: PASSED (✨ Build complete!)
