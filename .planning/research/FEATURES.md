# Feature Research

**Domain:** High-conversion landing page — mentorship/service sales (Brazilian market, R$ 299,90 price point)
**Researched:** 2026-03-24 (updated from 2026-03-21 for v1.5 milestone)
**Confidence:** HIGH (multiple sources verified, including Brazilian-specific data)

---

## v1.5 Milestone Focus: Conversion Optimization Patterns

This update addresses six specific conversion mechanisms requested in the v1.5 milestone. The existing v1.0 feature landscape below is preserved. New sections are explicitly labeled as v1.5 additions.

---

## v1.5 Feature Research: Six Conversion Mechanisms

### 1. WhatsApp-Style Testimonials (Print/Chat Bubble)

**What the pattern is:**
Screenshots of real WhatsApp conversations — or CSS components that visually mimic them — displayed as social proof instead of generic quote cards. Widely used in Brazilian infoprodutor funnels because WhatsApp is the dominant communication channel (148M users in Brazil) and screenshots are instantly recognizable as authentic.

**Table stakes vs. differentiator:**
In the Brazilian mentorship/course market, WhatsApp-style testimonial prints are **table stakes for the niche** — visitors familiar with this market expect to see them. Generic Western-style quote boxes with a name and photo look less credible to a Brazilian audience that is accustomed to seeing conversation prints. Missing this pattern signals that either results don't exist or the creator is targeting a different market.

**Two valid implementation approaches:**

| Approach | Authenticity | Implementation | Risk |
|----------|-------------|----------------|------|
| Real screenshot images (PNG/WebP) | Highest — viewer sees real app UI | `<NuxtImg>` inside a styled card container. CSS: `max-width: 340px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15)` | Requires actual client screenshots. Images must be legible on mobile. Must crop/blur identifying info except first name. |
| CSS chat bubble component (simulated) | High if well-designed — requires authentic-looking content | Flowbite `Chat Bubble` component (Tailwind CSS). Structure: avatar circle + rounded message bubble (`rounded-e-xl rounded-es-xl`) + name + timestamp. Green bubble (#25D366 or a tint) for "received" message style. | Can look fake if over-polished. Must use real testimonial text, never invented copy. |

**Recommended approach for Fly Up Milhas:**
Use **real screenshots as images** (primary) when Marcio provides them. Build a **CSS chat bubble fallback** component using Tailwind for cases where the screenshot is unreadable on mobile or not yet available.

**Section title pattern used in BR market:** "Casos reais de quem ja aplicou" or "O que nossos alunos dizem no WhatsApp" (already confirmed in v1.5 requirements as "Casos reais de quem ja aplicou").

**Implementation complexity:** LOW (images) / LOW-MEDIUM (CSS component)

**Dependencies:**
- Real client screenshots OR authentic testimonial text from Marcio
- Client permission to use their name and conversation (LGPD compliance — explicit consent)
- Image optimization via `@nuxt/image` with Cloudflare R2 provider

**Confidence:** HIGH — pattern is widespread and verified in BR landing page ecosystem

---

### 2. Pricing Sections with Installment Display (Parcelamento)

**What the pattern is:**
Brazilian consumers expect to see both a PIX/boleto price and a credit card installment option displayed together. The dominant formula is:

```
R$ 299,90 à vista (PIX)
ou 10x de R$ 29,99 no cartão
```

The PIX price is shown prominently as the primary ("best value") option, with installments as the accessible alternative. This is **table stakes** for any digital product sold in Brazil above R$ 100.

**Psychological mechanisms at play:**
- **Price anchoring:** Show value before price. "Consultoria que pode gerar R$ 3.000+ em passagens, por apenas R$ 299,90" anchors the price against the outcome.
- **Installment framing:** "10x de R$ 29,99" converts a R$ 300 decision into "about R$ 30/month" — equivalent to a streaming subscription. This reduces perceived cost for budget-sensitive buyers.
- **PIX badge:** The PIX icon/logo next to the price is immediately recognizable and signals no friction for payment. Brazilian buyers strongly prefer PIX for digital products.

**Layout pattern (industry standard for infoprodutos):**

```
[Price card]
  R$ 299,90
  à vista no PIX [PIX icon]

  — ou —

  10x de R$ 29,99
  no cartão de crédito

  [CTA button: Quero minha vaga]

  [Guarantee snippet: Garantia de 7 dias]
```

**What NOT to do:**
- Do NOT show only installment price without the full price visible somewhere — creates perception of hiding cost
- Do NOT add fake "de R$ 599,90 por R$ 299,90" unless Marcio actually ran that promotion — Brazilian buyers detect fake strikethrough pricing
- Do NOT use small font for installment fees — legal requirement and trust issue

**Implementation complexity:** LOW (pure markup + CSS, no payment processing)

**Note:** This LP does not process payment. The price display is for conversion signaling only. Actual payment happens offline via Marcio. No Stripe/Hotmart integration needed in scope.

**Confidence:** HIGH — verified against Hotmart/Eduzz LP patterns and Brazilian payment preference data

---

### 3. Guarantee Blocks

**What the pattern is:**
A visually distinct section (usually with a shield or badge icon, colored background, or bordered card) that states the money-back guarantee in plain language. For the Brazilian mentorship niche, 7-day guarantees are legally standard under the Consumer Defense Code (CDC, Art. 49 — direito de arrependimento for remote purchases).

**Table stakes status:** **Table stakes for any Brazilian digital product above R$ 100.** Not having a visible guarantee in 2025-2026 actively hurts conversion because buyers expect it and its absence signals a creator who doesn't trust their own product.

**What converts:**
- **Specificity beats generic:** "7 dias de garantia — 100% do seu dinheiro de volta, sem perguntas" converts better than "garantia de satisfacao" — specificity removes ambiguity
- **Guarantee copy near CTA:** Place guarantee language directly below or inside the pricing CTA block, not buried in FAQ
- **Visual treatment:** Shield icon (lucide-react `ShieldCheck` or Heroicons `shield-check`) + brief text. One badge, not multiple — excessive security signaling creates skepticism (Baymard research: 17 badges → 2.1% conversion; reduced to 6 badges → 3.4%)
- **Tone:** Matter-of-fact, not desperate. "Se em 7 dias voce sentir que nao faz sentido para voce, devolvemos 100% — sem burocracia" is confident tone

**Implementation pattern:**

```
[Inside or immediately below the pricing card]
--------------------------------------------
[ShieldCheck icon] Garantia de 7 dias

Se em 7 dias voce nao estiver satisfeito,
devolvemos 100% do seu investimento.
Sem perguntas, sem burocracia.
--------------------------------------------
```

**Background treatment:** Light green (#f0fdf4) or light blue (#eff6ff) for the guarantee container differentiates it from the rest of the pricing card. Avoid using the same orange/gold as CTAs — guarantee should feel safe/calm, not urgent.

**Implementation complexity:** LOW

**Dependencies:**
- Confirmed guarantee terms from Marcio (already specified in PROJECT.md: 7 dias, 100% devolucao)
- No code required for processing refunds — Marcio handles this manually

**Confidence:** HIGH — CDC legal requirement + conversion data from multiple sources

---

### 4. "Para Quem NAO E" Qualification Sections

**What the pattern is:**
An explicit section telling visitors who the product is NOT for. Used in Brazilian sales pages as a qualification/filtering mechanism. The psychological effect is:

1. **Reverse psychology / reactance:** Explicitly saying "this is not for you if X" makes X-type visitors feel excluded and either self-select out (desired) or feel curiosity to prove they're not X (unexpected conversion from borderline prospects)
2. **Trust signal:** A creator willing to turn away bad-fit clients signals confidence and quality. It communicates "I don't need everyone's money"
3. **Lead quality improvement:** Better-fit leads who see themselves in the "YES" section are more committed before submitting the form

**Table stakes vs. differentiator:**
In the Brazilian infoprodutor market (2024-2025), this section has crossed from differentiator to **near-table-stakes for mentorship/coaching products** at this price point. High-volume info products (courses, bootcamps) often skip it, but 1:1 or small-group mentorships use it consistently to filter leads.

**Layout pattern:**

Two-column or two-block layout pairing the negative with positive:

```
Para quem E                     | Para quem NAO E
---                             | ---
Quer voar de executiva         | Espera resultados sem esforco
pagando pouco                  |
                               |
Ja tem cartao de credito e     | Nao tem cartao de credito
quer usar melhor              |
                               |
Quer economizar em viagens    | Quer ficar rico so com milhas
em familia                    | (nao e isso)
```

OR a single-column list of negative qualifiers with visual treatment (red/warning icon):

```
Esta mentoria NAO e para voce se:

[X] Voce nao tem cartao de credito
[X] Voce quer resultados sem mudar nada
[X] Voce procura uma formula magica de renda extra
[X] Voce nao viaja (ou nunca planeja viajar)
```

**Recommended approach for Fly Up Milhas:**
Integrate into the existing `SectionForWhom` (already in codebase) by adding negative cards alongside the positive qualification cards. The existing 5 positive cards can be kept as-is, with 2-3 negative cards added to a separate sub-section or second row. This avoids rebuilding the section from scratch.

**Copy guidance:**
- Negative qualifiers should NOT be shaming or condescending — they should feel helpful ("this isn't the right fit for you, and that's okay")
- Each negative should implicitly define the opposite positive ("nao e para quem nao tem cartao" implicitly says "e para quem tem cartao e quer usá-lo melhor")
- Max 3-4 negative items — more creates anxiety and doubt in the target audience

**Implementation complexity:** LOW (adding cards to existing section)

**Dependencies:** None — copy from Marcio's feedback already indicates what audience to exclude

**Confidence:** MEDIUM-HIGH — pattern is widespread in BR market; specific conversion data for this approach is harder to find but qualitative evidence is strong

---

### 5. Progressive CTAs (Different Text Per Position)

**What the pattern is:**
Using different CTA button copy for different positions on the page rather than repeating the same text. Each CTA matches the visitor's mental state at that scroll depth:

| Position | Visitor State | CTA Copy Pattern |
|----------|--------------|-----------------|
| Hero (above fold) | Curious, skeptical | Problem-focused: "Quero descobrir minha estrategia" |
| Mid-page (after method/content) | Interested, evaluating | Process-focused: "Quero comecar minha mentoria" |
| After testimonials | Convinced, seeking permission | Results-focused: "Quero resultados como esses" |
| After pricing | Decision-ready | Commitment-focused: "Quero garantir minha vaga" |

**Table stakes vs. differentiator:**
Using the exact same CTA text everywhere is a missed opportunity but not a conversion killer. Varied CTAs are a **differentiator in the BR mentorship market** — most LP builders use one text throughout. Evidence shows varying CTA copy can lift conversion 15-30% because it matches visitor intent at each stage.

**Brazilian market-specific patterns:**
- "Quero" (I want) construction is dominant — first-person present tense, desire-focused
- Avoid corporate/formal register: "Solicitar consultoria" or "Enviar formulario" underperform
- Action verbs: "Garantir", "Comecar", "Descobrir", "Acessar" — active, personal
- Adding specificity: "Quero voar de executiva" beats "Quero comecar" for the right audience

**Recommended CTA set for Fly Up Milhas:**
1. Hero: "Quero dar o primeiro passo" (current — familiar, low-commitment)
2. After SectionMethod: "Quero comecar minha mentoria agora"
3. After SectionSocialProof (testimonials): "Quero resultados como esses"
4. After SectionPrice: "Quero garantir minha vaga por R$ 299,90"

**Implementation notes:**
- Each CTA must point to the same destination (the lead form or WhatsApp)
- Do NOT add CTAs between every section — 3-4 max on a page this length. Oversaturation dilutes conversion
- Mobile consideration: CTAs at the bottom of mobile screens (thumb zone) outperform top CTAs for sections that require scrolling past the initial screen

**Implementation complexity:** LOW (just copy changes in existing CTA button instances)

**Dependencies:** None — purely copy/content work

**Confidence:** HIGH — multiple A/B test sources confirm varied CTA copy outperforms repeated copy

---

### 6. Security Badges on Forms

**What the pattern is:**
A text label or small icon displayed near the lead form that communicates that the user's data is safe. In the Brazilian context this often references LGPD compliance.

**What works:**
- Studies show forms with trust signals convert 23-42% better than forms without
- Placement near form fields (not in header or footer) increases effectiveness 2-3x
- **One clear badge beats many:** Adding too many badges looks desperate. One well-placed badge is optimal
- **Copy over icon:** "Seus dados estao seguros. Nao enviamos spam." outperforms a generic padlock icon alone

**Recommended badge copy for Fly Up Milhas:**
```
[LockClosedIcon] Seus dados estao seguros.
Usamos suas informacoes apenas para entrar em contato sobre a mentoria.
```

Or the shorter version per v1.5 requirements:
```
[LockClosedIcon] Seus dados estao seguros
```

**Placement:** Directly below the submit button, centered, in a smaller font size (text-xs or text-sm) in gray — not competing visually with the CTA but visible to anyone scanning before submitting.

**LGPD note:** Under Brazilian LGPD (Lei 13.709/2018), forms collecting personal data (name, WhatsApp number) must collect data only for the specified purpose. The security badge is also an implicit LGPD signal. If the form includes a checkbox for consent, the badge text should reinforce what the data will be used for.

**What NOT to do:**
- Do NOT add Norton/McAfee seals — they require paid subscriptions and look out of place on a personal mentorship LP; they signal e-commerce, not service sales
- Do NOT add multiple trust icons (SSL badge + padlock + LGPD + guarantee) in the same form area — creates visual noise and looks untrustworthy

**Implementation complexity:** LOW (icon + 1-2 lines of text below submit button)

**Confidence:** HIGH — security badge conversion impact is well-documented across multiple CRO studies

---

## Table Stakes vs. Differentiators: v1.5 Summary

| Feature | Category | Brazilian Market Specificity | Complexity |
|---------|----------|------------------------------|------------|
| WhatsApp-style testimonials | **Table stakes** (in BR mentorship niche) | HIGH — specific to BR communication patterns | LOW (images) / LOW-MEDIUM (CSS) |
| PIX + installment pricing display | **Table stakes** (any BR digital product) | VERY HIGH — PIX is dominant payment preference | LOW |
| Guarantee block (7 dias) | **Table stakes** (BR digital products, CDC) | HIGH — legally expected, legally required | LOW |
| "Para quem nao e" section | Near table stakes for 1:1 mentorships | MEDIUM — pattern from BR info market | LOW (extend existing) |
| Progressive CTA copy | **Differentiator** | LOW — universal pattern but rare in BR | LOW |
| Form security badge | Near table stakes (trust signal) | MEDIUM — LGPD awareness raises relevance | LOW |

---

## Anti-Features: v1.5 Additions

| Anti-Feature | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Fake strikethrough pricing ("de R$ 599 por R$ 299") | Brazilian buyers increasingly detect and distrust fabricated discounts. Damages credibility for a personal brand. | Real PIX discount vs. installment price is a legitimate anchor — no fake-off needed |
| Multiple guarantee icons/badges | Baymard: 17 badges → 2.1% conversion; 6 badges → 3.4%. Excess signaling creates skepticism | One shield + one line of text. Guarantee copy in FAQ as reinforcement |
| reCAPTCHA on simplified form | Friction kills mobile conversion. Forms without CAPTCHA convert higher; rate-limiting on Fastify handles abuse | @fastify/rate-limit on the POST /leads endpoint handles spam server-side |
| Chat bubble testimonials with invented content | Even if visually convincing, invented testimonials violate trust when exposed, and are legally problematic in BR | Real screenshot images from actual clients. CSS bubble fallback only for authentic testimonial text Marcio provides |
| Countdown timer tied to pricing | Fake scarcity is detectable and destroys trust with the exact audience (tech-aware milhas enthusiasts) | Real scarcity: "Vagas para abril" — updated manually when capacity is reached |

---

## Feature Dependencies: v1.5 Updates

```
WhatsApp Testimonials (images)
    └──requires──> Client screenshot images from Marcio (LGPD-consented)
    └──fallback──> CSS chat bubble component with authentic text

WhatsApp Testimonials (CSS bubbles)
    └──requires──> Authentic testimonial text from real clients
    └──uses──> Tailwind CSS (already in stack via @nuxt/ui)
    └──uses──> Flowbite chat bubble pattern or custom implementation

PIX + Installment Pricing Display
    └──requires──> Confirmed price (R$ 299,90 PIX, 10x R$ 29,99 — per PROJECT.md)
    └──no backend dependency──> display only, no payment processing

Guarantee Block
    └──requires──> Confirmed terms from Marcio (7 dias, 100% — per PROJECT.md)
    └──enhances──> Pricing section (place inside or directly below price card)

"Para quem NAO e" Cards
    └──extends──> SectionForWhom (existing component)
    └──requires──> Negative qualifier copy from Marcio/client feedback

Progressive CTAs
    └──no new dependencies──> copy changes only in existing CTA buttons
    └──modifies──> Hero, SectionMethod, SectionSocialProof, SectionPrice CTAs

Form Security Badge
    └──extends──> Lead form component (existing)
    └──uses──> LockClosedIcon from @nuxt/ui icon set
    └──placement──> below submit button
```

---

## Original v1.0 Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = page feels untrustworthy or unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Benefit-focused hero headline | Visitors decide in 3 seconds whether they stay. Headline must state the concrete outcome, not the service name. | LOW | Formula: [Desired Result] + [Time Frame] + [Objection Removed]. "Voe de executiva gastando menos" beats "Mentoria de Milhas". |
| Hero subheadline | Answers "how?" and reinforces the promise. One sentence max. | LOW | Should name the mechanism: "Em 1 reuniao, monto sua estrategia personalizada de acumulo e emissao." |
| Single visible CTA above the fold | Visitors expect to understand what action to take before scrolling. Two CTAs create paralysis. | LOW | CTA must be in contrast color (laranja/dourado per design spec). |
| Mobile-first responsive layout | 70-80% of Brazilian traffic is mobile. Non-responsive page = instant exit. | LOW | Non-negotiable. Already in project constraints. |
| Page load under 2 seconds | Every second of delay reduces conversion ~7%. Brazilian mobile connections vary. | MEDIUM | SSR via Nuxt 4 + Cloudflare R2 for assets addresses this. Image optimization is the main risk. |
| Expert bio section | Service products require a visible human behind the offer. Anonymous service = no trust. | LOW | Section presenting Marcio: photo, results, credentials. |
| Social proof — testimonials | 92% of consumers read testimonials before purchasing. Brazilian buyers are high-trust-dependence. | LOW | Real depoimentos with full names, photos if possible. Screenshots of WhatsApp conversations are particularly effective in BR. |
| Social proof — real results | In the milhas niche, screenshots of actual bookings and redemptions are the strongest proof type. | LOW | Prints of passagens emitidas, economias calculadas. Specific numbers beat vague claims. |
| "Como Funciona" section | Service process must be visible. Buyers fear the unknown. 4-step visual flow removes that fear. | LOW | Diagnostico → Estrategia → Execucao → Voo. |
| Lead qualification form | Primary conversion mechanism. Must capture enough to qualify without creating friction. | MEDIUM | Fields reduced to 3 per v1.5: Nome, WhatsApp, objetivo. |
| Clear offer description | What exactly is R$ 299,90 buying? Users must know the deliverables before converting. | LOW | 2-3 reunioes online, 30 dias de acompanhamento, diagnostico de cartoes, planejamento de rotas, suporte WhatsApp. Bullet list, specific. |
| FAQ section | Handles purchase objections without requiring human contact. Reduces "leave to think about it" dropoff. | LOW | 5-7 questions targeting beginner milhas objections per v1.5. |
| Price visibility | Hidden pricing creates suspicion. At R$ 299,90, transparency is an advantage, not a risk. | LOW | Show prominently near the CTA. Anchor it against the value (passagens que custam R$ 3.000+ emitidas por menos). |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Price anchoring against redemption value | Converts "R$ 299,90 e caro" into "R$ 299,90 paga uma mentoria que pode gerar R$ 5.000 em passagens" | LOW | Show the value equation explicitly. Requires real data from Marcio. |
| WhatsApp as primary CTA destination | Brazil has 148M WhatsApp users. Direct click-to-WhatsApp achieves 45-60% conversion vs 2-5% for email forms. | LOW | Pre-filled message reduces friction. |
| Lead qualification form as filter signal | Asking about goal communicates exclusivity. Paradoxically increases conversions by setting expectations. | MEDIUM | Three fields: nome, WhatsApp, objetivo. |
| Specialist's personal results as proof | Showing Marcio's own redemptions adds authenticity rare in the niche. | LOW | One concrete personal story is worth 10 generic claims. |
| Specific result numbers in testimonials | "Economizei R$ 4.200 em uma passagem para Lisboa na business" creates credibility. | LOW | Coach Marcio to collect and present testimonials with specific numbers. |
| Guarantee / risk reversal | At R$ 299,90 this is low financial risk for Marcio but removes the biggest purchase barrier. | LOW | Confirmed: 7 dias, 100% devolucao, sem perguntas. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Navigation menu / multiple pages | "A page should have sections the user can browse" | Adds exit paths. Every link out of a LP is a conversion leak. | Single-scroll page with anchor links within the same page. |
| Online payment / checkout | "Let users buy directly" | Out of scope. WhatsApp-mediated close is higher-trust for a service sale. | Lead form + WhatsApp CTA. |
| Blog / content section | "Content builds authority and SEO" | Dilutes the single conversion goal. | Authority built through bio section, testimonials, and specific result numbers. |
| Social media feed embeds | "Shows we're active and credible" | Live feeds break page performance. | Static screenshots of best posts, footer link only. |
| Chatbot / live chat widget | "Reduces friction for questions" | Chatbots frustrate Brazilian buyers. Adds JS weight. | WhatsApp CTA provides direct human access. |
| Countdown timer (fake urgency) | "Creates urgency to buy now" | Fake timers destroy trust. Brazilian consumers detect this pattern. | Real scarcity: "Apenas X vagas abertas em abril" updated manually. |
| Multiple CTAs with different goals | "More options, more conversions" | Multiple competing CTAs create decision paralysis. | One primary CTA. |

---

## Feature Dependencies: Full Map

```
Hero Headline + Subheadline (v1.5 rewrite)
    └──requires──> Final copy from client feedback

Lead Qualification Form (3 fields: v1.5)
    └──requires──> WhatsApp CTA (form submission notifies via WhatsApp)
    └──requires──> Backend Fastify integration (stores lead in MongoDB)
    └──adds──> Security badge below submit button

WhatsApp CTA
    └──requires──> Marcio's WhatsApp number + pre-filled message text

Social Proof (WhatsApp testimonials: v1.5)
    └──requires──> Real screenshot images from Marcio (or authentic text for CSS fallback)
    └──requires──> Client LGPD consent for name/image use

Price Section (v1.5 expanded)
    └──shows──> R$ 299,90 PIX + 10x R$ 29,99 cartao
    └──includes──> Guarantee block (7 dias)
    └──uses──> Progressive CTA: "Quero garantir minha vaga por R$ 299,90"

SectionForWhom (v1.5 extended)
    └──adds──> Negative qualifier cards ("nao e para voce se...")
    └──extends──> Existing 5 positive cards

Progressive CTAs
    └──no new infrastructure──> copy changes only in existing CTA components
    └──positions──> Hero, Method, Testimonials, Pricing

FAQ Section (v1.5 reformulated)
    └──enhances──> Conversion by addressing beginner milhas objections specifically

SectionAbout (v1.5 rewrite — "renda extra" removed)
    └──requires──> Confirmed removal of "renda extra" angle from Marcio
```

---

## MVP: v1.5 Deliverables

All items required for v1.5 milestone (conversion optimization pass):

- [ ] Hero rewrite — new headline, subheadline, microcopy
- [ ] SectionAbout rewrite — 3 conversion functions (desejo, objecao, prova), no "renda extra"
- [ ] Conteudo Programatico — bold keywords + new subtitle
- [ ] SectionForWhom — integrate "Para quem NAO e" negative cards
- [ ] SectionMethod — add duration (30 dias), 3 encontros/mes, WhatsApp support detail
- [ ] SectionSocialProof — WhatsApp testimonial visual style (images or CSS bubbles)
- [ ] SectionPrice — R$ 299,90 PIX / 10x R$ 29,99 + guarantee block (7 dias)
- [ ] Lead form — reduce to 3 fields + "Seus dados estao seguros" badge below submit
- [ ] Progressive CTAs — 4 distinct CTA texts across page positions
- [ ] FAQ reformulation — beginner milhas objections (not generic)

---

## Content Dependencies (Non-Technical Blockers)

Before v1.5 build can be finalized, Marcio must provide or confirm:

| Content Item | Required For | Urgency |
|-------------|-------------|---------|
| WhatsApp testimonial screenshots (client-consented) | SectionSocialProof visual redesign | HIGH |
| Negative qualifier copy ("nao e para quem...") | SectionForWhom extension | MEDIUM |
| New hero headline and subheadline copy | Hero rewrite | HIGH |
| Confirmed R$ 299,90 PIX / 10x R$ 29,99 pricing | SectionPrice | CONFIRMED (PROJECT.md) |
| Confirmed 7-day guarantee terms | Guarantee block | CONFIRMED (PROJECT.md) |
| FAQ reformulation — beginner questions | FAQ section | MEDIUM |

---

## Sources

- [Tailwind CSS Chat Bubble — Flowbite](https://flowbite.com/docs/components/chat-bubble/) — Implementation reference for chat bubble component
- [WhatsApp Testimonials for Social Proof — Medium](https://medium.com/@yogevkimor/how-i-got-unlimited-whatsapp-testimonials-for-social-proof-and-how-you-can-do-it-too-de3522e43531) — WhatsApp as authenticity signal for testimonials
- [Landing Page Elements for Brazilian Infoproducts — GreatPages](https://blog.greatpages.com.br/post/landing-page-para-infoprodutos) — Brazilian market qualification section + pricing display patterns
- [Trust Badges That Boost Conversion — SmartSMS](https://smartsmssolutions.com/resources/blog/business/trust-badges-boost-conversion) — Security badge placement + conversion data (23-42% lift near forms, 2-3x better near fields vs header/footer)
- [Best CTA Placement Strategies — LandingPageFlow](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) — Progressive CTA placement and copy variation across page scroll depth
- [9 Payment Methods in Brazil — Rebill](https://www.rebill.com/en/blog/main-payment-methods-in-brazil) — PIX dominance + installment payment preference in Brazilian market
- [Social Proof on Landing Pages — LanderLab](https://landerlab.io/blog/social-proof-examples) — Social proof conversion psychology
- [Sales Page Copywriting: Disqualification Sections — EngageBay](https://www.engagebay.com/blog/sales-page/) — "Who it's not for" pattern for lead qualification and conversion quality
- [The Psychology Behind High-Converting Landing Pages — Serotonin Digital](https://www.serotonin.co.uk/news/the-psychology-behind-high-converting-landing-pages) — Psychological mechanisms behind guarantee blocks, social proof, qualification
- [Hotmart Installment Fee Changes 2025 — Hotmart Blog](https://hotmart.com/en/blog/reajuste-taxa-parcelamento-2025) — Brazilian installment payment market context
- [High-Converting Landing Pages: 2026 Essential Elements — Branded Agency](https://www.brandedagency.com/blog/the-anatomy-of-a-high-converting-landing-page-14-powerful-elements-you-must-use-in-2026) — General LP anatomy
- [Landing Page de Alta Conversao: Guia Estrategico 2026 — Thiago Regis MKT](https://thiagoregismkt.com.br/conteudos/landing-page-alta-conversao-estrategias/) — Brazilian conversion optimization patterns

---
*Feature research for: High-conversion landing page — mentorship sales (Fly Up Milhas)*
*Original: 2026-03-21 | Updated for v1.5 milestone: 2026-03-24*
