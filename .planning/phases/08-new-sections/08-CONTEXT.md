# Phase 8: New Sections - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Create and integrate two new Vue components: SectionProgramContent (8 learning items) and SectionForWhom (audience qualification cards). Wire into app.vue at optimal reading-flow positions. No changes to existing sections.

</domain>

<decisions>
## Implementation Decisions

### SectionProgramContent layout
- **D-01:** Two-block side-by-side layout on desktop: left block with title + description + CTA, right block with 8 items list
- **D-02:** Single column stacked on mobile (left block on top, list below)
- **D-03:** List items use individual icons (not check marks) — each item gets a relevant heroicons icon
- **D-04:** Content source: 8 items from `docs/OLD_SITE_CONTENT.md` section 3 (exactly as listed)
- **D-05:** Left block description: use text from old site section 2 ("Aqui voce nao recebe promessas irreais. Voce aprende o que funciona...")
- **D-06:** CTA button: "Quero dar o primeiro passo" → scrollTo('formulario')
- **D-07:** Section heading: "O que voce vai aprender na pratica" (from old site)

### SectionForWhom layout
- **D-08:** 5 individual cards in a grid layout (2-col desktop, 1-col mobile)
- **D-09:** Each card has an icon + short text matching the 5 audience fit criteria from old site section 4
- **D-10:** Card style: white cards with rounded-xl shadow-sm (consistent with bento pattern)
- **D-11:** Section heading: "Para quem e essa mentoria?" (from old site, adapted)
- **D-12:** 5th card can span full width or be centered — Claude's discretion

### Section positioning in app.vue
- **D-13:** Claude decides optimal position in the page reading flow for both sections
- **D-14:** Both sections must be reachable via anchor links if AppHeader nav is updated (add to nav if appropriate)

### Anchor navigation
- **D-15:** Add anchor IDs to both new sections (e.g., `id="conteudo-programatico"`, `id="para-quem-e"`)
- **D-16:** Whether to add new nav links to AppHeader is Claude's discretion — only if it doesn't overcrowd the nav

### Claude's Discretion
- Exact position of both sections in app.vue reading flow
- Whether to add new nav links to AppHeader
- Icons for the 8 programmatic content items
- Icons for the 5 audience fit cards
- Left block styling details (background, padding)
- 5th card layout handling (span or center)
- Section background colors (alternate with existing pattern)

</decisions>

<canonical_refs>
## Canonical References

### Content source
- `docs/OLD_SITE_CONTENT.md` — Section 3 (8 learning items), Section 4 (5 audience criteria)

### Phase requirements
- `.planning/REQUIREMENTS.md` — SEC-01, SEC-02

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Bento grid card pattern from SectionAbout, SectionMethod — `rounded-xl bg-white shadow-sm`
- `useScroll` composable for CTA button → scrollTo('formulario')
- Icon pattern: `UIcon name="i-heroicons-*"` used throughout

### Established Patterns
- Section structure: `<section id="..." class="bg-[...] py-12 md:py-24 px-6">`
- Heading: `text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)]`
- CTA button: plain `<button>` with `bg-[var(--color-brand-cta)]` classes
- Alternating backgrounds: off-white (`--color-brand-bg`) and white

### Integration Points
- `app/app.vue` — wire `<SectionProgramContent />` and `<SectionForWhom />` between existing sections
- `app/components/App/AppHeader.vue` — potentially add nav links

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-new-sections*
*Context gathered: 2026-03-22*
