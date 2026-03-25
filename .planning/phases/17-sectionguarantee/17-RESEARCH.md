# Phase 17: SectionGuarantee - Research

**Researched:** 2026-03-25
**Domain:** Nuxt 4 + Tailwind v4 — new pure-display Vue SFC, dark-background section with PNG seal
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Layout**
- D-01: Split layout — selo na esquerda, titulo + texto na direita (desktop)
- D-02: Mobile: stacks verticalmente — selo centralizado acima, texto abaixo
- D-03: Selo ~200px no mobile, ~250px no desktop (imagem grande mas nao dominante)

**Copy**
- D-04: Tom acolhedor e direto — "sem risco pra voce", empatico, elimina medo
- D-05: Titulo: algo como "Sua tranquilidade e nossa prioridade" (Claude pode ajustar)
- D-06: Texto: comunicar "7 dias, 100% devolvido, sem perguntas, sem burocracia"
- D-07: Usar as copy constants do STATE.md: Guarantee = "7 dias — 100% devolvido"

**Fundo e visual**
- D-08: Fundo escuro (#0F172A brand-dark) — continua o fluxo visual da SectionPrice, selo dourado brilha no contraste
- D-09: Pode usar gradiente diagonal sutil (similar ao gradient-price ou gradient-form) para manter consistencia visual
- D-10: Texto em branco sobre fundo escuro

**Posicionamento**
- D-11: Inserir em app.vue entre SectionPrice e SectionFAQ
- D-12: Usar tag `<SectionGuarantee />` diretamente (auto-import do Nuxt)

**Asset**
- D-13: Selo PNG ja existe em app/assets/img/selo-garantia7-dias.png — usar com `<img>` ou `<NuxtImg>` se R2 configurado
- D-14: PNG tem fundo preto nos cantos — usar com fundo escuro elimina esse problema visualmente

### Claude's Discretion
- Tamanho exato do selo (200-280px range)
- Padding e espacamento interno da secao
- Se adicionar borda sutil ou glow no selo
- Breakpoint exato para stack mobile (md: ou lg:)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GAR-01 | Nova secao dedicada SectionGuarantee com selo dourado (PNG existente) | PNG confirmed at `app/assets/img/selo-garantia7-dias.png` (750x750px); new SFC in `app/components/Section/`; one-line insertion in `app.vue` |
| GAR-02 | Copy de confianca enfatizando garantia de 7 dias sem risco | Copy constant confirmed in STATE.md ("7 dias — 100% devolvido"); tone and phrasing decisions locked in D-04 through D-07 |
| GAR-03 | Posicionamento estrategico da secao proximo ao preco/formulario | Insertion point confirmed: between `<SectionPrice />` and `<SectionFAQ />` in app.vue line 47; persuasion sequence: offer → guarantee → objection handling |
</phase_requirements>

---

## Summary

Phase 17 creates `SectionGuarantee.vue`, a new pure-display Vue SFC with no props, no emits, and no composables. Its sole job is to render a dark-background section with a golden PNG seal on the left and trust copy on the right — then slot into `app.vue` between `SectionPrice` and `SectionFAQ` with a single line.

The component is completely self-contained. Everything needed already exists: the PNG seal is confirmed in `app/assets/img/`, the design tokens (`--color-brand-dark`, gradient utilities `gradient-price`/`gradient-form`) are live in `main.css` after Phase 15, and the typographic conventions (white text, `font-semibold tracking-[-0.015em]` for `h2`) are established across existing dark sections. There is no new dependency, no new CSS token, and no API call.

The one decision left to Claude's discretion is cosmetic: whether to add a subtle `drop-shadow` or glow filter on the seal image, the precise padding values, and whether `md:` or `lg:` is the right breakpoint for the desktop layout split. All other details are locked.

**Primary recommendation:** Model the component directly on `SectionPrice.vue` for dark-section structure and class conventions. Use `<img src="~/assets/img/selo-garantia7-dias.png">` (no NuxtImg — R2 not confirmed active for local asset). Use `gradient-form` utility for the diagonal gradient that matches the surrounding dark sections. Target `md:flex-row` for the desktop split (matches SectionPrice's own `lg:grid-cols-2` breakpoint area).

---

## Standard Stack

### Core (everything already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Nuxt 4 | ^4.4.2 | Auto-imports components from `app/components/Section/` | File in correct directory = automatic registration, no explicit import |
| Tailwind v4 (via @nuxt/ui) | ^4.2.2 | Utility classes for layout, spacing, color | Already managing all styling; `@utility` gradient tokens already defined |
| Plus Jakarta Sans | 400/500/600/700 | Font (inherited via `html { font-family: var(--font-family-sans) }`) | Phase 16 complete; all components inherit automatically |

### No New Dependencies

This phase requires zero new `npm install` commands. All design tokens, utilities, font, and image asset are in place.

---

## Architecture Patterns

### Component Location

```
app/
└── components/
    └── Section/
        └── SectionGuarantee.vue   ← new file (only deliverable)
app/
└── app.vue                         ← one line added between SectionPrice and SectionFAQ
```

### Pattern: Pure Display Component (no script logic)

**What:** SFC with an empty `<script setup>` (or no script block at all). All content is hardcoded in the template. No reactive state, no composables, no imports.

**When to use:** Any section where content is static and not reused across multiple places. `SectionGuarantee` is a pure trust-signal element — the visitor reads it, does not interact with it.

**Example structure (mirrors SectionPrice.vue's dark section pattern):**

```vue
<!-- app/components/Section/SectionGuarantee.vue -->
<template>
  <section
    id="garantia"
    class="gradient-form py-12 md:py-20 px-6"
  >
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">

      <!-- Seal — left on desktop, top on mobile -->
      <div class="shrink-0 flex justify-center">
        <img
          src="~/assets/img/selo-garantia7-dias.png"
          alt="Selo de garantia incondicional de 7 dias"
          class="w-48 md:w-60"
        />
      </div>

      <!-- Copy — right on desktop, below seal on mobile -->
      <div class="flex flex-col gap-4 text-center md:text-left">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-white">
          Sua tranquilidade é nossa prioridade
        </h2>
        <p class="text-white/80 text-base leading-relaxed">
          Se nos primeiros 7 dias você sentir que a mentoria não é para você,
          devolvemos 100% do valor investido — sem perguntas, sem burocracia.
          Assim como deve ser.
        </p>
        <p class="text-white/60 text-sm">
          7 dias — 100% devolvido. Garantia incondicional.
        </p>
      </div>

    </div>
  </section>
</template>
```

### Pattern: `gradient-form` Utility Reuse

The `gradient-form` utility is already defined in `main.css`:

```css
@utility gradient-form {
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
}
```

This is the correct gradient for SectionGuarantee per D-09 (similar to gradient-price or gradient-form). Using it requires only `class="gradient-form"` on the `<section>` — no new CSS.

Alternatively, the section can use `class="bg-[var(--color-brand-dark)]"` for a flat dark background if the diagonal gradient feels inconsistent in context. This is Claude's discretion.

### Pattern: Insertion in app.vue

```html
<!-- Current app.vue lines 46-48 -->
<SectionPrice />
<!-- INSERT HERE -->
<SectionFAQ />
```

Becomes:

```html
<SectionPrice />
<SectionGuarantee />
<SectionFAQ />
```

Nuxt 4 auto-imports all components from `app/components/` — no import statement needed.

### Anti-Patterns to Avoid

- **Adding a composable for guarantee state:** The section is static. No `isOpen`, no `useGuarantee`, no modal. Render full text inline.
- **Using `<NuxtImg>` for the seal:** R2 is not confirmed active for local assets served from `app/assets/img/`. Use plain `<img src="~/assets/img/selo-garantia7-dias.png">`. The `~/` alias resolves correctly in Nuxt 4 component templates.
- **Hardcoding `#0F172A` in template:** Use `gradient-form` utility or `bg-[var(--color-brand-dark)]` to stay within the token system. No bare hex values in template classes.
- **Adding `id` to scroll nav:** The guarantee section does not need a nav link. The `id="garantia"` can be added for analytics purposes only, but must NOT be added to AppHeader's nav links.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Diagonal dark gradient background | Custom inline `style` gradient | `gradient-form` utility class | Already defined in main.css; consistent with SectionPrice and SectionForm visual language |
| Responsive layout (side-by-side → stacked) | JS media query detection | Tailwind `flex-col md:flex-row` | Zero JS; breakpoint-driven; matches all other sections |
| Seal image rendering | CSS-constructed badge or SVG | `<img src="~/assets/img/selo-garantia7-dias.png">` | Asset already exists, client-approved, 750x750px PNG ready |

**Key insight:** This component is genuinely simple. The temptation to add interactivity, animations, or stateful expansion ("show more") is the main risk. Resist it.

---

## Common Pitfalls

### Pitfall 1: Black corners on the PNG seal become visible on light backgrounds

**What goes wrong:** If someone tests the section on a white or light background, the PNG's black corners (pre-existing in the asset) become obvious rectangular artifacts.

**Why it happens:** The seal PNG does not have a transparent background — corners are filled with black.

**How to avoid:** Decision D-14 is locked: use only on dark backgrounds. `gradient-form` (dark-to-navy diagonal) ensures the black corners are invisible. Never place this seal on a white or off-white section background.

**Warning signs:** If a future design iteration suggests changing the section background to light, the seal PNG must be regenerated with a transparent background first.

### Pitfall 2: `<NuxtImg>` fails silently for local assets without R2

**What goes wrong:** Using `<NuxtImg src="/img/selo-garantia7-dias.png">` or `<NuxtImg src="~/assets/img/selo-garantia7-dias.png">` when `NUXT_PUBLIC_R2_BASE_URL` is not set causes the image to return a broken URL or blank.

**Why it happens:** `@nuxt/image` with a Cloudflare provider tries to construct a CDN URL. Without the env var, the provider has no base and can produce an empty `src`.

**How to avoid:** Use a plain `<img>` tag with the Vite `~/assets/` alias. Nuxt 4 resolves `~/assets/img/selo-garantia7-dias.png` via Vite's asset pipeline — the image is bundled into `_nuxt/assets/` and served statically. No env var needed.

### Pitfall 3: Copy does not match the established guarantee constant

**What goes wrong:** Writing new copy like "30 dias de garantia" or "50% reembolso" instead of using the confirmed constant.

**Why it happens:** The copy constant is in STATE.md, not inline in any component, making it easy to miss.

**How to avoid:** The locked constant is `Guarantee = "7 dias — 100% devolvido"`. The body copy must reference exactly "7 dias" and "100% do valor investido". Do not invent new terms.

### Pitfall 4: Section adds a nav link to AppHeader

**What goes wrong:** Adding `id="garantia"` to the section and then updating AppHeader's nav items to include a "Garantia" link.

**Why it happens:** Other sections with IDs (about, conteudo, como-funciona, depoimentos, faq) all have nav links. It feels consistent to add one.

**How to avoid:** The guarantee section is a conversion element in the persuasion flow, not a navigable destination. Users reach it naturally by scrolling. AppHeader nav is not part of this phase's scope.

### Pitfall 5: Redundancy with SectionPrice inline guarantee block

**What goes wrong:** SectionPrice.vue currently has a small inline guarantee block (shield icon + "Garantia de 7 dias" + short description line at bottom of the price card column). If SectionGuarantee is added directly after without removing or reducing this, the visitor sees the guarantee signal twice within a single scroll distance.

**Why it happens:** SectionPrice's inline block was the previous implementation before the dedicated section existed.

**How to avoid:** After creating SectionGuarantee, reduce the inline block in SectionPrice.vue to the minimum — keep only the shield icon + "Garantia de 7 dias" one-liner as a reinforcement signal. Let SectionGuarantee carry the full explanation. The one-liner in SectionPrice is acceptable (it lives directly beside the price card and serves an immediate reassurance function); the full paragraph duplicate is not.

---

## Code Examples

### Full component reference (SectionPrice.vue dark section pattern)

The existing dark-section pattern from SectionPrice.vue:

```vue
<section
  id="preco"
  class="gradient-price py-12 md:py-24 px-6"
>
  <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
    <!-- content -->
  </div>
</section>
```

SectionGuarantee should use the same structure but with `flex-col md:flex-row` instead of grid (simpler for two-column where left col is a centered image, not a form).

### Seal image with correct sizing (Claude's discretion: 200-280px range)

```html
<!-- Recommended starting point; adjust within 200-280px range -->
<img
  src="~/assets/img/selo-garantia7-dias.png"
  alt="Selo de garantia incondicional de 7 dias"
  class="w-48 md:w-64"
/>
<!-- w-48 = 192px mobile, w-64 = 256px desktop — both within locked D-03 range -->
```

### Heading typography (matches h2 convention from Phase 16)

```html
<h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-white">
  Sua tranquilidade é nossa prioridade
</h2>
```

This matches the h2 convention confirmed in STATE.md: `h2=semibold+tracking-[-0.015em]` and `text-white` for dark sections (from SectionPrice.vue line 22).

### app.vue insertion (one line)

```html
<!-- Current: -->
<SectionPrice />
<SectionFAQ />

<!-- After phase 17: -->
<SectionPrice />
<SectionGuarantee />
<SectionFAQ />
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline guarantee block in SectionPrice (shield icon + 2 lines) | Dedicated full-width section with seal, before FAQ | Phase 17 | Higher visibility at decision point; forces visitor to consciously process risk reversal |
| `--color-brand-primary` as navy `#1a3a5c` | `--color-brand-dark: #0F172A` (slate-900) for dark sections | Phase 15 | `brand-dark` is the correct token for dark/navy section backgrounds after Phase 15 palette migration |
| `gradient-price` used for price section | `gradient-form` or new `gradient-guarantee` for guarantee | Phase 15 | Both gradients start from `#0F172A`; `gradient-form` is stylistically closer to guarantee section tone |

**Current token names after Phase 15 (CRITICAL — not the old names):**

| Token | Value | Use |
|-------|-------|-----|
| `--color-brand-dark` | `#0F172A` | Dark section backgrounds (header, price, form) |
| `--color-brand-primary` | `#1D4ED8` | Text accents, icons, interactive elements |
| `--color-brand-cta` | `#0891B2` | CTA buttons (cyan-700) |

The ARCHITECTURE.md referenced `--color-brand-primary` as the navy background token. This is outdated. After Phase 15, dark section backgrounds use `--color-brand-dark` (`#0F172A`). The `gradient-form` utility (`#0F172A → #1E3A8A`) uses `brand-dark` as its start stop. SectionGuarantee must follow this same convention.

---

## Open Questions

1. **Should SectionPrice.vue inline guarantee be reduced in this phase?**
   - What we know: ARCHITECTURE.md explicitly recommends it; the inline block currently lives at the bottom of SectionPrice's right column
   - What's unclear: Whether the user decision (CONTEXT.md) scoped this phase to "create SectionGuarantee only" or includes the SectionPrice cleanup
   - Recommendation: Include a minimal edit to SectionPrice.vue to reduce the inline guarantee to a one-liner, but keep it within the phase; it prevents visual redundancy and is a 2-line change

2. **`gradient-form` vs `gradient-price` vs flat `bg-[var(--color-brand-dark)]`**
   - What we know: D-09 says "can use subtle diagonal gradient similar to gradient-price or gradient-form"; both are valid; it is Claude's discretion
   - What's unclear: Whether visual testing will reveal one looking better in context
   - Recommendation: Default to `gradient-form` (`#0F172A → #1E3A8A`) — it produces a slightly darker look than `gradient-price` which starts from blue-900; more contrast for the golden seal

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection (2026-03-25):
  - `app/assets/css/main.css` — confirmed token names and values after Phase 15/16; gradient utilities verified
  - `app/app.vue` — confirmed section order, insertion point at line 46-47
  - `app/components/Section/SectionPrice.vue` — reference implementation for dark section structure and class conventions
  - `app/assets/img/` listing — confirmed `selo-garantia7-dias.png` exists at correct path
  - `.planning/phases/17-sectionguarantee/17-CONTEXT.md` — all locked decisions
  - `.planning/STATE.md` — copy constants, token history, architecture constraints
  - `.planning/research/FEATURES.md` — guarantee section conversion research (D-14 confirmed, seal image context)
  - `.planning/research/ARCHITECTURE.md` — SectionGuarantee component structure, anti-patterns

### Secondary (MEDIUM confidence)

- FEATURES.md cites: "VWO experiment: +32% conversion" for standalone guarantee section vs inline — supports the strategic rationale for this phase

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all tools confirmed installed and active
- Architecture: HIGH — direct codebase read; component pattern directly observable in SectionPrice.vue
- Pitfalls: HIGH — pitfalls derived from direct asset inspection (PNG black corners confirmed) and established project decisions

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable — pure CSS/Vue component, no external API surface)
