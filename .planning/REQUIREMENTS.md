# Requirements: Fly Up Milhas

**Defined:** 2026-03-24
**Core Value:** Converter visitantes em clientes da mentoria Fly Up Milhas atraves de uma LP de alta conversao

## v1.5 Requirements

Requirements para milestone v1.5 — Refinamento de Copy e Conversao. Baseado no feedback do cliente (PDF consideracoes-do-cliente-v1.pdf).

### Hero

- [ ] **HERO-01**: Hero exibe nova headline "Aprenda a viajar de classe executiva pagando até 80% menos, mesmo começando do zero."
- [ ] **HERO-02**: Hero exibe nova subheadline "Um método simples e prático para transformar seus gastos do dia a dia em milhas e viajar mais, gastando menos."
- [ ] **HERO-03**: CTA do hero exibe "Quero começar agora"
- [ ] **HERO-04**: Microcopy abaixo do CTA do hero

### About (Viaje mais. Gaste menos)

- [ ] **ABOUT-01**: Título "Viaje mais. Gaste menos. Use milhas do jeito certo."
- [ ] **ABOUT-02**: Texto com 3 funções: reforçar desejo, quebrar objeção, provar que funciona
- [ ] **ABOUT-03**: Frase de prova social destacada ("Alunos já economizaram milhares de reais em passagens mesmo sem cartão black ou renda alta.")
- [ ] **ABOUT-04**: 3 cards inferiores (conforto, economia, estratégia) com títulos e descrições do PDF
- [ ] **ABOUT-05**: Remoção completa de "renda extra" da seção

### Conteúdo Programático

- [ ] **PROG-01**: Palavras-chave em negrito nos 8 itens (via v-html)
- [ ] **PROG-02**: Novo subtítulo "Sem promessas milagrosas. Um método simples e prático para você usar milhas do jeito certo e realmente economizar em viagens."

### Para Quem É

- [ ] **FORW-01**: Cards negativos "Para quem NÃO é" integrados na mesma seção (3 itens: "Não é pra quem quer dinheiro fácil", "Não é pra quem não usa cartão", "Não é pra quem não vai aplicar")

### Como Funciona (Method)

- [ ] **METH-01**: Adicionar duração (30 dias), quantidade de encontros (3/mês, dias a combinar), suporte (Sim, via WhatsApp)
- [ ] **METH-02**: Copy focada em transformação e oportunidade, não simplicidade

### Social Proof (Resultados)

- [ ] **SOCL-01**: Título "Casos reais de quem já aplicou"
- [ ] **SOCL-02**: Depoimentos estilo chat WhatsApp (bolhas CSS) com dados mock realistas
- [ ] **SOCL-03**: Números e valores destacados em negrito nos depoimentos

### Preço + Garantia

- [ ] **PRCE-01**: Preço visível: R$ 299,90 no PIX ou até 10x no cartão (strings hard-coded)
- [ ] **PRCE-02**: Bloco de garantia dedicado: "Garantia de 7 dias — 100% do valor devolvido"
- [ ] **PRCE-03**: Layout de oferta (não "lista comum") com CTA

### Formulário

- [ ] **FORM-01**: Remover campo "Gasto mensal no cartão" (gastoMensal) — frontend + backend Zod schema sync
- [ ] **FORM-02**: Novas opções de objetivo: "Viajar pagando menos", "Viajar com mais conforto (classe executiva)", "Organizar e usar melhor meus pontos/milhas", "Ainda não sei / estou começando"
- [ ] **FORM-03**: Texto "Preencha o formulário e entraremos em contato em até 24h pelo WhatsApp."
- [ ] **FORM-04**: Badge "Seus dados estão seguros" abaixo do botão (fora do UForm)

### CTAs

- [ ] **CTA-01**: CTA topo (hero): "Quero começar agora"
- [ ] **CTA-02**: CTA meio (method/social proof): "Quero entender melhor"
- [ ] **CTA-03**: CTA final (price/form): "Quero entrar na mentoria"

### Identidade

- [ ] **IDEN-01**: Remoção de qualquer referência ao nome "Márcio" em todo o site — usar "Fly Up Milhas" ou "nossa equipe"
- [ ] **IDEN-02**: Remoção global de "renda extra com milhas" de toda a LP (copy, enums, meta tags)

### FAQ

- [ ] **FAQ-01**: Reformulação de perguntas e respostas focadas na dor de quem não conhece milhas

## Future Requirements

### Analytics

- **ANLT-01**: Tracking de cliques por posição de CTA (data-cta-position)
- **ANLT-02**: Funnel de conversão (view → scroll → form → submit)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sistema de pagamento online | Pagamento tratado fora da LP |
| Area de login/dashboard | Foco exclusivo na conversão |
| Blog ou seção de conteúdo | LP única sem navegação complexa |
| Renda extra com milhas | Cliente removeu do posicionamento — atrai público errado |
| Real WhatsApp screenshots | Marcio não forneceu prints; CSS bubbles como fallback |
| A/B testing de CTAs | Escopo futuro; implementar variação fixa primeiro |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 12 | Pending |
| HERO-02 | Phase 12 | Pending |
| HERO-03 | Phase 12 | Pending |
| HERO-04 | Phase 12 | Pending |
| ABOUT-01 | Phase 12 | Pending |
| ABOUT-02 | Phase 12 | Pending |
| ABOUT-03 | Phase 12 | Pending |
| ABOUT-04 | Phase 12 | Pending |
| ABOUT-05 | Phase 12 | Pending |
| PROG-01 | Phase 13 | Pending |
| PROG-02 | Phase 13 | Pending |
| FORW-01 | Phase 13 | Pending |
| METH-01 | Phase 12 | Pending |
| METH-02 | Phase 12 | Pending |
| SOCL-01 | Phase 13 | Pending |
| SOCL-02 | Phase 13 | Pending |
| SOCL-03 | Phase 13 | Pending |
| PRCE-01 | Phase 13 | Pending |
| PRCE-02 | Phase 13 | Pending |
| PRCE-03 | Phase 13 | Pending |
| FORM-01 | Phase 11 | Pending |
| FORM-02 | Phase 14 | Pending |
| FORM-03 | Phase 14 | Pending |
| FORM-04 | Phase 14 | Pending |
| CTA-01 | Phase 14 | Pending |
| CTA-02 | Phase 14 | Pending |
| CTA-03 | Phase 14 | Pending |
| IDEN-01 | Phase 12 | Pending |
| IDEN-02 | Phase 11 | Pending |
| FAQ-01 | Phase 12 | Pending |

**Coverage:**
- v1.5 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 — traceability complete, all 30 requirements mapped to phases 11-14*
