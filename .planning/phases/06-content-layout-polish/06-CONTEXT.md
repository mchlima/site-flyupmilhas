# Phase 6: Content & Layout Polish - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish contrast, content, and UX across FAQ, About, Method, Price, and Form sections. Add back-to-top button. No new sections, no new functionality — visual and content refinement only.

</domain>

<decisions>
## Implementation Decisions

### FAQ accordion contrast
- **D-01:** UAccordion label (title) text must use `--color-brand-text` (#1a1a1a) instead of the default muted style — override via UAccordion's `#leading` or label slot
- **D-02:** Content text already fixed in v1.1 (UAccordion `#content` slot) — do not change

### SectionAbout title
- **D-03:** Change heading from "Sobre a Fly Up Milhas" to "Sua estratégia de milhas começa aqui"
- **D-04:** Subtitle can be adjusted by Claude to match the new heading tone

### Como Funciona step 4
- **D-05:** Rename step 4 title from "Voo" to "Autonomia"
- **D-06:** Replace step 4 description with: "Após o plano, você tem autonomia para acumular e emitir milhas sozinho. O conhecimento fica com você para sempre."
- **D-07:** Change step 4 icon from `i-heroicons-paper-airplane` to something representing independence/knowledge (e.g., `i-heroicons-academic-cap` or `i-heroicons-light-bulb` — Claude's discretion)

### SectionMethod offer card removal
- **D-08:** Remove the entire "O que está incluído" card (`<div class="bg-white rounded-xl shadow p-8">`) from SectionMethod.vue
- **D-09:** Do NOT remove the 4-step grid — only the offer block below it

### SectionPrice enrichment
- **D-10:** Add 2 new items to the existing 3-item grid: "Lista de cartões recomendados" and "Suporte na primeira emissão"
- **D-11:** Keep the same visual style (text-center, text-white/80, text-sm) — now 5 items instead of 3
- **D-12:** Adjust grid to `grid-cols-2 md:grid-cols-5` or similar to fit 5 items cleanly on desktop; 2-col on mobile

### Form colors
- **D-13:** Keep the navy card wrapper — do not change to white
- **D-14:** Force `bg-white` on all UInput and USelect components explicitly (add class or style override)
- **D-15:** Ensure input borders are visible against white background (light gray border)
- **D-16:** Labels remain white text on navy — already set via `<template #label>`

### Back-to-top button
- **D-17:** Floating button in bottom-right corner, appears after scrolling past ~300px
- **D-18:** Uses `useScroll` composable (already exists) for smooth scroll to top
- **D-19:** Icon: `i-heroicons-chevron-up` or `i-heroicons-arrow-up`
- **D-20:** Guarded with `import.meta.client` for SSR safety (established pattern)
- **D-21:** Style: small round button, brand-primary or brand-cta background, white icon

### Claude's Discretion
- Exact grid layout for 5 items in SectionPrice (responsive breakpoints)
- Back-to-top button exact size, position offset, and transition animation
- Step 4 icon choice
- SectionAbout subtitle wording adjustment
- Whether to create a new BackToTop component or add inline to app.vue

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Phase requirements
- `.planning/REQUIREMENTS.md` — CTRST-01, CTRST-02, CONT-04, CONT-05, CONT-06, UX-01
- `.planning/ROADMAP.md` — Phase 6 success criteria (6 items)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useScroll` composable — already has `scrollTo(id)` function; extend or use for back-to-top (`scrollTo('main-content')` or `window.scrollTo`)
- UAccordion `#content` slot pattern from v1.1 FAQ fix — same slot override pattern for labels
- `app/assets/css/main.css` design tokens — all brand colors defined

### Established Patterns
- `import.meta.client` guard for browser APIs (Nuxt 4 convention)
- `rounded-xl shadow-sm` for white cards
- `bg-[var(--color-brand-primary)] text-white` for navy elements
- `bg-[var(--color-brand-cta)]` for orange CTA buttons

### Integration Points
- `SectionFAQ.vue` line 40 — UAccordion needs label styling override
- `SectionAbout.vue` line 8 — h2 text to change
- `SectionMethod.vue` lines 72-93 — offer block to remove; lines 21-26 step 4 data to update
- `SectionPrice.vue` lines 33-43 — 3-item grid to expand to 5
- `SectionLeadForm.vue` lines 114-162 — UInput/USelect need explicit bg-white
- `app.vue` or new component — back-to-top button placement

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-content-layout-polish*
*Context gathered: 2026-03-21*
