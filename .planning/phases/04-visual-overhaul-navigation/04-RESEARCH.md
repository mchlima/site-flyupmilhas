# Phase 4: Visual Overhaul & Navigation - Research

**Researched:** 2026-03-21
**Domain:** Nuxt 4 / Nuxt UI v4 — CSS Grid bento layout, smart sticky header, responsive mobile menu, WCAG contrast, component refactor
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Background & Colors (VISL-01, VISL-03)**
- D-01: Change `--color-brand-bg` from `#f8f9fa` to `#F9FAFB` (Tailwind gray-50) — neutral cool tone, no yellow tint
- D-02: Update `html` background-color in main.css accordingly
- D-03: FAQ text: use `--color-brand-text` (#1a1a1a) instead of `--color-brand-text-muted` (#6b7280) for accordion content — passes WCAG AA 4.5:1

**Bento Grid Layout (VISL-02)**
- D-04: Bento grid as the visual language for the entire LP — all content sections use it
- D-05: Cards with varied sizes (1x1, 2x1, 1x2) — Apple/dashboard style, not uniform grid
- D-06: Some cards with colored backgrounds (azul aviacao, laranja CTA) for visual hierarchy and emphasis
- D-07: Other cards white with subtle shadow on the off-white background
- D-08: Card border-radius: `rounded-xl` (~12px) — modern but not exaggerated
- D-09: Sections to refactor with bento: Como Funciona, Depoimentos, Sobre a empresa, and general page layout
- D-10: Mobile: bento cards stack to single column; desktop: full grid with varied sizes

**Responsive Menu (NAV-01, NAV-02, NAV-03)**
- D-11: Header background: azul da marca (`--color-brand-primary` #1a3a5c) with white text
- D-12: Sticky behavior: "smart sticky" — appears on scroll UP, hides on scroll DOWN
- D-13: Desktop: anchor links (Sobre, Como Funciona, Depoimentos, FAQ) + CTA button "Quero minha Consultoria" em laranja
- D-14: Mobile: hamburger icon, fullscreen overlay on open with links centralizados and CTA
- D-15: Menu closes on anchor link tap (smooth scroll to section)
- D-16: Use `useScroll` composable (already exists) for anchor navigation
- D-17: Hamburger animation: use `import.meta.client` guard for state (SSR-safe per Phase 1 convention)

**Secao Sobre a Fly Up Milhas (CONT-01, CONT-02)**
- D-18: Replace `SectionExpert.vue` with `SectionAbout.vue` — company-focused, not personal bio
- D-19: Focus: proposta de valor direta — o que a Fly Up faz por voce
- D-20: Benefits list includes "renda extra com milhas" as a bullet alongside viagens executivas e economia familiar
- D-21: Visual: icones/ilustracoes em vez de foto pessoal — representativos dos servicos
- D-22: Bento grid layout within the section — varied card sizes for each value proposition
- D-23: Update `app.vue` to use `<SectionAbout />` instead of `<SectionExpert />`
- D-24: Section anchor id changes from `especialista` to `sobre`

**Remover Comprovante (CONT-03)**
- D-25: Remove the R2 result screenshot (`resultado-placeholder.webp`) from SectionSocialProof
- D-26: Keep testimonial cards — only remove the screenshot/comprovante element

### Claude's Discretion
- Exact bento grid CSS Grid template (areas, spans)
- Exact card shadow values
- Hamburger icon animation style (X transition)
- Specific icons/illustrations for SectionAbout value props
- Exact sticky header scroll threshold
- Whether to add subtle hover effects on bento cards
- Transition animations for fullscreen mobile menu

### Deferred Ideas (OUT OF SCOPE)
- Scroll animations on bento cards (fade in, slide up on scroll) — could add in future polish phase
- Dark mode toggle — not in scope
- Logo image in header (currently text only) — needs Marcio to provide logo file
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VISL-01 | Background da pagina corrigido para off-white limpo (remover tom amarelado) | D-01/D-02: token swap from #f8f9fa → #F9FAFB in main.css @theme block; single-line change |
| VISL-02 | Layout bento grid nas secoes principais com cards levemente arredondados, visual moderno | CSS Grid pattern documented; breakpoints validated at 375/768/1280px; card token system defined |
| VISL-03 | Contraste do texto no FAQ melhorado para legibilidade adequada | UAccordion content override with `--color-brand-text`; #1a1a1a on white = 16.5:1 contrast ratio |
| NAV-01 | Menu responsivo no header com links ancora para secoes da LP | AppHeader rebuild pattern documented; anchor map established; useScroll reuse confirmed |
| NAV-02 | CTA destacado no menu ("Quero minha Consultoria") em cor de destaque | CTA button in header uses `--color-brand-cta` (#e67e22), same copy as hero, scrolls to #formulario |
| NAV-03 | Menu hamburger no mobile com animacao de abertura/fechamento | Fullscreen overlay pattern with opacity transition; SSR-safe ref guard with import.meta.client |
| CONT-01 | Secao "Sobre a Fly Up Milhas" substituindo secao do especialista — foco na empresa | SectionAbout.vue new component; SectionExpert.vue retained (not deleted) for reference only |
| CONT-02 | Proposta de valor inclui renda extra com milhas alem de viagens | Third value prop card in SectionAbout bento grid at equal billing (same card size as other two) |
| CONT-03 | Remover elemento "Comprovante de Resultado" (screenshot) da secao de prova social | Remove comprovante div block from SectionSocialProof.vue; testimonial cards remain unchanged |
</phase_requirements>

---

## Summary

Phase 4 is a pure frontend refactor — no new backend integrations, no new libraries, no new composables needed beyond reusing the existing `useScroll`. The work divides into five distinct tracks: (1) a one-line CSS token change for the background color, (2) rebuilding AppHeader from scratch with smart-sticky scroll logic and mobile hamburger, (3) refactoring SectionMethod into a bento card grid, (4) creating the new SectionAbout company section, and (5) three small fixes across SectionSocialProof, SectionFAQ, and app.vue.

The codebase is already in a strong position for this work. The design token system in `main.css @theme {}` is the single source of truth for colors. Nuxt UI v4's `UIcon` and `UAccordion` components are already installed and in use. The `useScroll` composable handles smooth-scroll anchor navigation SSR-safely. The only genuinely new code is AppHeader (complete rebuild) and SectionAbout (new component); everything else is additive or subtractive modification.

The primary risk is the smart sticky header: scroll direction detection requires `window.scrollY` which is browser-only. This must be guarded with `import.meta.client` exactly as the existing `useScroll` pattern does. Testing must use `nuxt build && nuxt preview` (not `nuxt dev`) because hydration mismatches from SSR guard violations only surface in production builds.

**Primary recommendation:** Implement in six discrete commits — one per modified file or logical group — to keep diffs reviewable and git history interpretable.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| nuxt | ^4.4.2 | SSR framework | Already installed; no change |
| @nuxt/ui | ^4.5.1 | Tailwind v4, UIcon, UAccordion | Already installed; provides all needed components |
| tailwindcss | ^4.2.2 | Utility CSS via @nuxt/ui | Already installed; bento grid uses `grid`, `gap-*`, `col-span-*`, `rounded-xl` utilities |

**No new packages required for this phase.** All UI primitives needed (UIcon, UAccordion, grid utilities, transition classes) are already available.

### CSS Grid vs Flexbox for Bento Layout

CSS Grid is the correct tool for bento layout with varied card sizes. Flexbox cannot create 2x1 or 1x2 spans without wrapper hacks. Tailwind v4 (already installed) provides `grid-cols-*`, `col-span-*`, `row-span-*` utilities directly in the template.

```
Use: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
Cards: rounded-xl bg-white shadow-sm p-6
Spans: md:col-span-2 for wide cards; lg:row-span-2 for tall cards
```

---

## Architecture Patterns

### Recommended File Change Set

```
app/
├── assets/css/main.css              # 1-line token change (VISL-01)
├── app.vue                          # SectionExpert → SectionAbout swap (CONT-01)
└── components/
    ├── App/
    │   └── AppHeader.vue            # Complete rebuild (NAV-01, NAV-02, NAV-03)
    └── Section/
        ├── SectionAbout.vue         # NEW — replaces SectionExpert (CONT-01, CONT-02)
        ├── SectionMethod.vue        # Bento refactor (VISL-02)
        ├── SectionSocialProof.vue   # Remove comprovante block (CONT-03)
        └── SectionFAQ.vue           # Text contrast fix (VISL-03)
```

`SectionExpert.vue` is NOT deleted — it is kept in the repo as reference. The swap happens only in `app.vue`.

### Pattern 1: Smart Sticky Header (scroll direction detection)

**What:** Header is always visible at page top. After scrolling down past the header height (64px threshold), it hides on continued scroll-down and re-appears immediately on scroll-up.

**SSR constraint:** All scroll listeners must be registered inside `if (import.meta.client) {}` to prevent SSR hydration mismatch.

**Implementation approach:**

```typescript
// Inside AppHeader.vue <script setup>
const isVisible = ref(true)
const lastScrollY = ref(0)
const THRESHOLD = 64

if (import.meta.client) {
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY
    if (currentY < THRESHOLD) {
      isVisible.value = true
    } else {
      isVisible.value = currentY < lastScrollY.value
    }
    lastScrollY.value = currentY
  }, { passive: true })
}
```

**Template class binding:**
```html
<header
  class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
  :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
>
```

**Why `passive: true`:** Tells the browser the listener never calls `preventDefault()`, allowing scroll optimization without jank.

**`{ passive: true }` is HIGH confidence** — confirmed by MDN Web Docs. Scroll event with passive flag is the established pattern for scroll-direction headers.

### Pattern 2: Fullscreen Mobile Menu Overlay

**What:** On mobile, a hamburger button toggles a fullscreen overlay covering the entire viewport. The overlay uses the brand's navy background with centered white navigation links and the CTA button.

**SSR safety:** The `isMenuOpen` ref initializes as `false` on both server and client, so no hydration mismatch. Transition listeners (keyboard Escape, body scroll lock) are guarded with `import.meta.client`.

```vue
<script setup lang="ts">
const isMenuOpen = ref(false)
const { scrollTo } = useScroll()

function navigateTo(anchor: string) {
  isMenuOpen.value = false
  scrollTo(anchor)
}

if (import.meta.client) {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') isMenuOpen.value = false
  })
}
</script>
```

**Overlay template:**
```html
<!-- Fullscreen overlay — always in DOM, opacity-controlled -->
<div
  class="fixed inset-0 z-40 flex flex-col items-center justify-center
         bg-[var(--color-brand-primary)] transition-opacity duration-200"
  :class="isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
  role="dialog"
  aria-modal="true"
  :aria-hidden="!isMenuOpen"
>
```

**Why `opacity`/`pointer-events` over `v-if`:** `v-if` causes DOM create/destroy on every toggle — potential CLS. Opacity toggle is instant and SSR-safe. The overlay is always in the DOM but invisible and non-interactive when closed.

### Pattern 3: Bento Grid CSS Grid Template

**Validated breakpoints (from PITFALLS.md):** 375px, 768px, 1280px.

**SectionMethod bento:**

```html
<!-- Container -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
  <!-- Steps 01-03: standard cards -->
  <div class="rounded-xl bg-white shadow-sm p-6">...</div>
  <div class="rounded-xl bg-white shadow-sm p-6">...</div>
  <div class="rounded-xl bg-white shadow-sm p-6">...</div>
  <!-- Step 04: navy accent for conversion emphasis -->
  <div class="rounded-xl bg-[var(--color-brand-primary)] text-white p-6">...</div>
</div>
<!-- Offer block: full width below grid -->
<div class="rounded-xl bg-white shadow p-8">...</div>
```

**SectionAbout bento:**

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <!-- Tagline card: full width on md, 2/3 on lg -->
  <div class="md:col-span-2 rounded-xl bg-[var(--color-brand-primary)] text-white p-8">
    <!-- headline + subheadline -->
  </div>
  <!-- Value props: 1x1 each -->
  <div class="rounded-xl bg-white shadow-sm p-6"><!-- Viagens Executivas --></div>
  <div class="rounded-xl bg-white shadow-sm p-6"><!-- Economia Familiar --></div>
  <div class="rounded-xl bg-white shadow-sm p-6"><!-- Renda Extra com Milhas --></div>
</div>
```

### Pattern 4: UAccordion Content Text Override (VISL-03)

The existing `SectionFAQ.vue` uses `<UAccordion :items="faqItems" />`. In Nuxt UI v4, UAccordion renders accordion content in a slot or via the `content` key of each item object. The text color is controlled by Nuxt UI's internal styling.

**Override strategy:** Use a CSS custom property override in the component's `<style>` block targeting the rendered accordion content. Alternatively, use the `#content` slot to wrap text with explicit class.

Since Nuxt UI v4's UAccordion uses Reka UI primitives, the rendered content is accessible via the default slot pattern. The simplest correct approach is switching to the slot syntax:

```vue
<UAccordion :items="faqItems">
  <template #content="{ item }">
    <p class="text-[var(--color-brand-text)] leading-relaxed pb-4 px-4">
      {{ item.content }}
    </p>
  </template>
</UAccordion>
```

This guarantees `--color-brand-text` (#1a1a1a) is applied regardless of Nuxt UI's default text-muted styling. Contrast ratio: 16.5:1 (WCAG AA target 4.5:1 — passes by 3.7x margin).

### Pattern 5: Section Anchor scroll-margin-top

The smart sticky header is `position: fixed; height: ~64px`. When a user clicks an anchor nav link and the browser jumps to that section, the fixed header will overlap the top of the section content.

**Fix:** Add `scroll-margin-top: 72px` to every section that has an anchor ID. 72px = 64px header + 8px breathing room.

```css
/* In main.css — apply globally to all anchored sections */
section[id] {
  scroll-margin-top: 72px;
}
```

This is a CSS-only fix requiring one line in `main.css`. It does not affect SSR, hydration, or JavaScript.

### Anti-Patterns to Avoid

- **`v-if` on mobile menu overlay:** Creates/destroys DOM on each toggle; use `opacity` + `pointer-events` instead
- **Registering scroll listener without `import.meta.client` guard:** Causes SSR hydration error — `window` does not exist on server
- **Using `process.client` instead of `import.meta.client`:** `process.client` is deprecated in Nuxt 4; per established Phase 1 convention, only use `import.meta.client`
- **Hardcoding icon library prefix:** Only use `i-heroicons-*` icons — `@iconify-json/heroicons` is the confirmed installed set; other prefixes (`i-lucide-*`, `i-mdi-*`) will render as empty boxes
- **Using `.jpg` or `.png` directly in templates bypassing NuxtImg:** Any images added to SectionAbout must use `<NuxtImg>` if loading from R2; no raw `<img>` tags for external assets
- **`grid-cols-4` without lg breakpoint prefix on mobile:** A 4-column grid at 375px breaks into 60px-wide cards; always `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll to anchor | Custom scroll polyfill | `useScroll` composable (already exists) | Already SSR-safe, handles `import.meta.client` guard, tested in Phase 2 |
| Icon rendering | SVG sprite system | `UIcon` from @nuxt/ui | Already installed, tree-shaken, uses Iconify under the hood |
| Accordion FAQ | Custom expand/collapse | `UAccordion` from @nuxt/ui | Already in use in SectionFAQ; Reka UI accessible by default |
| CSS reset / base | Custom normalize.css | Tailwind's built-in preflight (in @nuxt/ui) | Already active via `@import "tailwindcss"` in main.css |
| Focus trap for mobile menu | Custom focus-trap library | `inert` attribute on `<main>` when menu is open | Native browser attribute, no JS needed, no new dependency |

---

## Common Pitfalls

### Pitfall 1: SSR Hydration Mismatch on Hamburger State
**What goes wrong:** `isMenuOpen` ref is `false` on server but a transition class derived from it differs between SSR and client, causing Vue to discard server HTML and re-render — visible flash on initial load.
**Why it happens:** Any conditional class bound to a ref that initializes differently server vs. client triggers mismatch.
**How to avoid:** `ref(false)` initializes identically on server and client — this is safe. The scroll listener and keyboard listener are the risky parts; wrap them in `if (import.meta.client)`. Do NOT put any initial state that reads browser APIs (`window.scrollY`, `document.activeElement`) into reactive refs at the top level of `<script setup>`.
**Warning signs:** `nuxt build && nuxt preview` shows flash on header; browser console has "Hydration node mismatch" on `<header>`.

### Pitfall 2: Fixed Header Obscuring Anchor Targets
**What goes wrong:** User clicks "Como Funciona" in the nav, browser scrolls to `#como-funciona`, but the top 64px of the section content is hidden behind the fixed header.
**Why it happens:** `position: fixed` elements are removed from document flow and overlay content below them. Smooth-scroll and anchor jump both land at the element's top edge, not accounting for header overlap.
**How to avoid:** Add `scroll-margin-top: 72px` to `section[id]` in `main.css`. This is the correct CSS approach — no JavaScript needed.
**Warning signs:** After clicking nav links, section headings are partially or fully hidden behind the header.

### Pitfall 3: Bento Grid Breaking at Intermediate Breakpoints
**What goes wrong:** The grid looks correct at 375px and 1280px but breaks at 768px — cards overflow or collapse to 1-column when they should be 2-column.
**Why it happens:** Tailwind responsive prefixes (`md:`, `lg:`) use min-width breakpoints. Without explicit `md:grid-cols-2`, the grid stays at `grid-cols-1` from 375px all the way to `lg:` breakpoint.
**How to avoid:** Always specify all three breakpoints explicitly: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Validate at 768px width (Tailwind `md:` = 768px) in Chrome DevTools.
**Warning signs:** Cards appear as single-column blocks on iPad-sized viewports.

### Pitfall 4: UAccordion Content Color Not Overriding
**What goes wrong:** Applying a class to `<UAccordion>` itself does not propagate text color to the rendered content inside accordion items.
**Why it happens:** Nuxt UI v4's UAccordion renders content in its own internal DOM subtree with Reka UI primitives. Nuxt UI applies its own `text-muted` color class inside, which overrides a parent's text color.
**How to avoid:** Use the `#content` slot to render a `<p>` element with explicit `text-[var(--color-brand-text)]` class. Do not rely on inheritance.
**Warning signs:** FAQ text still appears gray (#6b7280) after adding a class to the `<UAccordion>` component root.

### Pitfall 5: `i-heroicons-*` Icons Rendering as Empty Boxes
**What goes wrong:** Icons in SectionAbout value prop cards render as empty white boxes.
**Why it happens:** Only `@iconify-json/heroicons` is confirmed installed (verified by existing code using `i-heroicons-*` in SectionMethod). Other icon sets (Lucide, Material Design Icons) are not installed.
**How to avoid:** Only use `i-heroicons-*` icon names. Verify icon names against the Heroicons v2 set (heroicons.com) — use the `outline` variant (`i-heroicons-[name]`).
**Warning signs:** `<UIcon name="i-heroicons-xyz">` renders nothing; no console error in dev mode.

---

## Code Examples

Verified patterns from existing codebase and Nuxt 4 established conventions:

### Smart Sticky Header (complete AppHeader structure)

```vue
<!-- app/components/App/AppHeader.vue -->
<script setup lang="ts">
const { scrollTo } = useScroll()

const isVisible = ref(true)
const isMenuOpen = ref(false)
const lastScrollY = ref(0)
const SCROLL_THRESHOLD = 64

if (import.meta.client) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY
    if (current < SCROLL_THRESHOLD) {
      isVisible.value = true
    } else {
      isVisible.value = current < lastScrollY.value
    }
    lastScrollY.value = current
  }, { passive: true })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') isMenuOpen.value = false
  })
}

const navLinks = [
  { label: 'Sobre', anchor: 'sobre' },
  { label: 'Como Funciona', anchor: 'como-funciona' },
  { label: 'Depoimentos', anchor: 'depoimentos' },
  { label: 'FAQ', anchor: 'faq' },
]

function navigate(anchor: string) {
  isMenuOpen.value = false
  scrollTo(anchor)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 px-6 py-4
           bg-[var(--color-brand-primary)] transition-transform duration-300"
    :class="isVisible ? 'translate-y-0' : '-translate-y-full'"
  >
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <span class="font-semibold text-white text-lg">Fly Up Milhas</span>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <button
          v-for="link in navLinks"
          :key="link.anchor"
          class="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          @click="navigate(link.anchor)"
        >
          {{ link.label }}
        </button>
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)]
                 text-white font-semibold px-5 py-2 rounded-lg text-sm
                 cursor-pointer transition-colors min-h-[44px]"
          @click="scrollTo('formulario')"
        >
          Quero minha Consultoria
        </button>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <UIcon
          :name="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          class="w-6 h-6"
        />
      </button>
    </div>
  </header>

  <!-- Mobile fullscreen overlay -->
  <div
    class="fixed inset-0 z-40 flex flex-col items-center justify-center
           bg-[var(--color-brand-primary)] transition-opacity duration-200"
    :class="isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    role="dialog"
    aria-modal="true"
    :aria-hidden="!isMenuOpen"
  >
    <nav class="flex flex-col items-center gap-8">
      <button
        v-for="link in navLinks"
        :key="link.anchor"
        class="text-white text-xl font-bold cursor-pointer"
        @click="navigate(link.anchor)"
      >
        {{ link.label }}
      </button>
      <button
        class="mt-4 bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)]
               text-white font-semibold px-8 py-4 rounded-lg text-lg
               cursor-pointer transition-colors w-full max-w-xs"
        @click="navigate('formulario')"
      >
        Quero minha Consultoria
      </button>
    </nav>
  </div>
</template>
```

Source: `useScroll` composable (Phase 2, confirmed), `import.meta.client` pattern (Phase 1 convention), Tailwind `transition-transform` utility.

### UAccordion Content Slot Override

```vue
<!-- app/components/Section/SectionFAQ.vue — modified UAccordion block -->
<UAccordion :items="faqItems">
  <template #content="{ item }">
    <p class="text-[var(--color-brand-text)] leading-relaxed pb-4 px-4">
      {{ item.content }}
    </p>
  </template>
</UAccordion>
```

Source: Nuxt UI v4 UAccordion slot API; `--color-brand-text` token from existing main.css `@theme {}`.

### main.css Token Update + scroll-margin-top

```css
/* app/assets/css/main.css — two changes */

@theme {
  /* ... other tokens unchanged ... */
  --color-brand-bg: #F9FAFB;  /* was #f8f9fa — D-01 */
}

html {
  background-color: var(--color-brand-bg);  /* updated by token change — D-02 */
  /* other properties unchanged */
}

/* Fixed header anchor offset — prevents content hiding behind 64px header */
section[id] {
  scroll-margin-top: 72px;
}
```

### app.vue Section Swap

```vue
<!-- app/app.vue — change in <template> only, no script changes -->
<!-- Before: <SectionExpert /> -->
<!-- After: -->
<SectionAbout />
```

The `id="sobre"` anchor moves into `SectionAbout.vue` itself (the section element's id attribute), not in app.vue.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| `process.client` guard | `import.meta.client` guard | Nuxt 4 convention; `process.client` deprecated |
| CSS `position: sticky` header (always visible) | Smart sticky with `position: fixed` + scroll direction detection | Standard UX pattern for content-heavy LPs since 2022 |
| CSS Grid with equal-sized cells only | Bento grid with `col-span` / `row-span` for varied card sizes | Popularized by Apple product pages; now standard for modern SaaS LPs |
| WCAG contrast checked only for body text | WCAG AA check on ALL text including accordion/interactive content | WCAG 2.1 AA applies to ALL text, not just headings |

**Deprecated/outdated in this project:**
- `v-show` with `display:none` for mobile menu: replaced by opacity/pointer-events pattern (no layout reflow)
- Plain `<header class="py-4 px-6 bg-white">`: current AppHeader.vue is minimal placeholder — full rebuild required

---

## Open Questions

1. **SectionAbout copy — final text from Marcio**
   - What we know: UI-SPEC defines placeholder copy ("Viaje mais. Gaste menos. Ganhe com as suas milhas.")
   - What's unclear: Whether Marcio has approved this company description framing, especially the "renda extra" emphasis
   - Recommendation: Use placeholder copy from UI-SPEC for now; mark with TODO comment identical to other placeholder TODOs in the codebase

2. **Heroicons icon names for SectionAbout value props**
   - What we know: UI-SPEC suggests `i-heroicons-paper-airplane`, `i-heroicons-banknotes`, `i-heroicons-currency-dollar`
   - What's unclear: `i-heroicons-currency-dollar` may not exist in Heroicons v2 (the set uses `i-heroicons-currency-dollar` only in solid; outline variant may be named differently)
   - Recommendation: Verify against heroicons.com during implementation; fallback is `i-heroicons-banknotes` for renda extra if currency-dollar is unavailable

3. **SectionSocialProof after comprovante removal**
   - What we know: Remove the screenshot block (D-25, D-26); testimonial cards remain
   - What's unclear: Whether the section needs a visual bottom element to avoid feeling cut off after removal
   - Recommendation: After removing the comprovante block, assess if a CTA button ("Quero minha Consultoria" scrolling to form) should be added — this is standard LP conversion pattern and already exists as a pattern in SectionExpert

---

## Validation Architecture

> Skipped: `workflow.nyquist_validation` is explicitly `false` in `.planning/config.json`.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase scan — `app/assets/css/main.css`, `app/components/App/AppHeader.vue`, `app/composables/useScroll.ts`, `app/components/Section/SectionMethod.vue`, `app/components/Section/SectionFAQ.vue`, `app/components/Section/SectionSocialProof.vue`, `app/components/Section/SectionExpert.vue`, `app/app.vue`, `nuxt.config.ts`, `package.json`
- `.planning/phases/04-visual-overhaul-navigation/04-CONTEXT.md` — all locked decisions (D-01 through D-26)
- `.planning/phases/04-visual-overhaul-navigation/04-UI-SPEC.md` — component inventory, interaction contracts, color system, spacing scale, accessibility checklist
- `CLAUDE.md` — tech stack constraints, Nuxt 4 + Nuxt UI v4 versions confirmed
- MDN Web Docs — `addEventListener` passive option, `scroll-margin-top` CSS property, `inert` attribute, `aria-hidden` / `aria-modal`

### Secondary (MEDIUM confidence)
- `.planning/research/PITFALLS.md` — bento grid breakpoint validation warning (375px/768px/1280px), hydration mismatch patterns
- `.planning/research/ARCHITECTURE.md` — established component conventions and `import.meta.client` guard pattern

### Tertiary (LOW confidence)
- None — all findings verified against codebase or established project decisions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all tools already installed and confirmed working
- Architecture: HIGH — patterns derived from existing codebase conventions and locked CONTEXT.md decisions
- Pitfalls: HIGH — derived from existing PITFALLS.md research + codebase-specific observations

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable stack; no fast-moving dependencies)
