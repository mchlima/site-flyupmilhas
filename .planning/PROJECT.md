# Fly Up Milhas

## What This Is

Uma landing page premium de alta conversao para a Fly Up Milhas, focada na venda de mentoria personalizada (R$ 299,90) para acumulo estrategico de milhas e emissao de passagens em classe executiva. Identidade visual sofisticada com paleta azul vibrante, tipografia Plus Jakarta Sans, gradientes de aviacao e componentes de confianca (garantia, depoimentos com fotos, FAQ numerado).

## Core Value

Converter visitantes em clientes da mentoria VIP atraves de uma LP que transmita autoridade, sofisticacao e resultados reais no mercado de milhas.

## Current State

Shipped v1.0 through v1.6 (Upgrade de Identidade Visual) on 2026-03-25.
Tech stack: Nuxt 4 SSR + Nuxt UI v4 + Tailwind v4 + Fastify 5 + MongoDB.
Codebase: 13 Vue components, 2 composables, 1 CSS file with 5 gradient utilities.
Landing page com identidade visual premium: paleta azul #1D4ED8, tipografia Plus Jakarta Sans, gradientes diagonais, SectionGuarantee com selo dourado, avatares nos depoimentos, FAQ numerado.

**Pre-launch blockers:**
- Replace `55XXXXXXXXXXX` WhatsApp placeholder with Marcio's real number
- Replace Agencia 201 URL placeholder with real URL
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
- ✓ Seção Para quem é (5 cards qualificação) — v1.3
- ✓ SEO meta tags atualizadas para mentoria — v1.3
- ✓ Logo PNG no header substituindo texto — v1.4
- ✓ Acentuação corrigida em todos os componentes — v1.4
- ✓ Formulário sem card, campos direto no fundo navy — v1.4
- ✓ Instagram CTA block + link no footer — v1.4
- ✓ Footer cor separada do formulário (#0f2039) — v1.4
- ✓ Formulário 3 campos (nome, email, whatsapp) — gastoMensal e objetivo removidos — v1.5 Phase 11
- ✓ "Renda extra" removido de todo o código e copy — v1.5 Phase 11
- ✓ Campo email adicionado ao schema (frontend + backend) — v1.5 Phase 11
- ✓ Hero reescrito (headline 80% menos, subheadline, CTA, microcopy) — v1.5 Phase 12
- ✓ SectionAbout reescrito (titulo/texto/prova + 3 cards conforto/economia/estrategia) — v1.5 Phase 12
- ✓ SectionMethod enriquecido (30 dias, 3 encontros, suporte WhatsApp, copy transformacao) — v1.5 Phase 12
- ✓ FAQ reescrito para dor de iniciantes (6 perguntas) — v1.5 Phase 12
- ✓ "Marcio" removido de componentes renderizados (form, WhatsApp URL) — v1.5 Phase 12
- ✓ Depoimentos WhatsApp chat bubbles (3 testimonials, CSS green, mobile-safe) — v1.5 Phase 13
- ✓ ProgramContent com negritos v-html + novo subtitulo — v1.5 Phase 13
- ✓ "Para quem NAO e" 3 cards vermelhos integrados no ForWhom — v1.5 Phase 13
- ✓ SectionPrice split layout com R$ 299,90 PIX / 10x + garantia 7 dias — v1.5 Phase 13

- ✓ Badge "Seus dados estão seguros" com cadeado abaixo do form — v1.5 Phase 14
- ✓ CTAs variados por posição (Hero/ProgramContent/Price/Form) — v1.5 Phase 14
- ✓ Paleta azul vibrante #1D4ED8 + CTA cyan #0891B2 + gradientes diagonais — v1.6 Phase 15
- ✓ Dark backgrounds #0F172A (header/form) e #020617 (footer) — v1.6 Phase 15
- ✓ Plus Jakarta Sans substituiu Inter + hierarquia tipografica (bold/semibold/medium + tracking) — v1.6 Phase 16
- ✓ SectionGuarantee dedicada com selo dourado + copy acolhedor entre Price e FAQ — v1.6 Phase 17
- ✓ Avatares circulares com fotos reais + fallback iniciais nos depoimentos WhatsApp — v1.6 Phase 18
- ✓ FAQ redesenhado com cards numerados, hierarquia visual e focus ring — v1.6 Phase 19

### Active

(No active requirements — v1.6 milestone complete)

### Out of Scope

- Sistema de pagamento online — pagamento sera tratado fora da LP
- Area de login/dashboard do cliente — foco exclusivo na conversao
- Blog ou secao de conteudo — LP unica sem navegacao complexa
- Integracao com redes sociais — nao mencionado no escopo inicial
- Renda extra com milhas — cliente removeu do posicionamento (atrai publico errado, gera frustracao)

## Context

- Cliente: Marcio (Fly Up Milhas), especialista em milhas aereas
- Oferta: Mentoria VIP por R$ 299,90 (PIX) ou ate 10x no cartao, 30 dias de acompanhamento, 3 encontros/mes
- Entregaveis da mentoria: diagnostico de cartoes, planejamento de rotas/emissoes, suporte via WhatsApp
- Garantia: 7 dias — 100% do valor devolvido se nao fizer sentido
- Backend Fastify ja configurado
- Storage via Cloudflare R2 ja planejado
- Publico-alvo: pessoas que querem viajar de classe executiva gastando menos, familias buscando economia, iniciantes em milhas

## Constraints

- **Tech Stack**: Nuxt 4 (SSR) + Nuxt UI v4 (Tailwind CSS v4)
- **Backend**: Fastify 5 API — integrar, nao recriar
- **Database**: MongoDB — para leads e configuracoes
- **Storage**: Cloudflare R2 — para imagens e assets estaticos
- **Performance**: Mobile-first, carregamento ultra rapido
- **Design**: Paleta azul vibrante (#1D4ED8), dark bg (#0F172A), fundo off-white (#F9FAFB), CTA cyan (#0891B2)

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
| Paleta #1D4ED8 + CTA #0891B2 (v1.6) | Vibrant blue WCAG AA + cyan CTA replacing navy/orange; inspired by Descobridor de Milhas | ✓ Good |
| Dark bg #0F172A contraste forte (v1.6) | Azul brilha como destaque sobre fundo quase preto; selo dourado brilha | ✓ Good |
| Plus Jakarta Sans replacing Inter (v1.6) | Geometrica moderna premium; atomic swap via @nuxt/fonts global:true | ✓ Good |
| SectionGuarantee dedicada (v1.6) | Selo dourado entre Price e FAQ; standalone section outperforms inline mention | ✓ Good |
| UAccordion #leading/#trailing slots (v1.6) | :ui replaces defaults; slots give proper flex layout control for numbered cards | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-25 after v1.6 milestone complete*
