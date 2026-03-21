---
phase: 06-content-layout-polish
plan: 01
subsystem: frontend-components
tags: [contrast, accessibility, content, faq, form, wcag]
dependency_graph:
  requires: []
  provides: [CTRST-01, CTRST-02, CONT-04, CONT-05]
  affects: [SectionFAQ, SectionLeadForm, SectionAbout, SectionMethod]
tech_stack:
  added: []
  patterns:
    - "UAccordion ui prop override for trigger text color"
    - "UInput/USelect ui prop base override for bg-white on dark card"
    - "#default slot on UAccordion for label text color injection"
key_files:
  created: []
  modified:
    - app/components/Section/SectionFAQ.vue
    - app/components/Section/SectionLeadForm.vue
    - app/components/Section/SectionAbout.vue
    - app/components/Section/SectionMethod.vue
decisions:
  - "UAccordion default slot used to inject text-[var(--color-brand-text)] on label span — slot-based override more reliable than ui prop alone for trigger child styling"
  - "UInput/USelect ui prop base used alongside class for dual-layer bg-white guarantee — class on root, ui.base inside component"
  - "SectionAbout subtitle updated to value-prop copy alongside heading change"
  - "SectionMethod step 4 description changed to post-consultancy autonomy framing instead of emission moment"
metrics:
  duration: "3 min"
  completed_date: "2026-03-21"
  tasks: 2
  files: 4
---

# Phase 06 Plan 01: Content and Contrast Polish Summary

**One-liner:** FAQ labels forced to #1a1a1a with UAccordion slot override; form inputs rendered white on navy via ui prop; SectionAbout heading reframed as value proposition; SectionMethod step 4 rewritten as post-consultancy autonomy.

## Objective

Fix contrast issues in FAQ and form, update SectionAbout headline and SectionMethod step 4 content to match the real consultancy offering.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix FAQ label contrast and form input legibility | 7f8dc6f | SectionFAQ.vue, SectionLeadForm.vue |
| 2 | Update SectionAbout headline and SectionMethod step 4 | 0087f71 | SectionAbout.vue, SectionMethod.vue |

## Changes Made

### Task 1: FAQ Contrast and Form Legibility

**SectionFAQ.vue:**
- Added `:ui="{ trigger: '... text-[var(--color-brand-text)]' }"` to UAccordion to override trigger text color
- Added `#default` slot with `<span class="text-[var(--color-brand-text)]">{{ item.label }}</span>` to guarantee dark label color in the rendered label span
- The `#content` slot (already fixed in v1.1) was not modified

**SectionLeadForm.vue:**
- Added `class="w-full bg-white"` and `:ui="{ base: 'bg-white border border-gray-300' }"` to all 3 UInput components
- Added same classes/ui prop to USelect component
- All 4 label slots retain `<span class="text-white">` — unchanged per D-16

### Task 2: SectionAbout Headline and SectionMethod Step 4

**SectionAbout.vue:**
- h2 changed from "Sobre a Fly Up Milhas" to "Sua estrategia de milhas comeca aqui"
- Subtitle updated from "Especialistas em transformar..." to "Descubra como transformar seus gastos do dia a dia em viagens executivas e renda extra" (more direct value prop)

**SectionMethod.vue:**
- Step 4 title: "Voo" -> "Autonomia"
- Step 4 icon: `i-heroicons-paper-airplane` -> `i-heroicons-academic-cap`
- Step 4 description: updated to post-consultancy independence framing ("Apos o plano, voce tem autonomia...")

## Verification

- `pnpm build` completed without errors
- grep confirms `color-brand-text` in SectionFAQ.vue trigger area
- grep confirms `bg-white` in 4+ locations in SectionLeadForm.vue
- grep confirms "Sua estrat" in SectionAbout.vue h2
- grep confirms "Autonomia", "academic-cap", "autonomia para acumular" in SectionMethod.vue

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Dual-layer bg-white (class + ui prop) | Nuxt UI v4 components apply internal Tailwind classes that may override root class; ui.base prop reaches inside the component's base element |
| #default slot for label color | UAccordion renders label text inside a `<span data-slot="label">` that inherits color from trigger; the default slot allows wrapping with explicit color class |
| Subtitle updated alongside heading | Heading change required subtitle to remain coherent; previous copy ("Especialistas em...") was less direct than new heading implies |
| academic-cap icon for step 4 | Represents knowledge transfer and independence — appropriate for "Autonomia" step about the client operating independently post-consultancy |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None relevant to this plan's goal — all four components render production-appropriate content.

## Self-Check: PASSED

- app/components/Section/SectionFAQ.vue: EXISTS with color-brand-text in trigger
- app/components/Section/SectionLeadForm.vue: EXISTS with bg-white on 4 inputs
- app/components/Section/SectionAbout.vue: EXISTS with "Sua estrat" heading
- app/components/Section/SectionMethod.vue: EXISTS with Autonomia step 4
- Commit 7f8dc6f: FOUND (Task 1)
- Commit 0087f71: FOUND (Task 2)
