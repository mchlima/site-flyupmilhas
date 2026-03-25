# Phase 18: Avatares nos Depoimentos - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Adicionar avatar circular (foto real ou fallback de iniciais) a cada chat bubble de depoimento no SectionSocialProof.vue. Manter layout WhatsApp existente. Nao muda copy, ordem, ou estilo dos bubbles.

</domain>

<decisions>
## Implementation Decisions

### Posicao do avatar
- **D-01:** Avatar circular posicionado AO LADO do chat bubble — esquerda para bubbles alinhados a esquerda, direita para bubbles alinhados a direita
- **D-02:** Avatar ~40-48px circular (rounded-full, object-cover)
- **D-03:** Flex row no desktop e mobile — avatar e bubble lado a lado

### Fotos reais
- **D-04:** 3 fotos ja existem em app/assets/img/:
  - `ana-paula-profile.png` — Ana Paula
  - `carlos-eduardo-profile.png` — Carlos Eduardo
  - `juliana-martins-profile.png` — Juliana Martins
- **D-05:** Usar `<img>` com import de asset Vite (nao NuxtImg — R2 nao confirmado para local assets)
- **D-06:** Adicionar campo `avatar` ao objeto testimonials no script setup (path do import)

### Fallback de iniciais
- **D-07:** Quando avatar nao disponivel, exibir iniciais do nome em circulo colorido
- **D-08:** Cor de fundo deterministica baseada no nome (hash do nome → indice de cor)
- **D-09:** Iniciais brancas (text-white) sobre fundo colorido
- **D-10:** Paleta de fallback: usar tons da nova paleta (azul, cyan, slate) para manter coerencia

### Integracao no layout
- **D-11:** Nome e cidade permanecem abaixo do bubble (nao se movem pro lado do avatar)
- **D-12:** Manter max-width: min(85%, 400px) no container bubble+avatar
- **D-13:** WhatsApp green #DCF8C6 nos bubbles permanece inalterado

### Claude's Discretion
- Tamanho exato do avatar (40-48px range)
- Gap exato entre avatar e bubble
- Algoritmo de hash para cor deterministica (simple string hash → modulo N cores)
- Se precisa ajustar a largura do bubble pra acomodar o avatar

</decisions>

<specifics>
## Specific Ideas

- O cliente pediu especificamente "foto da pessoa que testemunhou" + "avatar com iniciais (formato circular)" como fallback
- As fotos sao de alta qualidade (quadradas, ~1024px) com enquadramento de rosto — perfeitas para crop circular
- Estilo WhatsApp real: avatar ao lado do bubble e o padrao reconhecivel
- As 3 fotos atuais todas tem rostos claros e sorrindo — boa credibilidade visual

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current implementation
- `app/components/Section/SectionSocialProof.vue` — Componente atual, dados dos testimonials, CSS dos bubbles

### Assets
- `app/assets/img/ana-paula-profile.png` — Foto Ana Paula
- `app/assets/img/carlos-eduardo-profile.png` — Foto Carlos Eduardo
- `app/assets/img/juliana-martins-profile.png` — Foto Juliana Martins

### Research
- `.planning/research/FEATURES.md` — Testimonial avatar patterns, UAvatar component capabilities
- `.planning/research/ARCHITECTURE.md` — Avatar data shape extension, photo upgrade path

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 3 profile photos em app/assets/img/ — prontos pra uso
- Tailwind rounded-full + object-cover — padrao para avatares circulares

### Established Patterns
- Testimonials array no script setup com { name, city, text } — adicionar campo avatar
- Alternating layout com index % 2 — avatar segue a mesma logica (esquerda/direita)
- Chat bubble CSS scoped com pseudo-elements (::before) para seta

### Integration Points
- SectionSocialProof.vue e o unico arquivo que muda
- Fotos importadas via Vite: `import anaPhoto from '~/assets/img/ana-paula-profile.png'`
- Nenhum outro componente referencia esses dados

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 18-avatares-nos-depoimentos*
*Context gathered: 2026-03-25*
