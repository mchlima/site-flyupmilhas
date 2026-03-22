# Phase 9: Logo, Accents & Form Redesign - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add logo to header, fix all accent issues in Portuguese text, and redesign the lead form layout. No new sections or functionality.

</domain>

<decisions>
## Implementation Decisions

### Logo no header
- **D-01:** Replace the text "Fly Up Milhas" in AppHeader.vue with an `<img>` tag using `~/assets/img/logo-fly-up-milhas.png`
- **D-02:** Logo is white on transparent background — works directly on the navy header
- **D-03:** Size: approximately h-8 or h-10 (32-40px height), auto width — Claude's discretion on exact size
- **D-04:** Add `alt="Fly Up Milhas"` for accessibility
- **D-05:** Logo should be a clickable link that scrolls to top (or reloads page)

### Acentuação
- **D-06:** Fix ALL Portuguese text missing accents across ALL .vue files in app/components/ and app/app.vue
- **D-07:** Common patterns to fix: voce→você, nao→não, estrategia→estratégia, pratica→prática, emissao→emissão, aplicacao→aplicação, organizacao→organização, credito→crédito, duvida→dúvida, condicoes→condições, Conteudo→Conteúdo, comeca→começa, diagnostico→diagnóstico, tambem→também, seguranca→segurança, cartoes→cartões, reuniao→reunião, reunioes→reuniões
- **D-08:** Also fix anchor IDs if they contain unaccented text that appears in nav (e.g., nav label "Conteudo" → "Conteúdo", but keep anchor ID unaccented for URL compatibility)
- **D-09:** Fix SEO meta tags in app.vue if they have unaccented Portuguese

### Formulário redesign
- **D-10:** Remove the navy card wrapper (`bg-[var(--color-brand-primary)] rounded-xl p-8 sm:p-10`) from SectionLeadForm.vue
- **D-11:** The section#formulario in app.vue keeps its navy background (`bg-[var(--color-brand-primary)]`)
- **D-12:** Form fields (UInput, USelect) float directly on the navy section background with bg-white and visible borders
- **D-13:** Labels remain white text on navy (keep `<template #label><span class="text-white">`)
- **D-14:** Heading and subtitle remain white text, centered above the form
- **D-15:** CTA button remains orange (`bg-[var(--color-brand-cta)]`)
- **D-16:** Max-width constraint stays (max-w-xl mx-auto) for the form content
- **D-17:** Success state and WhatsApp CTA styling adjusted to work without the card wrapper (already white text on navy section bg)

### Claude's Discretion
- Exact logo height
- Whether to use NuxtImg or plain img for the logo
- Form internal spacing adjustments after card removal
- Success state layout adjustments

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Files to modify
- `app/components/App/AppHeader.vue` — replace text with logo img
- `app/components/Section/SectionLeadForm.vue` — remove card wrapper
- `app/components/Section/SectionAbout.vue` — fix accents
- `app/components/Section/SectionMethod.vue` — fix accents
- `app/components/Section/SectionPrice.vue` — fix accents
- `app/components/Section/SectionProgramContent.vue` — fix accents
- `app/components/Section/SectionForWhom.vue` — fix accents
- `app/components/Section/SectionHero.vue` — fix accents (if any)
- `app/components/Section/SectionFAQ.vue` — fix accents (if any)
- `app/components/Section/SectionSocialProof.vue` — fix accents (if any)
- `app/app.vue` — fix SEO meta accents + section wrapper adjustments

### Logo file
- `app/assets/img/logo-fly-up-milhas.png` — white text on transparent, suitable for navy bg

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-logo-accents-form*
*Context gathered: 2026-03-22*
