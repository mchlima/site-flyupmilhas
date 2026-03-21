# Phase 2: Display Sections - Research

**Researched:** 2026-03-21
**Domain:** Nuxt 4 + Nuxt UI v4 static section components — landing page narrative (hero, expert bio, method, social proof, price, FAQ)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Section (HERO-01 through HERO-05)**
- D-01: Benefit-focused headline: "Sua proxima viagem de classe executiva custa menos que um jantar fora."
- D-02: Subheadline explaining the mechanism: consultoria personalizada de 1 hora que monta sua estrategia
- D-03: Single CTA button "Quero minha Consultoria" in brand-cta color (laranja #e67e22), scrolls to lead form anchor (#formulario)
- D-04: Hero takes full viewport height on mobile (min-h-screen or min-h-[80vh]), headline + CTA visible above the fold on 375px
- D-05: Clean off-white background (brand-bg), no hero image for MVP — rely on strong typography and CTA contrast
- D-06: Inter font at configured weight, brand-primary (#1a3a5c) for headline text

**Expert Section (AUTH-01, AUTH-02)**
- D-07: Section "Quem e o Marcio" with photo served from R2 (WebP, pre-optimized)
- D-08: Display specific numeric results: milhas acumuladas, paises visitados, economia gerada para clientes
- D-09: Brief bio paragraph focused on results, not credentials
- D-10: Secondary CTA button at bottom of section scrolling to form anchor
- D-11: Use placeholder photo and placeholder numbers with TODO markers until Marcio provides real content

**Como Funciona (METD-01, METD-02)**
- D-12: 4-step visual flow: Diagnostico -> Estrategia -> Execucao -> Voo
- D-13: Each step has an icon (Nuxt UI icons or simple SVG), title, and 1-2 sentence description
- D-14: Horizontal layout on desktop (4 columns), vertical stack on mobile
- D-15: Clear offer description nearby: R$200 pagamento unico, 2 reunioes online, 1 mes acompanhamento

**Social Proof (SOCL-01, SOCL-02)**
- D-16: Testimonial cards with: real first name, city, specific R$ savings or route + cabin class
- D-17: Minimum 2 testimonials displayed (use realistic placeholders until Marcio provides real ones)
- D-18: At least 1 result screenshot served from R2 (print of passagem emitida or economia calculada)
- D-19: Cards with subtle shadow and rounded corners, consistent with brand design

**Price & Value Anchoring (CTA-02)**
- D-20: Price R$200 displayed prominently near a CTA
- D-21: Value anchor: "Passagens que custam R$3.000+ emitidas por menos" or similar comparison
- D-22: Position near the bottom of the page, just before or alongside the form section

**FAQ Section (CTA-03)**
- D-23: Accordion format using Nuxt UI `UAccordion` component
- D-24: 5-7 questions addressing purchase objections
- D-25: Answers concise (2-3 sentences each), written in first person from Marcio's perspective

**Section Layout & Spacing**
- D-26: Alternating background tints (brand-bg #f8f9fa and white #ffffff) between sections
- D-27: Generous vertical padding — py-16 to py-24 on desktop, py-12 on mobile
- D-28: All section components follow naming pattern `Section/Section[Name].vue`
- D-29: Sections rendered as siblings in `app.vue` main content area, no client-side routing

**Content Strategy**
- D-30: All copy uses realistic placeholder text with clear TODO markers
- D-31: Real numbers from Marcio are the critical path — code structure supports easy swap
- D-32: All images referenced from R2 via `useRuntimeConfig().public.r2BaseUrl`

### Claude's Discretion
- Exact icon choices for Como Funciona steps
- Exact spacing values within sections
- Testimonial card internal layout
- Whether to use UCard or custom card styling
- Hero section decorative elements (if any)
- Section transition effects (scroll animations if desired)

### Deferred Ideas (OUT OF SCOPE)
- "Para voce que..." persona-targeted blocks (3 audience segments) — v2 differentiator
- Video of Marcio explaining approach (click-to-play) — v2
- Scroll animations / section transitions — v2 or Claude discretion for subtle effects
- Guarantee/risk reversal ("Se nao ficar satisfeito...") — needs validation with Marcio
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Hero section com headline focado em beneficio | Locked copy in D-01; typography via Inter + brand-primary token |
| HERO-02 | Subheadline explicando o mecanismo (consultoria personalizada) | D-02; positioned below headline, Inter font, brand-text-muted color |
| HERO-03 | CTA unico acima da dobra ("Quero minha Consultoria") em cor de destaque | UButton with class binding to brand-cta token; scrolls to #formulario anchor |
| HERO-04 | Layout mobile-first responsivo com fundo claro (off-white/cinza ultra claro) | min-h-screen/min-h-[80vh]; brand-bg token; Tailwind responsive grid |
| HERO-05 | Tipografia sans-serif moderna (Inter ou Geist) com legibilidade maxima | Inter already configured in main.css @theme; font-family-sans token |
| AUTH-01 | Secao do especialista com foto, bio e resultados reais do Marcio | NuxtImg from R2; bio paragraph; placeholder with TODO markers |
| AUTH-02 | Numeros especificos de resultados (milhas acumuladas, paises visitados, economia gerada) | Stat counter pattern; 3 metrics displayed prominently; placeholder data |
| METD-01 | Secao "Como Funciona" com 4 passos visuais | 4-column desktop / 1-column mobile grid; UIcon + title + description per step |
| METD-02 | Descricao clara da oferta (R$200, 2 reunioes, 1 mes acompanhamento, entregaveis) | Offer block placed within or immediately after Como Funciona section |
| SOCL-01 | Secao de depoimentos com nomes reais e resultados especificos | UCard testimonial grid; 2+ placeholder cards with TODO markers |
| SOCL-02 | Prints de resultados reais (passagens emitidas, screenshots de economia) | NuxtImg from R2; 1+ result screenshot with placeholder until content arrives |
| CTA-02 | Preco visivel (R$200) com ancoragem de valor | Price band section; "R$200" large text; value comparison copy; near page bottom |
| CTA-03 | Secao FAQ com 5-7 perguntas que tratam objecoes de compra | UAccordion with items array; 5-7 Q&A pairs; collapsible, single-open |
</phase_requirements>

---

## Summary

Phase 2 delivers all static content sections of the landing page. The foundation (design tokens, component naming conventions, R2 image pipeline, Nuxt UI modules) was established in Phase 1. This phase is purely additive: replace `SectionPlaceholder.vue` in `app.vue` with real section components and add `#formulario` anchor (the form stub that Phase 3 will fill).

Every section component in this phase is pure display — no reactive state beyond the FAQ accordion open/close, no API calls, no client-only logic that would trigger hydration mismatches. The primary implementation challenge is not technical complexity but content discipline: all placeholder text must carry explicit `<!-- TODO: replace with real data from Marcio -->` markers so they are unmissable before launch.

The `useScroll` composable is the only new shared logic required: CTA buttons throughout the page call `scrollTo('#formulario')` to bring the user to the lead form anchor. This is a thin browser-native wrapper, not a library dependency.

**Primary recommendation:** Build sections in page-scroll order (Hero → Expert → Method → Social Proof → Price/CTA → FAQ), replacing `SectionPlaceholder` once the first section is complete. Use `UAccordion` for FAQ (the only Nuxt UI component with stateful behavior needed in this phase); use custom Tailwind markup for testimonial cards and method steps rather than forcing UCard where layout control matters more than component API.

---

## Standard Stack

### Core (already installed — no new installs needed for Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| nuxt | ^4.4.2 | SSR framework, auto-import | Phase 1 established; `app/` directory structure |
| @nuxt/ui | 4.5.1 | UAccordion, UButton, UCard, UIcon | Installed; provides accessible accordion for FAQ with zero extra dependencies |
| @nuxt/image | ^2.0.0 | NuxtImg for R2 photos | Installed; expert photo + testimonial screenshot served from R2 |
| tailwindcss | ^4.2.2 | Utility classes for layout | Managed by @nuxt/ui; CSS-first config via main.css @theme block |

### Design Tokens Already Available (from Phase 1 main.css)

| Token | Value | Use in Phase 2 |
|-------|-------|----------------|
| `--color-brand-primary` | `#1a3a5c` | Headings, section titles, step numbers |
| `--color-brand-bg` | `#f8f9fa` | Alternating section background (odd sections) |
| `--color-brand-cta` | `#e67e22` | CTA buttons, accent highlights, price display |
| `--color-brand-cta-hover` | `#d35400` | Button hover state |
| `--color-brand-text` | `#1a1a1a` | Body copy, testimonial text |
| `--color-brand-text-muted` | `#6b7280` | Secondary text, captions, city labels |
| `--font-family-sans` | Inter + system fallback | All text; Inter already loaded |

### No New Dependencies Needed

Phase 2 requires no `npm install` operations. All components, icons, and utilities are available through the installed stack. The only new code is `.vue` component files and one composable.

---

## Architecture Patterns

### Recommended Component File Map

```
app/
├── app.vue                          # Updated: replace SectionPlaceholder with real sections + #formulario anchor
├── assets/css/main.css              # No changes needed
├── components/
│   └── Section/
│       ├── SectionPlaceholder.vue   # Kept temporarily during build, removed at phase end
│       ├── SectionHero.vue          # HERO-01, HERO-02, HERO-03, HERO-04, HERO-05
│       ├── SectionExpert.vue        # AUTH-01, AUTH-02
│       ├── SectionMethod.vue        # METD-01, METD-02
│       ├── SectionSocialProof.vue   # SOCL-01, SOCL-02
│       ├── SectionPrice.vue         # CTA-02 (price + value anchoring)
│       └── SectionFAQ.vue           # CTA-03 (accordion FAQ)
└── composables/
    ├── useLeadForm.ts               # Existing stub — no changes
    └── useScroll.ts                 # NEW: smooth scroll to #formulario
```

### Pattern 1: Section Component Shell

Every section in this phase follows the same structural pattern:

```vue
<!-- Section/SectionHero.vue — example shell, applies to all sections -->
<script setup lang="ts">
const config = useRuntimeConfig()
const r2Base = config.public.r2BaseUrl  // only in sections that display R2 images
</script>

<template>
  <section id="hero" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- section content -->
    </div>
  </section>
</template>
```

**Rules for all Phase 2 sections:**
- Section wrapper uses semantic `<section>` with a meaningful `id`
- Max width container `max-w-5xl mx-auto` for reading comfort
- Horizontal padding `px-6` minimum on mobile, auto on desktop
- No `<ClientOnly>` wrappers needed (all content is SSR-safe)
- No `$fetch` or `useFetch` calls (all content is static/hardcoded in this phase)

### Pattern 2: app.vue Section Assembly

After all sections are built, `app.vue` assembles them:

```vue
<!-- app.vue — final state after Phase 2 -->
<template>
  <UApp>
    <AppHeader />
    <main id="main-content">
      <SectionHero />
      <SectionExpert />
      <SectionMethod />
      <SectionSocialProof />
      <SectionPrice />
      <SectionFAQ />
      <!-- Phase 3 will add: -->
      <section id="formulario" aria-label="Formulário de consultoria">
        <!-- TODO: Phase 3 — SectionLeadForm goes here -->
      </section>
    </main>
    <AppFooter />
  </UApp>
</template>
```

The `#formulario` anchor MUST be present at end of Phase 2 even as an empty stub — CTA buttons throughout the page scroll to it and will silently fail if it doesn't exist in the DOM.

### Pattern 3: useScroll Composable

```typescript
// app/composables/useScroll.ts
export function useScroll() {
  function scrollTo(id: string) {
    if (import.meta.client) {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return { scrollTo }
}
```

Usage in CTA buttons:
```vue
<script setup lang="ts">
const { scrollTo } = useScroll()
</script>
<template>
  <UButton
    label="Quero minha Consultoria"
    class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg"
    @click="scrollTo('formulario')"
  />
</template>
```

The guard `if (import.meta.client)` prevents `document` access during SSR — without it the build will throw a ReferenceError.

### Pattern 4: UAccordion for FAQ (D-23)

UAccordion v4.5.1 accepts an `items` array with `label` and `content` keys. Default behavior is single-open with collapsible. No additional configuration needed.

```vue
<!-- Section/SectionFAQ.vue -->
<script setup lang="ts">
const faqItems = [
  {
    label: 'Funciona para quem gasta pouco no cartão?',
    content: 'Sim. Mesmo com R$1.500/mês em gastos, é possível acumular milhas suficientes para voos nacionais em menos de 1 ano. Na nossa reunião mapeamos seu perfil e definimos o ritmo ideal para o seu objetivo.',
  },
  {
    label: 'Preciso ter cartão premium para participar?',
    content: 'Não. Trabalho com cartões de diferentes categorias. O objetivo é otimizar o que você já tem e, se fizer sentido, indicar upgrades que compensem financeiramente.',
  },
  {
    label: 'E se eu não gostar da consultoria?',
    content: 'A primeira reunião é um diagnóstico detalhado. Se ao final dela você sentir que não foi o que esperava, conversamos — meu objetivo é que você saia com um plano claro e acionável.',
  },
  {
    label: 'Como funciona a reunião online?',
    content: 'Fazemos via Google Meet ou WhatsApp Video. Dura em média 1 hora. Você compartilha sua tela para vermos os programas juntos, e eu monto sua estratégia em tempo real.',
  },
  {
    label: 'Quanto tempo leva para ver resultado?',
    content: 'Depende do seu ritmo de gastos e objetivo. Resultados em milhas acumuladas aparecem no primeiro mês. Emissão de passagens executivas geralmente acontece entre 3 e 12 meses após a estratégia implementada.',
  },
  // TODO: replace with real Q&A from Marcio — add 1-2 more as needed
]
</script>

<template>
  <section id="faq" class="bg-[var(--color-brand-bg)] py-12 md:py-20 px-6">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-[var(--color-brand-primary)] mb-8 text-center">
        Perguntas Frequentes
      </h2>
      <UAccordion :items="faqItems" collapsible />
    </div>
  </section>
</template>
```

### Pattern 5: R2 Image Reference (D-07, D-18, D-32)

```vue
<script setup lang="ts">
const config = useRuntimeConfig()
const r2Base = config.public.r2BaseUrl
</script>

<template>
  <!-- Expert photo — fetchpriority only on LCP elements; expert photo is below fold -->
  <NuxtImg
    :src="`${r2Base}/marcio-profile.webp`"
    width="400"
    height="400"
    alt="Marcio — especialista em milhas aéreas"
    loading="lazy"
    class="rounded-full w-40 h-40 object-cover"
  />
  <!-- TODO: replace marcio-profile.webp with real photo from Marcio -->
</template>
```

**Note:** Only the hero LCP image uses `loading="eager"` and `fetchpriority="high"`. All other images in Phase 2 use `loading="lazy"` — they are below the fold and lazy loading improves LCP.

### Pattern 6: Stats Display for AUTH-02

```vue
<!-- Inside SectionExpert.vue -->
<div class="grid grid-cols-3 gap-6 mt-8">
  <div class="text-center">
    <p class="text-4xl font-bold text-[var(--color-brand-cta)]">
      <!-- TODO: replace with real number from Marcio -->
      +500k
    </p>
    <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">milhas acumuladas</p>
  </div>
  <div class="text-center">
    <p class="text-4xl font-bold text-[var(--color-brand-cta)]">
      <!-- TODO: replace with real number from Marcio -->
      +30
    </p>
    <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">países visitados</p>
  </div>
  <div class="text-center">
    <p class="text-4xl font-bold text-[var(--color-brand-cta)]">
      <!-- TODO: replace with real number from Marcio -->
      R$280k
    </p>
    <p class="text-sm text-[var(--color-brand-text-muted)] mt-1">em passagens emitidas para clientes</p>
  </div>
</div>
```

### Pattern 7: Method Steps (METD-01) with UIcon

Nuxt UI v4 bundles `@nuxt/icon` (which wraps `@iconify/vue`). Icons are referenced by Iconify name: `heroicons:magnifying-glass`, `heroicons:light-bulb`, `heroicons:rocket-launch`, `heroicons:paper-airplane`.

```vue
<!-- Inside SectionMethod.vue -->
<script setup lang="ts">
const steps = [
  {
    icon: 'heroicons:magnifying-glass',
    title: 'Diagnóstico',
    description: 'Analisamos seus cartões, programas de fidelidade e padrão de gastos para identificar oportunidades.',
  },
  {
    icon: 'heroicons:light-bulb',
    title: 'Estratégia',
    description: 'Montamos um plano personalizado: melhores cartões para seu perfil, programas ideais e metas de acúmulo.',
  },
  {
    icon: 'heroicons:rocket-launch',
    title: 'Execução',
    description: 'Reunião guiada para ativar a estratégia: transferências de pontos, cadastros e primeiras emissões.',
  },
  {
    icon: 'heroicons:paper-airplane',
    title: 'Voo',
    description: 'Suporte durante o check-in e orientação para aproveitar ao máximo sua viagem em executiva.',
  },
]
</script>

<template>
  <section id="como-funciona" class="bg-white py-12 md:py-20 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-[var(--color-brand-primary)] mb-12 text-center">
        Como Funciona
      </h2>
      <!-- 4-col desktop, 1-col mobile (D-14) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div v-for="(step, idx) in steps" :key="idx" class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-brand-bg)] mb-4">
            <UIcon :name="step.icon" class="w-8 h-8 text-[var(--color-brand-cta)]" />
          </div>
          <h3 class="font-semibold text-[var(--color-brand-primary)] mb-2">{{ step.title }}</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)]">{{ step.description }}</p>
        </div>
      </div>
      <!-- Offer description (D-15) -->
      <div class="mt-12 p-6 bg-[var(--color-brand-bg)] rounded-xl text-center">
        <p class="text-[var(--color-brand-primary)] font-semibold text-lg mb-3">O que está incluso:</p>
        <ul class="text-[var(--color-brand-text-muted)] space-y-1 text-sm">
          <li>2 reuniões online (estratégia + execução)</li>
          <li>1 mês de acompanhamento por WhatsApp</li>
          <li>Diagnóstico completo de cartões e programas</li>
          <li>Planejamento de rotas e emissões</li>
        </ul>
      </div>
    </div>
  </section>
</template>
```

### Pattern 8: Testimonial Cards (SOCL-01, SOCL-02)

Custom card markup preferred over UCard here — gives full layout control for the testimonial structure without fighting UCard's slot model.

```vue
<!-- Inside SectionSocialProof.vue -->
<script setup lang="ts">
const config = useRuntimeConfig()
const r2Base = config.public.r2BaseUrl

const testimonials = [
  {
    name: 'Carlos M.',         // TODO: replace with real name from Marcio
    city: 'São Paulo, SP',     // TODO: real city
    result: 'Economizei R$4.200 em uma passagem para Lisboa na Business Class usando só milhas do cartão do dia a dia.',
  },
  {
    name: 'Fernanda R.',       // TODO: replace with real name from Marcio
    city: 'Belo Horizonte, MG', // TODO: real city
    result: 'Em 8 meses acumulei milhas suficientes para toda a família voar para Orlando — sem pagar passagem.',
  },
]
</script>

<template>
  <section id="depoimentos" class="bg-[var(--color-brand-bg)] py-12 md:py-20 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-[var(--color-brand-primary)] mb-10 text-center">
        O que dizem meus clientes
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          v-for="(t, idx) in testimonials"
          :key="idx"
          class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <p class="text-[var(--color-brand-text)] mb-4 italic">"{{ t.result }}"</p>
          <p class="font-semibold text-[var(--color-brand-primary)] text-sm">{{ t.name }}</p>
          <p class="text-[var(--color-brand-text-muted)] text-xs">{{ t.city }}</p>
        </div>
      </div>
      <!-- Result screenshot (D-18) -->
      <!-- TODO: replace result-screenshot.webp with real print from Marcio -->
      <div class="text-center">
        <NuxtImg
          :src="`${r2Base}/result-screenshot.webp`"
          width="600"
          height="400"
          alt="Print de passagem executiva emitida via consultoria Fly Up Milhas"
          loading="lazy"
          class="rounded-xl shadow-md mx-auto max-w-lg w-full"
        />
        <p class="text-xs text-[var(--color-brand-text-muted)] mt-2">
          Passagem Business Class emitida para cliente — resultado real
          <!-- TODO: update caption with specific details from Marcio -->
        </p>
      </div>
    </div>
  </section>
</template>
```

### Pattern 9: Alternating Background Tints (D-26)

Section background alternates between `bg-[var(--color-brand-bg)]` (#f8f9fa) and `bg-white`. The page-scroll order determines which uses which:

| Section | Background |
|---------|------------|
| SectionHero | `bg-[var(--color-brand-bg)]` |
| SectionExpert | `bg-white` |
| SectionMethod | `bg-white` |
| SectionSocialProof | `bg-[var(--color-brand-bg)]` |
| SectionPrice | `bg-white` |
| SectionFAQ | `bg-[var(--color-brand-bg)]` |

### Anti-Patterns to Avoid

- **Hero image (none in MVP):** D-05 locks out a hero image — do NOT add an image to SectionHero even for visual interest. Strong typography is the intent.
- **fetchpriority="high" on below-fold images:** Only the LCP element gets this. Expert photo and testimonial screenshots are below fold — use `loading="lazy"` only.
- **ClientOnly wrapper around FAQ:** UAccordion is SSR-safe. Wrapping in `<ClientOnly>` adds layout shift and is unnecessary.
- **Pinia for section data:** Steps array, FAQ items, testimonials are hardcoded static data. No store needed.
- **UCard for method steps:** UCard's slot structure (header/body/footer) adds friction for the icon + title + text step layout. Custom markup with Tailwind is cleaner.
- **document.getElementById without import.meta.client guard:** Will throw during Nitro SSR build.
- **Competing CTAs:** Each section may have at most one CTA button. All CTA buttons scroll to `#formulario`. No CTA opens WhatsApp (that is Phase 3 — CTA-01).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion/FAQ expand-collapse | Custom `v-show` toggle with CSS transitions | `UAccordion` from @nuxt/ui | Accessibility (ARIA), keyboard navigation, animation — UAccordion handles all three correctly; custom implementations miss ARIA attributes |
| Icon rendering | Inline SVGs copied into components | `UIcon` with Heroicons name | @nuxt/icon (bundled with @nuxt/ui) manages SVG sprite or on-demand loading; inline SVGs bloat bundle |
| Smooth scroll to anchor | jQuery `.animate()` or custom requestAnimationFrame loop | `el.scrollIntoView({ behavior: 'smooth' })` wrapped in `useScroll` composable | Browser native, zero bundle cost, works without JS library |
| Button component | Custom `<button>` with manual hover/focus states | `UButton` from @nuxt/ui | Focus ring, disabled state, loading state, accessible by default |

**Key insight:** All of Phase 2's display complexity is handled by Tailwind layout utilities + two Nuxt UI components (UAccordion, UButton). There is no complex UI problem requiring a custom solution.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch from Date/Random in Section Content

**What goes wrong:** If any section computes content based on `new Date()`, `Math.random()`, or browser globals during render, SSR output differs from client output, causing Vue to discard the server HTML and re-render — visible flash, bad LCP.

**Why it happens:** Developers add "dynamic" elements like "Hoje e [date]" or randomly ordered testimonials without realizing components run on both server and client.

**How to avoid:** All content in Phase 2 sections is static (hardcoded arrays, fixed copy). No `Date`, no `Math.random()`, no `window`. The only browser access is in `useScroll` which is already guarded by `import.meta.client`.

**Warning signs:** Browser console shows "Hydration node mismatch" after `nuxt build && nuxt preview`.

### Pitfall 2: Forgetting #formulario Anchor Stub

**What goes wrong:** CTA buttons in Hero, Expert, and Price sections scroll to `#formulario`. If that `id` doesn't exist in the DOM, `getElementById('formulario')` returns null, `scrollIntoView` is never called, and the button click does nothing. The user sees no error but the CTA is broken.

**Why it happens:** The form section is Phase 3 — developers defer the anchor along with the form. But the anchor must land in Phase 2 so that Phase 2 CTAs work.

**How to avoid:** Add a minimal `<section id="formulario">` stub inside `app.vue` at the end of Phase 2. It can be empty or contain a "formulario em breve" placeholder.

**Warning signs:** Clicking any CTA button in the browser does not scroll the page.

### Pitfall 3: r2BaseUrl Empty in Local Dev Causes Broken Images

**What goes wrong:** `NuxtImg` src computes to `undefined/marcio-profile.webp` if `NUXT_PUBLIC_R2_BASE_URL` is not set in the local `.env` file. The image src becomes `"undefined/marcio-profile.webp"`, which results in a broken image with no console error.

**Why it happens:** `config.public.r2BaseUrl` returns empty string `''` when the env var is missing. Concatenating `'' + '/marcio-profile.webp'` gives `'/marcio-profile.webp'` — a relative URL that returns 404 in local dev, but not an obvious error.

**How to avoid:** Confirm `.env` has `NUXT_PUBLIC_R2_BASE_URL=https://cdn.flyupmilhas.com.br` before running `nuxt dev`. This was established in Phase 1 — verify it is still set. Add a console warning in development if the value is empty.

**Warning signs:** Expert photo or result screenshots show as broken images in `nuxt dev`.

### Pitfall 4: UButton Color Prop Overrides Custom Background

**What goes wrong:** `UButton` with `color="primary"` ignores the custom `class` background because Nuxt UI's `tv()` variant system applies color classes at higher specificity. The brand-cta orange does not appear.

**Why it happens:** UButton's `color` prop generates Tailwind utility classes internally via `tailwind-variants`. A custom `class` attribute may be overridden by the component's generated classes.

**How to avoid:** Either (a) avoid the `color` prop and apply all styling via `class`, or (b) configure the button color in `app.config.ts` to use the brand-cta token. The safest approach for MVP: use `class` only, with explicit Tailwind utilities:

```vue
<UButton
  label="Quero minha Consultoria"
  class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-bold px-8 py-4 rounded-lg text-lg"
  @click="scrollTo('formulario')"
/>
```

**Warning signs:** CTA button appears in Nuxt UI's default blue/green instead of the expected laranja #e67e22.

### Pitfall 5: Section ID Conflicts with Navigation Jump Links

**What goes wrong:** Section IDs like `id="hero"`, `id="faq"` placed on elements cause the browser to scroll to them when the URL contains a hash (e.g., direct link to `flyupmilhas.com.br#faq`). Depending on sticky header height, the section title is hidden behind the header.

**Why it happens:** The sticky header (from AppHeader) covers the top of the section when jumped to via hash link.

**How to avoid:** For Phase 2 MVP this is low-risk (no navigation exists in the LP, no hash links are shared). If needed, add `scroll-margin-top` to sections to account for header height. Not required before launch.

### Pitfall 6: TODO Markers Reaching Production

**What goes wrong:** Placeholder copy ("Carlos M. — TODO: replace with real name") or placeholder images (`result-screenshot.webp` that doesn't exist on R2) ship to production. This destroys trust.

**Why it happens:** Content from Marcio arrives after code is deployed; placeholder markers are easy to miss in a code review.

**How to avoid:** Per D-30 and D-31, all placeholders use HTML comment format `<!-- TODO: replace with real data from Marcio -->`. Before Phase 2 verification, run a grep for `TODO` across all Section components. Create a content checklist in the phase verification document.

---

## Code Examples

### Hero Section with Locked Copy (HERO-01 through HERO-05)

```vue
<!-- app/components/Section/SectionHero.vue -->
<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="hero"
    class="min-h-screen md:min-h-[80vh] flex flex-col items-center justify-center bg-[var(--color-brand-bg)] px-6 py-16 text-center"
  >
    <div class="max-w-3xl mx-auto">
      <!-- HERO-01: Benefit-focused headline (D-01) -->
      <h1 class="text-4xl md:text-6xl font-bold text-[var(--color-brand-primary)] leading-tight mb-6">
        Sua próxima viagem de classe executiva custa menos que um jantar fora.
      </h1>
      <!-- HERO-02: Subheadline explaining mechanism (D-02) -->
      <p class="text-lg md:text-xl text-[var(--color-brand-text-muted)] mb-10 max-w-xl mx-auto">
        Consultoria personalizada de 1 hora que monta sua estratégia completa de acúmulo e emissão de milhas.
      </p>
      <!-- HERO-03: Single CTA (D-03) -->
      <UButton
        label="Quero minha Consultoria"
        size="xl"
        class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-bold px-10 py-4 rounded-lg text-lg"
        @click="scrollTo('formulario')"
      />
    </div>
  </section>
</template>
```

### useScroll Composable

```typescript
// app/composables/useScroll.ts
export function useScroll() {
  function scrollTo(id: string) {
    if (import.meta.client) {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return { scrollTo }
}
```

### SectionPrice — Value Anchoring (CTA-02)

```vue
<!-- app/components/Section/SectionPrice.vue -->
<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section id="preco" class="bg-white py-12 md:py-20 px-6">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Value anchor first, price second (D-21, D-22) -->
      <p class="text-[var(--color-brand-text-muted)] mb-4 text-lg">
        <!-- TODO: replace with real average savings figure from Marcio -->
        Passagens que custam R$3.000+ — emitidas por menos com milhas
      </p>
      <div class="text-6xl font-bold text-[var(--color-brand-cta)] mb-2">R$200</div>
      <p class="text-[var(--color-brand-text-muted)] mb-8">Pagamento único. Sem mensalidades.</p>
      <UButton
        label="Quero minha Consultoria"
        size="xl"
        class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-bold px-10 py-4 rounded-lg text-lg"
        @click="scrollTo('formulario')"
      />
    </div>
  </section>
</template>
```

### #formulario Anchor Stub (app.vue update)

```vue
<!-- app.vue — final state -->
<template>
  <UApp>
    <AppHeader />
    <main id="main-content">
      <SectionHero />
      <SectionExpert />
      <SectionMethod />
      <SectionSocialProof />
      <SectionPrice />
      <SectionFAQ />
      <!-- Phase 3 will replace this stub with SectionLeadForm -->
      <section
        id="formulario"
        class="py-12 px-6 bg-[var(--color-brand-bg)]"
        aria-label="Formulário de consultoria"
      >
        <!-- TODO: Phase 3 — SectionLeadForm -->
      </section>
    </main>
    <AppFooter />
  </UApp>
</template>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` for design tokens | CSS-first `@theme {}` block in main.css | Tailwind v4 (2025) | No JS config file; tokens are CSS custom properties; already applied in Phase 1 |
| `UAccordion` items with `content` slot per item | `items` array with `label`/`content` keys; `content` slot for custom body | Nuxt UI v4 (Sep 2025) | Declarative array pattern replaces verbose slot-per-item markup |
| Separate `@nuxt/icon` install | Bundled with `@nuxt/ui` | Nuxt UI v4 | `UIcon` works without additional install; Heroicons and other sets available via Iconify namespace |
| `useHead({ title: '...' })` | `useSeoMeta({ title: '...' })` | Nuxt UI v4 / @nuxtjs/seo | SSR-safe, deduplicates; already used in app.vue (Phase 1) |

**Deprecated/outdated:**
- `<LazySection[Name]>` prefix for async loading: Phase 2 sections are all above or near fold; lazy import adds complexity without benefit for a single-page LP. The `SectionFAQ` could be lazy-loaded but the savings are minimal.
- `v-html` for FAQ content: Tempting for multi-paragraph answers, but XSS risk. Use plain text `{{ item.content }}` with `<br>` for line breaks if needed.

---

## Open Questions

1. **UButton color variant vs class override**
   - What we know: Nuxt UI v4 `tv()` styling system can conflict with custom `class` attributes depending on prop combinations
   - What's unclear: Whether `color="custom"` via `app.config.ts` is cleaner than raw class override for the CTA button
   - Recommendation: Use raw `class` override for MVP (simpler, zero config); move to `app.config.ts` color definition in v2 if button style consistency becomes an issue

2. **Result screenshot placeholder on R2**
   - What we know: `result-screenshot.webp` is referenced in SectionSocialProof but may not exist on R2 yet
   - What's unclear: Whether a 404 from R2 breaks the page layout or gracefully degrades with alt text
   - Recommendation: Wrap the screenshot in a `v-if="r2Base"` check and add a visible placeholder div so the layout doesn't collapse; NuxtImg with a missing src shows the alt attribute but may collapse the container

3. **Icon availability without explicit install**
   - What we know: `@nuxt/icon` is a dependency of `@nuxt/ui` 4.5.1; `UIcon` renders via it
   - What's unclear: Whether Heroicons icons are available by default or require an `@iconify-json/heroicons` package install
   - Recommendation: Test `UIcon name="heroicons:magnifying-glass"` in `nuxt dev` during the first task; if it fails, run `pnpm add @iconify-json/heroicons` — this is a lightweight package (~200KB) and a known requirement for on-demand icon loading

---

## Sources

### Primary (HIGH confidence)

- **Existing codebase** — Phase 1 components, main.css design tokens, nuxt.config.ts: examined directly at commit time
- **@nuxt/ui 4.5.1 installed source** — `node_modules/@nuxt/ui/dist/runtime/components/Accordion.vue`, `Card.vue`, `Button.vue`, `Icon.vue`: verified props, slots, and behavior directly from installed package
- **package.json** — verified installed versions: nuxt ^4.4.2, @nuxt/ui 4.5.1, @nuxt/image ^2.0.0, tailwindcss ^4.2.2, zod ^3.25.76
- **02-CONTEXT.md** — all locked decisions D-01 through D-32 consumed verbatim

### Secondary (MEDIUM confidence)

- **`.planning/research/ARCHITECTURE.md`** — Component naming conventions, data flow patterns, anti-patterns from Phase 1 research; verified consistent with Phase 1 implementation
- **`.planning/research/PITFALLS.md`** — Hydration mismatch, R2 image, SSR fetch pitfalls: cross-referenced with Phase 1 implementation choices
- **`.planning/research/FEATURES.md`** — Feature landscape, Brazilian market patterns, testimonial specificity requirements

### Tertiary (LOW confidence — training data, consistent with higher sources)

- Nuxt UI v4 UButton `class` override behavior with `tv()` variant system — flagged as Open Question #1

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages physically verified in node_modules; versions from package.json
- Architecture patterns: HIGH — directly derived from existing Phase 1 code + locked CONTEXT.md decisions
- Pitfalls: HIGH (technical) / MEDIUM (content/UX) — technical pitfalls verified against known Phase 1 decisions; UX patterns from existing research
- Code examples: HIGH — derived from verified installed component APIs and existing codebase patterns

**Research date:** 2026-03-21
**Valid until:** 2026-06-21 (Nuxt UI v4 stable; no expected breaking changes in 90 days)
