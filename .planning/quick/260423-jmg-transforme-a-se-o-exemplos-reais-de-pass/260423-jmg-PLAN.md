---
phase: quick-260423-jmg
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/Section/SectionProvas.vue
autonomous: true
requirements:
  - QUICK-260423-JMG
must_haves:
  truths:
    - "Desktop (>=1024px): exactly 3 proof cards are visible at once inside a carousel track, with a navigation arrow button (embla next/prev) to reveal the remaining cards"
    - "Mobile (<1024px): exactly 1 proof card is visible at a time with horizontal swipe/drag navigation"
    - "Pagination dots OR arrow buttons allow navigating to every one of the 5 cards on both breakpoints"
    - "All 5 existing cards (prova1..prova5) are present in the DOM at SSR time (SEO preserved — embla uses CSS transforms, not v-if)"
    - "Existing azul aviação palette, rounded corners, shadows, and card content are preserved verbatim"
    - "Section heading, intro copy, impact phrase, and disclaimer all remain unchanged"
  artifacts:
    - path: "app/components/Section/SectionProvas.vue"
      provides: "Carousel-based proof gallery using Nuxt UI UCarousel"
      contains: "UCarousel"
  key_links:
    - from: "app/components/Section/SectionProvas.vue"
      to: "@nuxt/ui UCarousel component"
      via: "<UCarousel :items> with ui.item basis classes for responsive slides-per-view"
      pattern: "UCarousel"
---

<objective>
Transform the "Exemplos reais de passagens emitidas com milhas" section (SectionProvas.vue) from a static responsive grid into a swipeable carousel. Desktop shows 3 cards visible simultaneously + a navigation arrow button to advance; mobile shows 1 card at a time with swipe/dot navigation.

Purpose: Reduce vertical scroll length on mobile (5 cards stacked = heavy scroll) and introduce a tactile, high-engagement pattern while preserving all 5 cards in SSR markup for SEO.
Output: Updated SectionProvas.vue using Nuxt UI UCarousel (embla-carousel under the hood). No new CTAs, no new link targets, no new copy.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/components/Section/SectionProvas.vue
@CLAUDE.md

<interfaces>
<!-- Nuxt UI v4 UCarousel API (from ui.nuxt.com/docs/components/carousel). -->
<!-- Executor should use these directly — no codebase exploration needed. -->

UCarousel usage:
```vue
<UCarousel
  v-slot="{ item }"
  :items="cards"
  :ui="{ item: 'basis-full lg:basis-1/3 pl-4' }"
  arrows
  dots
  class="lg:-mx-4"
>
  <!-- slot receives { item } for each entry in items -->
  <div class="rounded-xl bg-white ...">{{ item.rota }}</div>
</UCarousel>
```

Key props:
- `items` — array of any shape; each exposed via `v-slot="{ item }"`
- `arrows` — show prev/next arrow buttons (this is the "botão" the user mentioned for desktop)
- `dots` — show pagination dots
- `:ui="{ item: 'basis-full lg:basis-1/3 pl-4' }"` — controls slides-per-view per breakpoint: basis-full = 1 per view on mobile, lg:basis-1/3 = 3 per view on desktop
- `class="lg:-mx-4"` on root compensates for the `pl-4` per-slide gutter, producing gap-6-equivalent spacing between cards

Existing card data shape (from current SectionProvas.vue) — UNCHANGED:
```ts
type ProofCard = {
  tag: string
  companhia: string
  rota: string
  info: string
  classe: string
  duracao: string
  milhas: string
  equivalente: string
  economia: string
  imagem: string
}
```

Existing section structure to preserve:
- `<section id="provas" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">`
- h2: "Exemplos reais de passagens emitidas com milhas"
- Intro paragraph, impact phrase, disclaimer — ALL UNCHANGED
- 5 cards array (prova1..prova5) — UNCHANGED
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Refactor SectionProvas grid into UCarousel with responsive slides-per-view</name>
  <files>app/components/Section/SectionProvas.vue</files>
  <behavior>
    - Desktop (lg: 1024px+): UCarousel shows 3 cards per view (basis-1/3), arrow buttons visible to advance to cards 4 and 5
    - Mobile (<lg): UCarousel shows 1 card per view (basis-full), swipeable horizontally, pagination dots visible
    - All 5 cards still present in SSR HTML output (embla only manipulates transforms; no v-if hiding)
    - Existing card markup (image, tags, route h3, classe/duracao, milhas/economia block) preserved verbatim inside the carousel slot
    - Card hover effects still work on desktop (hover:scale, hover:shadow)
    - Section heading, intro paragraph, impact phrase, disclaimer byte-identical to the original
    - NO new CTA buttons, NO new link targets, NO new copy
  </behavior>
  <action>
    Edit `app/components/Section/SectionProvas.vue`:

    1. Keep the `<script setup>` block unchanged — same 5 imports and `cards` array.

    2. In `<template>`, keep the outer `<section id="provas">`, heading `<h2>`, and intro `<p>` exactly as-is.

    3. Replace the existing `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">` block with a `<UCarousel>`:
       ```vue
       <UCarousel
         v-slot="{ item }"
         :items="cards"
         :ui="{ item: 'basis-full lg:basis-1/3 pl-4' }"
         arrows
         dots
         class="lg:-mx-4"
       >
         <div
           class="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
         >
           <!-- paste EXISTING inner card markup: img + p-5 content block -->
           <!-- swap `card.X` references to `item.X` because slot binding renames -->
         </div>
       </UCarousel>
       ```
       IMPORTANT: inside the slot, every `card.rota`, `card.imagem`, etc. must become `item.rota`, `item.imagem`, etc. Add `h-full` to the card root so cards match height across the carousel row.

    4. Keep the impact phrase `<p>` and disclaimer `<p>` unchanged at the bottom. Do NOT add new buttons, anchors, or copy.

    Constraints:
    - Do NOT remove any of the 5 cards from the `cards` array
    - Do NOT add client-side v-if gating — all cards must be SSR-rendered
    - Do NOT install new packages — UCarousel is already available via @nuxt/ui ^4.5.1
    - Preserve existing alt text, `loading="lazy"`, width/height attrs on `<img>`
  </action>
  <verify>
    <automated>pnpm build 2>&1 | tail -40</automated>
  </verify>
  <done>
    - `pnpm build` completes without errors
    - `app/components/Section/SectionProvas.vue` contains a `<UCarousel>` tag
    - All 5 original card entries (prova1..prova5) still exist in the `cards` array
    - Section heading text and intro paragraph are byte-identical to the original
    - NO "Ver todos os casos" or similar new CTA anywhere in the file
  </done>
</task>

</tasks>

<verification>
- `pnpm build` completes with no TypeScript or Vue template errors
- Rendered SSR HTML contains all 5 route strings (Lisboa, Madrid, Orlando, Rio de Janeiro, Maceió)
- UCarousel present in the component
</verification>

<success_criteria>
- SectionProvas renders as a carousel with responsive slides-per-view (3 desktop, 1 mobile)
- All 5 proof cards present in SSR HTML
- Original styling (azul aviação palette, shadows, hover scale) preserved
- No new dependencies added (UCarousel from existing @nuxt/ui)
- Section heading, intro copy, impact phrase, and disclaimer unchanged byte-for-byte
- No invented CTAs or copy
</success_criteria>

<output>
After completion, create `.planning/quick/260423-jmg-transforme-a-se-o-exemplos-reais-de-pass/260423-jmg-SUMMARY.md`
</output>
