# Phase 13: Structural Template Changes - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Add WhatsApp-style chat bubble testimonials, "Para quem NÃO é" negative cards, bold keywords in ProgramContent, and real pricing + guarantee in SectionPrice. All are visual/structural template changes to existing components.

</domain>

<decisions>
## Implementation Decisions

### SectionSocialProof — WhatsApp Chat Bubbles (SOCL-01, SOCL-02, SOCL-03)
- **D-01:** Title: "Casos reais de quem já aplicou"
- **D-02:** 3 depoimentos (replacing current 2)
- **D-03:** Chat bubble visual: CSS-only WhatsApp-style bubbles (green tint, tail triangle, rounded corners). No images, no new dependencies.
- **D-04:** Content: mix of results — each testimonial highlights something different (economia em R$, rota + classe, experiência). Written as if the student is speaking naturally, not marketing copy.
- **D-05:** Numbers and values in bold within testimonial text (via v-html or <strong> tags in hardcoded strings)
- **D-06:** Remove TODO marker and all "Márcio" references from testimonials. Use "Fly Up Milhas" or "a mentoria" instead.
- **D-07:** Keep mock names/cities (Ana Paula, Carlos Eduardo + add 1 new). These are placeholders until Márcio provides real testimonials.
- **D-08:** Must render correctly at 375px, 390px, 412px (mobile breakpoints). Use `max-width: min(85%, 400px)` and `word-break: break-word`.

### SectionForWhom — "Para quem NÃO é" (FORW-01)
- **D-09:** 3 negative cards integrated below the positive cards in the same section
- **D-10:** Items: "Não é pra quem quer dinheiro fácil", "Não é pra quem não usa cartão", "Não é pra quem não vai aplicar"
- **D-11:** Visual: red/orange X icon (i-heroicons-x-mark) with red-500 or orange-500 color — clear contrast with positive cards that use blue icons
- **D-12:** Add a small separator/heading between positive and negative sections (e.g., "Essa mentoria não é para todos")
- **D-13:** Cards maintain same grid layout as positive cards but with distinct visual treatment

### SectionProgramContent — Bold Keywords (PROG-01, PROG-02)
- **D-14:** Switch from `{{ item.text }}` interpolation to `v-html="item.text"` for all 8 items
- **D-15:** Wrap key terms in `<strong>` tags in the data array. Safe because content is developer-controlled hardcoded strings.
- **D-16:** New subtitle: "Sem promessas milagrosas. Um método simples e prático para você usar milhas do jeito certo e realmente economizar em viagens."
- **D-17:** Subtitle placement: below the section title, above the content items

### SectionPrice — Pricing + Guarantee (PRCE-01, PRCE-02, PRCE-03)
- **D-18:** Split layout: benefits on the left, price/guarantee/CTA on the right
- **D-19:** Left side: keep the 4 benefit items from client PDF:
  - 3 encontros estratégicos (início, meio e fim)
  - Suporte direto via WhatsApp
  - Material prático para aplicação imediata
  - Plano personalizado para seu perfil
- **D-20:** Right side: price card with:
  - Pre-heading: "Comece hoje sua jornada com milhas"
  - Price: "R$ 299,90" (large, prominent) with "no PIX" qualifier
  - Installment: "ou até 10x no cartão" (smaller text below)
  - ALL prices as hard-coded strings (never JS arithmetic)
- **D-21:** Guarantee block below price card: shield icon + "Garantia de 7 dias" + "Se não fizer sentido pra você, devolvemos 100% do valor."
- **D-22:** CTA button at bottom of price card

### Claude's Discretion
- Exact green tint for WhatsApp bubbles (WhatsApp green #DCF8C6 or similar)
- Chat bubble tail direction and CSS implementation
- Separator styling between positive/negative ForWhom cards
- Exact benefit icons in SectionPrice
- Which keywords to bold in each ProgramContent item
- Price card background color/styling (navy, gradient, or white with border)

</decisions>

<specifics>
## Specific Ideas

- Client said testimonials should feel like "prints do WhatsApp" — authentic chat screenshots, not polished marketing quotes
- Client said "Não é pra quem quer dinheiro fácil" etc. — these exact phrases from the PDF
- Client: "Achei que esta com cara de 'lista comum' e não de oferta" for SectionPrice — needs to look like an offer, not a feature list
- Client provided exact benefit items for the offer section (PDF page 3)
- Research found: WhatsApp bubbles are table stakes in Brazilian mentorship niche
- Research found: PIX + installment display is standard for any BR digital product above R$ 100
- Research found: guarantee block is legally expected (CDC Art. 49) — not showing it is a trust negative

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Client feedback
- `docs/considerações-do-cliente-v1.pdf` — Pages 2-4 cover ProgramContent, ForWhom, SocialProof, Price/Offer, Guarantee

### Source files to modify
- `app/components/Section/SectionSocialProof.vue` — Full rewrite: chat bubbles replacing card testimonials
- `app/components/Section/SectionForWhom.vue` — Add negative cards below positive cards
- `app/components/Section/SectionProgramContent.vue` — Switch to v-html + add subtitle
- `app/components/Section/SectionPrice.vue` — Full rewrite: split layout with real pricing + guarantee

### Prior phase context
- `.planning/phases/12-copy-rewrite-identity-sweep/12-CONTEXT.md` — Identity sweep scope (SocialProof was deferred to this phase)
- `.planning/research/FEATURES.md` — WhatsApp testimonials patterns, pricing display, guarantee blocks
- `.planning/research/PITFALLS.md` — WhatsApp bubble CSS mobile issues, price string formatting

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- SectionSocialProof.vue: has testimonials data array — can be restructured for bubbles
- SectionForWhom.vue: uses info cards array with `text` and `icon` — easy to add negative items
- SectionProgramContent.vue: items array with `text` and `icon` — just add `<strong>` tags to text values
- SectionPrice.vue: has benefits array — restructure to split layout

### Established Patterns
- CSS variables for brand colors: `--color-brand-navy`, `--color-brand-cta`, etc.
- Heroicons via `i-heroicons-*` class pattern (UIcon or inline)
- Grid layouts: `grid-cols-1 md:grid-cols-2` for responsive
- Section structure: `<section id="..." class="py-16 md:py-24">`

### Integration Points
- SectionSocialProof: id="depoimentos" — anchor nav link in AppHeader
- SectionForWhom: no anchor in nav (not in nav links)
- SectionProgramContent: id="conteudo" — anchor nav link
- SectionPrice: no explicit id for nav (CTA scrolls to #formulario)

</code_context>

<deferred>
## Deferred Ideas

- Real WhatsApp screenshot images from Márcio — currently using CSS bubbles with text. When Márcio provides real screenshots, swap to NuxtImg.
- CTA text variations per position — Phase 14 (CTA-01..03)
- Security badge on form — Phase 14 (FORM-04)
- Form intro text change — Phase 14 (FORM-03)

</deferred>

---

*Phase: 13-structural-template-changes*
*Context gathered: 2026-03-24*
