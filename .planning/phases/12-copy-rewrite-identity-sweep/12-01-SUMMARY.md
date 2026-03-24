---
phase: 12-copy-rewrite-identity-sweep
plan: "01"
subsystem: frontend-copy
tags: [hero, about, copy-rewrite, conversion]
dependency_graph:
  requires: []
  provides: [hero-copy-v2, about-copy-v2]
  affects: [SectionHero.vue, SectionAbout.vue]
tech_stack:
  added: []
  patterns: [inline-copy-in-template, UIcon-heroicons, useScroll-composable]
key_files:
  created: []
  modified:
    - app/components/Section/SectionHero.vue
    - app/components/Section/SectionAbout.vue
decisions:
  - "Hero CTA changed to 'Quero começar agora' per client PDF (D-03); About CTA stays 'Quero dar o primeiro passo' until Phase 14"
  - "Microcopy placed below CTA button as plain <p> with text-white/60 — minimal styling keeps focus on CTA"
  - "Social proof phrase in About uses bg-[var(--color-brand-primary)]/5 highlight block for visual distinctness without secondary color"
  - "Old bento grid (hero card + 2 value cards) fully replaced by title/body/proof/3-cards structure"
metrics:
  duration: "71 seconds"
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_modified: 2
---

# Phase 12 Plan 01: Hero and About Copy Rewrite Summary

Hero and About sections rewritten with exact client-approved copy from PDF: new headline claiming 80% savings, structured About with desire/objection/proof body text, highlighted social proof phrase, and 3 equal benefit cards.

## What Was Done

### Task 1: Rewrite SectionHero copy (HERO-01 through HERO-04)

Updated `SectionHero.vue` with four targeted copy changes:

- **Headline (HERO-01):** "Aprenda a viajar de classe executiva pagando até 80% menos, mesmo começando do zero."
- **Subheadline (HERO-02):** "Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos."
- **CTA (HERO-03):** "Quero começar agora" (replaced "Quero dar o primeiro passo")
- **Microcopy (HERO-04):** Added `<p class="text-sm text-white/60 text-center mt-3">Comece a economizar já no primeiro mês</p>` below the CTA button div

Pain point badges unchanged (D-05). Background image, overlay, layout, and scrollTo behavior all preserved.

Commit: `1bc37b9`

### Task 2: Rewrite SectionAbout layout and copy (ABOUT-01 through ABOUT-05)

Rewrote `SectionAbout.vue` from scratch. Replaced the bento grid (navy hero card + 2 value cards) with:

- **Title (ABOUT-01):** "Viaje mais. Gaste menos. Use milhas do jeito certo."
- **Body text (ABOUT-02):** "A maioria das pessoas acumula milhas, mas não sabe como usar..." — structured as desire + objection + proof
- **Social proof phrase (ABOUT-03):** "Alunos já economizaram milhares de reais em passagens mesmo sem cartão black ou renda alta." — visually distinct with brand primary background tint, semibold font
- **3 equal cards (ABOUT-04):** grid-cols-1 md:grid-cols-3 — conforto (paper-airplane), economia (banknotes), estrategia (light-bulb)
- **No renda extra (ABOUT-05):** Zero occurrences confirmed

CTA button ("Quero dar o primeiro passo"), scrollTo behavior, and `id="sobre"` anchor all preserved.

Commit: `152a4f7`

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Hero CTA changed to "Quero comecar agora", About CTA unchanged | Per CONTEXT.md deferred section: About CTA stays at "Quero dar o primeiro passo" until Phase 14 CTA sweep |
| Microcopy as standalone `<p>` outside the CTA `<div>` | Keeps microcopy below the full-width flex container; avoids layout shift inside the button row |
| Social proof uses `bg-[var(--color-brand-primary)]/5` tint | Leverages Tailwind v4 opacity modifier on the brand token; no new color introduced |
| Full file rewrite for SectionAbout | File was short (59 lines); rewrite cleaner than 5 separate edits for removing hero card + 3 new sections |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all copy is wired and visible. CTA in SectionAbout intentionally keeps "Quero dar o primeiro passo" per deferred plan (Phase 14 will update all mid-LP CTAs).

## Self-Check: PASSED
