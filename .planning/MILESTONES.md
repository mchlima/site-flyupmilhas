# Milestones

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
