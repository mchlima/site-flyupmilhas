# Fly Up Milhas

## What This Is

Uma landing page de alta conversao para a Fly Up Milhas, focada na venda de consultoria personalizada (R$ 200) para otimizacao de acumulo de milhas, emissao estrategica de passagens aereas e renda extra com milhas. O produto principal e uma consultoria VIP de 1 mes com 2 reunioes online, diagnostico de cartoes/programas e planejamento de rotas.

## Core Value

Converter visitantes em clientes da consultoria VIP atraves de uma LP que transmita autoridade, confianca e resultados reais no mercado de milhas.

## Current State

Shipped v1.0 (MVP) and v1.1 (Refinamento Visual) on 2026-03-21.
Tech stack: Nuxt 4 SSR + Nuxt UI v4 + Tailwind v4 + Fastify 5 + MongoDB.
Codebase: ~1056 LOC across 12 Vue components, 2 composables, 1 CSS file.
Landing page is feature-complete with all sections, lead form, and visual polish.

**Pre-launch blockers:**
- Replace `55XXXXXXXXXXX` WhatsApp placeholder with Marcio's real number
- Replace Agencia 201 URL placeholder with real URL
- Upload real photos/assets to Cloudflare R2
- Confirm Cloudflare plan supports Image Transformations

## Requirements

### Validated

- ✓ SSR via Nuxt 4 para SEO e performance — v1.0
- ✓ Design tokens (paleta azul aviacao + fundo claro + CTA laranja/dourado) — v1.0
- ✓ Tipografia sans-serif moderna (Inter via @nuxt/fonts) — v1.0
- ✓ Performance mobile-first com carregamento ultra rapido — v1.0
- ✓ Integracao com backend Fastify para armazenamento de leads no MongoDB — v1.0
- ✓ Assets estaticos servidos via Cloudflare R2 — v1.0
- ✓ Hero section com copy de impacto e CTA para consultoria — v1.0
- ✓ Secao do especialista (bio do Marcio com resultados reais) — v1.0
- ✓ Secao "Como Funciona" com 4 passos visuais — v1.0
- ✓ Secao de prova social (depoimentos e prints de resultados) — v1.0
- ✓ Formulario de qualificacao de leads (4 campos) — v1.0
- ✓ Background off-white limpo (#F9FAFB) — v1.1
- ✓ Header smart sticky com ancoras e CTA destacado — v1.1
- ✓ Hamburger menu mobile com overlay fullscreen — v1.1
- ✓ Secao "Sobre a Fly Up Milhas" com bento grid e renda extra — v1.1
- ✓ Remocao do comprovante de resultado — v1.1
- ✓ Bento grid layout com cards arredondados — v1.1
- ✓ Contraste FAQ texto WCAG AA — v1.1
- ✓ Formulario em card navy com espacamento e botao centralizado — v1.1
- ✓ Footer split layout com credito Agencia 201 e WhatsApp — v1.1

- ✓ FAQ accordion labels com contraste #1a1a1a — v1.2
- ✓ Titulo SectionAbout "Sua estrategia de milhas comeca aqui" — v1.2
- ✓ Step 4 "Autonomia" com texto sobre independencia — v1.2
- ✓ Card "O que esta incluido" removido, SectionPrice enriquecida (5 itens) — v1.2
- ✓ Form inputs bg-white com bordas visiveis no card navy — v1.2
- ✓ Botao flutuante back-to-top com scroll detection — v1.2

- ✓ Copy "consultoria" → "mentoria" em toda a LP — v1.3
- ✓ CTA "Quero dar o primeiro passo" em todos os pontos — v1.3
- ✓ Pain points no hero (badges) — v1.3
- ✓ SectionMethod com 3 encontros + Autonomia — v1.3
- ✓ SectionPrice sem preco, com 5 beneficios — v1.3
- ✓ SectionAbout com copy de mentoria — v1.3
- ✓ Secao Conteudo Programatico (8 itens) — v1.3
- ✓ Secao Para quem e (5 cards qualificacao) — v1.3
- ✓ SEO meta tags atualizadas para mentoria — v1.3

### Active

(No active requirements — v1.2 milestone complete)

## Current Milestone: v1.4 Logo, Acentuacao e Form Design

**Goal:** Adicionar logo no header, corrigir acentuacao em toda a LP, e melhorar design do formulario.

**Target features:**
- Logo PNG no header substituindo texto "Fly Up Milhas"
- Correcao de acentuacao em todos os componentes Vue
- Redesign do formulario: remover card pesado, manter fundo azul da section

### Out of Scope

- Sistema de pagamento online — pagamento sera tratado fora da LP
- Area de login/dashboard do cliente — foco exclusivo na conversao
- Blog ou secao de conteudo — LP unica sem navegacao complexa
- Integracao com redes sociais — nao mencionado no escopo inicial

## Context

- Cliente: Marcio (Fly Up Milhas), especialista em milhas aereas
- Oferta: Consultoria VIP por R$ 200 (pagamento unico), 1 mes de acompanhamento, 2 reunioes online
- Entregaveis da consultoria: diagnostico de cartoes, planejamento de rotas/emissoes, suporte no check-in
- Backend Fastify ja configurado
- Storage via Cloudflare R2 ja planejado
- Publico-alvo: pessoas que querem viajar de classe executiva gastando menos, familias buscando economia, interessados em renda extra com milhas

## Constraints

- **Tech Stack**: Nuxt 4 (SSR) + Nuxt UI v4 (Tailwind CSS v4)
- **Backend**: Fastify 5 API — integrar, nao recriar
- **Database**: MongoDB — para leads e configuracoes
- **Storage**: Cloudflare R2 — para imagens e assets estaticos
- **Performance**: Mobile-first, carregamento ultra rapido
- **Design**: Paleta azul aviacao (#1a3a5c), fundo off-white (#F9FAFB), CTA laranja (#e67e22)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nuxt 4 com SSR (upgraded from Nuxt 3) | Nuxt 3 EOL July 2026, Nuxt 4 is current | ✓ Good |
| Nuxt UI v4 como framework de componentes | Tailwind CSS v4 integrado, componentes headless | ✓ Good |
| Formulario de qualificacao em vez de compra direta | Filtrar clientes ideais antes do contato | ✓ Good |
| Plain button over UButton for CTA | Exact design token usage, avoid Reka UI internal styling | ✓ Good |
| SectionAbout replacing SectionExpert | Company-focused, not personal bio — renda extra as equal value prop | ✓ Good |
| Bento grid card layout | Modern visual pattern, cards with rounded corners improve scannability | ✓ Good |
| Smart sticky header (show on scroll-up) | Better UX than always-visible or always-hidden — saves screen space | ✓ Good |
| Navy card for lead form | Conversion emphasis pattern — orange CTA on navy is highest contrast | ✓ Good |

---
*Last updated: 2026-03-22 after v1.3 milestone complete*
