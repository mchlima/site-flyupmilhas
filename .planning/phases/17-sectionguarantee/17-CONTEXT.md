# Phase 17: SectionGuarantee - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Nova secao SectionGuarantee.vue com selo dourado PNG + copy de confianca, posicionada entre SectionPrice e SectionFAQ em app.vue. Um componente novo, uma linha em app.vue. Nao muda nenhum outro componente.

</domain>

<decisions>
## Implementation Decisions

### Layout
- **D-01:** Split layout — selo na esquerda, titulo + texto na direita (desktop)
- **D-02:** Mobile: stacks verticalmente — selo centralizado acima, texto abaixo
- **D-03:** Selo ~200px no mobile, ~250px no desktop (imagem grande mas nao dominante)

### Copy
- **D-04:** Tom acolhedor e direto — "sem risco pra voce", empatico, elimina medo
- **D-05:** Titulo: algo como "Sua tranquilidade e nossa prioridade" (Claude pode ajustar)
- **D-06:** Texto: comunicar "7 dias, 100% devolvido, sem perguntas, sem burocracia"
- **D-07:** Usar as copy constants do STATE.md: Guarantee = "7 dias — 100% devolvido"

### Fundo e visual
- **D-08:** Fundo escuro (#0F172A brand-dark) — continua o fluxo visual da SectionPrice, selo dourado brilha no contraste
- **D-09:** Pode usar gradiente diagonal sutil (similar ao gradient-price ou gradient-form) para manter consistencia visual
- **D-10:** Texto em branco sobre fundo escuro

### Posicionamento
- **D-11:** Inserir em app.vue entre SectionPrice e SectionFAQ
- **D-12:** Usar tag <SectionGuarantee /> diretamente (auto-import do Nuxt)

### Asset
- **D-13:** Selo PNG ja existe em app/assets/img/selo-garantia7-dias.png — usar com <img> ou <NuxtImg> se R2 configurado
- **D-14:** PNG tem fundo preto nos cantos — usar com fundo escuro elimina esse problema visualmente

### Claude's Discretion
- Tamanho exato do selo (200-280px range)
- Padding e espacamento interno da secao
- Se adicionar borda sutil ou glow no selo
- Breakpoint exato para stack mobile (md: ou lg:)

</decisions>

<specifics>
## Specific Ideas

- O selo dourado com fundo escuro cria um momento visual forte no fluxo — Price (escuro) → Guarantee (escuro com selo dourado) → FAQ (claro) → Form (escuro)
- Tom acolhedor combina com o posicionamento de mentoria (nao e uma venda agressiva)
- O selo ja tem cantos escuros no PNG, entao fundo dark esconde isso naturalmente

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Component patterns
- `app/components/Section/SectionPrice.vue` — Referencia de secao com fundo escuro, padrao de styling
- `app/app.vue` — Ordem de secoes, onde inserir SectionGuarantee

### Asset
- `app/assets/img/selo-garantia7-dias.png` — Selo dourado existente (750x750px)

### Research
- `.planning/research/FEATURES.md` — Guarantee section design patterns, standalone vs inline
- `.planning/research/ARCHITECTURE.md` — SectionGuarantee component structure

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `selo-garantia7-dias.png` em app/assets/img/ — pronto pra uso
- `gradient-form` ou `gradient-price` utility em main.css — pode reusar ou criar gradient-guarantee

### Established Patterns
- Todas as secoes usam `<section>` com classes Tailwind
- Secoes escuras usam `bg-brand-dark` ou gradient utilities
- Texto branco com `text-white`, titulos com `font-semibold tracking-[-0.015em]`
- CTA pattern: `bg-brand-cta hover:bg-brand-cta-hover text-white`

### Integration Points
- `app.vue` linha 46-47: inserir `<SectionGuarantee />` entre `<SectionPrice />` e `<SectionFAQ />`
- Auto-import: basta criar o arquivo em app/components/Section/

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 17-sectionguarantee*
*Context gathered: 2026-03-25*
