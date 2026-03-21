# Phase 2: Display Sections - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

All static content sections of the landing page: hero headline with CTA, expert bio (Marcio), "Como Funciona" 4-step method, social proof (testimonials + result screenshots), price display with value anchoring, and FAQ accordion. All sections correctly styled with brand tokens and mobile-responsive. No form logic or backend integration — that's Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Hero Section (HERO-01 through HERO-05)
- **D-01:** Benefit-focused headline from PRD: "Sua proxima viagem de classe executiva custa menos que um jantar fora."
- **D-02:** Subheadline explaining the mechanism: consultoria personalizada de 1 hora que monta sua estrategia
- **D-03:** Single CTA button "Quero minha Consultoria" in brand-cta color (laranja #e67e22), scrolls to lead form anchor (#formulario)
- **D-04:** Hero takes full viewport height on mobile (min-h-screen or min-h-[80vh]), headline + CTA visible above the fold on 375px
- **D-05:** Clean off-white background (brand-bg), no hero image for MVP — rely on strong typography and CTA contrast
- **D-06:** Inter font at configured weight, brand-primary (#1a3a5c) for headline text

### Expert Section (AUTH-01, AUTH-02)
- **D-07:** Section "Quem e o Marcio" with photo served from R2 (WebP, pre-optimized)
- **D-08:** Display specific numeric results: milhas acumuladas, paises visitados, economia gerada para clientes
- **D-09:** Brief bio paragraph focused on results, not credentials
- **D-10:** Secondary CTA button at bottom of section scrolling to form anchor
- **D-11:** Use placeholder photo and placeholder numbers with TODO markers until Marcio provides real content

### Como Funciona (METD-01, METD-02)
- **D-12:** 4-step visual flow: Diagnostico → Estrategia → Execucao → Voo
- **D-13:** Each step has an icon (Nuxt UI icons or simple SVG), title, and 1-2 sentence description
- **D-14:** Horizontal layout on desktop (4 columns), vertical stack on mobile
- **D-15:** Clear offer description nearby: R$200 pagamento unico, 2 reunioes online, 1 mes acompanhamento

### Social Proof (SOCL-01, SOCL-02)
- **D-16:** Testimonial cards with: real first name, city, specific R$ savings or route + cabin class
- **D-17:** Minimum 2 testimonials displayed (use realistic placeholders until Marcio provides real ones)
- **D-18:** At least 1 result screenshot served from R2 (print of passagem emitida or economia calculada)
- **D-19:** Cards with subtle shadow and rounded corners, consistent with brand design

### Price & Value Anchoring (CTA-02)
- **D-20:** Price R$200 displayed prominently near a CTA
- **D-21:** Value anchor: "Passagens que custam R$3.000+ emitidas por menos" or similar comparison
- **D-22:** Position near the bottom of the page, just before or alongside the form section

### FAQ Section (CTA-03)
- **D-23:** Accordion format using Nuxt UI `UAccordion` component
- **D-24:** 5-7 questions addressing purchase objections: "Funciona para quem gasta pouco?", "Preciso ter cartao premium?", "E se eu nao gostar?", "Como funciona a reuniao?", "Quanto tempo leva para ver resultado?"
- **D-25:** Answers concise (2-3 sentences each), written in first person from Marcio's perspective

### Section Layout & Spacing
- **D-26:** Alternating background tints between sections (brand-bg #f8f9fa and white #ffffff) for visual separation
- **D-27:** Generous vertical padding on each section (py-16 to py-24 on desktop, py-12 on mobile)
- **D-28:** All section components follow naming pattern `Section/Section[Name].vue` (established in Phase 1)
- **D-29:** Sections rendered as siblings in `app.vue` main content area, no client-side routing

### Content Strategy
- **D-30:** All copy uses realistic placeholder text with clear TODO markers (e.g., `<!-- TODO: replace with real data from Marcio -->`)
- **D-31:** Real numbers from Marcio are the critical path for finalizing — code structure supports easy swap
- **D-32:** All images referenced from R2 via `useRuntimeConfig().public.r2BaseUrl` (pattern established in Phase 1)

### Claude's Discretion
- Exact icon choices for Como Funciona steps
- Exact spacing values within sections
- Testimonial card internal layout
- Whether to use UCard or custom card styling
- Hero section decorative elements (if any)
- Section transition effects (scroll animations if desired)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `docs/PRD.md` — Original PRD with copy direction, section structure, and design specs
- `.planning/PROJECT.md` — Project context with validated Phase 1 requirements
- `.planning/REQUIREMENTS.md` — v1 requirements HERO-01-05, AUTH-01-02, METD-01-02, SOCL-01-02, CTA-02, CTA-03

### Prior Phase
- `.planning/phases/01-foundation-infrastructure/01-CONTEXT.md` — Design token decisions (D-04, D-05, D-06), R2 strategy (D-06-08), component patterns

### Research
- `.planning/research/FEATURES.md` — Table stakes features, competitor analysis, anti-features
- `.planning/research/ARCHITECTURE.md` — Component structure, section naming conventions
- `.planning/research/PITFALLS.md` — Social proof credibility, content blockers

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/App/AppHeader.vue` — Header component (navigation placeholder)
- `app/components/App/AppFooter.vue` — Footer component
- `app/components/Section/SectionPlaceholder.vue` — Existing section pattern with R2 image reference via NuxtImg
- `app/composables/useLeadForm.ts` — Lead form composable stub (Phase 3, but form anchor target exists)

### Established Patterns
- Design tokens in `app/assets/css/main.css` via `@theme {}` block: 6 brand colors + Inter font
- R2 images via `useRuntimeConfig().public.r2BaseUrl` + absolute URL
- Nuxt UI components available (`UApp` wrapper in app.vue, `UAccordion`, `UCard`, `UButton`, etc.)
- `useSeoMeta` and `useSchemaOrg` already configured in app.vue

### Integration Points
- `app/app.vue` `<main id="main-content">` — Section components will be added here as siblings
- `SectionPlaceholder.vue` will be replaced by actual section components
- CTA buttons must scroll to `#formulario` anchor (form section in Phase 3)

</code_context>

<specifics>
## Specific Ideas

- Research recommends WhatsApp as primary CTA in Brazilian market (148M users, 45-60% conversion) — but WhatsApp CTA is Phase 3 (CTA-01). Phase 2 CTA buttons should scroll to form anchor.
- Competitors (PassageiroDePrimeira, ArteDasMilhas) lack visible pricing and specific result numbers — these are Fly Up Milhas differentiators
- Screenshots of WhatsApp conversations are particularly effective as social proof in BR market
- Price anchoring: frame R$200 against the value of passagens (R$3.000+) to change the mental frame
- "Para voce que..." blocks addressing 3 personas could be a v2 differentiator (deferred)

</specifics>

<deferred>
## Deferred Ideas

- "Para voce que..." persona-targeted blocks (3 audience segments) — v2 differentiator
- Video of Marcio explaining approach (click-to-play) — v2
- Scroll animations / section transitions — v2 or Claude discretion for subtle effects
- Guarantee/risk reversal ("Se nao ficar satisfeito...") — needs validation with Marcio

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-display-sections*
*Context gathered: 2026-03-21*
