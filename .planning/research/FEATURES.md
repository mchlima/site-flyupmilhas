# Feature Research

**Domain:** High-conversion landing page — consultancy/service sales (Brazilian market, R$200 price point)
**Researched:** 2026-03-21
**Confidence:** HIGH (multiple sources verified, including Brazilian-specific data)

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = page feels untrustworthy or unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Benefit-focused hero headline | Visitors decide in 3 seconds whether they stay. Headline must state the concrete outcome, not the service name. | LOW | Formula: [Desired Result] + [Time Frame] + [Objection Removed]. "Voe de executiva gastando menos" beats "Consultoria de Milhas". |
| Hero subheadline | Answers "how?" and reinforces the promise. One sentence max. | LOW | Should name the mechanism: "Em 1 reuniao, monto sua estrategia personalizada de acumulo e emissao." |
| Single visible CTA above the fold | Visitors expect to understand what action to take before scrolling. Two CTAs create paralysis. | LOW | "Quero minha consultoria" pointing to the form. CTA must be in contrast color (laranja/dourado per design spec). |
| Mobile-first responsive layout | 70-80% of Brazilian traffic is mobile. Non-responsive page = instant exit. | LOW | Non-negotiable. Already in project constraints. |
| Page load under 2 seconds | Every second of delay reduces conversion ~7%. Brazilian mobile connections vary. | MEDIUM | SSR via Nuxt 3 + Cloudflare R2 for assets addresses this. Image optimization is the main risk. |
| Expert bio section | Service products require a visible human behind the offer. Anonymous service = no trust. | LOW | Section presenting Marcio: photo, results, credentials. "Quem e o Marcio" with specific numbers (ex: "Ja emiti mais de X passagens para clientes"). |
| Social proof — testimonials | 92% of consumers read testimonials before purchasing. Brazilian buyers are high-trust-dependence. | LOW | Real depoimentos with full names, photos if possible. Screenshots of WhatsApp conversations are particularly effective in BR. |
| Social proof — real results | In the milhas niche, screenshots of actual bookings and redemptions are the strongest proof type. | LOW | Prints of passagens emitidas, economias calculadas. Specific numbers beat vague claims. |
| "Como Funciona" section | Service process must be visible. Buyers fear the unknown. 4-step visual flow removes that fear. | LOW | Already in PROJECT.md requirements: Diagnostico → Estrategia → Execucao → Voo. |
| Lead qualification form | Primary conversion mechanism. Must capture enough to qualify without creating friction. | MEDIUM | Fields: Nome, WhatsApp, gasto mensal com cartao, objetivo (executiva/economizar/renda extra). WhatsApp is the CTA destination in BR context. |
| SSL + page security signals | Brazilian users are alert to scams. Visible trust signals (HTTPS, no suspicious redirects) reduce abandonment. | LOW | Nuxt 3 + standard hosting handles SSL. Do not add fake badges. |
| Clear offer description | What exactly is R$200 buying? Users must know the deliverables before converting. | LOW | 2 reunioes online, 1 mes de acompanhamento, diagnostico de cartoes, planejamento de rotas. Bullet list, specific. |
| FAQ section | Handles purchase objections without requiring human contact. Reduces "leave to think about it" dropoff. | LOW | 5-7 questions: "Funciona para quem gasta pouco?", "Preciso ter cartao premium?", "E se eu nao gostar?", etc. |
| Price visibility | Hidden pricing creates suspicion. At R$200, transparency is an advantage, not a risk. | LOW | Show R$200 prominently near the CTA. Anchor it against the value (passagens que custam R$3.000+ emitidas por menos). |

### Differentiators (Competitive Advantage)

Features that set the product apart. Competitors (PassageiroDePrimeira, ArteDasMilhas, FirstClassMilhas) exist but most lack these.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Price anchoring against redemption value | Converts "R$200 e caro" into "R$200 paga uma consultoria que pode gerar R$5.000 em passagens" — changes the mental frame completely. | LOW | Show the value equation explicitly: "Meus clientes economizam em media R$X em passagens por consultoria." Requires real data from Marcio. |
| WhatsApp as primary CTA destination | Brazil has 148M WhatsApp users. Direct click-to-WhatsApp achieves 45-60% conversion vs 2-5% for email forms. Pre-filled message reduces friction. | LOW | Button: "Falar no WhatsApp" with `wa.me/` link and pre-filled text: "Ola Marcio, quero saber mais sobre a consultoria VIP." Form can also notify via WhatsApp. |
| Lead qualification form as filter signal | Asking about monthly spend communicates exclusivity — "I only work with clients I can help." Paradoxically increases conversions by setting expectations. | MEDIUM | The form itself signals professionalism. Questions: gastos mensais em cartoes, objetivo principal, programa de fidelidade atual. |
| Specialist's personal results as proof | Most competitor pages show client results. Showing the specialist's OWN redemptions (photos, prints) adds a layer of authenticity rare in the niche. | LOW | "Eu mesmo voei para Europa na business usando apenas milhas acumuladas com cartao do dia a dia." One concrete personal story is worth 10 generic claims. |
| Specific result numbers in testimonials | "Economizei muito" loses to "Economizei R$4.200 em uma passagem para Lisboa na business." Specificity creates credibility. | LOW | Coach Marcio to collect and present testimonials with specific numbers, destinations, and class of service. |
| Urgency — limited spots | 1-on-1 consultancy is genuinely capacity-constrained. "Apenas X vagas abertas por mes" is authentic scarcity, not manufactured. | LOW | Real scarcity drives 20-300% conversion lift. Must be kept honest. "Proximas vagas: abril" if booked out. |
| "Sua situacao especifica" framing | Speaks directly to three audience segments: executiva dreamers, families saving money, side-income seekers. Each has different pain points. | MEDIUM | One approach: three "Para voce que..." blocks each addressing a persona, all pointing to the same CTA. Personalizes without requiring dynamic content. |
| Guarantee or risk reversal | "Se na primeira reuniao voce sentir que nao foi o que esperava, eu devolvo seu dinheiro." At R$200 this is low financial risk for Marcio but removes the biggest purchase barrier for buyers. | LOW | Even a soft guarantee ("se nao ficar satisfeito, conversamos") signals confidence. Needs to be validated with Marcio before committing. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem useful but create friction, complexity, or dilution of conversion focus.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Navigation menu / multiple pages | "A page should have sections the user can browse" | Adds exit paths. Every link out of a LP is a conversion leak. Visitors who navigate away rarely return. | Single-scroll page with anchor links within the same page. Jump links to #como-funciona, #depoimentos, #contato are fine — off-page links are not. |
| Online payment / checkout | "Let users buy directly without waiting" | Payment scope is explicitly out of scope. Also, for a R$200 consultancy, a WhatsApp-mediated close is higher-trust and allows qualification. | Lead form + WhatsApp CTA. Payment handled offline as defined in PROJECT.md. |
| Blog / content section | "Content builds authority and SEO" | Dilutes the single conversion goal. Blog requires maintenance. LPs that add content sections see engagement but lower form conversion. | Authority is built through the bio section, testimonials, and specific result numbers. SEO for this LP is not a traffic driver — paid ads or social referrals are. |
| Social media feed embeds | "Shows we're active and credible" | Live feeds break page performance. Algorithmic content is unpredictable. Negative comments or low engagement are visible. | Static screenshots of best Instagram/WhatsApp posts, linked by footer icon only. |
| Chatbot / live chat widget | "Reduces friction for questions" | Chatbots frustrate Brazilian buyers who expect human responses. Adds JS weight. Creates expectation of immediate response. | WhatsApp CTA provides direct human access. FAQ section handles common objections passively. |
| Countdown timer (fake urgency) | "Creates urgency to buy now" | Fake timers that reset are detectable and destroy trust. Brazilian consumers are increasingly aware of this pattern. | Real scarcity: "Apenas X vagas abertas em abril" updated manually. Genuine capacity constraint. |
| Video autoplay | "Video converts better than text" | Autoplay is blocked on most mobile browsers. When it does play, unexpected audio drives exits. Page performance cost is high. | An embedded video (YouTube/Vimeo, click-to-play) of Marcio explaining his approach can be a differentiator, but must be opt-in. |
| Login / user area | "Clients want to access their consultancy materials" | Completely out of scope. Adds authentication complexity, backend surface area, and diverts build time from conversion focus. | WhatsApp groups or Google Drive for consultancy deliverables, managed offline. |
| Multiple CTAs with different goals | "More options, more conversions" | Multiple competing CTAs create decision paralysis. Each additional CTA reduces all others' conversion rates. | One primary CTA (form or WhatsApp). Secondary CTA only after primary is scroll-depth proven (via analytics). |

## Feature Dependencies

```
Hero Headline + Subheadline
    └──requires──> Offer Description (must be specific enough to write specific headline)

Lead Qualification Form
    └──requires──> WhatsApp CTA (form submission notifies via WhatsApp)
    └──requires──> Backend Fastify integration (stores lead in MongoDB)

WhatsApp CTA
    └──requires──> Marcio's WhatsApp number + pre-filled message text

Social Proof — Specific Results
    └──requires──> Real data from Marcio (client results, anonymized or consented)

Price Anchoring
    └──requires──> Real average savings data from Marcio

Urgency — Limited Spots
    └──requires──> Marcio's actual monthly capacity number (to stay honest)

Guarantee / Risk Reversal
    └──requires──> Validation with Marcio (he must be willing to honor it)

FAQ Section
    └──enhances──> Lead Qualification Form (addresses objections before form submission)

Expert Bio
    └──enhances──> Social Proof (bio + results together form trust stack)

"Como Funciona" Section
    └──enhances──> Lead Qualification Form (sets expectations, improves form quality)
```

### Dependency Notes

- **Form requires Fastify backend:** The backend already exists (PROJECT.md). Integration is a connection task, not a build task.
- **Price anchoring requires data:** Cannot write "clients save R$X on average" without Marcio providing that number. This is a content blocker, not a code blocker.
- **Guarantee requires Marcio validation:** Do not implement on assumption. Confirm the offer with the client before publishing.
- **WhatsApp CTA requires number:** Get Marcio's WhatsApp business number before build starts. Pre-filled message text should be agreed upon.

## MVP Definition

### Launch With (v1)

Minimum viable to convert visitors. Every item below has a direct conversion impact.

- [ ] Hero section — benefit headline + subheadline + primary CTA button
- [ ] Offer description — what R$200 buys (bullet list, specific deliverables)
- [ ] "Como Funciona" — 4-step visual flow (Diagnostico, Estrategia, Execucao, Voo)
- [ ] Expert bio (Marcio) — photo, background, real results, personality
- [ ] Social proof — minimum 3 testimonials with names and specific outcomes
- [ ] Lead qualification form — Nome, WhatsApp, gastos mensais, objetivo
- [ ] WhatsApp CTA — direct link as secondary conversion path
- [ ] FAQ section — 5-7 objections answered
- [ ] Price visibility — R$200 shown near CTA with value anchor
- [ ] Mobile-first responsive layout
- [ ] Page load under 2 seconds

### Add After Validation (v1.x)

Add these once the page is live and collecting data (first 2-4 weeks).

- [ ] Urgency indicator — "Vagas para abril" — requires honest capacity data from Marcio
- [ ] Guarantee block — "Se nao ficar satisfeito..." — requires Marcio's approval
- [ ] Result screenshots (prints) — printed passagens emitidas — requires content from Marcio
- [ ] A/B test: form CTA vs WhatsApp CTA as primary — test which converts better for this audience
- [ ] Optional embedded video — Marcio intro, click-to-play, hosted on YouTube

### Future Consideration (v2+)

Defer until product-market fit is confirmed and traffic volume justifies the effort.

- [ ] Dynamic "vagas restantes" counter — requires admin interface to update; MVP can be static text updated manually
- [ ] Segment-specific landing pages (one per audience persona) — complex, useful only when spending on segmented ad campaigns
- [ ] Chat integration (WhatsApp API automated flow) — requires WhatsApp Business API setup, not trivial

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero headline + CTA | HIGH | LOW | P1 |
| Expert bio section | HIGH | LOW | P1 |
| Social proof testimonials | HIGH | LOW | P1 |
| Lead qualification form | HIGH | MEDIUM | P1 |
| "Como Funciona" visual flow | HIGH | LOW | P1 |
| Price visibility + anchor | HIGH | LOW | P1 |
| WhatsApp CTA button | HIGH | LOW | P1 |
| FAQ section | MEDIUM | LOW | P1 |
| Mobile-first layout | HIGH | LOW | P1 |
| Result screenshots / prints | HIGH | LOW | P2 |
| Urgency — limited spots | MEDIUM | LOW | P2 |
| Guarantee block | HIGH | LOW | P2 |
| Embedded video (Marcio) | MEDIUM | MEDIUM | P3 |
| Segment-specific pages | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | PassageiroDePrimeira | ArteDasMilhas | Fly Up Milhas (our approach) |
|---------|---------------------|----------------|-------------------------------|
| Price visible | Hidden ("varies") | Not shown | Visible — R$200, with value anchor |
| Social proof type | Reputation / newsletter size | Client logos | Testimonials + specific result numbers + screenshots |
| CTA mechanism | External booking platform (Yondo) | Contact form | Inline form + WhatsApp direct |
| Expert bio | Named consultants, brief | Generic brand | Marcio personal story, specific results |
| Process visibility | None | Vague | 4-step visual flow |
| Urgency / scarcity | None | None | "Vagas limitadas" — honest capacity |
| Guarantee | Explicit "no guarantee" | None | Risk reversal (pending Marcio approval) |
| Mobile experience | Not prioritized | Acceptable | Mobile-first, primary design target |

**Key competitive gap:** Competitors in the BR milhas consultancy space do not show pricing, do not use WhatsApp as primary CTA, and do not provide specific result numbers. These three alone are significant differentiators.

## Content Dependencies (Non-Technical Blockers)

Before build can be finalized, Marcio must provide:

| Content Item | Required For | Urgency |
|-------------|-------------|---------|
| Average client savings figure | Price anchoring copy | HIGH |
| Monthly consultancy capacity | Honest urgency/scarcity | HIGH |
| 3+ client testimonials (named, with results) | Social proof section | HIGH |
| Result screenshots (passagens emitidas) | Visual proof section | HIGH |
| Personal results / story | Expert bio | HIGH |
| WhatsApp business number + pre-filled message text | WhatsApp CTA | HIGH |
| Willingness to offer guarantee | Guarantee block | MEDIUM |
| Video recording (intro) | Optional embedded video | LOW |

## Sources

- [High-Converting Landing Pages: 2026 Essential Elements — Branded Agency](https://www.brandedagency.com/blog/the-anatomy-of-a-high-converting-landing-page-14-powerful-elements-you-must-use-in-2026)
- [Smart Landing Page Strategies for Higher Conversions in 2026 — Capsquery](https://capsquery.com/blog/smart-landing-page-strategies-for-higher-conversions-in-2026/)
- [Landing Page Conversion Rates — 40 Statistics — Genesys Growth](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders)
- [Landing Page de Alta Conversao: Guia Estrategico 2026 — Thiago Regis MKT](https://thiagoregismkt.com.br/conteudos/landing-page-alta-conversao-estrategias/)
- [Como usar Depoimentos e Provas Sociais em Landing Pages — Meu Site Agora](https://www.meusiteagora.com.br/Blog/como-usar-depoimentos-e-provas-sociais-em-landing-pages.html)
- [WhatsApp Marketing — The Complete Guide 2025 — Braze](https://www.braze.com/resources/articles/whatsapp-marketing)
- [Passageiro de Primeira — Concierge dos Pontos (competitor analysis)](https://passageirodeprimeira.com/consultoria-presonalizada/)
- [The Role of Scarcity and Urgency in Landing Page Conversion — Abmatic AI](https://abmatic.ai/blog/role-of-scarcity-and-urgency-in-landing-page-conversion)
- [Social Proof Landing Pages — Leadpages](https://www.leadpages.com/blog/social-proof-landing-pages)
- [B2B Landing Page Lessons from 2025 — Instapage](https://instapage.com/blog/b2b-landing-page-best-practices)

---
*Feature research for: High-conversion landing page — consultancy/service sales (Fly Up Milhas)*
*Researched: 2026-03-21*
