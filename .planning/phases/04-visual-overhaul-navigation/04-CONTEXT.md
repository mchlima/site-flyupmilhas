# Phase 4: Visual Overhaul & Navigation - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual redesign of the entire landing page: fix background color, implement bento grid layout across all sections, build responsive header with anchor navigation and CTA, replace SectionExpert with SectionAbout (company-focused with renda extra), remove comprovante de resultado from social proof, and fix FAQ text contrast. No new features, no backend changes.

</domain>

<decisions>
## Implementation Decisions

### Background & Colors (VISL-01, VISL-03)
- **D-01:** Change `--color-brand-bg` from `#f8f9fa` to `#F9FAFB` (Tailwind gray-50) — neutral cool tone, no yellow tint
- **D-02:** Update `html` background-color in main.css accordingly
- **D-03:** FAQ text: use `--color-brand-text` (#1a1a1a) instead of `--color-brand-text-muted` (#6b7280) for accordion content — passes WCAG AA 4.5:1

### Bento Grid Layout (VISL-02)
- **D-04:** Bento grid as the visual language for the entire LP — all content sections use it
- **D-05:** Cards with varied sizes (1x1, 2x1, 1x2) — Apple/dashboard style, not uniform grid
- **D-06:** Some cards with colored backgrounds (azul aviacao, laranja CTA) for visual hierarchy and emphasis
- **D-07:** Other cards white with subtle shadow on the off-white background
- **D-08:** Card border-radius: `rounded-xl` (~12px) — modern but not exaggerated
- **D-09:** Sections to refactor with bento: Como Funciona, Depoimentos, Sobre a empresa, and general page layout
- **D-10:** Mobile: bento cards stack to single column; desktop: full grid with varied sizes

### Responsive Menu (NAV-01, NAV-02, NAV-03)
- **D-11:** Header background: azul da marca (`--color-brand-primary` #1a3a5c) with white text
- **D-12:** Sticky behavior: "smart sticky" — appears on scroll UP, hides on scroll DOWN
- **D-13:** Desktop: anchor links (Sobre, Como Funciona, Depoimentos, FAQ) + CTA button "Quero minha Consultoria" destacado em laranja
- **D-14:** Mobile: hamburger icon, fullscreen overlay on open with links centralizados and CTA
- **D-15:** Menu closes on anchor link tap (smooth scroll to section)
- **D-16:** Use `useScroll` composable (already exists) for anchor navigation
- **D-17:** Hamburger animation: use `import.meta.client` guard for state (SSR-safe per Phase 1 convention)

### Secao Sobre a Fly Up Milhas (CONT-01, CONT-02)
- **D-18:** Replace `SectionExpert.vue` with `SectionAbout.vue` — company-focused, not personal bio
- **D-19:** Focus: proposta de valor direta — o que a Fly Up faz por voce
- **D-20:** Benefits list includes "renda extra com milhas" as a bullet alongside viagens executivas e economia familiar
- **D-21:** Visual: icones/ilustracoes em vez de foto pessoal — representativos dos servicos
- **D-22:** Bento grid layout within the section — varied card sizes for each value proposition
- **D-23:** Update `app.vue` to use `<SectionAbout />` instead of `<SectionExpert />`
- **D-24:** Section anchor id changes from `especialista` to `sobre`

### Remover Comprovante (CONT-03)
- **D-25:** Remove the R2 result screenshot (`resultado-placeholder.webp`) from SectionSocialProof
- **D-26:** Keep testimonial cards — only remove the screenshot/comprovante element

### Claude's Discretion
- Exact bento grid CSS Grid template (areas, spans)
- Exact card shadow values
- Hamburger icon animation style (X transition)
- Specific icons/illustrations for SectionAbout value props
- Exact sticky header scroll threshold
- Whether to add subtle hover effects on bento cards
- Transition animations for fullscreen mobile menu

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Components to Modify
- `app/assets/css/main.css` — Design tokens (`--color-brand-bg` to change)
- `app/components/App/AppHeader.vue` — Currently minimal, needs full rebuild with menu
- `app/components/Section/SectionExpert.vue` — To be replaced by SectionAbout
- `app/components/Section/SectionSocialProof.vue` — Remove comprovante screenshot
- `app/components/Section/SectionMethod.vue` — Refactor to bento grid
- `app/components/Section/SectionFAQ.vue` — Fix text contrast
- `app/app.vue` — Update SectionExpert → SectionAbout

### Prior Phase Decisions
- `.planning/phases/01-foundation-infrastructure/01-CONTEXT.md` — Design token system, R2 strategy, SSR patterns
- `.planning/phases/02-display-sections/02-CONTEXT.md` — Section component patterns, spacing conventions

### Research
- `.planning/research/PITFALLS.md` — SSR hydration pitfalls for hamburger menu, bento grid breakpoint validation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/composables/useScroll.ts` — SSR-safe scroll composable (for menu anchor clicks)
- `app/assets/css/main.css` — `@theme {}` block with brand tokens
- Nuxt UI components: `UButton`, `UIcon`, `UAccordion` already in use
- All section components in `app/components/Section/`

### Established Patterns
- `import.meta.client` guard for browser-only logic (useScroll pattern)
- Design tokens via CSS custom properties in `@theme {}` block
- R2 images via `useRuntimeConfig().public.r2BaseUrl`
- Section naming: `Section/Section[Name].vue`
- Alternating backgrounds between sections (currently brand-bg / white)

### Integration Points
- `app/app.vue` — Section order: Hero → About (was Expert) → Method → SocialProof → Price → FAQ → Form
- AppHeader.vue — needs complete rebuild (currently just logo text)
- AppFooter.vue — unchanged in this phase (Phase 5)
- Menu anchor IDs: `sobre` (new), `como-funciona`, `depoimentos`, `faq`, `formulario`

</code_context>

<specifics>
## Specific Ideas

- Bento grid should feel like Apple product pages or modern SaaS dashboards — not a generic Bootstrap grid
- Cards with colored backgrounds (azul, laranja) create visual rhythm and draw attention to key value props
- Smart sticky menu (show on scroll up, hide on scroll down) prevents content obstruction while keeping navigation accessible
- Fullscreen mobile menu creates a focused navigation moment — no partial overlays
- Renda extra should feel like a natural part of the value prop, not an afterthought — equal billing with viagens

</specifics>

<deferred>
## Deferred Ideas

- Scroll animations on bento cards (fade in, slide up on scroll) — could add in future polish phase
- Dark mode toggle — not in scope
- Logo image in header (currently text only) — needs Marcio to provide logo file

</deferred>

---

*Phase: 04-visual-overhaul-navigation*
*Context gathered: 2026-03-21*
