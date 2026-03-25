# Milestones

## v1.6 Upgrade de Identidade Visual (Shipped: 2026-03-25)

**Phases completed:** 5 phases (15-19), 6 plans, 10 tasks
**Git range:** feat(15-01) → feat(19-01)
**Files changed:** 16 files, +179 -63 lines

**Key accomplishments:**

- Paleta azul vibrante #1D4ED8 + CTA cyan #0891B2 + 5 gradientes diagonais 135deg substituindo navy #1a3a5c / laranja #e67e22
- Dark backgrounds #0F172A (header/form) e #020617 (footer) com azul como destaque em hovers
- Plus Jakarta Sans substituiu Inter com hierarquia tipografica (h1 bold+tight, h2 semibold, h3 medium)
- SectionGuarantee dedicada com selo dourado PNG entre Price e FAQ (split layout, fundo dark)
- Avatares circulares com fotos reais + fallback iniciais (hash deterministico) nos depoimentos WhatsApp
- FAQ redesenhado com cards numerados (01-06), hierarquia visual e focus ring acessivel

---

## v1.5 Refinamento de Copy e Conversao (Shipped: 2026-03-24)

**Phases completed:** 4 phases (11-14), 6 plans, 11 tasks
**Git range:** feat(11-01) → feat(14-01)
**Files changed:** 31 files, +2760 -259 lines

**Key accomplishments:**

- Schema migrado para 3 campos (nome, email, whatsapp) — gastoMensal e objetivo removidos, campo email adicionado
- "Renda extra" e "Márcio" removidos de toda a LP (posicionamento empresa, não pessoa)
- Hero reescrito com copy de conversão (headline 80% menos, CTA "Quero começar agora", microcopy)
- SectionAbout reestruturado com 3 funções (desejo/objeção/prova) + 3 cards (conforto/economia/estratégia)
- Depoimentos WhatsApp chat bubbles CSS + "Para quem NÃO é" cards vermelhos + negritos no ProgramContent
- SectionPrice split layout com R$ 299,90 PIX / 10x + garantia 7 dias + badge segurança no form

---

## v1.4 Logo, Acentuação e Form Design (Shipped: 2026-03-22)

**Phases completed:** 2 phases (9-10), 3 plans, 5 tasks
**Git range:** feat(09-01) → feat(10-01)

**Key accomplishments:**

- Logo PNG adicionado ao header substituindo texto "Fly Up Milhas"
- Acentuação corrigida em 7 componentes Vue (87+ palavras)
- Formulário redesenhado: card navy removido, campos direto no fundo azul da section
- Instagram CTA block + link no footer com ícone SVG
- Footer com cor mais escura (#0f2039) separando visualmente do formulário

---

## v1.3 Alinhamento de Conteudo com Mentoria (Shipped: 2026-03-22)

**Phases completed:** 2 phases (7-8), 5 plans, 9 tasks
**Git range:** feat(07-01) → feat(08-02)
**Files changed:** 14 files, +151 -71 lines

**Key accomplishments:**

- Global copy migration: "consultoria" → "mentoria" com zero ocorrencias restantes
- Pain point chips no hero ("Viajar é caro", "Milhas é complicado", "Não sei por onde começar")
- CTA "Quero dar o primeiro passo" em todos os 7 pontos de conversão
- SectionMethod reescrito com 3 encontros quinzenais + Autonomia + formato subtexto
- SectionPrice sem preço, com 5 benefícios + "Condições especiais disponíveis"
- SectionProgramContent com 8 itens do que se aprende (two-column layout)
- SectionForWhom com 5 cards de qualificação do público
- SEO meta tags e schema.org atualizados para mentoria

---

## v1.2 Polimento de Conteudo e Layout (Shipped: 2026-03-21)

**Phases completed:** 1 phase (6), 2 plans, 4 tasks
**Git range:** fix(06-01) → feat(06-02)
**Files changed:** 7 files, +71 -35 lines

**Key accomplishments:**

- FAQ accordion labels forced to #1a1a1a for WCAG AA contrast
- Form inputs rendered bg-white with visible borders on navy card
- SectionAbout headline reframed: "Sua estratégia de milhas começa aqui"
- Step 4 "Voo" renamed to "Autonomia" with post-consultancy independence copy
- Offer block consolidated from SectionMethod into SectionPrice (5 enriched items)
- Floating back-to-top button with SSR-safe scroll detection

---

## v1.0 MVP Launch (Shipped: 2026-03-21)

**Phases completed:** 3 phases (1-3), 7 plans, 14 tasks
**Git range:** feat(01-01) → feat(03-01)

**Key accomplishments:**

- Nuxt 4 SSR scaffold with Cloudflare Pages preset, Tailwind v4 design tokens, and app shell
- Fastify 5 POST /leads with Zod validation, MongoDB, CORS, honeypot, rate limiting
- SEO meta layer (OG, Twitter Card, LocalBusiness JSON-LD) + R2 image pipeline
- Full landing page sections: Hero, Expert bio, Como Funciona, Social Proof, Pricing, FAQ
- Zod-validated 4-field lead form with phone masking, honeypot, and WhatsApp CTA

---

## v1.1 Refinamento Visual (Shipped: 2026-03-21)

**Phases completed:** 2 phases (4-5), 4 plans, 7 tasks
**Git range:** fix(04-01) → feat(05-01)
**Files changed:** 9 files, +368 -164 lines

**Key accomplishments:**

- Smart-sticky AppHeader with desktop anchor nav and mobile fullscreen hamburger overlay
- Background color fixed to #F9FAFB (neutral off-white, no warm tint)
- SectionAbout bento grid replacing personal bio — company-focused with renda extra value prop
- Comprovante screenshot removed from social proof section
- FAQ text contrast fixed to WCAG AA (#1a1a1a via UAccordion slot override)
- SectionMethod refactored to bento grid card layout with navy Step 4 accent
- Lead form wrapped in navy card with 24px spacing and centered submit button
- Split footer with Agencia 201 credit link and WhatsApp contact

---
