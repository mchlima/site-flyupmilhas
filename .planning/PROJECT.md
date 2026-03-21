# Fly Up Milhas

## What This Is

Uma landing page de alta conversao para a Fly Up Milhas, focada na venda de consultoria personalizada (R$ 200) para otimizacao de acumulo de milhas e emissao estrategica de passagens aereas. O produto principal e uma consultoria VIP de 1 mes com 2 reunioes online, diagnostico de cartoes/programas e planejamento de rotas.

## Core Value

Converter visitantes em clientes da consultoria VIP atraves de uma LP que transmita autoridade, confianca e resultados reais no mercado de milhas.

## Requirements

### Validated

- ✓ SSR via Nuxt 4 para SEO e performance — Phase 1
- ✓ Design tokens (paleta azul aviacao + fundo claro + CTA laranja/dourado) — Phase 1
- ✓ Tipografia sans-serif moderna (Inter via @nuxt/fonts) — Phase 1
- ✓ Performance mobile-first com carregamento ultra rapido (scaffold) — Phase 1
- ✓ Integracao com backend Fastify para armazenamento de leads no MongoDB — Phase 1
- ✓ Assets estaticos servidos via Cloudflare R2 — Phase 1

### Active

- [ ] Hero section com copy de impacto e CTA para consultoria
- [ ] Secao do especialista (bio do Marcio com resultados reais)
- [ ] Secao "Como Funciona" com 4 passos visuais (Diagnostico, Estrategia, Execucao, Voo)
- [ ] Secao de prova social (depoimentos e prints de resultados)
- [ ] Formulario de qualificacao de leads (nome, WhatsApp, gastos mensais, objetivo)

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

- **Tech Stack**: Nuxt 3 (SSR) + Nuxt UI (Tailwind CSS) — definido no PRD
- **Backend**: Fastify API ja existente — integrar, nao recriar
- **Database**: MongoDB — para leads e configuracoes
- **Storage**: Cloudflare R2 — para imagens e assets estaticos
- **Performance**: Mobile-first, carregamento ultra rapido
- **Design**: Paleta azul aviacao, fundo branco gelo/cinza ultra claro, CTA laranja/dourado

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nuxt 4 com SSR (upgraded from Nuxt 3) | Nuxt 3 EOL July 2026, Nuxt 4 is current | ✓ Good |
| Nuxt UI v4 como framework de componentes | Tailwind CSS v4 integrado, componentes headless | ✓ Good |
| Formulario de qualificacao em vez de compra direta | Filtrar clientes ideais antes do contato | — Pending |

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
*Last updated: 2026-03-21 after Phase 1 completion*
