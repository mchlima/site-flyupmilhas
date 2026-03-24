# Phase 14: Form Frontend & CTA Pass - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Add security badge below form, update CTA text per position across the LP, and update form submit button text. Several original Phase 14 requirements were already completed in earlier phases (see Prior Completions below).

</domain>

<decisions>
## Implementation Decisions

### Prior Completions (DO NOT re-implement)
- **FORM-02** (objetivo dropdown options): OBSOLETE — objetivo field removed entirely in Phase 11. Form is now nome + email + whatsapp.
- **FORM-03** (form intro text "Preencha...24h"): ALREADY DONE in Phase 12 identity sweep.
- **CTA-01** (Hero "Quero começar agora"): ALREADY DONE in Phase 12 hero rewrite.

### Security Badge (FORM-04)
- **D-01:** Badge text: "Seus dados estão seguros" (short version, no extra explanation)
- **D-02:** Icon: lock icon (i-heroicons-lock-closed) before the text
- **D-03:** Placement: directly below the form submit button, OUTSIDE the UForm component
- **D-04:** Visual: small, muted text (text-sm, opacity-70 or similar) — not a loud banner
- **D-05:** Research note: badge must be outside UForm because Nuxt UI's UForm expects UFormField children only — injecting arbitrary elements causes spacing issues

### CTA Text Distribution (CTA-02, CTA-03)
- **D-06:** Hero → "Quero começar agora" (ALREADY DONE — do not change)
- **D-07:** About → "Quero dar o primeiro passo" (KEEP current text — no change)
- **D-08:** ProgramContent → "Quero entender melhor" (CTA-02 — CHANGE this)
- **D-09:** Price card → "Quero entrar na mentoria" (CTA-03 — CHANGE this)
- **D-10:** Form submit button → "Quero começar minha mentoria" (from client PDF — CHANGE this)

### Components to modify
- **D-11:** SectionProgramContent.vue — change CTA text only
- **D-12:** SectionPrice.vue — change CTA text only (price card button)
- **D-13:** SectionLeadForm.vue — change submit button text + add security badge below form

### Claude's Discretion
- Exact opacity/color for the security badge
- Whether to use UIcon or inline SVG for the lock icon
- Badge container element type (div, p, span)

</decisions>

<specifics>
## Specific Ideas

- Client PDF page 5: "O CTA, quero trocar todas as frase para 'Quero começar minha mentoria'" — this applies to the form submit button
- Client PDF page 5: CTAs variados: Topo "Quero começar agora", Meio "Quero entender melhor", Final "Quero entrar na mentoria"
- Client PDF page 5: "Quero adicionar aquele botão que sempre vejo nos sites. 🔒 Seus dados estão seguros"
- The About CTA stays unchanged because user chose Hero + ProgramContent + Price as the 3 varied positions

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source files to modify
- `app/components/Section/SectionProgramContent.vue` — CTA button text change only
- `app/components/Section/SectionPrice.vue` — CTA button text change only
- `app/components/Section/SectionLeadForm.vue` — Submit button text + security badge

### Prior phase context
- `.planning/phases/11-backend-schema-cleanup/11-CONTEXT.md` — Form is now nome + email + whatsapp (objetivo removed)
- `.planning/phases/12-copy-rewrite-identity-sweep/12-CONTEXT.md` — Hero CTA already "Quero começar agora", form subtitle already changed
- `.planning/research/FEATURES.md` — Security badge placement research (23-42% conversion uplift below submit button)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- CTA buttons: all use plain `<a>` tags with `scrollToElement('formulario')` onclick
- Form submit: plain `<button>` element (not UButton) with flex centering
- UIcon already available via Nuxt UI for lock icon

### Established Patterns
- CTA pattern: `<a href="#formulario" @click.prevent="scrollToElement('formulario')" class="...">{TEXT}</a>`
- Submit button: `<button type="submit" :disabled="loading" class="...">`
- Security badge should be a sibling of the UForm, not a child

### Integration Points
- SectionProgramContent CTA: currently "Quero dar o primeiro passo" — change text only
- SectionPrice CTA: in the price card right column — change text only
- SectionLeadForm submit: currently "Quero dar o primeiro passo" — change text, add badge div after UForm closing tag

</code_context>

<deferred>
## Deferred Ideas

None — this is the last phase of v1.5.

</deferred>

---

*Phase: 14-form-frontend-cta-pass*
*Context gathered: 2026-03-24*
