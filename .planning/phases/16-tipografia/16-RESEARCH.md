# Phase 16: Tipografia - Research

**Researched:** 2026-03-24
**Domain:** Web font swap (@nuxt/fonts), CSS typography tokens, CLS measurement
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Font swap
- **D-01:** Fonte principal muda de Inter para Plus Jakarta Sans (Google Fonts, variable font, pesos 200-800)
- **D-02:** Token `--font-family-sans` em main.css atualizado para `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **D-03:** `nuxt.config.ts` fonts.families deve ser atualizado simultaneamente com o token CSS para evitar double-load (carregar Inter + Jakarta)
- **D-04:** Inter deve ser completamente removido — zero downloads no painel Network

#### Hierarquia tipografica
- **D-05:** h1 (hero headline): font-weight 700 (bold), tracking tighter (-0.025em) para impacto premium
- **D-06:** h2 (section titles): font-weight 600 (semibold), tracking tighter (-0.015em)
- **D-07:** h3 (card titles, subsections): font-weight 500 (medium), tracking normal
- **D-08:** Body text: font-weight 400 (regular), tracking normal — manter legibilidade igual ao Inter
- **D-09:** Tamanhos de heading podem ser aumentados se necessario para impacto (ex: hero h1 de text-4xl para text-5xl em desktop)

#### Performance
- **D-10:** CLS < 0.1 obrigatorio em `nuxt preview` (nao dev server) verificado via Lighthouse
- **D-11:** @nuxt/fonts gera metricas de fallback automaticamente — nao precisa de font-display manual

### Claude's Discretion
- Tamanhos exatos de heading (text-3xl, text-4xl, text-5xl) — desde que crie hierarquia clara
- Ajustes de line-height se necessario para Plus Jakarta Sans
- Se algum componente precisa de peso diferente para contraste visual

### Deferred Ideas (OUT OF SCOPE)
- Playfair Display serif para headings — descartado para v1.6, pode ser explorado em milestone futuro
- Font weight variations per section (ex: hero extra-bold 800) — simplificar agora, iterar depois se necessario
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TIPO-01 | Plus Jakarta Sans substitui Inter como fonte principal em toda a LP | `fonts.families` config + `@theme` token swap; both files must change atomically |
| TIPO-02 | Hierarquia tipografica aprimorada (pesos e tamanhos de heading mais impactantes) | Per-component Tailwind class audit across 10 components; decisions D-05 through D-09 provide exact values |
| TIPO-03 | CLS < 0.1 apos troca de fonte (verificado via Lighthouse) | @nuxt/fonts fallback metric generation; verified via `nuxt preview` + Lighthouse (not dev server) |
</phase_requirements>

---

## Summary

Phase 16 is a contained, two-file configuration change (nuxt.config.ts + main.css) combined with targeted Tailwind class updates across 10 components. No new npm packages are needed — `@nuxt/fonts` is already bundled via `@nuxt/ui` v4 and is the correct mechanism for adding Plus Jakarta Sans.

The single biggest risk is Pitfall V3 (font double-load): if `nuxt.config.ts` fonts.families is not updated in the same commit as the `@theme` CSS token, either Inter continues downloading alongside Plus Jakarta Sans, or Plus Jakarta Sans loads without @nuxt/fonts generating CLS-prevention fallback metrics. The double-load scenario is observable via the Network tab; the missing-fallback scenario only shows up as a CLS regression in Lighthouse on `nuxt preview`.

The typography hierarchy update (D-05 through D-09) requires auditing all heading elements across 10 components. The grep audit below shows the current state: h2 elements use `text-2xl md:text-3xl font-bold`, h1 in hero uses `text-3xl md:text-5xl font-bold`. Each heading level needs its weight and tracking adjusted per decisions.

**Primary recommendation:** Update `nuxt.config.ts` and `main.css` atomically in one task. Then in a second task sweep all 10 components to apply the hierarchy decisions. Verify CLS via `nuxt preview` + Lighthouse as the phase exit gate.

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @nuxt/fonts | ^1.x (bundled via @nuxt/ui) | Font loading, @font-face generation, fallback metrics | Zero-config; generates `size-adjust`/`ascent-override` fallback rules that prevent CLS; bundled with @nuxt/ui v4 |
| Tailwind CSS | ^4.2.2 (managed by @nuxt/ui) | tracking-* and font-weight utilities | Native tracking utilities: `tracking-tighter` = -0.05em, so use `tracking-tight` (-0.025em) or arbitrary `tracking-[-0.025em]` |
| Plus Jakarta Sans | via Google Fonts | Display/body font | Geometric, premium, humanist warmth; weights 200–800 available as variable font; similar x-height to Inter minimizes CLS |

**Installation: No new packages needed.**

```bash
# Nothing to install — @nuxt/fonts already bundled with @nuxt/ui v4
# Configuration only:
# 1. nuxt.config.ts — add fonts.families
# 2. app/assets/css/main.css — update --font-family-sans token
```

### Version Verification

Current package.json dependencies (from STACK.md):
- `@nuxt/ui`: ^4.5.1 — bundles @nuxt/fonts ^1.x
- `nuxt`: ^4.4.2

No version changes required for this phase.

---

## Architecture Patterns

### Current State (what exists in the codebase)

**`app/assets/css/main.css` — line 17 (current):**
```css
@theme {
  --font-family-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**`nuxt.config.ts` — current state:**
No explicit `fonts.families` configuration — Inter is loaded implicitly via Nuxt UI v4 defaults.

**Component heading pattern (current, confirmed by grep):**
- h1 (SectionHero): `text-3xl md:text-5xl font-bold` — no tracking
- h2 (all sections): `text-2xl md:text-3xl font-bold` — no tracking
- h3 (card titles): `text-base font-bold` — no tracking or weight variation

### Pattern 1: Atomic Font Swap (nuxt.config.ts + main.css in same commit)

**What:** Update both the `fonts.families` configuration and the CSS token simultaneously.
**When to use:** Always — never update one without the other.

```typescript
// nuxt.config.ts — ADD fonts section
export default defineNuxtConfig({
  // ... existing config unchanged ...

  fonts: {
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
      }
    ]
  },
})
```

```css
/* app/assets/css/main.css — UPDATE @theme token */
@theme {
  /* ... existing color tokens unchanged ... */

  /* Typography — updated from Inter to Plus Jakarta Sans (D-02) */
  --font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Why both must change together:** @nuxt/fonts only generates fallback metrics (size-adjust, ascent-override) for fonts declared in its configuration. A font added only in @theme is downloaded as a raw web font with no metrics optimization — this causes CLS > 0.1. Conversely, a font in nuxt.config.ts but not in @theme still generates metrics but the browser never uses Plus Jakarta Sans as the CSS font-family.

**Note on weights:** Only declare weights that are actually used. D-05 through D-08 use 400, 500, 600, 700. Do NOT add 800 (extra-bold) — it was deferred to scope.

### Pattern 2: Tailwind Tracking Values for Decisions

The decisions specify exact tracking values. Tailwind v4 has these built-in utilities:

| Decision | Required Value | Tailwind Class | Notes |
|----------|---------------|----------------|-------|
| D-05 (h1) | -0.025em | `tracking-tight` | Tailwind `tight` = -0.025em — exact match |
| D-06 (h2) | -0.015em | `tracking-[-0.015em]` | No built-in class for -0.015em; use arbitrary value |
| D-07 (h3) | normal | `tracking-normal` | Tailwind default |
| D-08 (body) | normal | `tracking-normal` (or omit) | Already default |

**Tailwind v4 built-in tracking scale for reference:**
- `tracking-tighter`: -0.05em
- `tracking-tight`: -0.025em (matches D-05)
- `tracking-normal`: 0em
- `tracking-wide`: 0.025em
- `tracking-wider`: 0.05em
- `tracking-widest`: 0.1em

### Pattern 3: Component Heading Inventory (what to change)

Based on the grep audit of all 10 components, here is the full heading inventory:

**SectionHero.vue** — h1:
- Current: `text-3xl md:text-5xl font-bold text-white leading-tight`
- Target: Add `tracking-tight` (D-05 — h1 gets -0.025em)
- Size: already `md:text-5xl` — meets D-09 goal for hero

**SectionAbout.vue** — h2 + h3:
- h2 current: `text-2xl md:text-3xl font-bold`
- h2 target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06 — semibold not bold, add tracking)
- h3 current: `text-base font-bold`
- h3 target: `text-base font-medium` (D-07 — medium not bold, no tracking change needed)

**SectionProgramContent.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06)

**SectionForWhom.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06)

**SectionMethod.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06)

**SectionSocialProof.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06)

**SectionPrice.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold text-white`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-white` (D-06)

**SectionFAQ.vue** — h2:
- Current: `text-2xl md:text-3xl font-bold`
- Target: `text-2xl md:text-3xl font-semibold tracking-[-0.015em]` (D-06)

**SectionLeadForm.vue** — h2:
- Current: `text-2xl font-bold text-white`
- Target: `text-2xl font-semibold tracking-[-0.015em] text-white` (D-06)

**AppHeader.vue** — no h1/h2/h3 headings; mobile menu title uses `font-bold` — not a heading element, no change needed.

### Recommended Task Split

**Task 1 (config + token):** Update `nuxt.config.ts` and `app/assets/css/main.css` atomically.
**Task 2 (components):** Apply weight and tracking classes across all heading elements in the 10 components listed above.
**Verification:** Run `nuxt build && nuxt preview` then Lighthouse → confirm CLS < 0.1 and Inter absent from Network.

### Anti-Patterns to Avoid

- **Updating only main.css without nuxt.config.ts:** @nuxt/fonts will not generate fallback metrics for Plus Jakarta Sans. CLS will be > 0.1.
- **Keeping Inter in fonts.families:** Even with `--font-family-sans` pointing to Plus Jakarta Sans, Inter will still be downloaded as a network request if it remains in the fonts module config.
- **Adding weight 800:** Deferred to scope. Do not add `800` to the weights array — it downloads an extra 30–50 KB of font data without a committed use case.
- **Applying tracking on body text (D-08):** Body copy should NOT get tracking-tight. Only headings get tighter tracking per the decisions.
- **Testing CLS on dev server:** Nuxt dev server uses Vite HMR and does not apply font-display optimizations. CLS must be measured on `nuxt preview` (production-equivalent build).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading with CLS prevention | Manual @font-face + font-display in CSS | @nuxt/fonts via `fonts.families` | @nuxt/fonts generates `size-adjust` and `ascent-override` fallback metrics automatically; hand-rolled @font-face skips this entirely |
| Font fallback metrics | Fontaine or manual metric calculation | @nuxt/fonts built-in | @nuxt/fonts includes Fontaine-equivalent metric generation since v1.x — no separate install needed |
| Google Fonts link tag | `<link rel="stylesheet" href="fonts.googleapis.com/...">` in app.vue | `fonts.families` config | The link tag bypasses @nuxt/fonts optimization, causes additional round-trips, and does not generate CLS-prevention fallback rules |
| Inter removal | Commenting out the @theme token only | Remove from BOTH nuxt.config.ts AND @theme | Module-level removal stops the download; @theme removal stops CSS inheritance — both are required |

**Key insight:** The entire font infrastructure for CLS prevention exists in @nuxt/fonts already. The only work is configuration, not code.

---

## Common Pitfalls

### Pitfall 1: Font Double-Load (Pitfall V3 from project PITFALLS.md)
**What goes wrong:** If @theme CSS token is updated but `nuxt.config.ts` fonts.families is NOT updated (or still contains Inter), both Inter and Plus Jakarta Sans download. Network tab shows two font families. First load performance degrades 200–400 KB.
**Why it happens:** Developers assume @nuxt/fonts auto-detects fonts from @theme CSS. It does not — the module only serves fonts explicitly declared in `fonts.families`.
**How to avoid:** Single atomic commit updating both files. Verify in Network tab on first uncached load — only Plus Jakarta Sans @font-face requests should appear.
**Warning signs:** DevTools Network tab shows both `inter-*.woff2` and `plus-jakarta-sans-*.woff2` downloading on first load.

### Pitfall 2: CLS Without Fallback Metrics
**What goes wrong:** Even if only Plus Jakarta Sans loads (no double-load), if it was added only to `@theme` without `fonts.families`, there are no fallback metrics. The system font fallback (e.g., `-apple-system`) has different x-height than Plus Jakarta Sans. When the web font loads, text reflows — CLS jumps above 0.1.
**Why it happens:** @nuxt/fonts generates `size-adjust` and `ascent-override` CSS rules only for fonts in its configuration. Adding the font only in @theme skips this generation.
**How to avoid:** Always configure the font in `fonts.families`. Check compiled CSS for `size-adjust` on the fallback font-face rule after build.
**Warning signs:** Lighthouse CLS > 0.1 on `nuxt preview` even though only one font downloads.

### Pitfall 3: Testing CLS on Dev Server
**What goes wrong:** `nuxt dev` uses Vite HMR, which inlines styles differently than the production build. CLS measured on dev server is not representative. The project exit gate specifically requires `nuxt preview`.
**Why it happens:** Convenience — `nuxt dev` is the default workflow. Developers forget CLS behavior differs between dev and production rendering.
**How to avoid:** Run `pnpm run build && pnpm run preview` before running Lighthouse. The Lighthouse URL must be the preview server (e.g., `http://localhost:3000`), not the dev server.
**Warning signs:** CLS passes on dev but fails after deploy to production.

### Pitfall 4: Tracking Applied to Body Text
**What goes wrong:** A developer applies `tracking-tight` globally (e.g., on `html {}` or via a shared wrapper class) thinking it makes all text look more premium. Body text at 16px with -0.025em tracking becomes noticeably harder to read — especially at 400 weight on mobile.
**Why it happens:** Tracking-tighter for headings looks good and the pattern gets over-applied.
**How to avoid:** Tracking changes are applied per heading element class only, never globally. D-08 explicitly locks body text to tracking-normal.

### Pitfall 5: h3 Weight Confusion (font-medium vs font-bold)
**What goes wrong:** The current codebase uses `font-bold` on h3 card titles (SectionAbout.vue lines 27, 36, 45). D-07 specifies font-weight 500 (medium). Leaving `font-bold` on h3 elements maintains the old weight hierarchy where h2 and h3 look the same weight.
**Why it happens:** The grep shows h3 elements currently match h2 in weight — both use `font-bold`. The hierarchy refinement requires changing h3 to `font-medium`.
**How to avoid:** Component audit in Task 2 must explicitly change `font-bold` to `font-medium` on all h3 elements.

---

## Code Examples

### Config: fonts.families Declaration (nuxt.config.ts)
```typescript
// Source: https://fonts.nuxt.com/get-started/configuration (verified in project STACK.md)
// Add to existing nuxt.config.ts — only the fonts key is new
fonts: {
  families: [
    {
      name: 'Plus Jakarta Sans',
      provider: 'google',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    }
  ]
},
```

### Config: CSS Token Update (main.css)
```css
/* Source: decisions D-02 from CONTEXT.md */
/* Replace line 17 in app/assets/css/main.css */
@theme {
  /* ... all existing color tokens stay unchanged ... */

  /* Typography — Plus Jakarta Sans replaces Inter */
  --font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Component: h1 Heading Update (SectionHero.vue example)
```html
<!-- Source: decision D-05 from CONTEXT.md -->
<!-- Before -->
<h1 class="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">

<!-- After — add tracking-tight only -->
<h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
```

### Component: h2 Heading Update (pattern for all section h2s)
```html
<!-- Source: decision D-06 from CONTEXT.md -->
<!-- Before -->
<h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)]">

<!-- After — font-bold → font-semibold, add tracking-[-0.015em] -->
<h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-[var(--color-brand-primary)]">
```

### Component: h3 Heading Update (SectionAbout.vue card titles)
```html
<!-- Source: decision D-07 from CONTEXT.md -->
<!-- Before -->
<h3 class="text-base font-bold text-[var(--color-brand-primary)] mb-2">

<!-- After — font-bold → font-medium, tracking stays normal (omit tracking class) -->
<h3 class="text-base font-medium text-[var(--color-brand-primary)] mb-2">
```

### Verification: CLS Check Command
```bash
# Step 1: Build production bundle
pnpm run build

# Step 2: Start preview server
pnpm run preview

# Step 3: In a separate terminal or browser — run Lighthouse on the preview URL
# Open Chrome → DevTools → Lighthouse → Navigation → Mobile → Run audit
# Target: CLS < 0.1 in the Core Web Vitals section

# Step 4: Confirm Inter is absent from Network
# DevTools → Network → filter "woff2" or "font"
# Should see only plus-jakarta-sans-*.woff2 files, no inter-*.woff2
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual @font-face with font-display: swap | @nuxt/fonts with auto-generated fallback metrics (size-adjust, ascent-override) | Nuxt UI v4 / @nuxt/fonts v1 (Sep 2025) | Eliminates CLS from font swap without manual metric calculation |
| Google Fonts `<link>` tag in head | fonts.families config in nuxt.config.ts | @nuxt/fonts v1 | Preloading, self-hosting, and metrics optimization bundled automatically |
| Tailwind v3 tracking scale (limited) | Tailwind v4 supports arbitrary tracking values (`tracking-[-0.015em]`) | Tailwind v4 (Dec 2024) | No need for plugin or safelisting for custom tracking values |

**Deprecated/outdated:**
- `@nuxtjs/google-fonts`: Replaced by @nuxt/fonts. Do NOT install — it duplicates functionality and creates two competing font loaders.
- Manual `font-display: swap` in CSS: @nuxt/fonts sets this automatically. D-11 confirmed: no manual font-display needed.
- `Inter` via Nuxt UI v4 default: Will be replaced by explicit `fonts.families` config pointing to Plus Jakarta Sans.

---

## Open Questions

1. **Does @nuxt/fonts support variable font subset for Plus Jakarta Sans?**
   - What we know: Plus Jakarta Sans is available as a variable font on Google Fonts (wght axis 200–800). @nuxt/fonts with `provider: 'google'` fetches from Google Fonts API.
   - What's unclear: Whether specifying `weights: [400, 500, 600, 700]` with the Google provider downloads 4 separate static font files or a single variable font subset. Variable font subset would be smaller.
   - Recommendation: Proceed with the `weights` array approach (proven pattern). If font size in the Network tab exceeds 100 KB total, investigate variable font axis subset syntax for Google provider.

2. **Line-height adjustments needed for Plus Jakarta Sans?**
   - What we know: Plus Jakarta Sans has slightly higher ascenders than Inter. D-11 (Claude's Discretion) allows line-height adjustments.
   - What's unclear: Whether the existing `leading-tight` on the hero h1 is appropriate for Plus Jakarta Sans or needs `leading-snug`.
   - Recommendation: Test visually on mobile after font swap. Adjust if headings feel cramped. No action needed in research — this is a visual discretion item.

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — Plus Jakarta Sans rationale, @nuxt/fonts config syntax, weights 200–800 confirmed, v1.6 typography section
- `.planning/research/PITFALLS.md` — Pitfall V3 (font double-load), Pitfall V4 (CLS from font swap), V3 "How to avoid" section
- `app/assets/css/main.css` — Current state: `--font-family-sans: 'Inter'` at line 17; html base rule at line 44
- `nuxt.config.ts` — Current state: no `fonts.families` section; modules array confirms @nuxt/ui installed

### Secondary (MEDIUM confidence)
- Component grep audit (all 10 components) — confirmed current heading class patterns and h3 font-bold usage
- `fonts.nuxt.com/get-started/configuration` (cited in STACK.md) — @nuxt/fonts families syntax verified

### Tertiary (LOW confidence)
- None required for this phase — all critical patterns verified via project source files and prior research.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — @nuxt/fonts config syntax verified in project STACK.md; Plus Jakarta Sans weight availability confirmed
- Architecture: HIGH — nuxt.config.ts and main.css current state directly inspected; all 10 component heading classes captured via grep
- Pitfalls: HIGH — V3 and V4 from project PITFALLS.md directly verified against current codebase

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable domain — @nuxt/fonts API not changing rapidly)
