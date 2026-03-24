# Stack Research

**Domain:** High-conversion landing page — miles/travel consultancy (Brazilian market)
**Researched:** 2026-03-21 (updated 2026-03-24 for v1.5 milestone)
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

## Installation

No new packages. Current installed versions are correct:

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
| Custom chat bubble (pure Tailwind) | DaisyUI chat component | Requires installing DaisyUI — full component library for one UI pattern; DaisyUI v5 also reworks Tailwind v4 integration and may conflict with Nuxt UI v4 |
| Custom chat bubble (pure Tailwind) | Flowbite chat bubble | Flowbite requires its own JS plugin; conflicts with Reka UI primitives already bundled in Nuxt UI v4 |
| v-html with static strings | DOMPurify / sanitize-html / vue-3-sanitize | Sanitizers are for user-generated content; hardcoded developer data needs no sanitization; DOMPurify adds ~17kb gzipped to client bundle for zero security benefit here |
| UIcon (existing @nuxt/ui) | Font Awesome / Lucide Vue | Already have 200,000+ icons via Iconify through @nuxt/ui; adding another icon library doubles icon bundle weight |
| Static pricing display | pricing-js / custom calculator | Price is fixed (R$ 299,90 / 10x R$ 29,99); no dynamic calculation needed |

---

## What NOT to Add for v1.5

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| DaisyUI | Conflicts with Nuxt UI v4's Tailwind v4 integration; adding two component systems creates CSS specificity battles | Custom components with Tailwind utilities |
| sanitize-html / DOMPurify | Overkill for developer-controlled static strings in v-html | Trust developer-authored HTML; use v-html directly |
| Any additional icon library | @nuxt/ui already bundles Iconify (200k+ icons) via @nuxt/icon | UIcon with i-heroicons-* or i-mdi-* prefix |
| vue-i18n or similar | No i18n requirement; LP is Portuguese-only | Hardcoded Portuguese strings |
| Any animation library (GSAP, Motion One) | Performance risk on mobile; LP already achieves conversion goals with static layout | Tailwind transition utilities for hover states only |

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
| zod ^3.x | Node.js 18+, TypeScript ^5 | Stable; v4 alpha exists but do NOT use in production (API still changing) |
| @fastify/mongodb ^3.x | fastify ^5.x, mongodb driver ^6.x | Use with official MongoDB Node.js driver ^6; not ^5 or ^4 |
| @fastify/rate-limit ^10.x | fastify ^5.x | Match major versions with Fastify |

---

## Sources

- https://github.com/nuxt/nuxt/releases — Nuxt version history (verified: v4.4.2 latest as of Mar 2026)
- https://github.com/nuxt/ui/releases — Nuxt UI version history (verified: v4.5.1 latest)
- https://endoflife.date/nuxt — EOL dates (Nuxt 3 security support until July 31, 2026)
- https://ui.nuxt.com/docs/getting-started/installation/nuxt — Official Nuxt UI v4 install guide
- https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind v4 release (v4.2.2 current)
- https://nuxtseo.com/docs/nuxt-seo/getting-started/introduction — @nuxtjs/seo documentation
- https://image.nuxt.com/providers/cloudflare — @nuxt/image Cloudflare provider
- https://github.com/fastify/fastify-mongodb — @fastify/mongodb official plugin
- https://tailwindflex.com/@simon-scheffer/whatsapp-like-chat-design — WhatsApp chat bubble pattern (CSS triangle via Tailwind)
- https://vuejs.org/guide/best-practices/security.html — Vue official security guide (v-html safety rules)
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns

---

*Stack research for: Fly Up Milhas — high-conversion landing page*
*Originally researched: 2026-03-21 | Updated for v1.5 milestone: 2026-03-24*
