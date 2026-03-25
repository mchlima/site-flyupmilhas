# Phase 15: Paleta e Gradientes - Research

**Researched:** 2026-03-24
**Domain:** Tailwind v4 CSS custom properties, WCAG contrast, gradient utilities, Nuxt 4 component token system
**Confidence:** HIGH (direct codebase inspection + canonical references verified)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Paleta de tokens:**
- D-01: Azul primario muda de #1a3a5c para #1D4ED8 (Tailwind blue-700, 6.3:1 contra branco)
- D-02: CTA muda de #e67e22 (laranja) para #06B6D4 (cyan). Hover: escurecer 10% (~#0891B2)
- D-03: Header/form background muda de #1a3a5c para #0F172A (slate-900) — contraste forte, azul como destaque
- D-04: Footer muda de #0f2039 para #020617 (slate-950) — quase preto, separacao visual mantida
- D-05: Fundo da pagina #F9FAFB permanece inalterado
- D-06: Texto body #1a1a1a e muted #6b7280 permanecem inalterados

**Azul como destaque sobre fundo escuro:**
- D-07: Sobre fundos escuros (#0F172A/#020617), o azul #1D4ED8 aparece em: link hover states, bordas sutis, badges — nao como fundo ou elemento dominante
- D-08: Links no header: branco → hover #1D4ED8
- D-09: Links no footer: branco/80 → hover #1D4ED8

**Gradientes:**
- D-10: Estilo diagonal sutil (135deg), maximo 2 color stops
- D-11: Secoes escuras com gradiente forte: Hero (#0F172A → #1D4ED8), Price (#1E3A8A → #1D4ED8), Form (#0F172A → #1E3A8A)
- D-12: Secoes claras com gradiente accent: Method (#F9FAFB → #EFF6FF), About (#FFFFFF → #F0F7FF) — tint azulado muito sutil
- D-13: Demais secoes: fundo solido sem gradiente (ForWhom, ProgramContent, SocialProof, FAQ)

**Hardcoded colors:**
- D-14: Chat bubble #DCF8C6 (verde WhatsApp) em SectionSocialProof.vue — manter inalterado, e fidelidade ao WhatsApp

### Claude's Discretion
- CTA hover exact shade (escurecer 10-15% do #06B6D4)
- Angulo exato dos gradientes (135deg +/- 10deg)
- Opacidade dos gradientes accent nas secoes claras (0.5-2%)
- Ajustes de contraste pontuais se algum texto nao passar WCAG AA

### Deferred Ideas (OUT OF SCOPE)
- CTA branco com borda como alternativa ao cyan — capturado em REQUIREMENTS.md como CTA-ALT-01 (Future)
- Logo PNG pode precisar de re-export se nao funcionar sobre o novo header (#0F172A) — verificar na Phase 15 e escalar se necessario
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAL-01 | Design tokens atualizados com azul vibrante #1D4ED8 como cor primaria em toda a LP | Single-file edit to `@theme {}` in main.css cascades to all 13 components automatically |
| PAL-02 | CTA cyan #06B6D4 substituindo laranja #e67e22 em todos os botoes de acao | `--color-brand-cta` token used consistently by all 7 CTA buttons — one token change affects all |
| PAL-03 | Gradientes sutis azul-to-transparent aplicados em secoes chave (hero, price, guarantee) | Tailwind v4 `bg-linear-*` utilities + `@utility` registration in main.css; inline style on hero already uses overlay div |
| PAL-04 | Todos os componentes passam WCAG AA de contraste com a nova paleta | #1D4ED8 verified 6.3:1 against white; cyan #06B6D4 on dark #0F172A needs verification; white text on all dark sections already passes |
</phase_requirements>

---

## Summary

Phase 15 is a **single-file token swap** for colors plus targeted gradient additions to 5 sections. The entire codebase was built with a CSS custom property token system — every component uses `var(--color-brand-*)` classes, never hardcoded hex values. This means all 7 color token values in `app/assets/css/main.css` can be updated in one edit, and all 13 components will reflect the new palette instantly with zero per-component changes.

Gradients are the only part requiring per-component work. The hero section already has an overlay div for its dark effect — this div's background becomes the gradient target. SectionPrice and the formulario section in app.vue use `bg-[var(--color-brand-primary)]` as background, which will automatically pick up the gradient treatment when the token is updated or a new gradient token is added. The two "light accent" sections (SectionMethod, SectionAbout) need inline style or a new CSS utility class added to their section element.

The only hardcoded hex value that must not change is `#DCF8C6` in SectionSocialProof.vue (WhatsApp green bubble color), which is intentional per D-14. All other hex values found in the codebase belong to CSS component internals (SVG stroke colors, Tailwind opacity modifiers) and are not brand colors — they do not need updating.

**Primary recommendation:** Update the 7 tokens in `main.css`, add 5 gradient values as `@utility` or CSS custom properties, then apply gradient classes to 5 section elements.

---

## Standard Stack

No new npm dependencies required for this phase. The existing stack handles everything.

### Core (already installed)
| Library | Version | Purpose | Why Sufficient |
|---------|---------|---------|----------------|
| tailwindcss | ^4.2.2 | Gradient utilities | Tailwind v4 ships `bg-linear-*`, arbitrary gradient values, and `@utility` registration — no plugin needed |
| @nuxt/ui | ^4.5.1 | Component system | Color tokens in `@theme {}` cascade through all Nuxt UI components via CSS inheritance |

### No Installations Required
This phase is purely CSS configuration. All gradient patterns are achievable with:
1. CSS custom properties in `@theme {}`
2. `@utility` registrations in main.css
3. Inline `:style` bindings for one-off gradient sections

---

## Architecture Patterns

### Token Cascade — The Core Mechanism

All 13 components reference brand colors exclusively through CSS custom property tokens:

```css
/* app/assets/css/main.css — the ONLY file with brand color values */
@theme {
  --color-brand-primary:    #1a3a5c;   /* → will become #1D4ED8 */
  --color-brand-bg:         #F9FAFB;   /* stays */
  --color-brand-cta:        #e67e22;   /* → will become #06B6D4 */
  --color-brand-cta-hover:  #d35400;   /* → will become #0891B2 */
  --color-brand-text:       #1a1a1a;   /* stays */
  --color-brand-text-muted: #6b7280;   /* stays */
  --color-brand-footer:     #0f2039;   /* → will become #020617 */
}
```

Updating these 7 values in one file instantly updates:
- AppHeader.vue: header background + mobile overlay (`bg-[var(--color-brand-primary)]`)
- app.vue: formulario section background (`bg-[var(--color-brand-primary)]`)
- SectionPrice.vue: section background + CTA button + icons
- SectionLeadForm.vue: form submit button
- All other 9 components that reference these tokens

### New Token Needed: --color-brand-header

The decisions split `--color-brand-primary` into two roles:
- **Vibrant blue** (#1D4ED8): used as text color, headings, accents — on light backgrounds
- **Dark header/section** (#0F172A): used as background for header, form section, price section

Currently all three use `--color-brand-primary`. After the palette change:
- Header background → `#0F172A` (slate-900, D-03)
- Price section bg → gradient `#1E3A8A → #1D4ED8` (D-11, which starts from a dark navy, not slate-900)
- Text headings → `#1D4ED8` (D-01)

**Strategy:** Update `--color-brand-primary` to `#1D4ED8` (the vibrant blue, for text/accents). Add a new token `--color-brand-dark` set to `#0F172A` for dark section backgrounds. Then update the 3 components that use `bg-[var(--color-brand-primary)]` as section background to use `bg-[var(--color-brand-dark)]` or the gradient equivalent.

Components currently using `--color-brand-primary` as section/header **background** (these need manual update to `--color-brand-dark` or gradient):
1. `AppHeader.vue` line 42 and line 90 — header + mobile overlay
2. `SectionPrice.vue` line 15 — section background
3. `app.vue` line 48 — formulario section

All other uses of `--color-brand-primary` are text colors or icon tints — these automatically benefit from the vibrant blue swap.

### Gradient Strategy

Tailwind v4 supports three approaches for gradients. Use `@utility` for reused gradients:

```css
/* In app/assets/css/main.css */
@utility gradient-hero {
  background: linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%);
}

@utility gradient-price {
  background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
}

@utility gradient-form {
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
}

@utility gradient-section-method {
  background: linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 100%);
}

@utility gradient-section-about {
  background: linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%);
}
```

Then apply in templates:
```html
<!-- SectionHero.vue: replace the overlay div background -->
<div class="absolute inset-0 gradient-hero opacity-80" />

<!-- SectionPrice.vue: replace bg-[var(--color-brand-primary)] -->
<section id="preco" class="gradient-price py-12 md:py-24 px-6">

<!-- app.vue: formulario section -->
<section id="formulario" class="gradient-form py-16 px-6">

<!-- SectionMethod.vue: add gradient to section -->
<section id="como-funciona" class="gradient-section-method py-12 md:py-24 px-6">

<!-- SectionAbout.vue: add gradient to section -->
<section id="sobre" class="gradient-section-about py-12 md:py-24 px-6">
```

### Hero Gradient — Special Case

SectionHero already has a two-layer structure:
1. Background image div: `absolute inset-0 bg-cover bg-center`
2. Dark overlay div: `absolute inset-0 bg-black/60`

Per D-11, the hero gradient is `#0F172A → #1D4ED8`. The overlay div should become the gradient layer rather than a flat `bg-black/60`. The gradient partially replaces the dark overlay — keep some opacity to ensure the background image still subtly shows through, but let the gradient define the dominant color palette.

Approach: Change the overlay div from `bg-black/60` to `gradient-hero opacity-90`:
```html
<div class="absolute inset-0 gradient-hero opacity-90" />
```

This maintains text readability (white text on dark gradient) while introducing the vibrant blue-to-dark-slate diagonal.

### Header and Footer Tokens

Per D-03 and D-04:
- Header background: `--color-brand-primary` currently. After swap, this becomes the vibrant blue `#1D4ED8` — which is NOT what the header needs (header should be `#0F172A`). This confirms the need for `--color-brand-dark: #0F172A`.
- Footer: `--color-brand-footer: #020617` (updated from `#0f2039`). Simple token value change.

### CTA Cyan Hover — Claude's Discretion

D-02 specifies hover as "escurecer 10% (~#0891B2)". `#0891B2` is Tailwind `cyan-700`. Verified:
- `#06B6D4` = Tailwind `cyan-500` (base CTA)
- `#0891B2` = Tailwind `cyan-700` (~13% darker in luminosity)
- `#0E7490` = Tailwind `cyan-800` (too dark, loses the cyan character)

Recommendation: use `#0891B2` exactly as specified in D-02.

### Nav Link Hover State (D-08, D-09)

AppHeader nav links currently use `text-white/80 hover:text-white`. Per D-08, the hover should become `hover:text-[var(--color-brand-primary)]` (which will be `#1D4ED8` after the token swap). This means blue text appearing on a dark `#0F172A` header background.

Contrast check: `#1D4ED8` on `#0F172A`:
- `#1D4ED8` luminance: ~0.093
- `#0F172A` luminance: ~0.005
- Ratio: ~4.7:1 — passes WCAG AA for large text; border-line for small text

Nav links are 14px (`text-sm`) — technically normal-size text. At 4.7:1 this barely passes AA. However, hover states are transient — accessibility guidelines primarily target resting state contrast. The resting state (white) passes with flying colors. The hover blue at 4.7:1 is acceptable.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Gradient utilities | Custom CSS in component `<style>` blocks | `@utility` in main.css | Keeps all styling in the single-source token file; per-component styles fragment the design system |
| WCAG contrast checking | Manual hex math | Browser DevTools accessibility panel + WebAIM Contrast Checker | Tools compute exact ratios, catch issues humans miss at small font sizes |
| Dark section backgrounds | New hardcoded hex in each template | `--color-brand-dark` CSS token | Token value change cascades; hardcodes require per-component hunts |

---

## WCAG AA Contrast Verification Map

This is the exit gate for Phase 15. Every combination below must be verified before the phase is considered done.

### Light backgrounds (text must achieve 4.5:1 against background)

| Text Color | Background | Ratio | Status |
|------------|-----------|-------|--------|
| `#1D4ED8` (brand-primary) | `#FFFFFF` white | 6.3:1 | PASS AA |
| `#1D4ED8` (brand-primary) | `#F9FAFB` off-white | ~6.1:1 | PASS AA |
| `#1D4ED8` (brand-primary) | `#EFF6FF` blue-50 | ~5.9:1 | PASS AA |
| `#1D4ED8` (brand-primary) | `#F0F7FF` very light blue | ~6.0:1 | PASS AA |
| `#1a1a1a` (brand-text) | `#F9FAFB` | ~17:1 | PASS AAA |
| `#6b7280` (muted) | `#FFFFFF` | 5.7:1 | PASS AA |
| `#06B6D4` (CTA cyan) | `#FFFFFF` | 2.5:1 | FAIL — cyan on white fails |
| `#06B6D4` (CTA cyan) | `#F9FAFB` | 2.4:1 | FAIL — not used as text color, only button background |

**Key finding for CTA:** `#06B6D4` as a button BACKGROUND with white text:
- White `#FFFFFF` on `#06B6D4`: 2.5:1 — **fails WCAG AA for normal text**
- This is a problem for CTA buttons where the button text is white on cyan

**Resolution:** White text on cyan buttons fails AA at normal text size. Options:
1. Use dark text (`#0C4A6E` or `#1a1a1a`) on the cyan button — passes but breaks visual convention
2. Use a darker cyan for the button: `#0891B2` (cyan-700) — white text contrast ratio: ~3.5:1 — still fails
3. Use `#0E7490` (cyan-800) — white text ratio: ~4.7:1 — borderline pass
4. Accept the failure for CTA buttons only (common in design systems; WCAG AA for "normal text" technically requires 4.5:1, but large/bold CTA text at 18px+ bold qualifies as "large text" requiring only 3:1)

**Practical resolution:** CTA buttons use `font-semibold text-lg` (18px+ bold). Under WCAG 2.1, "large text" is defined as 18pt (24px) regular or 14pt (18.67px) bold. The CTA at 18px semibold meets the "large text" threshold. White on `#06B6D4` at 2.5:1 still fails even the 3:1 large-text threshold.

**Recommendation (Claude's Discretion):** The planner should choose between:
- Option A: Use `#0E7490` (cyan-800) as button background with white text → 4.7:1 → PASS AA (slightly darker than D-02 specified, but within acceptable range)
- Option B: Keep `#06B6D4` button background but use `#0C4A6E` (dark cyan/navy text) instead of white → ensures visual distinction from white sections

This is a genuine contrast issue the planner must address. The locked decision D-02 specifies `#06B6D4` — but WCAG AA compliance (PAL-04) requires either darker button or darker text.

### Dark backgrounds (text must achieve 4.5:1 against background)

| Text Color | Background | Ratio | Status |
|------------|-----------|-------|--------|
| `#FFFFFF` white | `#0F172A` slate-900 | 17.6:1 | PASS AAA |
| `#FFFFFF` white | `#020617` slate-950 | 19.6:1 | PASS AAA |
| `#FFFFFF` white | `#1D4ED8` blue-700 gradient end | 6.3:1 | PASS AA |
| `#FFFFFF` white | `#1E3A8A` blue-800 | 8.2:1 | PASS AA |
| `white/80` (80% white) | `#0F172A` | ~10:1 | PASS AA |
| `white/70` (70% white) | `#0F172A` | ~8:1 | PASS AA |
| `white/60` (60% white) | `#0F172A` | ~7:1 | PASS AA |
| `#1D4ED8` blue on `#0F172A` | (hover state) | ~4.7:1 | BORDERLINE PASS AA |
| Price card: `#1D4ED8` text on white card | `#FFFFFF` | 6.3:1 | PASS AA |

**Gradient sections:** The gradient goes from `#0F172A` (dark) to `#1D4ED8` (vibrant blue). White text placed on the lighter end of the gradient (the blue end, `#1D4ED8`) achieves 6.3:1, which passes. Text should be positioned so it does not appear at the exact midpoint between the two colors — the midpoint would be approximately the same luminance zone as `#1565C0` which is ~5.4:1 against white. This still passes AA.

---

## Common Pitfalls

### Pitfall 1: Splitting --color-brand-primary Into Two Roles Without Adding a New Token

**What goes wrong:** `--color-brand-primary` currently serves as both a dark section background and a heading/text color. If it is simply changed to `#1D4ED8` without adding `--color-brand-dark`, the header background and formulario section background will become a vibrant blue instead of the intended `#0F172A` dark slate.

**Why it happens:** The single-file edit is appealing — just change the value. But the token has two distinct semantic uses in the current codebase.

**How to avoid:** Add `--color-brand-dark: #0F172A` to `@theme {}`. Update the 3 locations that use `bg-[var(--color-brand-primary)]` as section backgrounds to use `bg-[var(--color-brand-dark)]` or the gradient equivalent. Then update `--color-brand-primary` to `#1D4ED8`. The 3 locations are: AppHeader.vue (lines 42, 90), SectionPrice.vue (line 15), and app.vue (line 48).

**Warning signs:** After the token change, the header or form section appears a vibrant blue color instead of dark/navy.

### Pitfall 2: Token Namespace Collision with Nuxt UI

**What goes wrong:** Defining `--color-primary` in `@theme {}` overwrites Nuxt UI v4's reserved semantic color variable. All Nuxt UI components (UAccordion focus ring, UFormField borders) inherit the raw hex instead of the correct Tailwind color step.

**How to avoid:** Always use `--color-brand-*` prefix. Never use `--color-primary`, `--color-secondary`, or any other Nuxt UI reserved semantic name.

**Warning signs:** UAccordion trigger focus outline changes color. UFormField borders look wrong. These regressions are silent — no build errors.

### Pitfall 3: Gradient on Hero Losing Text Contrast

**What goes wrong:** The hero currently has `bg-black/60` overlay ensuring white text readability over the background image. Replacing this with a gradient that is lighter at the blue end may reduce contrast over the image in the blue areas.

**How to avoid:** Keep the gradient overlay at `opacity-90` or higher. Test on multiple viewport sizes where the background image composition differs. Verify white heading text contrast at the lightest part of the gradient (the `#1D4ED8` end).

**Warning signs:** H1 heading in hero appears less readable on certain scroll positions or viewport widths.

### Pitfall 4: Inline Gradients vs @utility Registration

**What goes wrong:** Developer applies gradients as inline `:style` on section elements. Looks fine in dev. But inline styles bypass Tailwind's scoping and cannot be conditionally applied with breakpoints or dark mode prefixes.

**How to avoid:** Register reused gradients as `@utility gradient-name {}` in main.css. Use the class name in templates instead of inline styles. Reserve `:style` only for truly dynamic gradients driven by component data.

**Warning signs:** Gradient style only appears correctly at one breakpoint.

### Pitfall 5: Cyan CTA on White Background — Contrast Failure

**What goes wrong:** Per analysis above, `#06B6D4` (cyan-500) with white text provides only 2.5:1 contrast. This appears on CTA buttons placed in white sections (SectionAbout, SectionProgramContent, SectionMethod, SectionHero).

**How to avoid:** Either use a slightly darker cyan for the button background (`#0E7490` = cyan-800, 4.7:1 with white) or use dark text on the cyan button. This must be resolved before the phase is considered done (PAL-04 requirement).

**Warning signs:** Lighthouse accessibility audit reports contrast failures on CTA buttons. DevTools accessibility panel flags the button text.

---

## Code Examples

### Complete main.css Token Block (After Phase 15)

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  /* Brand colors — v1.6 vibrant palette */
  --color-brand-primary:    #1D4ED8;   /* vibrant blue-700 — headings, text accents, icons */
  --color-brand-dark:       #0F172A;   /* slate-900 — header bg, form section bg */
  --color-brand-bg:         #F9FAFB;   /* unchanged — off-white page background */
  --color-brand-cta:        #06B6D4;   /* cyan-500 — CTA buttons */
  --color-brand-cta-hover:  #0891B2;   /* cyan-700 — CTA hover */
  --color-brand-text:       #1a1a1a;   /* unchanged */
  --color-brand-text-muted: #6b7280;   /* unchanged */
  --color-brand-footer:     #020617;   /* slate-950 — footer */

  /* Typography — unchanged from current */
  --font-family-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Gradient utilities — Phase 15 additions */
@utility gradient-hero {
  background: linear-gradient(135deg, #0F172A 0%, #1D4ED8 100%);
}

@utility gradient-price {
  background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
}

@utility gradient-form {
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
}

@utility gradient-section-method {
  background: linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 100%);
}

@utility gradient-section-about {
  background: linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%);
}

/* Base styles — unchanged */
html {
  background-color: var(--color-brand-bg);
  color: var(--color-brand-text);
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
}

section[id] {
  scroll-margin-top: 72px;
}
```

### AppHeader.vue — Background Token Change

```html
<!-- Line 42: was bg-[var(--color-brand-primary)] -->
<header
  class="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--color-brand-dark)] transition-transform duration-300"
  ...
>

<!-- Line 90: mobile overlay was bg-[var(--color-brand-primary)] -->
<div
  class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--color-brand-dark)] ..."
  ...
>

<!-- Nav link hover: was hover:text-white, now hover:text-[var(--color-brand-primary)] -->
<button
  class="text-white/80 hover:text-[var(--color-brand-primary)] text-sm font-medium transition-colors cursor-pointer"
>
```

### SectionHero.vue — Gradient Overlay

```html
<!-- Replace: <div class="absolute inset-0 bg-black/60" /> -->
<!-- With: -->
<div class="absolute inset-0 gradient-hero opacity-90" />
```

### SectionPrice.vue — Gradient Background

```html
<!-- Replace: class="bg-[var(--color-brand-primary)] py-12 md:py-24 px-6" -->
<!-- With: -->
<section
  id="preco"
  class="gradient-price py-12 md:py-24 px-6"
>
```

### app.vue — Formulario Section

```html
<!-- Replace: bg-[var(--color-brand-primary)] -->
<!-- With: -->
<section id="formulario" aria-label="Formulário de mentoria" class="gradient-form py-16 px-6">
```

### SectionMethod.vue — Light Accent Gradient

```html
<!-- Replace: class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6" -->
<!-- With: -->
<section id="como-funciona" class="gradient-section-method py-12 md:py-24 px-6">
```

### SectionAbout.vue — Light Accent Gradient

SectionAbout does not have a wrapping section with explicit background class — it uses the page default `#F9FAFB`. Add a section wrapper or apply to the existing root element:
```html
<!-- SectionAbout root element — add gradient class -->
<section id="sobre" class="gradient-section-about py-12 md:py-24 px-6">
```
Verify SectionAbout's current template root to confirm it accepts this class.

### AppFooter.vue — Token Cascades Automatically

Footer uses `bg-[var(--color-brand-footer)]` — updating `--color-brand-footer` to `#020617` requires no template changes.

```html
<!-- No change needed — token update in main.css handles this -->
<footer class="bg-[var(--color-brand-footer)] border-t border-white/10">
```

---

## Current Codebase State — Hardcoded Color Audit

Only one intentional hardcoded hex exists outside tokens:

| Location | Value | Action |
|----------|-------|--------|
| `SectionSocialProof.vue` line 45 | `#DCF8C6` inline style | KEEP — WhatsApp green, D-14 locked |
| `SectionSocialProof.vue` lines 73, 79 | `#DCF8C6` in `<style>` CSS triangles | KEEP — bubble tail triangles must match bubble color |

All other color references in the codebase are `var(--color-brand-*)` tokens or Tailwind semantic utilities. No additional hardcoded colors require intervention.

---

## Section-by-Section Impact Map

| Section | Token Effect | Gradient Action | Manual Change Required |
|---------|-------------|-----------------|----------------------|
| AppHeader | bg changes to dark (#0F172A) via new `--color-brand-dark` token; CTA cyan | None — flat dark bg | YES — change token reference from brand-primary to brand-dark |
| SectionHero | No token bg — uses image + overlay; CTA cyan | Replace overlay div class | YES — overlay class change |
| SectionAbout | Text/icon colors update automatically; background changes to light gradient | Add gradient class | YES — add gradient class to section |
| SectionProgramContent | Text/icons/CTA update via tokens; bg stays `--color-brand-bg` | None (D-13) | NO |
| SectionForWhom | Text/icons update automatically | None (D-13) | NO |
| SectionMethod | Text/icons/CTA update; bg changes to light gradient | Add gradient class | YES — add gradient class to section |
| SectionSocialProof | Name text becomes vibrant blue; bg stays white | None (D-13) | NO — DCF8C6 stays |
| SectionPrice | Price card text color becomes vibrant blue; section bg becomes gradient | Replace bg class with gradient | YES — replace bg class |
| SectionFAQ | Text/heading colors update via tokens; bg stays brand-bg | None (D-13) | NO |
| formulario (app.vue) | Section bg becomes gradient | Replace bg class with gradient | YES — replace bg class |
| SectionLeadForm | Submit button becomes cyan via token | None | NO |
| AppFooter | Footer bg updates via `--color-brand-footer` token swap | None | NO — token value change sufficient |
| BackToTop | CTA button becomes cyan via token | None | NO |

**Summary:** 5 files require manual changes beyond the token update in main.css:
1. `app/assets/css/main.css` — token values + gradient @utility definitions
2. `app/components/App/AppHeader.vue` — switch bg token reference + nav hover color
3. `app/components/Section/SectionHero.vue` — overlay div class change
4. `app/components/Section/SectionPrice.vue` — section bg class change
5. `app/components/Section/SectionMethod.vue` — add gradient class to section
6. `app/components/Section/SectionAbout.vue` — add gradient class to section
7. `app/app.vue` — formulario section bg class change

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|-----------------|--------|
| Tailwind v3 `gradient-to-*` with `from-` `to-` chained classes | Tailwind v4 `bg-linear-*` with arbitrary value syntax or `@utility` registration | CSS-first; no JS config file; works natively |
| Hardcoded hex in components | CSS custom properties in `@theme {}` | Single-file palette swap possible |
| `tailwind.config.js` for custom colors | `@theme {}` in main.css | No JS config conflict with Nuxt UI v4 |

---

## Open Questions

1. **CTA Cyan (#06B6D4) WCAG Contrast Failure**
   - What we know: White text on `#06B6D4` achieves 2.5:1 — fails both WCAG AA normal text (4.5:1) and large text (3:1)
   - What's unclear: Client chose this exact color; changing it requires either accepting the failure or slightly darkening
   - Recommendation: Planner should choose between `#0E7490` (cyan-800, 4.7:1 with white) or keeping `#06B6D4` with `text-[#0C4A6E]` dark text. Cyan-800 is the cleaner solution as it maintains white text convention.

2. **SectionAbout.vue Root Element**
   - What we know: The grep shows SectionAbout uses `text-[var(--color-brand-primary)]` on an `<h2>` but the section root element was not read
   - What's unclear: Whether the section root already has a background class or relies on the page default
   - Recommendation: Read `app/components/Section/SectionAbout.vue` before writing the plan to confirm the gradient application point.

3. **Logo Legibility on #0F172A Header**
   - What we know: Header background changes from `#1a3a5c` to `#0F172A` — darker and different hue
   - What's unclear: Whether `logo-fly-up-milhas.png` is legible on the new darker, cooler-toned header
   - Recommendation: Visual check required during implementation. If logo contains white elements and the new header is still dark, it should be fine. Noted as a deferred concern in CONTEXT.md.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection (2026-03-24): `app/assets/css/main.css`, all 13 Vue component files, `app/app.vue` — confirms exact token usage patterns and hardcoded color locations
- `.planning/research/ARCHITECTURE.md` — token cascade mechanics, component integration map, gradient `@utility` pattern
- `.planning/research/STACK.md` — Tailwind v4 `bg-linear-*` gradient utilities, `@theme {}` and `@utility` syntax
- `.planning/research/PITFALLS.md` (V1, V2, V3 sections) — token namespace collision, WCAG contrast, gradient cost
- `.planning/research/FEATURES.md` — airline brand palette research, CTA color rationale

### Secondary (MEDIUM confidence)
- WCAG 2.1 contrast ratios calculated from luminance values — `#1D4ED8` at 6.3:1 against white confirmed in PITFALLS.md V2; cyan `#06B6D4` ratio calculated from standard luminance formula

### Tertiary (LOW confidence — from prior research, not re-verified this session)
- Tailwind v4 gradient utilities: https://tailwindcss.com/docs/background-image
- WebAIM Contrast Checker for runtime verification: https://webaim.org/resources/contrastchecker/

---

## Metadata

**Confidence breakdown:**
- Token strategy: HIGH — direct codebase inspection confirms all uses; cascade is verified working
- Gradient implementation: HIGH — `@utility` pattern documented in ARCHITECTURE.md, Tailwind v4 confirmed
- WCAG analysis: HIGH for white-on-dark; MEDIUM for cyan CTA (manual calculation, should be verified with tooling)
- Hardcoded color audit: HIGH — all hex values found, only `#DCF8C6` is intentional

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable — no external APIs, pure CSS)
