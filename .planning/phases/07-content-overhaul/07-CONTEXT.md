# Phase 7: Content Overhaul - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all "consultoria" references with "mentoria" across the LP. Update CTAs, hero pain points, form confirmation, SectionMethod format, SectionPrice (no price), and SectionAbout copy. Reference: `docs/OLD_SITE_CONTENT.md`.

</domain>

<decisions>
## Implementation Decisions

### Copy replacement: consultoria → mentoria
- **D-01:** Global find-and-replace of "consultoria" (and variants like "Consultoria VIP", "consultoria personalizada") with "mentoria" in all `.vue` files, meta tags, and schema.org data
- **D-02:** The word "consultoria" must not appear in any user-visible text after this phase

### CTA text
- **D-03:** All CTA buttons change from "Quero minha Consultoria" to "Quero dar o primeiro passo"
- **D-04:** Applies to: SectionHero, SectionAbout, SectionPrice, AppHeader (desktop + mobile), SectionLeadForm submit button
- **D-05:** Form heading changes from "Quero minha Consultoria VIP" to something mentoria-focused (Claude's discretion on exact wording)

### Hero pain points
- **D-06:** Add pain point badges/chips ABOVE the main headline in SectionHero
- **D-07:** Use 3 pain points from old site: "Viajar de avião é caro", "Milhas é só para quem tem cartão black", "Não sei por onde começar"
- **D-08:** Style: small rounded chips with muted/outline style, not full-color — they lead into the headline, not compete with it
- **D-09:** Keep existing headline and subheadline (adjust wording for "mentoria" if needed)

### SectionMethod: 4 steps reflecting 3 encontros
- **D-10:** Step 01 title: "Primeiro Encontro" — description: Diagnóstico completo + início da estratégia personalizada
- **D-11:** Step 02 title: "Segundo Encontro" — description: Aprofundamento da estratégia + acompanhamento do progresso
- **D-12:** Step 03 title: "Terceiro Encontro" — description: Revisão dos resultados e ajustes finais
- **D-13:** Step 04 title: "Autonomia" — description: Você se beneficia do que aprendeu, com conhecimento para acumular e emitir milhas sozinho
- **D-14:** Formato (encontros quinzenais via Google Meet, suporte via WhatsApp, material de apoio) mencionado com menos ênfase — como subtexto abaixo dos cards, NÃO como card próprio
- **D-15:** Icons: Claude's discretion, mas refletir os temas (diagnóstico, estratégia, revisão, autonomia)

### SectionPrice: sem preço, com benefícios
- **D-16:** Remover completamente o preço R$200 e o value anchor ("passagens que custam R$3.000+")
- **D-17:** Heading: "Comece sua jornada" (ou similar — Claude's discretion)
- **D-18:** Lista de 5 benefícios com check icons:
  - 3 encontros durante o período da mentoria (início, meio e fim)
  - Suporte para dúvidas via WhatsApp
  - Material de apoio
  - Aplicação imediata
  - Plano personalizado
- **D-19:** Nota abaixo: "Parcelamento disponível" ou "Condições especiais disponíveis"
- **D-20:** Manter CTA button "Quero dar o primeiro passo"
- **D-21:** Manter fundo navy — é a seção de conversão

### SectionAbout: ajustar para mentoria
- **D-22:** Hero card copy: descrever o que é a mentoria (baseado no old site: "mentoria criada para quem quer aprender do zero ou organizar o que já faz")
- **D-23:** Manter os 3 value prop cards (Viagens Executivas, Economia Familiar, Renda Extra) — são relevantes para mentoria também
- **D-24:** Heading "Sua estratégia de milhas começa aqui" continua (já atualizado no v1.2)

### Form confirmation text
- **D-25:** Success message: trocar "Recebi! Marcio vai te chamar no WhatsApp em ate 24h." por texto adequado para mentoria (e.g., "Recebemos! Entraremos em contato pelo WhatsApp para agendar seu primeiro encontro.")
- **D-26:** WhatsApp pre-filled message: trocar "consultoria VIP de milhas" por "mentoria Fly Up Milhas"

### SEO meta tags
- **D-27:** Atualizar title, description, og:title, og:description, twitter:title, twitter:description para refletir "mentoria" em vez de "consultoria"
- **D-28:** Atualizar schema.org LocalBusiness description

### Claude's Discretion
- Exact wording for form heading and subheadline
- Pain point chip styling details (border, opacity, font-size)
- Step icons for the 4 new steps
- SectionPrice heading copy
- Whether to adjust SectionAbout subtitle

</decisions>

<canonical_refs>
## Canonical References

### Old site content (primary reference)
- `docs/OLD_SITE_CONTENT.md` — Pain points, mentoria description, programmatic content, audience fit, methodology, pricing reference

### Phase requirements
- `.planning/REQUIREMENTS.md` — COPY-01..04, EDIT-01..03

</canonical_refs>

<code_context>
## Existing Code Insights

### Files to modify
- `app/components/Section/SectionHero.vue` — add pain point badges, update CTA text
- `app/components/Section/SectionAbout.vue` — update hero card copy for mentoria
- `app/components/Section/SectionMethod.vue` — rewrite all 4 steps + add format subtexto
- `app/components/Section/SectionPrice.vue` — remove price, add benefits list
- `app/components/Section/SectionLeadForm.vue` — update form heading, success message, WhatsApp text
- `app/components/App/AppHeader.vue` — update CTA text
- `app/app.vue` — update SEO meta tags and schema.org

### Established Patterns
- CTA button: plain `<button>` with `bg-[var(--color-brand-cta)]` classes
- Text colors: `text-[var(--color-brand-primary)]` for headings, `text-[var(--color-brand-text-muted)]` for secondary
- Navy cards: `bg-[var(--color-brand-primary)] text-white rounded-xl`
- Check icons: `UIcon name="i-heroicons-check-circle"` with CTA color

### Integration Points
- `useScroll` composable used in SectionAbout and SectionPrice for CTA click → scrollTo('formulario')
- WhatsApp URL constant in SectionLeadForm.vue — update pre-filled message text

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-content-overhaul*
*Context gathered: 2026-03-21*
