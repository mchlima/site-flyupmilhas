---
phase: 07-content-overhaul
plan: 03
subsystem: content-copy
tags: [copy, mentoria, cta, testimonials, faq]
dependency_graph:
  requires: [07-01, 07-02]
  provides: [COPY-01, COPY-02, COPY-04]
  affects: [SectionLeadForm, SectionSocialProof, SectionFAQ, SectionExpert, SectionPlaceholder]
tech_stack:
  added: []
  patterns: [copy-replacement, consultoria-to-mentoria-migration]
key_files:
  modified:
    - app/components/Section/SectionLeadForm.vue
    - app/components/Section/SectionSocialProof.vue
    - app/components/Section/SectionFAQ.vue
    - app/components/Section/SectionExpert.vue
    - app/components/Section/SectionPlaceholder.vue
decisions:
  - "Submit CTA changed to 'Quero dar o primeiro passo' — softer entry barrier per D-03/D-04"
  - "Form heading changed to 'Comece sua mentoria agora' — action-oriented and mentoria-aligned"
  - "Success message references 'primeiro encontro' — frames mentorship relationship correctly"
metrics:
  duration: "2 minutes"
  completed: "2026-03-22T02:08:31Z"
  tasks: 2
  files_modified: 5
---

# Phase 07 Plan 03: Form, Testimonials, FAQ, and Legacy File Mentoria Migration Summary

Complete consultoria-to-mentoria migration for SectionLeadForm (heading, success message, WhatsApp pre-fill, submit CTA), SectionSocialProof testimonials, SectionFAQ label, and legacy SectionExpert/SectionPlaceholder files — achieving zero consultoria occurrences site-wide.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update SectionLeadForm heading, success message, WhatsApp text, and submit CTA | 6e22d0f | app/components/Section/SectionLeadForm.vue |
| 2 | Update SocialProof, FAQ, and legacy files to eliminate all remaining consultoria | e072e39 | SectionSocialProof.vue, SectionFAQ.vue, SectionExpert.vue, SectionPlaceholder.vue |

## Changes Made

### SectionLeadForm.vue (4 changes)
- WhatsApp pre-fill URL: `consultoria%20VIP%20de%20milhas` → `mentoria%20Fly%20Up%20Milhas`
- Form heading h2: "Quero minha Consultoria VIP" → "Comece sua mentoria agora"
- Success message: "Recebi! Marcio vai te chamar no WhatsApp em ate 24h." → "Recebemos! Entraremos em contato pelo WhatsApp para agendar seu primeiro encontro."
- Submit button: "Quero minha Consultoria" → "Quero dar o primeiro passo"

### SectionSocialProof.vue (2 changes)
- Ana Paula testimonial: "Com a consultoria do Márcio" → "Com a mentoria do Márcio"
- Ana Paula testimonial: "Valeu cada centavo da consultoria" → "Valeu cada centavo da mentoria"

### SectionFAQ.vue (1 change)
- FAQ label: "E se eu não gostar da consultoria?" → "E se eu não gostar da mentoria?"

### SectionExpert.vue (1 change)
- Secondary CTA: "Quero minha Consultoria" → "Quero dar o primeiro passo"

### SectionPlaceholder.vue (1 change)
- Tagline: "consultoria VIP em milhas aéreas" → "mentoria em milhas aéreas"

## Final Verification Results

- `grep -ric "consultoria" app/ | grep -v ":0$" | wc -l` → **0** (COPY-01 complete)
- `grep -rc "Quero dar o primeiro passo" app/` → 7 matches across AppHeader, SectionPrice, SectionExpert, SectionLeadForm, SectionHero, SectionAbout (all CTA buttons aligned)
- All mentoria-specific text verified in place

## Deviations from Plan

None - plan executed exactly as written.

Note: `grep -ric` output showed `:1` for SectionAbout.vue during Task 2 sweep, but direct `grep -ni` confirmed zero actual matches. The discrepancy was a display artifact of the count format. Final authoritative check with `grep -v ":0$"` confirmed zero site-wide occurrences.

## Known Stubs

- WhatsApp number `55XXXXXXXXXXX` remains a placeholder in SectionLeadForm.vue and AppFooter.vue — needs Marcio's real number before launch (tracked in STATE.md blockers)
- Testimonials in SectionSocialProof.vue are still placeholder data — real testimonials pending from Marcio

## Self-Check: PASSED

Files exist:
- app/components/Section/SectionLeadForm.vue — FOUND
- app/components/Section/SectionSocialProof.vue — FOUND
- app/components/Section/SectionFAQ.vue — FOUND
- app/components/Section/SectionExpert.vue — FOUND
- app/components/Section/SectionPlaceholder.vue — FOUND

Commits exist:
- 6e22d0f — FOUND (feat(07-03): update SectionLeadForm to mentoria copy)
- e072e39 — FOUND (feat(07-03): eliminate all consultoria in SocialProof, FAQ, Expert, Placeholder)
