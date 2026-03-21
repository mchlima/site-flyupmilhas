# Requirements: Fly Up Milhas

**Defined:** 2026-03-21
**Core Value:** Converter visitantes em clientes da consultoria VIP atraves de uma LP de alta conversao

## v1 Requirements

### Hero & Branding

- [x] **HERO-01**: Hero section com headline focado em beneficio ("Sua proxima viagem de executiva custa menos que um jantar fora")
- [x] **HERO-02**: Subheadline explicando o mecanismo (consultoria personalizada)
- [x] **HERO-03**: CTA unico acima da dobra ("Quero minha Consultoria") em cor de destaque (laranja/dourado)
- [x] **HERO-04**: Layout mobile-first responsivo com fundo claro (off-white/cinza ultra claro)
- [x] **HERO-05**: Tipografia sans-serif moderna (Inter ou Geist) com legibilidade maxima

### Autoridade

- [x] **AUTH-01**: Secao do especialista com foto, bio e resultados reais do Marcio
- [x] **AUTH-02**: Numeros especificos de resultados (milhas acumuladas, paises visitados, economia gerada)

### Metodo

- [x] **METD-01**: Secao "Como Funciona" com 4 passos visuais (Diagnostico, Estrategia, Execucao, Voo)
- [x] **METD-02**: Descricao clara da oferta (R$200, 2 reunioes, 1 mes acompanhamento, entregaveis)

### Prova Social

- [x] **SOCL-01**: Secao de depoimentos com nomes reais e resultados especificos (R$ economizados, destinos, classe)
- [x] **SOCL-02**: Prints de resultados reais (passagens emitidas, screenshots de economia)

### Formulario de Leads

- [x] **LEAD-01**: Formulario com 4 campos: nome, WhatsApp (mascara BR), gasto mensal no cartao, objetivo principal
- [x] **LEAD-02**: Validacao client-side com Zod (campos obrigatorios, formato WhatsApp)
- [x] **LEAD-03**: Submissao via $fetch para endpoint Fastify POST /leads
- [x] **LEAD-04**: Feedback visual de sucesso/erro apos submissao
- [x] **LEAD-05**: Protecao anti-spam (honeypot field)

### CTA & Conversao

- [x] **CTA-01**: WhatsApp como CTA primario com link wa.me/ e mensagem pre-preenchida
- [x] **CTA-02**: Preco visivel (R$200) com ancoragem de valor (economia media vs custo)
- [x] **CTA-03**: Secao FAQ com 5-7 perguntas que tratam objecoes de compra

### Infraestrutura

- [x] **INFR-01**: Projeto Nuxt 4 com SSR configurado (nuxt.config.ts, Nuxt UI v4, design tokens)
- [x] **INFR-02**: Assets estaticos servidos via Cloudflare R2 (imagens otimizadas)
- [x] **INFR-03**: SEO basico (meta tags, Open Graph, structured data para servico)
- [x] **INFR-04**: Performance: LCP < 2s, pagina inteira < 3s em 3G

### Integracao Backend

- [x] **BACK-01**: Endpoint Fastify POST /leads com validacao e armazenamento no MongoDB
- [x] **BACK-02**: CORS configurado no Fastify para dominio da LP
- [x] **BACK-03**: Rate limiting no endpoint de leads (@fastify/rate-limit)

## v1.1 Requirements — Refinamento Visual

### Visual & Layout

- [ ] **VISL-01**: Background da pagina corrigido para off-white limpo (remover tom amarelado)
- [ ] **VISL-02**: Layout bento grid nas secoes principais com cards levemente arredondados, visual moderno e marcante
- [x] **VISL-03**: Contraste do texto no FAQ melhorado para legibilidade adequada

### Navegacao

- [ ] **NAV-01**: Menu responsivo no header com links ancora para secoes da LP (Sobre, Como Funciona, Depoimentos, FAQ, Contato)
- [ ] **NAV-02**: CTA destacado no menu ("Quero minha Consultoria") em cor de destaque
- [ ] **NAV-03**: Menu hamburger no mobile com animacao de abertura/fechamento

### Conteudo & Secoes

- [x] **CONT-01**: Secao "Sobre a Fly Up Milhas" substituindo secao do especialista — foco na empresa, nao na pessoa
- [x] **CONT-02**: Proposta de valor inclui renda extra com milhas alem de viagens
- [x] **CONT-03**: Remover elemento "Comprovante de Resultado" (screenshot) da secao de prova social

### Formulario & Footer

- [ ] **FORM-01**: Layout do formulario melhorado com melhor espacamento e alinhamento
- [ ] **FORM-02**: Alinhamento do texto no botao de submit corrigido
- [ ] **FOOT-01**: Footer inclui credito "Desenvolvido por Agencia 201"

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

### v1.0

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 2 | Complete |
| HERO-02 | Phase 2 | Complete |
| HERO-03 | Phase 2 | Complete |
| HERO-04 | Phase 2 | Complete |
| HERO-05 | Phase 2 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| METD-01 | Phase 2 | Complete |
| METD-02 | Phase 2 | Complete |
| SOCL-01 | Phase 2 | Complete |
| SOCL-02 | Phase 2 | Complete |
| LEAD-01 | Phase 3 | Complete |
| LEAD-02 | Phase 3 | Complete |
| LEAD-03 | Phase 3 | Complete |
| LEAD-04 | Phase 3 | Complete |
| LEAD-05 | Phase 3 | Complete |
| CTA-01 | Phase 3 | Complete |
| CTA-02 | Phase 2 | Complete |
| CTA-03 | Phase 2 | Complete |
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| INFR-04 | Phase 1 | Complete |
| BACK-01 | Phase 1 | Complete |
| BACK-02 | Phase 1 | Complete |
| BACK-03 | Phase 1 | Complete |

**v1.0 Coverage:**
- Requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0 ✓

### v1.1

| Requirement | Phase | Status |
|-------------|-------|--------|
| VISL-01 | Phase 4 | Pending |
| VISL-02 | Phase 4 | Pending |
| VISL-03 | Phase 4 | Complete |
| NAV-01 | Phase 4 | Pending |
| NAV-02 | Phase 4 | Pending |
| NAV-03 | Phase 4 | Pending |
| CONT-01 | Phase 4 | Complete |
| CONT-02 | Phase 4 | Complete |
| CONT-03 | Phase 4 | Complete |
| FORM-01 | Phase 5 | Pending |
| FORM-02 | Phase 5 | Pending |
| FOOT-01 | Phase 5 | Pending |

**v1.1 Coverage:**
- Requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 — v1.1 traceability added (phases 4-5)*
