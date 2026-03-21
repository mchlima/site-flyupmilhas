# Requirements: Fly Up Milhas

**Defined:** 2026-03-21
**Core Value:** Converter visitantes em clientes da consultoria VIP atraves de uma LP de alta conversao

## v1 Requirements

### Hero & Branding

- [ ] **HERO-01**: Hero section com headline focado em beneficio ("Sua proxima viagem de executiva custa menos que um jantar fora")
- [ ] **HERO-02**: Subheadline explicando o mecanismo (consultoria personalizada)
- [ ] **HERO-03**: CTA unico acima da dobra ("Quero minha Consultoria") em cor de destaque (laranja/dourado)
- [ ] **HERO-04**: Layout mobile-first responsivo com fundo claro (off-white/cinza ultra claro)
- [ ] **HERO-05**: Tipografia sans-serif moderna (Inter ou Geist) com legibilidade maxima

### Autoridade

- [ ] **AUTH-01**: Secao do especialista com foto, bio e resultados reais do Marcio
- [ ] **AUTH-02**: Numeros especificos de resultados (milhas acumuladas, paises visitados, economia gerada)

### Metodo

- [ ] **METD-01**: Secao "Como Funciona" com 4 passos visuais (Diagnostico, Estrategia, Execucao, Voo)
- [ ] **METD-02**: Descricao clara da oferta (R$200, 2 reunioes, 1 mes acompanhamento, entregaveis)

### Prova Social

- [ ] **SOCL-01**: Secao de depoimentos com nomes reais e resultados especificos (R$ economizados, destinos, classe)
- [ ] **SOCL-02**: Prints de resultados reais (passagens emitidas, screenshots de economia)

### Formulario de Leads

- [ ] **LEAD-01**: Formulario com 4 campos: nome, WhatsApp (mascara BR), gasto mensal no cartao, objetivo principal
- [ ] **LEAD-02**: Validacao client-side com Zod (campos obrigatorios, formato WhatsApp)
- [ ] **LEAD-03**: Submissao via $fetch para endpoint Fastify POST /leads
- [ ] **LEAD-04**: Feedback visual de sucesso/erro apos submissao
- [ ] **LEAD-05**: Protecao anti-spam (honeypot field)

### CTA & Conversao

- [ ] **CTA-01**: WhatsApp como CTA primario com link wa.me/ e mensagem pre-preenchida
- [ ] **CTA-02**: Preco visivel (R$200) com ancoragem de valor (economia media vs custo)
- [ ] **CTA-03**: Secao FAQ com 5-7 perguntas que tratam objecoes de compra

### Infraestrutura

- [ ] **INFR-01**: Projeto Nuxt 4 com SSR configurado (nuxt.config.ts, Nuxt UI v4, design tokens)
- [ ] **INFR-02**: Assets estaticos servidos via Cloudflare R2 (imagens otimizadas)
- [ ] **INFR-03**: SEO basico (meta tags, Open Graph, structured data para servico)
- [ ] **INFR-04**: Performance: LCP < 2s, pagina inteira < 3s em 3G

### Integracao Backend

- [ ] **BACK-01**: Endpoint Fastify POST /leads com validacao e armazenamento no MongoDB
- [ ] **BACK-02**: CORS configurado no Fastify para dominio da LP
- [ ] **BACK-03**: Rate limiting no endpoint de leads (@fastify/rate-limit)

## v2 Requirements

### Otimizacao

- **OPT-01**: A/B testing de headlines e CTAs
- **OPT-02**: Analytics de conversao (Plausible ou similar, LGPD-compliant)
- **OPT-03**: Pixel de remarketing (Meta/Google) com consent banner LGPD

### Conteudo Avancado

- **CONT-01**: Video do Marcio explicando abordagem (click-to-play, nao autoplay)
- **CONT-02**: Secao "Para voce que..." com 3 personas (executiva, familia, renda extra)
- **CONT-03**: Garantia de satisfacao (validar com Marcio)
- **CONT-04**: Indicador de vagas limitadas (escassez real baseada na capacidade do Marcio)

### Notificacoes

- **NOTF-01**: Notificacao via WhatsApp Business API quando lead submete formulario
- **NOTF-02**: Email de confirmacao automatico para o lead

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sistema de pagamento online | Pagamento tratado offline via WhatsApp, fora do escopo da LP |
| Area de login/dashboard | Foco exclusivo em conversao, sem complexidade de autenticacao |
| Blog ou secao de conteudo | Dilui objetivo de conversao, requer manutencao continua |
| Navegacao multi-pagina | Links externos sao vazamento de conversao; LP e single-scroll |
| Chatbot / live chat | WhatsApp ja fornece acesso humano direto; chatbot frustra consumidor BR |
| Countdown timer fake | Destrói confianca; consumidor BR cada vez mais atento a urgencia artificial |
| Video autoplay | Bloqueado em maioria dos browsers mobile; impacto negativo em performance |
| Feed de redes sociais | Quebra performance; conteudo algoritmico e imprevisivel |
| OAuth / login social | Email/password nao aplicavel; LP nao tem area autenticada |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| METD-01 | Phase 2 | Pending |
| METD-02 | Phase 2 | Pending |
| SOCL-01 | Phase 2 | Pending |
| SOCL-02 | Phase 2 | Pending |
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| LEAD-03 | Phase 3 | Pending |
| LEAD-04 | Phase 3 | Pending |
| LEAD-05 | Phase 3 | Pending |
| CTA-01 | Phase 3 | Pending |
| CTA-02 | Phase 2 | Pending |
| CTA-03 | Phase 2 | Pending |
| INFR-01 | Phase 1 | Pending |
| INFR-02 | Phase 1 | Pending |
| INFR-03 | Phase 1 | Pending |
| INFR-04 | Phase 1 | Pending |
| BACK-01 | Phase 1 | Pending |
| BACK-02 | Phase 1 | Pending |
| BACK-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after phase mapping*
