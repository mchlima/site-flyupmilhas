# Phase 1: Foundation & Infrastructure - Research

**Researched:** 2026-03-21
**Domain:** Nuxt 4 SSR scaffold + Cloudflare R2 image serving + Fastify backend endpoints + SEO meta layer
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Nuxt Version & Scaffold**
- D-01: Use Nuxt 4 (not Nuxt 3) — Nuxt 3 enters security-only maintenance ending July 2026, greenfield project should start on current major version
- D-02: Use `app/` directory structure (Nuxt 4 default) — `app/app.vue` as single entry point, no `pages/` directory needed for single-page LP
- D-03: Install Nuxt UI v4 (bundles Tailwind CSS v4) — do NOT install Tailwind separately, let Nuxt UI manage it
- D-04: Configure design tokens in CSS (Tailwind v4 is CSS-first, no `tailwind.config.js`) — set brand colors: azul aviacao (primary), branco gelo/cinza ultra claro (background), laranja/dourado (CTA accent)
- D-05: Typography: Inter font via `@fontsource/inter` or Google Fonts — fallback to system sans-serif

**R2 Asset Strategy**
- D-06: Reference R2 assets via absolute URL to public R2 bucket — no `@nuxt/image` custom provider needed for MVP
- D-07: Images should be pre-optimized (WebP format, appropriate dimensions) before upload to R2 — avoid runtime transformation dependency
- D-08: R2 bucket accessible via custom subdomain (e.g., `cdn.flyupmilhas.com`) configured in Cloudflare DNS

**Fastify Endpoint Contract**
- D-09: POST /leads endpoint accepts JSON body: `{ nome: string, whatsapp: string, gastoMensal: string, objetivo: "executiva" | "economia" | "renda-extra" }`
- D-10: Response: 200 `{ success: true, id: string }` on success, 400 on validation error, 429 on rate limit
- D-11: CORS via `@fastify/cors` with explicit origin whitelist (LP domain only)
- D-12: Rate limiting via `@fastify/rate-limit` — 5 requests per minute per IP on /leads endpoint
- D-13: Honeypot field: include `website` field in schema — if populated, reject silently (return 200 but don't store)

**Deployment Target**
- D-14: Deploy Nuxt to Cloudflare Pages with SSR (Nitro preset: `cloudflare_pages`)
- D-15: Fastify backend deployed separately (existing infrastructure — not part of this LP project scope)

**SEO & Performance Baseline**
- D-16: SEO via `@nuxtjs/seo` module — meta tags, Open Graph, structured data (LocalBusiness schema for consultoria)
- D-17: Performance target: LCP < 2s on mobile 3G, PageSpeed score 90+
- D-18: No analytics in Phase 1 — deferred to v2 (LGPD consent banner needed)

### Claude's Discretion
- Exact Nitro configuration details
- ESLint/Prettier setup
- Git hooks configuration
- Exact rate limit tuning beyond the 5/min baseline
- Loading/error page design for the scaffold phase

### Deferred Ideas (OUT OF SCOPE)
- LGPD consent banner — needed before any analytics/tracking (v2)
- Cloudflare Image Transformations — depends on Cloudflare plan tier, pre-optimize images for now
- WhatsApp Business API notification on lead submission — v2 feature
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFR-01 | Projeto Nuxt 4 com SSR configurado (nuxt.config.ts, Nuxt UI v4, design tokens) | Verified stack, correct nuxt.config.ts with `cloudflare_pages` preset and `app/` directory, Tailwind v4 CSS-first tokens |
| INFR-02 | Assets estaticos servidos via Cloudflare R2 (imagens otimizadas) | Decision D-06/D-07: absolute URLs, pre-optimize to WebP before upload; `<NuxtImg>` with external src for lazy loading |
| INFR-03 | SEO basico (meta tags, Open Graph, structured data para servico) | `@nuxtjs/seo` v4.0.2 + `nuxt-schema-org` v5.0.10; LocalBusiness schema via `useSchemaOrg`; `useSeoMeta` for OG tags |
| INFR-04 | Performance: LCP < 2s, pagina inteira < 3s em 3G | Hero image pre-optimization + `fetchpriority="high"` + Nitro edge caching + font optimization via `@nuxt/fonts` |
| BACK-01 | Endpoint Fastify POST /leads com validacao e armazenamento no MongoDB | Zod schema validation + `@fastify/mongodb` native driver; contract defined in D-09/D-10 |
| BACK-02 | CORS configurado no Fastify para dominio da LP | `@fastify/cors` v11.2.0 with explicit origin array; test from real browser on staging domain |
| BACK-03 | Rate limiting no endpoint de leads (@fastify/rate-limit) | `@fastify/rate-limit` v10.3.0; 5 req/min/IP on POST /leads route scope |
</phase_requirements>

---

## Summary

Phase 1 is a pure infrastructure phase — no user-visible content, no business copy. The output is a working SSR scaffold running on Cloudflare Pages with one placeholder page that demonstrates: (a) SSR working without hydration errors, (b) an R2-hosted image rendering correctly via `<NuxtImg>`, (c) the Fastify `/leads` endpoint responding to real CORS-compliant browser requests, and (d) SEO meta tags present in the page source. All architectural conventions are established here; later phases inherit them.

The most consequential decisions for the planner are: the Nuxt 4 `app/` directory layout is mandatory (not optional), the Nitro preset must be `cloudflare_pages` (underscore, not hyphen), `@nuxt/ui` v4 manages Tailwind v4 as a peer dep so Tailwind must not be installed separately, and CORS must be tested from an actual browser hitting the staging URL (not from `nuxt dev` where CORS is irrelevant). The Fastify backend is external and already deployed — only the `/leads` route needs to be created or confirmed.

For images, the locked decision (D-06/D-07) is to pre-optimize images to WebP before uploading to R2 and reference them via absolute URL. This avoids the Cloudflare Image Transformations plan-tier dependency entirely. The planner should treat image optimization as a content preparation task, not a runtime configuration task.

**Primary recommendation:** Scaffold with `pnpm dlx nuxi@latest init`, install `@nuxt/ui`, `@nuxtjs/seo`, `@nuxt/image`, configure `nuxt.config.ts` with the `cloudflare_pages` preset and `app/` directory, then validate the full pipeline with `nuxt build && nuxt preview` before declaring the phase done.

---

## Standard Stack

### Core (verified against npm registry, 2026-03-21)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| nuxt | 4.4.2 | SSR framework, Nitro server, auto-imports | Current supported major; Nuxt 3 EOL July 2026 |
| @nuxt/ui | 4.5.1 | Component library, Tailwind v4, Reka UI primitives | Bundles Tailwind v4 as peer dep; UForm + Zod integration; locked decision D-03 |
| @nuxtjs/seo | 4.0.2 | SEO meta, sitemap, robots.txt, schema.org graphs | Wraps `useSeoMeta`, auto-generates sitemap, includes `nuxt-schema-org` v5 |
| @nuxt/image | 2.0.0 | `<NuxtImg>` component with lazy loading, format hints | Handles lazy loading + `loading="eager"` / `fetchpriority="high"` attributes |
| zod | 3.24.x (latest 3.x) | Schema validation shared between frontend and Fastify | Paired with Nuxt UI UForm; v4 alpha exists — do NOT use |

### Fastify Backend

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| fastify | 5.8.2 | HTTP API server | Existing; only add `/leads` route |
| @fastify/mongodb | 10.0.0 | Native MongoDB driver plugin | No Mongoose; single collection, no ODM needed |
| @fastify/cors | 11.2.0 | CORS headers for LP domain | Explicit origin array, not wildcard |
| @fastify/rate-limit | 10.3.0 | IP-based rate limiting on /leads | Scoped to POST /leads route only |

> **Version correction:** Earlier research documents cited `@fastify/cors ^10.x` — the current published version is `11.2.0`. Use `11.2.0`.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Standard in Nuxt ecosystem |
| nuxi | Nuxt CLI | `pnpm dlx nuxi@latest init` |
| @nuxt/eslint | ESLint config | Install as Nuxt module, not standalone ESLint config |
| TypeScript | 5.x | Bundled with Nuxt; configure `strict: true` |

### Installation

```bash
# Scaffold
pnpm dlx nuxi@latest init site-flyupmilhas
cd site-flyupmilhas

# Nuxt UI (brings Tailwind v4, @nuxt/fonts, @nuxt/icon)
pnpm add @nuxt/ui

# SEO suite (brings nuxt-schema-org v5, nuxt-og-image, nuxt-sitemap, nuxt-robots)
pnpm add @nuxtjs/seo

# Image optimization (NuxtImg component)
pnpm add @nuxt/image

# Schema validation
pnpm add zod

# Dev tooling
pnpm add -D @nuxt/eslint eslint
```

```bash
# Fastify backend (add to existing Fastify project)
npm install @fastify/mongodb @fastify/cors @fastify/rate-limit zod
```

---

## Architecture Patterns

### Nuxt 4 Directory Structure (Mandatory)

```
site-flyupmilhas/
├── nuxt.config.ts              # Root — stays here
├── package.json
├── tsconfig.json
├── .env                        # NUXT_PUBLIC_API_BASE, etc.
│
├── app/                        # ALL application code lives here (Nuxt 4)
│   ├── app.vue                 # Root shell — no pages/ directory
│   ├── components/
│   │   ├── App/
│   │   │   ├── AppHeader.vue
│   │   │   └── AppFooter.vue
│   │   └── Section/
│   │       └── SectionPlaceholder.vue  # Phase 1: empty scaffold section
│   ├── composables/
│   │   └── useLeadForm.ts      # Stub — wire up in Phase 3
│   └── assets/
│       └── css/
│           └── main.css        # Tailwind base + brand tokens
│
├── public/
│   ├── favicon.ico
│   └── og-image.jpg            # 1200x630, pre-optimized WebP
│
└── server/                     # Nitro server — empty in Phase 1 unless proxy needed
```

**Critical:** In Nuxt 4, `app/` is the root for all application code. `nuxt.config.ts` stays at the project root. Do not put `nuxt.config.ts` inside `app/`.

### Pattern 1: nuxt.config.ts for Phase 1

```typescript
// nuxt.config.ts (project root)
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',  // Nuxt 4 baseline date

  future: {
    compatibilityVersion: 4,  // Enables app/ directory structure
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],

  ssr: true,  // Explicit; SSR is the default but make it visible

  nitro: {
    preset: 'cloudflare_pages',  // underscore, not hyphen
    prerender: {
      autoSubfolderIndex: false,  // Required for Cloudflare route matching
    },
  },

  site: {
    url: 'https://flyupmilhas.com.br',
    name: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
    defaultLocale: 'pt-BR',
  },

  runtimeConfig: {
    public: {
      apiBase: '',  // Override with NUXT_PUBLIC_API_BASE env var
      r2BaseUrl: '', // Override with NUXT_PUBLIC_R2_BASE_URL env var
    },
  },

  css: ['~/assets/css/main.css'],
})
```

### Pattern 2: Tailwind v4 CSS-First Design Tokens

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  /* Brand colors (Tailwind v4 CSS custom properties) */
  --color-brand-primary: #1a3a5c;    /* azul aviacao */
  --color-brand-bg: #f8f9fa;         /* branco gelo / cinza ultra claro */
  --color-brand-cta: #e67e22;        /* laranja/dourado — CTA accent */
  --color-brand-cta-hover: #d35400;

  /* Typography */
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

> **Note:** Tailwind v4 uses `@theme` block instead of `tailwind.config.js`. There is no JavaScript config file. All tokens are CSS custom properties.

### Pattern 3: SEO Meta + LocalBusiness Schema in app.vue

```vue
<!-- app/app.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
  description: 'Consultoria personalizada para acumular milhas e voar em classe executiva gastando menos.',
  ogImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    name: 'Fly Up Milhas',
    description: 'Consultoria VIP em acúmulo e emissão estratégica de milhas aéreas',
    url: 'https://flyupmilhas.com.br',
    priceRange: 'R$200',
    areaServed: { '@type': 'Country', name: 'Brasil' },
  }),
])
</script>

<template>
  <AppHeader />
  <main>
    <!-- Sections rendered here in Phase 2/3 -->
  </main>
  <AppFooter />
</template>
```

### Pattern 4: Fastify POST /leads Endpoint

```typescript
// Fastify backend — leads route
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import mongodb from '@fastify/mongodb'
import { z } from 'zod'

const LeadSchema = z.object({
  nome: z.string().min(2).max(100),
  whatsapp: z.string().regex(/^\d{10,11}$/, 'Formato inválido'),
  gastoMensal: z.string(),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra']),
  website: z.string().optional(),  // Honeypot field
})

// Register CORS (must be registered before routes)
await fastify.register(cors, {
  origin: ['https://flyupmilhas.com.br', 'https://www.flyupmilhas.com.br'],
  methods: ['POST', 'OPTIONS'],
})

// Register rate limit (global + per-route override)
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

// POST /leads route
fastify.post('/leads', {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '1 minute',
    },
  },
}, async (request, reply) => {
  const result = LeadSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ error: result.error.flatten() })
  }

  const { website, ...leadData } = result.data

  // Honeypot: if website field is filled, silently accept but don't store
  if (website) {
    return reply.status(200).send({ success: true, id: 'honeypot' })
  }

  const db = fastify.mongo.db
  const inserted = await db.collection('leads').insertOne({
    ...leadData,
    createdAt: new Date(),
    source: 'lp-flyupmilhas',
  })

  return reply.status(200).send({ success: true, id: inserted.insertedId.toString() })
})
```

### Pattern 5: R2 Image Reference via NuxtImg

```vue
<!-- Phase 1: test image from R2 to verify the pipeline -->
<script setup lang="ts">
const config = useRuntimeConfig()
const r2Base = config.public.r2BaseUrl  // e.g., https://cdn.flyupmilhas.com.br
</script>

<template>
  <!-- For LCP element (hero): eager + high priority -->
  <NuxtImg
    :src="`${r2Base}/hero-bg.webp`"
    width="1200"
    height="675"
    alt="Classe executiva — Fly Up Milhas"
    loading="eager"
    fetchpriority="high"
  />

  <!-- For below-fold images: lazy (default) -->
  <NuxtImg
    :src="`${r2Base}/marcio-perfil.webp`"
    width="400"
    height="400"
    alt="Marcio — consultor de milhas"
  />
</template>
```

### Pattern 6: runtimeConfig for API and R2 URLs

```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: '',   // Set via NUXT_PUBLIC_API_BASE in .env or Cloudflare Pages env vars
    r2BaseUrl: '', // Set via NUXT_PUBLIC_R2_BASE_URL
  },
},
```

```bash
# .env (local dev)
NUXT_PUBLIC_API_BASE=http://localhost:3001
NUXT_PUBLIC_R2_BASE_URL=https://cdn.flyupmilhas.com.br
```

### Anti-Patterns to Avoid

- **Installing Tailwind CSS separately:** `@nuxt/ui` v4 ships Tailwind v4 as a peer dependency. Running `pnpm add tailwindcss` alongside it causes version conflicts. Let `@nuxt/ui` own it.
- **Using `future.compatibilityVersion: 4` without `compatibilityDate`:** Both are required together for Nuxt 4 `app/` directory to activate.
- **Using the hyphenated preset name:** The Nitro preset is `cloudflare_pages` (underscore), not `cloudflare-pages` (hyphen). The hyphen variant was deprecated.
- **Skipping `autoSubfolderIndex: false`:** Without this, Cloudflare route matching fails for non-index routes.
- **Testing CORS from `nuxt dev`:** The dev server proxies requests internally; CORS enforcement only applies when the browser makes cross-origin requests. Test from the staging URL in a real browser.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading optimization | Custom `<link rel="preload">` in head | `@nuxt/fonts` (bundled with `@nuxt/ui`) | Prevents FOUT, handles subsetting, self-hosts with zero config |
| CORS handling | Manual `Access-Control-Allow-Origin` headers | `@fastify/cors` plugin | Handles preflight OPTIONS, credentials, multiple origins correctly |
| IP rate limiting | Custom in-memory counter | `@fastify/rate-limit` | Handles distributed rate limiting, TTL cleanup, correct 429 headers |
| Image lazy loading | `IntersectionObserver` wrapper | `<NuxtImg>` from `@nuxt/image` | Handles `loading="lazy"`, `fetchpriority`, WebP `<picture>` elements, SSR-safe |
| SEO meta injection | Manual `<head>` manipulation | `useSeoMeta()` + `@nuxtjs/seo` | SSR-safe, deduplicates meta tags, generates sitemap + robots.txt automatically |
| Schema.org JSON-LD | Inline `<script type="application/ld+json">` | `useSchemaOrg` from `@nuxtjs/seo` | Validates schema graph, handles inheritance, avoids duplicate scripts |
| MongoDB connection pool | Raw `MongoClient` instantiation | `@fastify/mongodb` | Plugin lifecycle integrates with Fastify hooks; correct pool management |

**Key insight:** This stack is heavily opinionated and convention-driven. The libraries listed above are not optional convenience wrappers — they handle non-trivial edge cases (SSR deduplication, preflight CORS, pool lifecycle, font CLS) that hand-rolled solutions routinely miss.

---

## Common Pitfalls

### Pitfall 1: Nitro Preset Name Mismatch

**What goes wrong:** Using `preset: 'cloudflare-pages'` (hyphen) in `nuxt.config.ts`. The build completes but the Cloudflare Pages deployment uses the wrong Worker format.

**Why it happens:** Older documentation and community articles used the hyphenated name. The current Nitro/Nuxt 4 convention is underscore.

**How to avoid:** Always use `preset: 'cloudflare_pages'`. Pair with `prerender: { autoSubfolderIndex: false }` for correct Cloudflare route matching.

**Warning signs:** Build log shows "using cloudflare-pages preset (deprecated)" or deployment fails to match routes.

---

### Pitfall 2: Hydration Mismatch in `nuxt dev` vs Production

**What goes wrong:** Code that reads `window`, `localStorage`, or `navigator` at the top level of `<script setup>` renders differently on server vs client, causing Vue to discard server HTML and re-render — destroying LCP and causing CLS.

**Why it happens:** `nuxt dev` runs in a mode where hydration mismatches are suppressed or silently fixed. The bug only surfaces in `nuxt build && nuxt preview`.

**How to avoid:**
- Wrap any browser-only code in `if (import.meta.client)` or `<ClientOnly>`
- Always validate with `nuxt build && nuxt preview` before declaring Phase 1 complete
- Check browser console for "Hydration node mismatch" errors

---

### Pitfall 3: CORS Tested from Dev, Fails in Production

**What goes wrong:** The `/leads` POST works fine during local dev because both Nuxt and Fastify run on localhost. After deployment, the browser enforces CORS between `flyupmilhas.com.br` and the Fastify API domain, and submissions silently fail.

**Why it happens:** SSR requests (on the server) bypass CORS entirely. Only client-initiated `$fetch` calls enforce it. Dev mode often runs same-origin or with permissive defaults.

**How to avoid:**
- Configure `@fastify/cors` with the exact production domain array (D-11)
- Smoke-test the form POST from a real browser pointed at the staging Cloudflare Pages URL
- Check browser Network tab for `Access-Control-Allow-Origin` on the preflight OPTIONS response

---

### Pitfall 4: R2 Image Served Without WebP in Production

**What goes wrong:** Images load as JPEG or PNG instead of WebP, inflating page weight and failing PageSpeed "serve images in next-gen formats" audit.

**Why it happens:** D-07 locks image pre-optimization as the strategy. If images are uploaded to R2 before being converted to WebP, the original format is served forever. Cloudflare Image Transformations (which would auto-convert) is deferred (D-06/D-07).

**How to avoid:** Pre-optimize every image before uploading to R2. Use `squoosh` CLI or `sharp`:
```bash
# Convert to WebP at 85% quality
npx @squoosh/cli --webp '{"quality":85}' hero-bg.jpg
```
Name output files with `.webp` extension. Reference them by that name in the template.

---

### Pitfall 5: `@fastify/cors` Package Version Mismatch

**What goes wrong:** Installing `@fastify/cors@^10.x` (as referenced in older research docs) when Fastify 5 requires `@fastify/cors@^11.x`. Plugin registration fails at startup.

**Why it happens:** The research documents in `.planning/research/STACK.md` cite `^10.x` but the current published version is `11.2.0`. Fastify plugins track Fastify major versions.

**How to avoid:** Install `@fastify/cors@^11` explicitly. Run `npm view @fastify/cors version` to confirm before install.

---

### Pitfall 6: `@nuxt/ui` v4 Requires Nuxt 4 — Not Nuxt 3

**What goes wrong:** Attempting to install `@nuxt/ui@^4.x` in a Nuxt 3 project (e.g., if the `future.compatibilityVersion: 4` flag is omitted or the scaffolding defaulted to Nuxt 3).

**Why it happens:** Both Nuxt 3 and Nuxt 4 are published; `pnpm dlx nuxi@latest init` creates a Nuxt 4 project, but if someone installs Nuxt from `npm install nuxt@3.x`, the module is incompatible.

**How to avoid:** Always scaffold with `nuxi` latest. Verify `nuxt.config.ts` has `future: { compatibilityVersion: 4 }`. Confirm `package.json` shows `"nuxt": "^4.x"`.

---

## Code Examples

### Verified: Complete nuxt.config.ts for Phase 1

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],

  ssr: true,

  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  site: {
    url: 'https://flyupmilhas.com.br',
    name: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
    defaultLocale: 'pt-BR',
    description: 'Consultoria personalizada em milhas aéreas. Voe em classe executiva gastando menos.',
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      r2BaseUrl: '',
    },
  },

  css: ['~/assets/css/main.css'],

  image: {
    // @nuxt/image v2 — no provider configuration needed for absolute URLs
    // Images on R2 are referenced by full URL; NuxtImg handles lazy loading attributes
    quality: 85,
    format: ['webp'],
  },
})
```

### Verified: Tailwind v4 CSS-First Config (no tailwind.config.js)

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --color-brand-primary: #1a3a5c;
  --color-brand-bg: #f8f9fa;
  --color-brand-cta: #e67e22;
  --color-brand-cta-hover: #d35400;
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### Verified: @fastify/cors with Origin Whitelist

```typescript
// Source: github.com/fastify/fastify-cors README
import cors from '@fastify/cors'

await fastify.register(cors, {
  origin: [
    'https://flyupmilhas.com.br',
    'https://www.flyupmilhas.com.br',
    // For staging: add staging URL here during Phase 1 validation
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
})
```

### Verified: @fastify/rate-limit Scoped to /leads

```typescript
// Source: github.com/fastify/fastify-rate-limit README
import rateLimit from '@fastify/rate-limit'

// Global plugin registration (permissive global limit)
await fastify.register(rateLimit, {
  global: false,  // Don't apply globally; scope per-route
})

// Route-level limit
fastify.post('/leads', {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '1 minute',
      keyGenerator: (req) => req.ip,
      errorResponseBuilder: (_req, context) => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Muitas tentativas. Tente novamente em ${context.after}.`,
      }),
    },
  },
}, handler)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with JS theme | `@theme {}` block in CSS file | Tailwind v4 (Jan 2025) | No separate config file; tokens are CSS custom properties |
| `pages/index.vue` as entry point | `app/app.vue` as root for single-page LP | Nuxt 4 (Jul 2025) | Eliminates vue-router overhead (~15 KB) for LP use case |
| `nuxt.config.ts` `future: { compatibilityVersion: 4 }` opt-in | Default in Nuxt 4 installs | Nuxt 4 (Jul 2025) | Still required in `nuxt.config.ts` for explicit clarity |
| Nitro preset `cloudflare-pages` | `cloudflare_pages` (underscore) | Nitro 2025 | Hyphenated name deprecated |
| `@fastify/cors ^10.x` | `@fastify/cors ^11.x` | Late 2025 | Must match Fastify 5 major version |
| `@nuxt/ui` v2/v3 with Tailwind v3 | `@nuxt/ui` v4 with Tailwind v4 | Sep 2025 | Unified package; old major is superseded |

**Deprecated/outdated:**
- `tailwind.config.js`: Replaced by CSS-first `@theme {}` in Tailwind v4. Do not create this file.
- `nuxt.config.ts → image.provider: 'cloudflare'` for R2: Not needed when using absolute URLs (D-06). Custom provider config only needed for server-side image transformation, which is deferred.
- `@fastify/cors@^10.x`: Superseded by v11 for Fastify 5 compatibility.

---

## Open Questions

1. **Fastify API domain topology**
   - What we know: Fastify is "existing infrastructure, external" (D-15). CORS must be configured for the LP domain.
   - What's unclear: Is the Fastify server on a subdomain of `flyupmilhas.com.br` (e.g., `api.flyupmilhas.com.br`) or a completely different domain? This affects the CORS origin list and whether staging needs a staging-domain entry.
   - Recommendation: Confirm the production API URL before implementing the CORS origin array. Add staging URL to the CORS whitelist during Phase 1 validation.

2. **MongoDB connection string location**
   - What we know: Fastify uses `@fastify/mongodb` with native driver.
   - What's unclear: Is the MongoDB connection string already available in the Fastify environment, or does it need to be provisioned?
   - Recommendation: Confirm with the team that the connection string is in the Fastify server's environment. This is not a Nuxt concern (D-15), but a blocker for BACK-01 testing.

3. **Inter font loading strategy**
   - What we know: D-05 specifies Inter via `@fontsource/inter` or Google Fonts. `@nuxt/fonts` is bundled with `@nuxt/ui`.
   - What's unclear: `@nuxt/fonts` can self-host Google Fonts automatically — this is likely the correct approach as it eliminates third-party DNS lookups and is LGPD-safer.
   - Recommendation: Use `@nuxt/fonts` automatic Google Fonts self-hosting (zero config; it intercepts the font request and hosts it). Only fall back to `@fontsource/inter` if `@nuxt/fonts` causes issues.

---

## Sources

### Primary (HIGH confidence)
- npm registry — verified versions: nuxt@4.4.2, @nuxt/ui@4.5.1, @nuxtjs/seo@4.0.2, @nuxt/image@2.0.0, @fastify/cors@11.2.0, @fastify/rate-limit@10.3.0, @fastify/mongodb@10.0.0, fastify@5.8.2, zod@3.24.x (registry query, 2026-03-21)
- https://nuxt.com/blog/v4 — Nuxt 4 directory structure changes, `app/` directory, compatibilityDate
- https://nuxt.com/deploy/cloudflare — Cloudflare Pages preset name (`cloudflare_pages`), `autoSubfolderIndex: false` requirement
- https://github.com/fastify/fastify-cors — @fastify/cors origin array configuration
- https://github.com/fastify/fastify-rate-limit — Per-route rate limiting configuration

### Secondary (MEDIUM confidence)
- https://nuxtseo.com/docs/nuxt-seo/getting-started/introduction — @nuxtjs/seo module composition (includes nuxt-schema-org v5)
- https://nuxtseo.com/docs/schema-org/getting-started/introduction — Schema.org LocalBusiness via `useSchemaOrg` / `defineLocalBusiness`
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns, asset optimization

### Tertiary (LOW confidence — from prior research, cross-referenced)
- .planning/research/STACK.md — Prior stack research (version discrepancy noted: @fastify/cors version corrected from ^10 to ^11)
- .planning/research/PITFALLS.md — Pitfall catalogue; all Phase 1-relevant pitfalls incorporated above

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry on 2026-03-21
- Architecture: HIGH — based on official Nuxt 4 docs and Cloudflare Pages deployment guide
- Fastify backend patterns: HIGH — official plugin READMEs
- Pitfalls: HIGH — sourced from official Nuxt and Fastify documentation + confirmed bug reports

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable ecosystem; main risk is if `@nuxtjs/seo` v4 has breaking changes between now and plan execution)

**Version correction note:** `.planning/research/STACK.md` cites `@fastify/cors ^10.x`. The current published version is `11.2.0`. The planner must use `@fastify/cors@^11`, not `^10`.
