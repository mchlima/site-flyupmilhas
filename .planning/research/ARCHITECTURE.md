# Architecture Research — v1.6 Visual Identity Upgrade

**Domain:** High-conversion landing page — miles/travel mentorship (Brazilian market)
**Researched:** 2026-03-24
**Confidence:** HIGH (direct codebase inspection, cross-referenced with Tailwind v4 and Nuxt UI v4 official docs)
**Focus:** Integration of v1.6 visual features into the existing Nuxt 4 single-page architecture

---

## Existing Architecture — Ground Truth (post-v1.5)

Single-page Nuxt 4 SSR app. No `pages/` directory. `app/app.vue` composes 13 SFC components.
Design tokens live exclusively in `app/assets/css/main.css` under Tailwind v4's `@theme {}` block.

### Current Component Map

```
UApp
├── AppHeader             (sticky smart nav, mobile overlay, CTA → #formulario)
└── main#main-content
    ├── SectionHero           id="hero"                 bg: dark image overlay
    ├── SectionAbout          id="sobre"                bg: white
    ├── SectionProgramContent id="conteudo-programatico" bg: brand-bg (#F9FAFB)
    ├── SectionForWhom        id="para-quem-e"          bg: white
    ├── SectionMethod         id="como-funciona"        bg: brand-bg
    ├── SectionSocialProof    id="depoimentos"          bg: white
    ├── SectionPrice          id="preco"                bg: brand-primary (navy)
    ├── SectionFAQ            id="faq"                  bg: brand-bg
    └── section#formulario    bg: brand-primary (navy)
        └── SectionLeadForm
AppFooter
BackToTop
```

### Current Design Token Definitions (app/assets/css/main.css)

```css
@theme {
  --color-brand-primary:    #1a3a5c;   /* navy — headings, header, price section bg */
  --color-brand-bg:         #F9FAFB;   /* off-white — alternating section bg */
  --color-brand-cta:        #e67e22;   /* orange — all CTA buttons */
  --color-brand-cta-hover:  #d35400;
  --color-brand-text:       #1a1a1a;
  --color-brand-text-muted: #6b7280;
  --color-brand-footer:     #0f2039;   /* dark navy — footer only */

  --font-family-sans: 'Inter', system-ui, ...;
}
```

### Current Token Usage Across Components

| Token | Used In | Usage Pattern |
|-------|---------|---------------|
| `--color-brand-primary` | All 13 components | `text-[var(...)]`, `bg-[var(...)]`, section backgrounds |
| `--color-brand-cta` | 8 components | All CTA buttons (plain `<button>`), icons in cards |
| `--color-brand-cta-hover` | 8 components | Hover state on same buttons |
| `--color-brand-bg` | 4 sections | Section background alternation |
| `--color-brand-text` | All components | Body text, FAQ answers |
| `--color-brand-text-muted` | All components | Subtitles, descriptions, card body text |
| `--color-brand-footer` | AppFooter | Footer bg only |
| `--font-family-sans` | `html {}` base | Applied to entire page via CSS `html {}` rule |

---

## v1.6 Features: New vs Modified Components

### NEW Component to Create

| Component | Type | Location | Purpose |
|-----------|------|----------|---------|
| `SectionGuarantee` | New SFC | `app/components/Section/` | Standalone 7-day guarantee section with golden seal |

### MODIFIED Components

| Component | What Changes | Change Type |
|-----------|-------------|-------------|
| `app/assets/css/main.css` | Replace all token values + add gradient utilities | **Token swap — cascades to ALL components automatically** |
| `SectionSocialProof` | Add avatar (circular photo or initials) per testimonial | Template extension + data shape change |
| `SectionFAQ` | Visual redesign — richer layout, icons, visual hierarchy | Template + optional data shape |
| `app/app.vue` | Insert `<SectionGuarantee />` into composition order | One-line addition |
| `@nuxt/fonts` config | Swap font family from Inter to new choice | `nuxt.config.ts` + CSS token update |

### NOT Modified (benefit automatically from token swap)

All other components — `AppHeader`, `SectionHero`, `SectionAbout`, `SectionProgramContent`,
`SectionForWhom`, `SectionMethod`, `SectionPrice`, `SectionLeadForm`, `AppFooter`, `BackToTop`
— will inherit the new palette and typography the moment the CSS tokens are updated. No per-component
edits are needed for the color and font migration.

---

## Integration Point 1: Design Tokens in Tailwind v4 CSS-first Config

### How Tailwind v4 `@theme {}` Works

Tailwind v4 uses a CSS-first configuration system. Custom tokens defined inside `@theme {}` in
`main.css` are:
1. Registered as CSS custom properties (accessible via `var(--...)` anywhere in CSS)
2. Automatically mapped to Tailwind utility classes (e.g., `--color-brand-primary` → `bg-brand-primary`, `text-brand-primary`)

This project uses both forms: `text-[var(--color-brand-primary)]` (arbitrary value syntax) and
occasional direct `var()` in inline styles. Both continue to work after a token value swap.

### Token Replacement Strategy

All v1.6 palette and font changes are a **single-file edit** to `app/assets/css/main.css`:

```css
@theme {
  /* Replace these values: */
  --color-brand-primary:    [NEW_BLUE];     /* vibrant aviation blue */
  --color-brand-cta:        [NEW_CTA];      /* premium CTA color */
  --color-brand-cta-hover:  [NEW_CTA_HOVER];

  /* Optionally add: */
  --color-brand-primary-dark: [DARKER_SHADE];  /* for gradient end stops */
  --color-brand-accent:       [ACCENT];        /* secondary accent if needed */

  /* Font swap: */
  --font-family-sans: '[NEW_FONT]', system-ui, ...;
}
```

**Cascade effect:** Because every component references the token via `var(--color-brand-primary)`,
updating the token value in `@theme {}` instantly updates all 13 components with zero per-component
edits. This is the entire point of the token architecture.

### Adding Gradient Utilities

Tailwind v4 supports adding custom CSS utilities directly in `main.css` using `@utility`:

```css
@utility gradient-sky-hero {
  background: linear-gradient(
    135deg,
    var(--color-brand-primary) 0%,
    var(--color-brand-primary-dark) 100%
  );
}

@utility gradient-section-subtle {
  background: linear-gradient(
    180deg,
    white 0%,
    var(--color-brand-bg) 100%
  );
}
```

These become first-class Tailwind classes: `<div class="gradient-sky-hero">`.

Alternatively, gradients can be applied as inline `style` attributes using the CSS vars directly,
which requires no Tailwind utility registration and is appropriate for one-off uses:

```html
<div :style="{ background: 'linear-gradient(135deg, var(--color-brand-primary), #0a1f3c)' }" />
```

**Recommendation:** Register gradients as `@utility` if used on 2+ components. Use inline style for
one-off cases (e.g., SectionHero's dark overlay stays as `bg-black/60`).

### Where NOT to Define Tokens

Do not use `tailwind.config.ts`. Tailwind v4 deprecated the JS config file for CSS-first
projects. The `@nuxt/ui` module manages Tailwind v4 entirely through `main.css`. Adding a
`tailwind.config.ts` alongside `@nuxt/ui` can cause conflicts with Nuxt UI's own Tailwind
integration layer.

---

## Integration Point 2: Font Swap via @nuxt/fonts

### How @nuxt/fonts Works in This Project

`@nuxt/fonts` is included as a dependency of `@nuxt/ui v4` — it is active without explicit
`nuxt.config.ts` module registration. It works by:
1. Scanning CSS for `font-family` references in `@theme {}` and `html {}` base styles
2. Auto-injecting optimized `<link rel="preload">` tags and `@font-face` declarations in `<head>`
3. Serving fonts via a local proxy by default (avoids external font domain, improves privacy + CWV)

### Font Swap Steps

**Step 1 — Update the CSS token in main.css:**

```css
@theme {
  --font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
```

`@nuxt/fonts` automatically detects the new name and downloads + serves it. No `nuxt.config.ts`
change is needed for Google Fonts or Bunny Fonts sources.

**Step 2 — Verify the `html {}` base rule still references the token:**

```css
html {
  font-family: var(--font-family-sans);   /* already in place — no change needed */
}
```

Because the `html {}` rule references the token (not the font name directly), updating the token
in `@theme {}` is sufficient. The font propagates to all elements via CSS inheritance.

**Step 3 — Check Nuxt UI component typography:**

Nuxt UI v4 components (UAccordion, UForm, UInput, UIcon) inherit `font-family` from the HTML
root via CSS cascade. No per-component font override is needed.

### Font Recommendations for Premium/Travel Context

Recommended fonts for this brand context (aviation, premium, Brazilian market):

| Font | Weight Range | Character | Use If |
|------|-------------|-----------|--------|
| Plus Jakarta Sans | 300-800 | Modern, warm, geometric | Primary recommendation — excellent legibility at all sizes, premium feel without being cold |
| DM Sans | 300-700 | Clean, slightly rounded | Secondary option — similar to Inter but more personality |
| Outfit | 100-900 | Geometric, forward-looking | Good for bold hero headlines — pair with DM Sans for body |
| Sora | 300-800 | Techy, premium | Strong for headlines, weaker for long text |

**Recommendation:** Plus Jakarta Sans. Single font family, 300–800 weights cover all use cases
(body at 400, headlines at 700/800, badges at 500), and it has strong Portuguese glyph coverage.

### CLS Prevention

`@nuxt/fonts` prevents Cumulative Layout Shift automatically by:
- Injecting `font-display: swap` or `optional` depending on configuration
- Preloading the most-used weight (400) in `<head>` before render
- Using `size-adjust` and `ascent-override` CSS descriptors to match the fallback font metrics

No manual CLS mitigation is required.

---

## Integration Point 3: SectionGuarantee — New Component

### Rationale for Standalone Component

SectionPrice currently has an inline guarantee block (a shield icon + 2 lines of text). The v1.6
milestone upgrades this to a visually dedicated section with a golden seal. A standalone
`SectionGuarantee` section provides:
- Clear visual separation from the pricing section
- Opportunity for a larger seal/badge image
- A dedicated `id` anchor for potential deep-linking or analytics

### Component Responsibility

`SectionGuarantee` is a pure display component. It has no props, no emits, no composables, and
no backend connection. All content is hardcoded within the component.

### Structure

```
SectionGuarantee.vue
├── <script setup> — no imports needed (pure static)
└── <template>
    └── <section id="garantia">
        ├── Optional: gradient or brand-primary bg
        ├── Seal/badge element
        │   ├── Option A: <img> from Cloudflare R2 (selo-garantia7-dias.png already exists)
        │   └── Option B: CSS/SVG golden circle with "7" numeral (no asset dependency)
        ├── Headline: "Garantia Incondicional de 7 Dias"
        ├── Body: "Se em 7 dias você não sentir que a mentoria vale cada centavo..."
        └── Trust signals: shield icon + "Reembolso sem burocracia"
```

### Asset Dependency

`app/assets/img/selo-garantia7-dias.png` already exists in the project. Use it:

```html
<img
  src="~/assets/img/selo-garantia7-dias.png"
  alt="Selo de garantia de 7 dias"
  class="w-24 h-24 mx-auto"
/>
```

This removes the need for a CSS-constructed seal and leverages an asset the client has already
approved.

### Placement in app.vue

Insert between `SectionPrice` and `SectionFAQ` — this maintains the persuasion sequence:
offer → guarantee → objection handling (FAQ).

```html
<!-- app.vue addition -->
<SectionPrice />
<SectionGuarantee />    <!-- NEW — insert here -->
<SectionFAQ />
```

### Inline Guarantee Block in SectionPrice

After `SectionGuarantee` is added as a dedicated section, remove or reduce the inline guarantee
block in `SectionPrice.vue` to avoid redundancy. Keep only the one-liner trust signal in
`SectionPrice` (e.g., the shield icon + "Garantia de 7 dias") and let `SectionGuarantee` carry
the full explanation.

---

## Integration Point 4: Avatar Pattern in SectionSocialProof

### Current State

`SectionSocialProof` renders 3 WhatsApp-style chat bubbles. Each testimonial has `name`, `city`,
and `text`. Name and city appear below the bubble. No photo or avatar is rendered.

### Target State

Each testimonial gets either:
- A circular photo (`<img>` from Cloudflare R2), or
- A generated initials avatar (CSS circle + text, no asset dependency)

The initials fallback is strongly preferred for launch because it requires zero new assets and
works immediately regardless of whether real photos are available.

### Implementation — Initials Avatar

Add a computed color per testimonial (deterministic, based on name):

```typescript
const testimonials = [
  {
    name: 'Ana Paula',
    city: 'São Paulo, SP',
    text: '...',
    initials: 'AP',
    avatarColor: '#2563EB',   // or derive from index for variety
  },
  ...
]
```

Avatar markup (inline in SectionSocialProof, no new component needed for 3 items):

```html
<div
  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
  :style="{ backgroundColor: t.avatarColor }"
>
  {{ t.initials }}
</div>
```

### Layout Adjustment

Current layout: bubble → name/city below bubble.
New layout: avatar beside name/city, then bubble below:

```
[AP] Ana Paula · São Paulo, SP
+---------------------------+
| WhatsApp bubble text...   |
+---------------------------+
```

Or: avatar floats to the left of the bubble (left-aligned testimonials) / right (right-aligned):

```
[AP]  +---------------------------+
      | bubble text               |
      +---------------------------+
```

The second layout (avatar beside bubble) more closely mirrors how WhatsApp renders group chat
messages and requires minimal CSS change — add `flex flex-row items-start gap-2` to the outer
container per testimonial.

### Photo Upgrade Path

When real photos are available on Cloudflare R2:

```typescript
{
  name: 'Ana Paula',
  avatarSrc: 'https://cdn.flyupmilhas.com.br/testimonials/ana-paula.webp',
  initials: 'AP',   // fallback if src fails
}
```

```html
<img
  v-if="t.avatarSrc"
  :src="t.avatarSrc"
  :alt="t.name"
  class="w-9 h-9 rounded-full object-cover shrink-0"
/>
<div v-else ...>{{ t.initials }}</div>
```

This pattern avoids a broken image state and works without `@nuxt/image` (R2 URLs are direct).

---

## Integration Point 5: FAQ Visual Redesign

### Current State

`SectionFAQ` uses `UAccordion` from Nuxt UI with minimal `ui` prop customization. Layout is a
single-column list on a `--color-brand-bg` background. Visual weight is low.

### Target State Options

Two valid approaches — choose one:

#### Option A: Enhanced UAccordion (lower effort)

Keep `UAccordion` but add visual richness through the `:ui` prop and surrounding markup:

- Add a numbered badge or icon per FAQ item
- Change section background from `brand-bg` to brand-primary (navy) for contrast
- Make accordion item borders more visible
- Use larger font sizes for questions

```html
<UAccordion
  :items="faqItems"
  :ui="{
    item: 'border-b border-white/10',
    trigger: 'group flex items-center gap-3 py-5 font-semibold text-base text-white focus-visible:outline-primary',
    content: 'text-white/80 pb-5 px-0 leading-relaxed'
  }"
>
  <template #default="{ item, index }">
    <span class="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
      {{ index + 1 }}
    </span>
    <span>{{ item.label }}</span>
  </template>
</UAccordion>
```

This requires no changes to the `faqItems` data array and no new components.

#### Option B: Custom Accordion (higher effort, full design control)

Replace `UAccordion` with a hand-rolled Vue accordion using `<details>/<summary>` or a
`v-show` + transition pattern. Use when the Nuxt UI accordion's internal DOM structure
prevents the desired visual outcome.

```typescript
// faqItems gets an `isOpen` boolean per item
const faqItems = ref([
  { label: '...', content: '...', isOpen: false },
  ...
])
```

```html
<div v-for="item in faqItems" :key="item.label" class="border-b ...">
  <button @click="item.isOpen = !item.isOpen" class="...">
    {{ item.label }}
  </button>
  <Transition name="faq">
    <p v-show="item.isOpen" class="...">{{ item.content }}</p>
  </Transition>
</div>
```

**Recommendation:** Start with Option A. The `UAccordion` `:ui` prop is highly flexible and
covers most visual redesign needs without the risk of breaking accessibility (UAccordion uses
Reka UI primitives with correct ARIA). Switch to Option B only if the required visual design
cannot be achieved through `:ui` customization after a genuine attempt.

---

## Architectural Patterns for v1.6

### Pattern 1: CSS Token Cascade (Single-Source Design System)

**What:** All visual values (color, typography) live as CSS custom properties in `@theme {}`.
Components reference tokens via `var()`, never hardcoded hex values.

**When to use:** Always, for brand colors and typography. Exception: externally defined values
that belong to a specific library's canonical system (e.g., WhatsApp's `#DCF8C6` bubble green,
Tailwind's `red-50` for negative qualification cards) — these are acceptable hardcodes.

**Implementation example:**
```css
/* main.css @theme {} — the only place brand colors are defined */
--color-brand-primary: #1e56a0;   /* new vibrant blue */
--color-brand-cta:     #f59e0b;   /* amber — premium travel feel */
```

```html
<!-- Component — references token, never hardcodes -->
<h2 class="text-[var(--color-brand-primary)]">...</h2>
<button class="bg-[var(--color-brand-cta)]">...</button>
```

### Pattern 2: Pure Display Components for New Sections

**What:** New visual-only sections (SectionGuarantee) have no props, no emits, no composables.
All content is hardcoded within the SFC. The component is a rendering unit, not a data container.

**When to use:** Any section where content is not dynamic, not user-controlled, and not shared
across multiple places.

**Trade-off:** Content edits require touching the Vue file. Acceptable for a client LP where
copy changes go through a developer anyway.

### Pattern 3: Data-Shape Extension (not component extraction) for Avatar

**What:** Add new fields (`initials`, `avatarColor`, `avatarSrc`) to the existing `testimonials`
array inside `SectionSocialProof`. Extend the template to render the new fields. Do not extract
a `TestimonialCard` component.

**When to use:** When adding visual complexity to existing static data that is used in only one
place. Extraction to a sub-component adds a file boundary with no reuse benefit.

**Extraction trigger:** Create a sub-component only if (a) the same testimonial card structure
appears in 2+ places, or (b) the per-item template grows beyond ~25 lines.

---

## Data Flow Changes in v1.6

All v1.6 features are pure UI/visual changes. No data flow changes:

- No new composables
- No backend contract changes
- No changes to `useLeadForm` or `useScroll`
- No new API calls
- No `app.vue` data logic changes (only one new `<SectionGuarantee />` line in the template)

### v1.6 Data Flow Summary

```
@theme {} token values → CSS custom properties → all component class bindings
@nuxt/fonts CSS scan  → font preload + @font-face → html { font-family } → all text
SectionSocialProof    → testimonials[].initials/avatarColor → avatar divs (no external data)
SectionGuarantee      → hardcoded template → rendered section (no data source)
SectionFAQ            → faqItems[] (existing) → redesigned accordion (same data, new template)
```

---

## Suggested Build Order for v1.6

Order is determined by: (a) tokens first — they cascade, (b) font immediately after tokens,
(c) new components before section redesigns, (d) FAQ last (most open-ended design work).

### Phase 1: Design Token Replacement (MUST be first — blocks all visual work)

1. Update `app/assets/css/main.css` — replace `--color-brand-primary`, `--color-brand-cta`,
   `--color-brand-cta-hover` values with new palette
2. Add `--color-brand-primary-dark` and any gradient utility tokens if using `@utility` approach
3. Visual check: load the page — all sections instantly reflect new palette

**Dependency:** Nothing depends on this being "done" before Phase 2, but visual validation of
the new palette is only possible after this step. Do it first so all subsequent work is reviewed
against the real palette.

### Phase 2: Font Swap (immediately after tokens)

4. Update `--font-family-sans` in `@theme {}` with new font name
5. Verify `@nuxt/fonts` auto-picks up the new font (check `<head>` in browser DevTools for
   `<link rel="preload">` with new font filename)
6. Visual check: scan all sections for line-height and spacing regressions (new font metrics
   may shift layout slightly — address with `leading-*` adjustments per component)

### Phase 3: New SectionGuarantee Component

7. Create `app/components/Section/SectionGuarantee.vue` — static content, golden seal image
8. Add `<SectionGuarantee />` to `app/app.vue` between `SectionPrice` and `SectionFAQ`
9. Remove or reduce the redundant inline guarantee block in `SectionPrice.vue`

### Phase 4: Avatar in SectionSocialProof

10. Extend `testimonials` array in `SectionSocialProof.vue` with `initials` and `avatarColor` fields
11. Update template: add avatar element (initials circle) alongside existing bubble layout

### Phase 5: Gradient Application

12. Apply gradient utilities or inline gradient styles to target sections
    - SectionHero: already uses dark overlay — add gradient to the overlay or hero bg
    - SectionPrice / SectionGuarantee: gradient bg on navy sections for depth
    - SectionAbout or SectionMethod: optional subtle gradient dividers

### Phase 6: FAQ Visual Redesign (last — most design iteration expected)

13. Attempt Option A (enhanced UAccordion `:ui` prop)
14. If blocked by UAccordion internal structure: switch to Option B (custom accordion with `v-show`)

**Rationale for this order:**
- Phase 1-2 are pure token/font changes — they cannot break component logic, only visual output
- Phase 3 is self-contained (new file, one app.vue line) — zero risk to existing components
- Phase 4 is additive to existing data shape — testimonial bubbles still render if avatar fields are absent
- Phase 5 (gradients) depends on the final token values being confirmed — do after Phase 1-2
- Phase 6 (FAQ) involves the most design iteration; keep it last so it doesn't hold up other phases

---

## Anti-Patterns to Avoid in v1.6

### Do Not Hardcode New Color Values in Component Templates

**What people do:** Apply new colors directly in templates: `class="bg-[#1e56a0]"`.

**Why it's wrong:** Bypasses the token system. Future palette changes again require hunting
through all 13 components. The v1.6 work proves the value of the token system — do not
undermine it by adding new hardcodes.

**Do this instead:** Define new values in `@theme {}`. Use `var(--color-brand-primary)` in
template classes.

### Do Not Swap Fonts by Modifying html {} Directly

**What people do:** Change `html { font-family: 'Plus Jakarta Sans', ... }` without updating
`--font-family-sans` in `@theme {}`.

**Why it's wrong:** The CSS token and the `html {}` rule become inconsistent. If any component
uses `font-[var(--font-family-sans)]` directly, it still gets the old font. The token is the
source of truth.

**Do this instead:** Update only `--font-family-sans` in `@theme {}`. The `html {}` rule already
uses `font-family: var(--font-family-sans)` — it picks up the new value automatically.

### Do Not Create SectionGuaranteeModal or Composable for Guarantee State

**What people do:** Add `isGuaranteeExpanded`, a `useGuarantee` composable, or a modal for
guarantee details.

**Why it's wrong:** The guarantee section is a static trust signal. Users read it; they do not
interact with it. Adding stateful behavior adds complexity with no conversion benefit.

**Do this instead:** Render the full guarantee text inline. If the copy is long, truncate visually
with a CSS approach — but do not add JavaScript state for this.

### Do Not Use Tailwind v4 `tailwind.config.ts` for New Tokens

**What people do:** Create a `tailwind.config.ts` extending the theme with `colors.brand`.

**Why it's wrong:** Nuxt UI v4 manages Tailwind v4 via the CSS-first path. A JS config file
can conflict with Nuxt UI's Tailwind integration and may generate utility class collisions.

**Do this instead:** Add all new tokens to `@theme {}` in `main.css`.

### Do Not Use @nuxt/image for Initials Avatars

**What people do:** Wrap the initials avatar `<div>` in a `<NuxtImg>` component.

**Why it's wrong:** Initials avatars are CSS elements, not images. `<NuxtImg>` is for raster
image optimization (WebP conversion, lazy loading, responsive sizing). Using it on a `<div>`
is invalid.

**Do this instead:** Keep initials avatars as plain `<div>` elements. Use `<NuxtImg>` only
when rendering actual photos from Cloudflare R2.

---

## Component Boundaries After v1.6

| Component | Status | Change Type | New File |
|-----------|--------|-------------|---------|
| `app/assets/css/main.css` | Modified | Token value replacement + gradient utilities | No |
| `SectionGuarantee` | New | Pure display component, static content | YES |
| `SectionSocialProof` | Modified | Data shape extension (avatars) + template update | No |
| `SectionFAQ` | Modified | Template redesign (enhanced UAccordion or custom) | No |
| `SectionPrice` | Modified | Remove/reduce inline guarantee block | No |
| `app/app.vue` | Modified | Insert `<SectionGuarantee />` in composition order | No |
| All other components | Unchanged | Inherit new palette + font via CSS token cascade | No |

---

## Sources

- Direct codebase inspection (HIGH confidence — files read 2026-03-24):
  - `app/assets/css/main.css` — token definitions and `@theme {}` scope
  - `app/app.vue` — component composition order
  - `app/components/Section/SectionSocialProof.vue` — current testimonial data shape
  - `app/components/Section/SectionFAQ.vue` — UAccordion usage and `:ui` prop
  - `app/components/Section/SectionPrice.vue` — existing inline guarantee block
  - `app/assets/img/` listing — confirms `selo-garantia7-dias.png` exists
  - `nuxt.config.ts` — module list, confirms `@nuxt/ui` and `@nuxt/fonts` active
- Tailwind v4 CSS-first configuration: https://tailwindcss.com/docs/v4-upgrade (HIGH)
- Tailwind v4 `@theme` block and custom utilities: https://tailwindcss.com/blog/tailwindcss-v4 (HIGH)
- Nuxt UI v4 accordion `:ui` prop customization: https://ui.nuxt.com/components/accordion (HIGH)
- @nuxt/fonts auto-detection behavior: https://fonts.nuxt.com (MEDIUM — docs consistent with observed behavior)
- Plus Jakarta Sans font metrics and glyph coverage: https://fonts.google.com/specimen/Plus+Jakarta+Sans (MEDIUM)
- CSS `size-adjust` for font CLS prevention: https://web.dev/articles/css-size-adjust (HIGH)

---

*Architecture research for: Fly Up Milhas v1.6 — visual identity upgrade milestone*
*Researched: 2026-03-24*
