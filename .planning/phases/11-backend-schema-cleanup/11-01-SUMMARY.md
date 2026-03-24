---
phase: 11-backend-schema-cleanup
plan: 01
subsystem: backend-schema, lead-form, about-section
tags: [schema, zod, form, cleanup, renda-extra]
dependency_graph:
  requires: []
  provides: [3-field-lead-schema, clean-about-section]
  affects: [server/leads/schema.ts, app/composables/useLeadForm.ts, app/components/Section/SectionLeadForm.vue, app/components/Section/SectionAbout.vue]
tech_stack:
  added: []
  patterns: [shared-zod-schema, honeypot-field]
key_files:
  modified:
    - server/leads/schema.ts
    - app/composables/useLeadForm.ts
    - app/components/Section/SectionLeadForm.vue
    - app/components/Section/SectionAbout.vue
decisions:
  - "gastoMensal and objetivo removed from Zod schema; email added as z.string().email()"
  - "SectionAbout bento grid temporarily unbalanced (2 cards) — Phase 12 rewrites this section entirely"
  - "FAQ 'objetivo' word occurrences are natural language (Portuguese for 'goal'), not schema field references"
metrics:
  duration: "2 min"
  completed: "2026-03-24"
  tasks: 2
  files: 4
---

# Phase 11 Plan 01: Backend Schema Cleanup Summary

**One-liner:** Replaced 4-field lead schema (nome, whatsapp, gastoMensal, objetivo) with 3-field schema (nome, email, whatsapp) plus honeypot, and purged all renda-extra references from app and server.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Update backend + frontend Zod schemas and form component to 3-field lead | 0deb992 | server/leads/schema.ts, app/composables/useLeadForm.ts, app/components/Section/SectionLeadForm.vue |
| 2 | Purge "renda extra" from SectionAbout and verify zero results site-wide | baa5f8d | app/components/Section/SectionAbout.vue |

## What Was Done

**Task 1 — Schema + Form update:**
- `server/leads/schema.ts`: Removed `gastoMensal` and `objetivo` fields, added `email: z.string().email('Informe um e-mail valido')`. Honeypot (`website`) unchanged.
- `app/composables/useLeadForm.ts`: Mirrored backend schema exactly — same 3 fields + honeypot. Removed `gastoMensal` and `objetivo`. `submit()` function now passes `{ nome, email, whatsapp, website }`.
- `app/components/Section/SectionLeadForm.vue`: Removed `objetivoOptions` array. Removed `gastoMensal` and `objetivo` UFormField blocks. Added `email` UFormField between nome and whatsapp. Reactive state updated to `{ nome, email, whatsapp, website }`.
- `server/leads/index.ts`: No changes needed — it destructures `result.data` which automatically reflects the new schema shape.

**Task 2 — Renda extra purge:**
- Subtitle changed from "...em viagens executivas e renda extra" to "...em viagens executivas"
- "Renda Extra com Milhas" card block removed from bento grid (was value prop 3)
- Bento grid now has 3 `rounded-xl` divs: 1 hero card (md:col-span-2) + 2 value prop cards (Viagens Executivas, Economia Familiar)

## Verification Results

All checks passed:

```
1. Schema integrity: server/leads/schema.ts:1, app/composables/useLeadForm.ts:1
2. Removed fields: PASS — no gastoMensal, renda-extra in app/ server/
3. Form email field: name="email" count = 1 in SectionLeadForm.vue
4. No orphan references: PASS — no objetivoOptions, renda-extra
5. Honeypot preserved: website count = 1 in server/leads/schema.ts
6. index.ts LeadSchema.safeParse: count = 1 (unchanged)
```

Note: `grep -ri "objetivo" app/ server/` produces 4 matches in SectionFAQ.vue — all are the Portuguese word "objetivo" (meaning "goal") in FAQ answer text, not schema field references. No schema or form file contains this word.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all 4 files have real implementation with no placeholder values.

## Self-Check: PASSED

Files verified:
- server/leads/schema.ts — FOUND, contains `email: z.string().email(`
- app/composables/useLeadForm.ts — FOUND, contains `email: z.string().email(`
- app/components/Section/SectionLeadForm.vue — FOUND, contains `name="email"`, no gastoMensal
- app/components/Section/SectionAbout.vue — FOUND, no "renda extra" text

Commits verified:
- 0deb992 — feat(11-01): update lead schema to 3-field
- baa5f8d — feat(11-01): remove renda extra card from SectionAbout
