# Phase 19: FAQ Visual - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesenhar visualmente o FAQ com cards numerados, hierarquia clara entre pergunta e resposta, mantendo acessibilidade (keyboard navigation, focus ring, ARIA). Copy das perguntas/respostas nao muda. Comportamento accordion permanece.

</domain>

<decisions>
## Implementation Decisions

### Estilo visual
- **D-01:** Cada pergunta/resposta em card individual (bg-white, rounded-xl, shadow-sm ou border)
- **D-02:** Numero em destaque (01, 02, 03...) na cor azul primaria, posicionado a esquerda da pergunta
- **D-03:** Seta de abertura/fechamento (chevron) no lado direito
- **D-04:** Gap entre cards (~4-6px) para separacao visual clara
- **D-05:** Pergunta com texto mais proeminente (font-semibold, cor escura, tamanho maior que resposta)
- **D-06:** Resposta com texto mais leve (font-normal, cor muted ou text ligeiramente menor)

### Fundo e cores
- **D-07:** Fundo da secao permanece #F9FAFB (brand-bg) — respiro visual entre secoes escuras
- **D-08:** Cards em bg-white com borda sutil (border-gray-100) ou shadow-sm
- **D-09:** Numero do item em text-brand-primary (#1D4ED8)

### Comportamento
- **D-10:** Manter accordion single-open (UAccordion) — ao abrir um card, fecha o anterior
- **D-11:** Transicao suave na abertura/fechamento (UAccordion padrao)

### Acessibilidade (CRITICO)
- **D-12:** Keyboard navigation obrigatoria: Tab move foco entre triggers, Enter/Space abre/fecha
- **D-13:** Focus ring visivel em cada trigger — deve incluir focus-visible:ring-2 na :ui prop
- **D-14:** UAccordion :ui prop SUBSTITUI (nao merge) default classes — focus ring DEVE ser incluido explicitamente

### Claude's Discretion
- Tamanho exato do numero (text-lg, text-xl)
- Shadow vs border nos cards
- Padding interno dos cards
- Se o card aberto tem visual diferente (highlight sutil, borda azul)

</decisions>

<specifics>
## Specific Ideas

- O cliente quer que o FAQ "impacte mais" — cards numerados criam sensacao de organizacao e profissionalismo
- Numeros em azul primario criam ritmo visual (01, 02, 03...) que guia o olho
- A pesquisa de pitfalls alertou: UAccordion :ui prop e replacement, nao merge — focus ring pode ser perdido se nao incluido explicitamente

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current implementation
- `app/components/Section/SectionFAQ.vue` — UAccordion atual com :ui prop customizada

### Pitfalls
- `.planning/research/PITFALLS.md` — V5 (UAccordion :ui prop replaces default classes, focus ring must be explicit)
- `.planning/phases/15-paleta-e-gradientes/15-CONTEXT.md` — D-14 (WhatsApp green preserved, but irrelevant here)

### Research
- `.planning/research/FEATURES.md` — FAQ redesign patterns (numbered cards, two-column)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- UAccordion component from Nuxt UI v4 — already in use, handles ARIA and keyboard nav
- Current :ui prop override: `trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-primary min-w-0 text-[var(--color-brand-text)]'`

### Established Patterns
- faqItems array com { label, content } — adicionar campo `number` ou usar index
- UAccordion #default slot para pergunta, #content slot para resposta
- Secao usa bg-[var(--color-brand-bg)] com max-w-3xl mx-auto

### Integration Points
- SectionFAQ.vue e o unico arquivo que muda
- UAccordion slots (#default, #content) permitem customizacao total do visual

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 19-faq-visual*
*Context gathered: 2026-03-25*
