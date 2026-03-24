# Phase 12: Copy Rewrite & Identity Sweep - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite Hero, About, Method, and FAQ copy based on client PDF feedback. Remove all "Márcio" name references from form, expert component, meta tags, and WhatsApp URLs. SocialProof testimonials are NOT touched here (Phase 13 recreates them as WhatsApp bubbles). Form field labels/placeholders already correct from Phase 11.

</domain>

<decisions>
## Implementation Decisions

### Hero Section (SectionHero.vue)
- **D-01:** Headline: "Aprenda a viajar de classe executiva pagando até 80% menos, mesmo começando do zero."
- **D-02:** Subheadline: "Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos."
- **D-03:** CTA button text: "Quero começar agora"
- **D-04:** Microcopy below CTA: "Comece a economizar já no primeiro mês"
- **D-05:** Pain point badges remain (already good: "Viajar de avião é caro", "Milhas é só para quem tem cartão black", "Não sei por onde começar")

### SectionAbout Rewrite (SectionAbout.vue)
- **D-06:** Section title: "Viaje mais. Gaste menos. Use milhas do jeito certo."
- **D-07:** Body text structured in 3 parts: (1) Reforçar desejo — viajar mais, (2) Quebrar objeção — "isso é caro/difícil", (3) Provar que funciona
- **D-08:** Example body text from PDF: "A maioria das pessoas acumula milhas, mas não sabe como usar e acaba pagando caro em passagens. Na Fly Up Milhas, você aprende de forma simples, como transformar seus gastos do dia a dia em viagens reais, pagando muito menos."
- **D-09:** Social proof phrase highlighted (visually distinct): "Alunos já economizaram milhares de reais em passagens mesmo sem cartão black ou renda alta."
- **D-10:** 3 cards below (replacing current bento grid):
  - Card 1: "Viaje com mais conforto pagando menos" — "Voe de classe executiva para Europa, Ásia e Américas pagando apenas uma fração do valor original."
  - Card 2: "Economize nas viagens do dia a dia" — "Transforme seus gastos comuns em milhas e reduza drasticamente o custo das suas passagens."
  - Card 3: "Use suas milhas com estratégia" — "Aprenda a acumular, organizar e usar seus pontos da forma certa para nunca mais perder oportunidades."
- **D-11:** Remove hero card (large card with "Viaje mais. Gaste menos. Ganhe com as suas milhas.") — replace with the structured title/text/proof layout above
- **D-12:** No "renda extra" anywhere (already clean from Phase 11, but verify)

### SectionMethod Rewrite (SectionMethod.vue)
- **D-13:** Add visible info: "Duração: 30 dias", "3 encontros no mês (dias a combinar)", "Suporte via WhatsApp: Sim"
- **D-14:** Copy tone: sell transformation and vision of opportunity, NOT simplicity
- **D-15:** Keep 4-step structure (3 encounters + Autonomia) but enrich copy to convey transformation
- **D-16:** Client said "Eu não quero vender simplicidade, quero vender transformação e visão de oportunidade"

### FAQ Rewrite (SectionFAQ.vue)
- **D-17:** Claude writes all questions and answers — focused on beginner pain points (people who don't know miles world)
- **D-18:** Target pain points: "É caro?", "Funciona pra mim?", "Preciso de cartão premium?", "Quanto tempo leva?", "E se não gostar?", "Como funciona o pagamento?"
- **D-19:** Answers must be empathetic, concrete, and include the guarantee (7 days) where relevant
- **D-20:** Remove TODO marker "replace with real Q&A from Marcio"
- **D-21:** Subtitle changed to: "Sem promessas milagrosas. Um método simples e prático para você usar milhas do jeito certo e realmente economizar em viagens." (Wait — this is for ProgramContent, not FAQ. Keep FAQ subtitle as-is or improve naturally.)

### Identity Sweep (IDEN-01)
- **D-22:** SectionLeadForm.vue line 53: "Preencha e Marcio entra em contato..." → "Preencha o formulário e entraremos em contato em até 24h pelo WhatsApp."
- **D-23:** SectionLeadForm.vue WhatsApp URL text: "Ola%20Marcio%2C..." → "Ola%2C%20quero%20saber%20mais%20sobre%20a%20mentoria%20Fly%20Up%20Milhas."
- **D-24:** SectionSocialProof.vue — DO NOT TOUCH. Phase 13 recreates this entirely as WhatsApp bubbles.
- **D-25:** SectionExpert.vue — File exists but is NOT wired in app.vue (replaced by SectionAbout in v1.1). Leave file as-is, it's dead code.
- **D-26:** grep verify at end: zero "Marcio" or "Márcio" in rendered components (excluding SectionExpert.vue which is unwired, and SectionSocialProof.vue which is Phase 13 scope)

### Claude's Discretion
- Exact visual treatment of the social proof phrase in SectionAbout (bold, highlight, separate block)
- SectionAbout layout restructure (flex vs grid, card styling)
- FAQ question ordering and exact wording
- Method step copy enrichment (transformation tone)
- Whether to remove SectionExpert.vue file entirely or leave as dead code

</decisions>

<specifics>
## Specific Ideas

- Client PDF provides exact text for Hero headline, subheadline, About title, About body, About cards, and ProgramContent subtitle
- Client emphasized: "tem que ter 3 funções: Reforçar o desejo (viajar mais), Quebrar objeção ('isso é caro / difícil'), Começar a provar que funciona"
- Client emphasized: "Talvez seria legal, separar bem título / texto / prova" — clear visual separation in SectionAbout
- Client said: "Eu não quero vender simplicidade, quero vender transformação e visão de oportunidade" for Method
- FAQ: "Pensando na dor de quem não conhece o mundo das milhas"

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Client feedback
- `docs/considerações-do-cliente-v1.pdf` — Pages 1-2 cover Hero, About, ProgramContent. Page 3 covers Method. Pages 4-5 cover FAQ and Form identity.

### Source files to modify
- `app/components/Section/SectionHero.vue` — Hero copy (headline line 31, subheadline lines 34-38, CTA line 45, badges lines 22-26)
- `app/components/Section/SectionAbout.vue` — Full rewrite (title, body, proof phrase, cards)
- `app/components/Section/SectionMethod.vue` — Copy enrichment + add duration/meetings/support info
- `app/components/Section/SectionFAQ.vue` — Full Q&A rewrite
- `app/components/Section/SectionLeadForm.vue` — Identity sweep (line 53 subtitle, line 5 WhatsApp URL text)

### Prior phase artifacts
- `.planning/phases/11-backend-schema-cleanup/11-CONTEXT.md` — Form is now 3 fields (nome, email, whatsapp); "renda extra" already purged

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- SectionAbout bento grid: currently uses CSS Grid with `grid-cols-1 md:grid-cols-2` pattern. Can be adapted for 3 equal cards.
- SectionMethod step data: array of objects `{ step, title, description }` — easy to enrich.
- SectionFAQ: uses UAccordion with items array `{ label, content }` — just replace the data.

### Established Patterns
- All sections follow same structure: `<section id="..." class="...">` with container div
- Copy stored as inline text in templates (not in separate data files)
- CTA buttons use plain `<a>` tags with `scrollToElement('formulario')` onclick
- Pain point badges in Hero use flex-wrap spans

### Integration Points
- app.vue wires all sections — no changes needed there
- CTA scroll targets `#formulario` — stays the same
- SectionExpert.vue NOT wired in app.vue (dead code since v1.1)

</code_context>

<deferred>
## Deferred Ideas

- SectionSocialProof "Márcio" references — Phase 13 recreates entire section
- SectionProgramContent bold keywords + new subtitle — Phase 13 (PROG-01, PROG-02)
- SectionForWhom "Para quem NÃO é" cards — Phase 13 (FORW-01)
- CTA text variations per position — Phase 14 (CTA-01..03). Phase 12 uses "Quero começar agora" for Hero only; other CTAs stay as "Quero dar o primeiro passo" until Phase 14 changes them.

</deferred>

---

*Phase: 12-copy-rewrite-identity-sweep*
*Context gathered: 2026-03-24*
