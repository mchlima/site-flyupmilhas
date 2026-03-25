# Phase 16: Tipografia - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Source:** Auto-generated (--auto flag — recommended defaults selected)

<domain>
## Phase Boundary

Substituir Inter por Plus Jakarta Sans em toda a LP, aprimorar hierarquia tipografica (pesos e tamanhos de heading mais impactantes), e verificar CLS < 0.1 em nuxt preview. Copy e layout nao mudam — apenas a fonte e os estilos tipograficos.

</domain>

<decisions>
## Implementation Decisions

### Font swap
- **D-01:** Fonte principal muda de Inter para Plus Jakarta Sans (Google Fonts, variable font, pesos 200-800)
- **D-02:** Token `--font-family-sans` em main.css atualizado para `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **D-03:** `nuxt.config.ts` fonts.families deve ser atualizado simultaneamente com o token CSS para evitar double-load (carregar Inter + Jakarta)
- **D-04:** Inter deve ser completamente removido — zero downloads no painel Network

### Hierarquia tipografica
- **D-05:** h1 (hero headline): font-weight 700 (bold), tracking tighter (-0.025em) para impacto premium
- **D-06:** h2 (section titles): font-weight 600 (semibold), tracking tighter (-0.015em)
- **D-07:** h3 (card titles, subsections): font-weight 500 (medium), tracking normal
- **D-08:** Body text: font-weight 400 (regular), tracking normal — manter legibilidade igual ao Inter
- **D-09:** Tamanhos de heading podem ser aumentados se necessario para impacto (ex: hero h1 de text-4xl para text-5xl em desktop)

### Performance
- **D-10:** CLS < 0.1 obrigatorio em `nuxt preview` (nao dev server) verificado via Lighthouse
- **D-11:** @nuxt/fonts gera metricas de fallback automaticamente — nao precisa de font-display manual

### Claude's Discretion
- Tamanhos exatos de heading (text-3xl, text-4xl, text-5xl) — desde que crie hierarquia clara
- Ajustes de line-height se necessario para Plus Jakarta Sans
- Se algum componente precisa de peso diferente para contraste visual

</decisions>

<specifics>
## Specific Ideas

- Plus Jakarta Sans foi escolhida na fase de scoping do milestone por ser geometrica, moderna e premium sem perder legibilidade
- Research recomendou Playfair Display para headings como alternativa serif — descartado pelo usuario, ficou como Future Requirement
- O objetivo e que os headings "impactem mais" — Plus Jakarta Sans em bold com tracking tighter da esse efeito
- Referencia: MaxMilhas usa Sora (geometrica similar) com bons resultados de hierarquia

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Font configuration
- `.planning/research/STACK.md` — Plus Jakarta Sans rationale, @nuxt/fonts config syntax, variable font weight range
- `.planning/research/PITFALLS.md` — V3 (font double-load: update nuxt.config AND @theme simultaneously), V4 (CLS regression from font swap)

### Current implementation
- `app/assets/css/main.css` — `--font-family-sans` token at line 17, base `html {}` rule at line 44
- `nuxt.config.ts` — @nuxt/fonts configuration (Inter currently configured)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@theme { --font-family-sans }` in main.css — single token swap cascades to all components via `html { font-family: var(--font-family-sans) }`
- @nuxt/fonts already installed and configured — handles font download, fallback metrics, preloading

### Established Patterns
- All text uses the `--font-family-sans` token via `html` base rule — no hardcoded font-family in components
- Heading styles are applied per-component with Tailwind classes (text-3xl, text-4xl, font-bold, etc.)
- CTA buttons use font-semibold consistently

### Integration Points
- `nuxt.config.ts` — fonts.families configuration must be updated to Plus Jakarta Sans
- `app/assets/css/main.css` — font token update
- Each component with headings: AppHeader, SectionHero, SectionAbout, SectionProgramContent, SectionForWhom, SectionMethod, SectionSocialProof, SectionPrice, SectionFAQ, SectionLeadForm

</code_context>

<deferred>
## Deferred Ideas

- Playfair Display serif para headings — descartado para v1.6, pode ser explorado em milestone futuro
- Font weight variations per section (ex: hero extra-bold 800) — simplificar agora, iterar depois se necessario

</deferred>

---

*Phase: 16-tipografia*
*Context gathered: 2026-03-25 via --auto (recommended defaults)*
