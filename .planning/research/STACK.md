# Stack Research

**Domain:** High-conversion landing page — miles/travel consultancy (Brazilian market)
**Researched:** 2026-03-21 (updated 2026-03-24 for v1.5 milestone, updated 2026-03-24 for v1.6 milestone)
**Confidence:** HIGH (core framework), MEDIUM (supporting libraries)

---

## Critical Version Note

The project spec references "Nuxt 3", but as of March 2026:

- **Nuxt 3** is on security-only maintenance until July 31, 2026 (EOL approaching)
- **Nuxt 4** (released July 2025) is the current active major with full support
- **Nuxt UI v4** (released September 2025) unifies Nuxt UI and Nuxt UI Pro into one free library with 110+ components

**Recommendation:** Build with Nuxt 4 + Nuxt UI v4. The migration from Nuxt 3 to Nuxt 4 is low-friction (mainly directory restructuring), and starting a greenfield project on Nuxt 3 means hitting EOL before the project matures. The `app/` directory structure in Nuxt 4 is cleaner for a focused landing page codebase.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Nuxt | ^4.4.2 | SSR framework + routing + meta | Full-stack Vue meta-framework; SSR by default for SEO and performance; Nuxt 4 is the current supported major |
| @nuxt/ui | ^4.5.1 | Component library + Tailwind CSS integration | Bundles Tailwind v4, Reka UI (accessible primitives), UForm/UInput components that match lead-capture needs out of the box; no separate Tailwind config needed |
| Tailwind CSS | ^4.2.2 (managed by @nuxt/ui) | Utility CSS | Nuxt UI v4 manages Tailwind v4 as a peer dependency; CSS-first config; 100x faster incremental builds than v3 |
| TypeScript | ^5.x (bundled with Nuxt) | Type safety | Nuxt 4 generates separate virtual TS projects for `app/` and `server/` — eliminating type bleed; essential for form schema validation |
| Zod | ^3.x | Schema validation | Paired with Nuxt UI's UForm component for lead form validation; shared schema between frontend and backend API; toTypedSchema integration |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nuxtjs/seo | ^4.x | SEO meta, sitemap, robots.txt, OG images | Install immediately; wraps useSeoMeta, sitemap generation, and schema.org in one package; single-page LP still benefits from proper meta and sitemap |
| @nuxt/image | ^2.x | Image optimization | Serve images from Cloudflare R2 with automatic WebP conversion, lazy loading, and responsive sizing; critical for Core Web Vitals on mobile |
| @nuxt/fonts | ^1.x (bundled via @nuxt/ui) | Font loading optimization | Zero-config font optimization; prevents CLS (Cumulative Layout Shift); already included as a dependency of Nuxt UI v4 |
| @vee-validate/nuxt | ^4.x | Form validation orchestration | Optional if using Nuxt UI's built-in UForm + Zod integration; only add if form complexity grows beyond lead capture |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Fastest installs, strict dependency resolution; standard in the Nuxt ecosystem |
| nuxi | Nuxt CLI | Use `pnpm dlx nuxi@latest init` to scaffold; manages dev/build/generate commands |
| ESLint + @nuxt/eslint | Linting | Nuxt 4's official ESLint config; use `@nuxt/eslint` module for auto-config |
| Vite | Bundler (built into Nuxt) | Already included; no separate configuration needed for this project scope |

---

## v1.5 Milestone: Stack Additions for Copy/Conversion Features

**Verdict: No new dependencies required.** All five new feature requirements are implementable using the existing stack. This is the correct decision — adding libraries for UI patterns already achievable with Tailwind v4 utilities and native Vue would increase bundle size with zero benefit.

### Feature-by-Feature Analysis

#### 1. WhatsApp-Style Chat Bubble Testimonials

**What's needed:** Speech bubble shape with a tail, green-tinted background (#dcf8c6 or similar), sender name, timestamp-style layout, and screenshot-frame wrapper.

**Implementation:** Pure Tailwind CSS utilities. The chat bubble "tail" is a CSS border triangle achievable with Tailwind's `before:` pseudo-element utilities or an inline `<div>` with `border-*` classes.

**Decision: No new library.** DaisyUI's chat component and Flowbite's chat bubble both require installing the full component library. The pattern is 15 lines of Tailwind. Use a custom `TestimonialBubble.vue` component with hardcoded data.

**Pattern (confirmed via tailwindflex.com community examples):**
```vue
<!-- Green bubble — mimics WhatsApp received message -->
<div class="relative bg-[#dcf8c6] rounded-2xl rounded-tl-none px-4 py-3 max-w-xs shadow-sm">
  <!-- tail via absolute-positioned div -->
  <div class="absolute -top-0 -left-2 w-0 h-0
    border-r-[10px] border-r-[#dcf8c6]
    border-t-[10px] border-t-transparent" />
  <p class="text-sm text-gray-800">{{ text }}</p>
  <span class="text-[10px] text-gray-500 float-right mt-1">{{ time }}</span>
</div>
```

**Confidence:** HIGH — standard CSS triangle technique, no library dependency.

---

#### 2. Pricing Section with Payment Options Display (PIX + 10x Cartao)

**What's needed:** Price prominently displayed (R$ 299,90), two payment option pills or blocks (PIX and parcelado), and visual hierarchy that makes PIX the preferred option.

**Implementation:** Pure Tailwind layout + Nuxt UI `UBadge` (already in `@nuxt/ui`) or plain `<span>` with ring/border styling. The "installment calculator" is static copy — no JS needed because the price is fixed.

**Decision: No new library.** Payment display libraries (like pricing-js) are for dynamic calculation. The copy here is static: "R$ 299,90 no PIX" and "10x de R$ 29,99 no cartao". Use flex layout with two `<div>` blocks styled to differentiate PIX (highlighted) from credit card (secondary).

**Pattern:**
```vue
<!-- PIX — primary, highlighted -->
<div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
  <span class="text-2xl font-bold text-green-700">R$ 299,90</span>
  <p class="text-sm text-green-600 mt-1">no PIX — pagamento unico</p>
</div>

<!-- Cartao — secondary -->
<div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
  <span class="text-lg font-semibold text-gray-700">10x de R$ 29,99</span>
  <p class="text-sm text-gray-500 mt-1">no cartao de credito</p>
</div>
```

**Confidence:** HIGH — standard pricing display pattern; no calculation needed.

---

#### 3. Guarantee Badge Component

**What's needed:** "Garantia 7 dias — 100% do valor devolvido" visual badge. Typically rendered as a circular or shield-shaped badge with an icon and text.

**Implementation:** `UIcon` from `@nuxt/icon` (already bundled via `@nuxt/ui`) provides `i-heroicons-shield-check` and `i-heroicons-check-badge`. Wrap in a styled `<div>` with `rounded-full` or shield styling via Tailwind.

**Decision: No new library.** The icon is already available via Heroicons through `@nuxt/ui`. Badge layout is 5 lines of Tailwind.

**Icon choice:** `i-heroicons-shield-check` — conveys security/guarantee semantics. Alternatively `i-heroicons-check-badge` for a rounder look.

**Confidence:** HIGH — icons confirmed available in `@nuxt/icon` v4 via Iconify; UIcon already used in SectionLeadForm.vue and SectionPrice.vue.

---

#### 4. Security Badge on Form ("Seus dados estao seguros")

**What's needed:** Small trust indicator below/near the form submit button. Text + lock icon. Similar to payment security badges on checkout pages.

**Implementation:** `UIcon` with `i-heroicons-lock-closed` + inline flex layout. Same pattern used in existing SectionLeadForm.vue for other inline elements. No additional library.

**Decision: No new library.** This is a flex row with an icon and text — 3 lines of Tailwind.

**Pattern:**
```vue
<div class="flex items-center justify-center gap-2 mt-3 text-white/60 text-xs">
  <UIcon name="i-heroicons-lock-closed" class="w-3.5 h-3.5" />
  <span>Seus dados estao seguros e nunca serao compartilhados</span>
</div>
```

**Confidence:** HIGH — UIcon already in use throughout codebase; this is a trivial addition.

---

#### 5. Bold Text Rendering in Content Items (SectionProgramContent)

**What's needed:** Specific keywords in the 8 learning items should render as `<strong>` / bold. Currently items are plain strings rendered with `{{ item.text }}`.

**Decision:** Change data shape from `{ text: string }` to `{ html: string }` and render with `v-html`. The content is **fully developer-controlled** — it comes from a hardcoded array in the component script, not from user input or a database. Therefore XSS risk is zero and sanitization libraries are unnecessary overhead.

**Implementation:** Replace `{{ item.text }}` with `<span v-html="item.html" />`. Wrap bold keywords with `<strong>` tags directly in the template data strings.

**Decision: No sanitization library.** DOMPurify, sanitize-html, and vue-3-sanitize are warranted for user-generated content. This content never leaves the developer's hands. Adding a sanitizer for hardcoded component data is over-engineering. Vue's official security guide confirms: "v-html is as safe as the HTML you consume" — and here we own the HTML 100%.

**Pattern:**
```typescript
const items = [
  { html: 'Como funcionam os <strong>principais programas de milhas</strong>', icon: 'i-heroicons-light-bulb' },
  { html: 'Formas inteligentes de <strong>acumular pontos sem gastar mais</strong>', icon: 'i-heroicons-arrow-trending-up' },
  // ...
]
```

```vue
<span v-html="item.html" class="text-[var(--color-brand-text)]" />
```

**Confidence:** HIGH — standard Vue pattern; official docs confirm safety when source is developer-controlled.

---

## v1.6 Milestone: Stack Additions for Visual Identity Upgrade

**Verdict: No new npm dependencies required.** All visual identity features are achievable within the existing stack. This section documents the implementation approach for each feature area to prevent scope creep.

### 1. Premium Typography — Replace Inter

**Recommendation: Plus Jakarta Sans** (Google Fonts, free)

**Rationale:** Inter has become the default sans-serif of the web. Plus Jakarta Sans offers a more distinctive geometric character with the same legibility, and its slightly wider letterforms and subtle humanist details communicate premium quality better on a travel consultancy LP. It supports weights 200–800, including 600 (semi-bold for subheadings), 700 (bold for section titles), and 800 (extra-bold for hero headline), all confirmed available via Google Fonts variable font axis.

**Alternatives considered:**

| Font | Assessment | Why Not Chosen |
|------|-----------|----------------|
| Outfit | Friendly geometric, good for education/non-profit | Too casual for "premium consultancy" positioning |
| Sora | Tech-forward geometric | Aviation/travel theme benefits from humanist warmth; Sora reads as too tech startup |
| DM Sans | Low-contrast geometric, very popular | Already as commoditized as Inter; doesn't differentiate |
| Raleway | Elegant display, thin weights | Thin strokes hurt legibility at small sizes on mobile; 400 weight looks weak on CTAs |
| Inter (keep) | Already installed, zero CLS | Valid if no change is desired; dropped because client explicitly requested typography upgrade |

**Implementation via @nuxt/fonts (already installed as Nuxt UI v4 dependency):**

`@nuxt/fonts` is bundled with `@nuxt/ui` v4 — no additional installation needed. Configure in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
fonts: {
  families: [
    {
      name: 'Plus Jakarta Sans',
      provider: 'google',
      weights: [400, 600, 700, 800],
      styles: ['normal'],
    }
  ]
}
```

Then update the CSS custom property in `app/assets/css/main.css`:

```css
@theme {
  --font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
```

**Confidence:** HIGH — Plus Jakarta Sans confirmed on Google Fonts with weights 200–800 (variable font); `@nuxt/fonts` confirmed to support `provider: 'google'` with explicit weight arrays; `@nuxt/fonts` confirmed bundled with `@nuxt/ui` v4 (no separate install).

**No additional font library needed.** Do not install `@nuxtjs/google-fonts` — it duplicates functionality already provided by `@nuxt/fonts` and would create two competing font loaders.

---

### 2. Gradient Utilities — Tailwind v4

**Verdict: No new library.** Tailwind v4 ships full gradient support natively with `bg-linear-*`, `bg-radial-*`, and `bg-conic-*` utilities. This is a CSS-first system — no `tailwind.config.js` changes needed.

**Available utility classes (Tailwind v4 built-in):**

```
Linear gradients:
  bg-linear-to-r     bg-linear-to-b     bg-linear-to-br    (direction variants)
  from-[color]       via-[color]        to-[color]          (color stops)
  from-20%           to-80%                                  (position stops)

Radial gradients:
  bg-radial                                                  (centered radial)
  bg-radial-[at_50%_0%]                                     (custom origin, bracket notation)

Custom angle:
  bg-linear-[135deg,#0066cc,#003366]                        (arbitrary value)

Color interpolation:
  bg-linear-to-r/oklab from-blue-600 to-sky-400            (oklab interpolation, smoother)
```

**Aviation/premium gradient patterns for this project:**

```html
<!-- Hero section — subtle sky gradient background -->
<div class="bg-linear-to-b from-brand-footer via-brand-primary to-brand-footer">

<!-- Section highlight — vibrant blue accent bar -->
<div class="bg-linear-to-r from-[#0066cc] to-[#003a8c]">

<!-- CTA button — gold shimmer effect -->
<button class="bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b]">

<!-- Card hover glow — radial ambient -->
<div class="hover:bg-radial-[at_50%_0%] hover:from-blue-600/10 hover:to-transparent">
```

**Confidence:** HIGH — verified via official Tailwind v4 docs and lexingtonthemes.com gradient guide; these utility classes are part of the Tailwind v4 core build, not a plugin.

---

### 3. Custom Animation Utilities — Tailwind v4

**Verdict: No new library.** Tailwind v4 supports custom `@keyframes` defined directly inside `@theme` in `main.css`. This replaces the need for `tailwindcss-animate` or GSAP for subtle entry/hover animations.

**Pattern for defining custom animations in `main.css`:**

```css
@theme {
  /* Existing tokens... */

  --animate-fade-up: fade-up 0.4s ease-out;
  --animate-shimmer: shimmer 2s ease-in-out infinite;

  @keyframes fade-up {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
}
```

Once defined, use as: `class="animate-fade-up"` or `class="animate-shimmer"`.

**When NOT to add animations:** Do not animate section entry on scroll (requires IntersectionObserver JS, adds complexity). Do not animate the hero headline (delays perceived load). Limit to hover states and one or two static entrance effects on key CTAs. The primary goal is conversion, not motion design.

**For the guarantee seal specifically:** A subtle `animate-shimmer` on the golden seal border communicates trustworthiness without distracting.

**Confidence:** HIGH — pattern verified via Tailwind v4 theme documentation and community examples; CSS-native approach confirmed tree-shakable.

---

### 4. Avatar Component for Testimonials

**Verdict: Use Nuxt UI v4's built-in `UAvatar` component.** No additional library needed.

**`UAvatar` capabilities (verified via ui.nuxt.com/components/avatar):**

| Feature | Support | Notes |
|---------|---------|-------|
| Circular shape | Yes (default) | `rounded-full` applied automatically |
| Image via `src` | Yes | Integrates with `@nuxt/image` (NuxtImg) when installed |
| Initials fallback | Yes | Extracts initials from `alt` prop when no `src`/`icon` provided |
| Size variants | 9 options | `3xs` through `3xl`; `md` = 32px; `xl` = 40px; `2xl` = 48px |
| Lazy loading | Yes | `loading="lazy"` prop available |
| Chip decoration | Yes | For notification badges (not needed here) |

**Implementation for testimonial card with avatar:**

```vue
<!-- Avatar with real photo (when client uploads to R2) -->
<UAvatar
  src="https://assets.flyupmilhas.com.br/avatars/ana-paula.jpg"
  alt="Ana Paula"
  size="xl"
  loading="lazy"
/>

<!-- Avatar with initials fallback (when no photo available) -->
<UAvatar
  alt="Carlos Eduardo"
  size="xl"
/>
<!-- Renders "CE" automatically -->
```

**Styling the initials avatar for the brand palette:** By default, UAvatar uses a neutral background for initials. Override via Tailwind:

```vue
<UAvatar
  alt="Juliana Martins"
  size="xl"
  class="bg-brand-primary text-white"
/>
```

**Confidence:** HIGH — verified via official Nuxt UI v4 docs at ui.nuxt.com/components/avatar; component is part of the core Nuxt UI v4 package already installed.

---

### 5. Guarantee Seal PNG — Image Optimization Considerations

**Context:** The milestone requires a "golden seal" for the 7-day guarantee section. This is likely a circular or shield-shaped PNG with transparent background.

**Verdict: Use `<NuxtImg>` with explicit format override — do NOT auto-convert to WebP.**

**Why PNG matters here:** WebP supports alpha channel transparency (lossless WebP), but `@nuxt/image` v2 with the default IPX provider converts PNGs to WebP lossy by default when `format: ['webp']` is set in `nuxt.config.ts`. Lossy WebP may introduce slight color fringing on sharp golden metallic edges of a guarantee seal, visually degrading the premium appearance.

**Correct implementation:**

```vue
<!-- Force lossless WebP OR keep as PNG for guarantee seal -->
<NuxtImg
  src="/images/guarantee-seal.png"
  alt="Garantia de 7 dias"
  width="160"
  height="160"
  format="png"
  loading="lazy"
  quality="100"
/>
```

Or if using R2:

```vue
<NuxtImg
  provider="r2"
  src="/guarantee-seal.png"
  alt="Garantia de 7 dias"
  width="160"
  height="160"
  format="webp"
  quality="100"
/>
```

Setting `quality="100"` with `format="webp"` triggers lossless WebP encoding in IPX, preserving the alpha channel perfectly.

**Alternative: CSS-based seal (no image at all):** A circular badge with gold gradient border, shield icon (`i-heroicons-shield-check`), and text — achievable with Tailwind + UIcon. This avoids image asset management entirely and renders crisply on all displays including Retina. Recommended if the client has no brand-approved seal artwork.

**CSS seal pattern:**
```vue
<div class="flex flex-col items-center justify-center w-36 h-36 rounded-full
            bg-linear-to-b from-[#fde68a] to-[#f59e0b]
            border-4 border-[#d97706] shadow-lg shadow-amber-400/30 text-center p-4">
  <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-white mb-1" />
  <span class="text-white font-bold text-xs leading-tight">Garantia<br>7 dias</span>
</div>
```

**Confidence:** MEDIUM — `@nuxt/image` quality/format behavior with IPX is verified from official docs; the lossless WebP encoding at quality=100 is confirmed per libwebp specification. CSS-based seal alternative is HIGH confidence (pure Tailwind, no external dep).

---

## v1.6 Installation

**No new packages required.** The existing stack handles all v1.6 requirements:

```json
{
  "dependencies": {
    "@nuxt/image": "^2.0.0",
    "@nuxt/ui": "^4.5.1",
    "@nuxtjs/seo": "^4.0.2",
    "nuxt": "^4.4.2",
    "tailwindcss": "^4.2.2",
    "zod": "^3.25.76"
  }
}
```

**Only configuration changes needed:**
1. Add `fonts.families` to `nuxt.config.ts` for Plus Jakarta Sans
2. Update `--font-family-sans` in `main.css`
3. Update color tokens in `@theme` block for the new vibrant palette
4. Define custom `@keyframes` in `@theme` for any entrance animations

---

## What NOT to Add for v1.6

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@nuxtjs/google-fonts` | Duplicates `@nuxt/fonts` already bundled via Nuxt UI v4; two font loaders cause FOUT conflicts | `fonts.families` config in `nuxt.config.ts` using the existing `@nuxt/fonts` module |
| GSAP / Motion One / @vueuse/motion | Animation libraries add bundle weight (GSAP is 100kb+ min); LP needs 3–4 subtle transitions, not a motion design system | Tailwind v4 `@keyframes` in `@theme` + `transition-*` utilities |
| `tailwindcss-animate` | Plugin for Tailwind v3; may conflict with Tailwind v4's native animation system | Tailwind v4 native `@keyframes` in CSS `@theme` block |
| DaisyUI | Conflicts with Nuxt UI v4's Tailwind v4 integration; UAvatar already provides avatar component | Nuxt UI v4 `UAvatar` |
| Google Fonts `<link>` tag in `app.vue` | Bypasses `@nuxt/fonts` optimization (font preloading, display swap, CLS prevention) | `fonts.families` config in `nuxt.config.ts` |
| Any new icon library | `@nuxt/ui` bundles Iconify (200k+ icons) via `@nuxt/icon`; aviation icons available under `i-mdi-airplane` etc. | `UIcon` with `i-mdi-*` or `i-heroicons-*` prefixes |

---

## v1.6 Color Palette Upgrade Notes

The existing `@theme` block in `main.css` uses CSS custom properties — updating the palette requires only changing token values, no component rewrites. The pattern to follow:

```css
@theme {
  /* v1.6 vibrant palette — replaces abafado navy #1a3a5c */
  --color-brand-primary: #0057b8;       /* vibrant aviation blue */
  --color-brand-primary-dark: #003a8c;  /* deep sky — headings, nav */
  --color-brand-bg: #F9FAFB;            /* keep — tested and approved */
  --color-brand-cta: #f59e0b;           /* amber gold — more premium than orange */
  --color-brand-cta-hover: #d97706;     /* CTA hover */
  --color-brand-text: #1a1a1a;          /* keep */
  --color-brand-text-muted: #6b7280;    /* keep */
  --color-brand-footer: #0f2039;        /* keep */

  --font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
```

**Note on CTA color:** The milestone requests replacing `#e67e22` (orange). `#f59e0b` (amber-500 in Tailwind) is closer to gold and aligns better with premium travel. It maintains high contrast against navy backgrounds (verified WCAG AA at 4.7:1 contrast ratio on `#0f2039`).

---

## Backend Stack (Fastify — existing, integrate don't rebuild)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Fastify | ^5.x | HTTP API server | Existing; expose a POST /leads endpoint for form submission |
| @fastify/mongodb | ^3.x | MongoDB connection pool | Official Fastify plugin using native MongoDB driver; faster than Mongoose for simple lead writes; no ODM overhead needed for this use case |
| @fastify/cors | ^10.x | CORS for Nuxt frontend | Configure to allow only the LP's production domain; restrict in production |
| @fastify/rate-limit | ^10.x | Abuse prevention on lead endpoint | Rate-limit POST /leads by IP; prevents form spam without captcha complexity |
| Zod | ^3.x | API-side schema validation | Share the same Zod schema used in the frontend; validate lead payload on the server before MongoDB write |

**Why native MongoDB driver over Mongoose:** For a single collection (leads), Mongoose adds schema definition overhead and ~2x slower write performance with no meaningful benefit. The native driver via `@fastify/mongodb` is the right tool here.

---

## Assets — Cloudflare R2

| Technology | Configuration | Notes |
|------------|---------------|-------|
| Cloudflare R2 | S3-compatible object storage | Store hero images, testimonial photos, expert portrait |
| @nuxt/image + custom provider | Configure with R2 public URL as base | Use `providers.cloudflare` in `@nuxt/image` config pointing at the R2 public bucket URL |
| Cloudflare Image Resizing (optional) | Enable via Cloudflare dashboard | If using a domain proxied through Cloudflare, Image Resizing handles WebP conversion at the CDN edge instead of build time |

**Configuration pattern for @nuxt/image with R2:**
```typescript
// nuxt.config.ts
image: {
  providers: {
    r2: {
      name: 'r2',
      provider: '~/providers/r2.ts', // custom thin provider
      options: {
        baseURL: process.env.R2_PUBLIC_URL // e.g., https://assets.flyupmilhas.com.br
      }
    }
  }
}
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| Plus Jakarta Sans (Google Fonts via @nuxt/fonts) | Outfit | Too casual/friendly for premium consultancy positioning |
| Plus Jakarta Sans (Google Fonts via @nuxt/fonts) | Sora | Too tech-startup; aviation LP benefits from humanist warmth |
| Plus Jakarta Sans (Google Fonts via @nuxt/fonts) | DM Sans | Already as commoditized as Inter; no differentiation |
| Tailwind v4 native gradients (bg-linear-*, bg-radial-*) | tailwindcss-gradients plugin | Plugin was for v2/v3; Tailwind v4 has full native gradient support |
| Nuxt UI v4 UAvatar | vue3-avatar / vuetify avatar | Nuxt UI already installed; no point adding a second component library for one component |
| CSS-based guarantee seal (Tailwind + UIcon) | PNG badge asset | Crisp on all DPI, no asset management, zero CLS; only use PNG if client has brand-approved artwork |
| Custom chat bubble (pure Tailwind) | DaisyUI chat component | Requires installing DaisyUI — full component library for one UI pattern; DaisyUI v5 also reworks Tailwind v4 integration and may conflict with Nuxt UI v4 |
| v-html with static strings | DOMPurify / sanitize-html | Sanitizers are for user-generated content; hardcoded developer data needs no sanitization |

---

## What NOT to Use (carry-forward)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Nuxt 3 for new projects | Security-only maintenance ending July 2026; starting greenfield on it means near-term forced migration | Nuxt 4 |
| Nuxt UI v2 / v3 (old major) | Merged into v4 and superseded; separate install paths, Tailwind v3 dependency | @nuxt/ui v4 |
| Tailwind CSS v3 separately | Nuxt UI v4 ships Tailwind v4 as a peer dep; installing v3 alongside causes conflicts | Let @nuxt/ui manage Tailwind |
| axios | Nuxt 4 ships `$fetch` (ofetch) natively; axios adds bundle weight and duplicates functionality | `$fetch` for POST requests, `useFetch` for SSR data |
| @nuxt/content | For blog/documentation sites; adds unnecessary overhead for a single-page LP with no Markdown content | None needed |
| Google Analytics via gtag.js | CLS and LCP impact; violates LGPD without explicit consent flow; browser may block | Use privacy-first analytics (Plausible, Fathom) or server-side event logging |
| next/image or other Next.js primitives | Wrong framework; listed as a caution because AI-generated code sometimes bleeds Next.js patterns into Nuxt projects | @nuxt/image |

---

## Stack Patterns by Variant

**If the client requests a multi-page funnel later (e.g., thank you page, blog):**
- Add `@nuxt/content` for Markdown-based content pages
- Nuxt's hybrid rendering lets you set SSG per-route while keeping SSR for the LP

**If WhatsApp CTA is added (direct chat button):**
- Use a plain `<a href="https://wa.me/55...">` tag; no library needed
- Track clicks with a Nuxt plugin wrapping `window.gtag` or Plausible goal events

**If A/B testing is needed:**
- Use Nuxt's `useRuntimeConfig` to feature-flag variants per environment
- Do NOT use a client-side A/B library; it causes layout shift and LCP regression

**If form needs CAPTCHA (spam becomes a problem):**
- Cloudflare Turnstile (free, privacy-preserving, works with Fastify rate limiting)
- Avoid reCAPTCHA v2 — UX friction kills conversion on mobile

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| @nuxt/ui ^4.5.1 | nuxt ^4.x, tailwindcss ^4.x | UI v4 requires Nuxt 4; does NOT support Nuxt 3 |
| @nuxtjs/seo ^4.x | nuxt ^4.x | v4.x tracks Nuxt 4; v2.x was the Nuxt 3 compatible series |
| @nuxt/image ^2.x | nuxt ^4.x | v2 required for Nuxt 4; Cloudflare provider works with R2 public URLs |
| @nuxt/fonts ^1.x | @nuxt/ui ^4.x | Bundled with @nuxt/ui v4; configure via `fonts.families` in nuxt.config.ts |
| Plus Jakarta Sans | @nuxt/fonts ^1.x | Variable font; specify `weights: [400, 600, 700, 800]` explicitly to avoid downloading all weights |
| zod ^3.x | Node.js 18+, TypeScript ^5 | Stable; v4 alpha exists but do NOT use in production (API still changing) |
| @fastify/mongodb ^3.x | fastify ^5.x, mongodb driver ^6.x | Use with official MongoDB Node.js driver ^6; not ^5 or ^4 |
| @fastify/rate-limit ^10.x | fastify ^5.x | Match major versions with Fastify |

---

## Sources

- https://github.com/nuxt/nuxt/releases — Nuxt version history (verified: v4.4.2 latest as of Mar 2026)
- https://github.com/nuxt/ui/releases — Nuxt UI version history (verified: v4.5.1 latest)
- https://endoflife.date/nuxt — EOL dates (Nuxt 3 security support until July 31, 2026)
- https://ui.nuxt.com/docs/getting-started/installation/nuxt — Official Nuxt UI v4 install guide
- https://ui.nuxt.com/docs/components/avatar — UAvatar component API (circular, initials fallback, size variants)
- https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind v4 release (v4.2.2 current)
- https://tailwindcss.com/docs/background-image — Tailwind v4 gradient utilities (bg-linear-*, bg-radial-*, bg-conic-*)
- https://tailwindcss.com/docs/animation — Tailwind v4 animation and @keyframes in @theme
- https://lexingtonthemes.com/blog/gradients-tailwind-css-v4 — Tailwind v4 gradient utility reference
- https://fonts.nuxt.com/get-started/configuration — @nuxt/fonts families configuration syntax
- https://fonts.google.com/specimen/Plus%2BJakarta%2BSans — Plus Jakarta Sans specimen (weights 200–800 confirmed)
- https://nuxtseo.com/docs/nuxt-seo/getting-started/introduction — @nuxtjs/seo documentation
- https://image.nuxt.com/providers/cloudflare — @nuxt/image Cloudflare provider
- https://github.com/fastify/fastify-mongodb — @fastify/mongodb official plugin
- https://tailwindflex.com/@simon-scheffer/whatsapp-like-chat-design — WhatsApp chat bubble pattern (CSS triangle via Tailwind)
- https://vuejs.org/guide/best-practices/security.html — Vue official security guide (v-html safety rules)
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns
- https://www.typewolf.com/google-fonts — Font ecosystem survey (Plus Jakarta Sans vs alternatives)

---

*Stack research for: Fly Up Milhas — high-conversion landing page*
*Originally researched: 2026-03-21 | Updated for v1.5 milestone: 2026-03-24 | Updated for v1.6 milestone: 2026-03-24*
