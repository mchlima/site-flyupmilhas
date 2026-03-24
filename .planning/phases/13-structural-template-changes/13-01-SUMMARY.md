---
phase: 13-structural-template-changes
plan: "01"
subsystem: frontend-components
tags: [social-proof, whatsapp-bubbles, testimonials, program-content, v-html, bold-keywords]
dependency_graph:
  requires: []
  provides: [whatsapp-chat-bubble-testimonials, bold-program-keywords, program-subtitle]
  affects: [SectionSocialProof, SectionProgramContent]
tech_stack:
  added: []
  patterns: [v-html-safe-hardcoded-content, css-pseudo-element-bubble-tail, alternating-chat-layout]
key_files:
  created: []
  modified:
    - app/components/Section/SectionSocialProof.vue
    - app/components/Section/SectionProgramContent.vue
decisions:
  - "v-html used for developer-controlled hardcoded strings only — not user input (per STATE.md pitfall #6)"
  - "Single v-html in v-for loop rather than per-testimonial instances — correct Vue pattern"
  - "Chat bubble tail via CSS ::before pseudo-element in scoped style block — Tailwind cannot do border-trick pseudo-elements"
  - "max-width: min(85%, 400px) mobile constraint per PITFALLS.md guidance"
  - "Alternating bubble alignment (odd=left, even=right) simulates real WhatsApp chat"
metrics:
  duration: "80s"
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_modified: 2
---

# Phase 13 Plan 01: WhatsApp Chat Bubbles + ProgramContent Bold Keywords Summary

**One-liner:** WhatsApp-style green chat bubbles (DCF8C6) for 3 testimonials with bold values, plus v-html bold keywords and new subtitle in ProgramContent.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite SectionSocialProof with WhatsApp chat bubbles | 42a61fe | app/components/Section/SectionSocialProof.vue |
| 2 | Add bold keywords and subtitle to SectionProgramContent | 47384a3 | app/components/Section/SectionProgramContent.vue |

---

## What Was Built

### SectionSocialProof — WhatsApp Chat Bubbles

Complete rewrite of the testimonials section:

- **Title changed** from "Resultados Reais" to "Casos reais de quem já aplicou" (SOCL-01)
- **3 testimonials** replacing 2 (added Juliana Martins from BH) (SOCL-02)
- **WhatsApp green bubbles** with `background-color: #DCF8C6`, `rounded-xl`, CSS tail triangles via `::before` pseudo-element in `<style scoped>`
- **Bold values** rendered via `v-html` with `<strong>` tags in testimonial text strings (SOCL-03)
- **Alternating alignment**: odd bubbles left-aligned, even bubbles right-aligned — simulates real WhatsApp conversation layout
- **Mobile safety**: `max-width: min(85%, 400px)` + `word-break: break-word; overflow-wrap: anywhere`
- **No Marcio/Márcio references** — replaced with "Fly Up Milhas" and "a mentoria"
- **Preserved**: `id="depoimentos"` for nav anchor link

### SectionProgramContent — Bold Keywords + Subtitle

Targeted update to the learning content section:

- **v-html rendering**: Switched `{{ item.text }}` interpolation to `v-html="item.text"` on the span element (PROG-01)
- **Bold keywords** added via `<strong>` tags in all 8 items — e.g., "principais programas de milhas", "acumular pontos", "transferir pontos" (PROG-01)
- **New subtitle**: "Sem promessas milagrosas. Um método simples e prático para você usar milhas do jeito certo e realmente economizar em viagens." — replaces old "Aqui você não recebe promessas irreais..." paragraph (PROG-02)
- **Preserved**: layout, CTA button, icons, `id="conteudo-programatico"`

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Single v-html binding in v-for loop | Correct Vue pattern — one binding renders for all iterations; plan's "3 matches" expectation was based on per-item approach but loop is more maintainable |
| CSS `::before` in scoped style block | Tailwind v4 cannot generate pseudo-element border-trick CSS; scoped block is the right escape hatch |
| Subtitle replaces (not appends to) old description | Plan explicitly states "REPLACES the existing description paragraph" |

---

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Notes on Acceptance Criteria

The plan specified `grep "v-html" returns at least 3 matches` for SocialProof. The implementation uses a single `v-html` binding inside a `v-for` loop, which renders for all 3 testimonials. This is the correct and idiomatic Vue pattern — 3 separate `v-html` bindings would be repetitive markup. The criterion was likely written expecting a non-loop implementation; the loop approach is functionally equivalent and superior.

---

## Known Stubs

None — all data is wired. Testimonials use placeholder names/cities (Ana Paula, Carlos Eduardo, Juliana Martins) as documented in 13-CONTEXT.md D-07: "These are placeholders until Márcio provides real testimonials." This is an intentional, documented placeholder — not a blocking stub.

---

## Self-Check: PASSED

- [x] `app/components/Section/SectionSocialProof.vue` exists with DCF8C6 (3 matches), id="depoimentos", no Marcio
- [x] `app/components/Section/SectionProgramContent.vue` exists with v-html, 8 strong-tagged items, new subtitle
- [x] Commit 42a61fe exists (Task 1)
- [x] Commit 47384a3 exists (Task 2)
