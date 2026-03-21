# Architecture Research

**Domain:** High-conversion landing page — miles/travel consultancy (Brazilian market)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (Client)                           │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Hero    │  │ Sections │  │Proof/    │  │  Lead Form   │   │
│  │ Section  │  │ (How It  │  │Testim.   │  │  Component   │   │
│  │          │  │  Works,  │  │          │  │              │   │
│  │          │  │  Expert) │  │          │  │              │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │             │             │               │            │
│       └─────────────┴─────────────┴───────────────┘            │
│                             │                                   │
│                    app.vue (root shell)                         │
│                     useHead / useSeoMeta                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │  SSR hydration (initial HTML)
                           │  $fetch (form submission, client-side)
┌──────────────────────────┼──────────────────────────────────────┐
│              Nuxt 3 SSR Layer (Nitro)                           │
│                          │                                      │
│         nuxt.config.ts — runtimeConfig, routeRules             │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP POST (JSON)
┌──────────────────────────┼──────────────────────────────────────┐
│              External Fastify API                               │
│                          │                                      │
│  ┌────────────────────────────────────────────────┐            │
│  │  POST /leads  → MongoDB (leads collection)     │            │
│  └────────────────────────────────────────────────┘            │
│                                                                 │
│  Static Assets: Cloudflare R2                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `app.vue` | Root shell, global SEO meta, layout wrapper | All section components |
| `AppHeader` | Minimal sticky nav with logo and primary CTA button | None (pure display) |
| `SectionHero` | Above-the-fold headline, sub-headline, CTA button | Scrolls to `SectionLeadForm` |
| `SectionExpert` | Expert bio (Marcio), credentials, authority signals | None (pure display) |
| `SectionHowItWorks` | 4-step visual process (Diagnostico → Estrategia → Execucao → Voo) | None (pure display) |
| `SectionSocialProof` | Testimonials carousel/grid, screenshots of real results | None (pure display) |
| `SectionLeadForm` | Qualification form (name, WhatsApp, monthly spend, goal) | `useLeadForm` composable |
| `SectionCTA` | Final CTA block above footer, urgency/scarcity copy | Scrolls to `SectionLeadForm` |
| `AppFooter` | Legal copy, contact info, social links | None |
| `useLeadForm` | Form state, validation, submission to Fastify API | Fastify `/leads` endpoint |
| `useScroll` | Smooth-scroll to lead form from any CTA button | Browser scroll API |

## Recommended Project Structure

```
site-flyupmilhas/
├── app.vue                     # Root shell — no pages/ needed for single LP
├── nuxt.config.ts              # SSR config, Nuxt UI module, runtimeConfig
├── package.json
├── tsconfig.json
│
├── components/
│   ├── App/
│   │   ├── AppHeader.vue       # Sticky nav with logo + CTA
│   │   └── AppFooter.vue       # Legal, contacts
│   └── Section/
│       ├── SectionHero.vue         # Hero — headline, CTA
│       ├── SectionExpert.vue       # Bio Marcio
│       ├── SectionHowItWorks.vue   # 4 steps visual
│       ├── SectionSocialProof.vue  # Depoimentos + prints
│       ├── SectionLeadForm.vue     # Lead capture form
│       └── SectionCTA.vue          # Final CTA band
│
├── composables/
│   ├── useLeadForm.ts          # Form state, validation, $fetch to Fastify
│   └── useScroll.ts            # Smooth-scroll helper for CTA buttons
│
├── assets/
│   ├── css/
│   │   └── main.css            # Tailwind base + custom tokens
│   └── images/                 # Optimized local images (remote on R2)
│
├── public/
│   ├── favicon.ico
│   └── og-image.jpg            # Open Graph static image (1200x630)
│
└── server/                     # Nitro server — only if proxy is needed
    └── (empty or proxy route to Fastify)
```

### Structure Rationale

- **No `pages/` directory:** For a single-page LP, Nuxt does not need its router. `app.vue` acts as the entire app, eliminating vue-router overhead and reducing bundle size. (Official Nuxt docs confirm this is the recommended approach for LPs.)
- **`components/Section/`:** Grouping all landing sections under `Section/` prefix makes the page's narrative structure visible at a glance. Nuxt auto-imports all components, so no explicit imports are needed.
- **`composables/useLeadForm.ts`:** Isolating form logic in a composable keeps `SectionLeadForm.vue` as a pure UI component and makes the API call easy to test or swap.
- **`assets/` vs `public/`:** Static files processed by Vite (CSS, local icons) go in `assets/`. Files served as-is (OG image, favicons) go in `public/`. Heavy media (expert photos, testimonial screenshots) should be served from Cloudflare R2 and referenced via absolute URL.
- **No Pinia store:** For a single-page LP the only shared state is the lead form. A composable with `ref()` is sufficient — Pinia adds unnecessary complexity here.

## Architectural Patterns

### Pattern 1: No-Router Single File App

**What:** Remove the `pages/` directory entirely and put all section components directly inside `app.vue`.
**When to use:** Any Nuxt project with exactly one "page" — no navigation, no dynamic routes.
**Trade-offs:** Reduces JS bundle by ~15KB (vue-router), simpler hydration, but forces all content into one component tree.

**Example:**
```vue
<!-- app.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
  description: 'Aprenda a voar em classe executiva gastando menos...',
  ogImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
})
</script>

<template>
  <AppHeader />
  <main>
    <SectionHero />
    <SectionExpert />
    <SectionHowItWorks />
    <SectionSocialProof />
    <SectionLeadForm />
    <SectionCTA />
  </main>
  <AppFooter />
</template>
```

### Pattern 2: Composable-Driven Form Submission

**What:** All form logic (state, validation, API call, success/error handling) lives in `useLeadForm.ts`. The Vue component only handles UI concerns.
**When to use:** Any form that posts to an external API. Keeps components thin and reusable.
**Trade-offs:** Slight indirection for simple forms, but isolation makes debugging straightforward and allows future migration to a different API without touching the component.

**Example:**
```typescript
// composables/useLeadForm.ts
export const useLeadForm = () => {
  const config = useRuntimeConfig()
  const form = reactive({ name: '', whatsapp: '', monthlySpend: '', goal: '' })
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async () => {
    status.value = 'loading'
    try {
      await $fetch(`${config.public.apiBase}/leads`, {
        method: 'POST',
        body: form,
      })
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  return { form, status, submit }
}
```

### Pattern 3: runtimeConfig for API Base URL

**What:** API endpoint URL stored in `nuxt.config.ts → runtimeConfig.public.apiBase`, injected at SSR time via environment variables.
**When to use:** Any Nuxt app that calls an external API. Avoids hardcoded URLs across components.
**Trade-offs:** Requires setting environment variables at deploy time, but this is standard practice and necessary for staging/production parity.

**Example:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3001',
    },
  },
})
```

## Data Flow

### Lead Capture Flow (Primary)

```
User fills form (SectionLeadForm.vue)
    ↓
useLeadForm.submit() called on @submit.prevent
    ↓
$fetch POST → Fastify /leads  (client-side, after SSR hydration)
    ↓
Fastify validates + saves to MongoDB
    ↓
HTTP 201 response
    ↓
status.value = 'success'
    ↓
SectionLeadForm shows success state
    ↓
(Optional) WhatsApp redirect or confirmation message
```

### SSR Rendering Flow (Initial Page Load)

```
Browser requests /
    ↓
Nuxt SSR (Nitro) renders full HTML on server
    ↓
useSeoMeta() injects meta tags into <head>
    ↓
All section components rendered to HTML string
    ↓
HTML delivered to browser (with meta, OG tags)
    ↓
Vue hydrates client-side — form becomes interactive
    ↓
Cloudflare R2 assets (images) loaded independently via CDN
```

### CTA Scroll Flow

```
User clicks CTA button (in Hero, Header, or SectionCTA)
    ↓
useScroll.scrollTo('lead-form') called
    ↓
browser.scrollIntoView({ behavior: 'smooth' }) on #lead-form anchor
    ↓
SectionLeadForm comes into viewport
```

### Key Data Boundaries

1. **Client → Fastify:** Only `$fetch` (client-side after hydration). No Nuxt server route is needed unless CORS must be proxied.
2. **Nuxt → R2:** One-directional: `<img>` tags or `<NuxtImg>` with absolute R2 URLs. No Nuxt logic touches R2 directly.
3. **Components → Composables:** Section components consume composables via `const { form, status, submit } = useLeadForm()`. No prop drilling; no Pinia.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–1k visitors/month | Current architecture is sufficient — single SSR server or edge deployment |
| 1k–50k visitors/month | Add Cloudflare CDN in front of Nuxt; R2 already handles static assets; ensure Fastify has connection pooling to MongoDB |
| 50k+ visitors/month | Consider prerendering to static HTML (`nuxt generate`) for zero-server-cost CDN delivery; Fastify API scales independently |

### Scaling Priorities

1. **First bottleneck:** Nuxt SSR compute cost under traffic spikes. Fix: Cloudflare CDN caching at the edge or static prerendering.
2. **Second bottleneck:** MongoDB write throughput from lead submissions. Fix: Fastify connection pool + MongoDB Atlas auto-scaling; LP volume rarely stresses this.

## Anti-Patterns

### Anti-Pattern 1: Using pages/ When Only One Page Exists

**What people do:** Create `pages/index.vue` by habit (tutorials show pages/).
**Why it's wrong:** Adds vue-router (~15KB gzipped) and hydration complexity for zero benefit. Nuxt docs explicitly recommend using only `app.vue` for single-page applications.
**Do this instead:** Delete `pages/`, put all content in `app.vue`.

### Anti-Pattern 2: Fetching via Nuxt Server Route as Passthrough

**What people do:** Create `server/api/leads.post.ts` that simply proxies the request to Fastify.
**Why it's wrong:** Doubles latency (browser → Nitro → Fastify), adds maintenance overhead, and complicates debugging. CORS is better solved at the Fastify layer.
**Do this instead:** Configure `@fastify/cors` on the Fastify server to allow the LP's origin. Call Fastify directly from the browser via `$fetch`.

### Anti-Pattern 3: Pinia for Single-Component State

**What people do:** Install Pinia and create a `leads` store for form data.
**Why it's wrong:** The lead form state is entirely local to one component. Pinia adds bundle weight and indirection for state that never needs to be shared.
**Do this instead:** Use `useLeadForm()` composable with local `reactive()` and `ref()` — zero extra dependencies.

### Anti-Pattern 4: Embedding Images as Local Assets for Large Media

**What people do:** Store expert photos, testimonial screenshots, and result images in `assets/images/`.
**Why it's wrong:** These files inflate the Nuxt build output, slow deployment, and bypass CDN optimization. Cloudflare R2 is already planned for exactly this purpose.
**Do this instead:** Upload all media > 20KB to Cloudflare R2, reference via absolute URL. Use `<NuxtImg>` with the external URL for lazy-loading + format optimization if `@nuxt/image` is installed.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Fastify API | `$fetch(config.public.apiBase + '/leads', { method: 'POST' })` from composable | Configure `@fastify/cors` with LP's production domain as allowed origin |
| Cloudflare R2 | Absolute `<img src="https://r2.flyupmilhas.com.br/...">` in templates | Public bucket with custom domain; no Nuxt integration needed |
| WhatsApp (optional CTA) | `<a href="https://wa.me/55...?text=...">` deep-link | Encode pre-filled message in URL; no API key required |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `SectionHero` ↔ `SectionLeadForm` | `useScroll` composable — no props | CTA button calls `scrollTo('lead-form')`; sections are siblings, not parent/child |
| `SectionLeadForm` ↔ Fastify | `useLeadForm` composable — `$fetch` | Only client-side; no SSR data fetching needed for form submission |
| `app.vue` ↔ All sections | Props: none. Auto-import: all components | Nuxt auto-imports components from `components/`; no explicit registration |
| Nuxt build ↔ Cloudflare R2 | None at build time | R2 URLs are runtime strings; R2 assets managed independently |

## Build Order (Dependency Sequence)

This sequence respects what must exist before other pieces can be built or tested:

1. **Project scaffold** — `nuxt.config.ts`, `app.vue` shell, Nuxt UI module installed. Everything else depends on this.
2. **Design tokens** — Tailwind config with brand colors (aviation blue, off-white, orange/gold CTA). Blocks all component work.
3. **`AppHeader` + `AppFooter`** — Frame for all sections. No dependencies beyond design tokens.
4. **`SectionHero`** — First visible content. Defines the typographic scale and CTA button style used everywhere.
5. **`SectionExpert`** — Pure display, no dependencies. Can be built in parallel with Hero once tokens are set.
6. **`SectionHowItWorks`** — Pure display, no dependencies.
7. **`SectionSocialProof`** — Requires real testimonial content/images from client before it can be finalized.
8. **`useLeadForm` composable** — Depends on Fastify endpoint contract (`POST /leads` request/response shape).
9. **`SectionLeadForm`** — Depends on `useLeadForm`. Integration-testable once Fastify is reachable.
10. **`SectionCTA`** — Pure display, depends only on `useScroll`.
11. **SEO layer** — `useSeoMeta()` in `app.vue`, OG image in `public/`. Can be done last before launch.

## Sources

- [Nuxt 3 — app.vue directory structure](https://nuxt.com/docs/guide/directory-structure/app) (HIGH confidence — official docs)
- [Nuxt UI — PageHero Component](https://ui.nuxt.com/docs/components/page-hero) (HIGH confidence — official docs)
- [Nuxt UI — PageSection Component](https://ui.nuxt.com/docs/components/page-section) (HIGH confidence — official docs)
- [Nuxt UI — Components overview](https://ui.nuxt.com/docs/components) (HIGH confidence — official docs)
- [When to Use $fetch, useFetch, or useAsyncData in Nuxt](https://masteringnuxt.com/blog/when-to-use-fetch-usefetch-or-useasyncdata-in-nuxt-a-comprehensive-guide) (MEDIUM confidence — well-regarded community source)
- [Building API Routes with Nuxt 3's Nitro Server](https://masteringnuxt.com/blog/building-api-routes-with-nuxt-3s-nitro-server) (MEDIUM confidence — community)
- [Nuxt 3 — SEO and Meta](https://nuxt.com/docs/3.x/getting-started/seo-meta) (HIGH confidence — official docs)
- [fastify/fastify-cors — GitHub](https://github.com/fastify/fastify-cors) (HIGH confidence — official plugin)
- [Nuxt.js Structure Best Practices — Medium](https://medium.com/@ali_mirzaei/nuxt-js-structure-best-practices-building-robust-vue-js-applications-625ed4e782bb) (LOW confidence — community blog)
- [Building effective landing pages with Nuxt — Nuxt Dojo](https://blog.nuxtdojo.com/p/6-building-effective-landing-pages) (MEDIUM confidence — community)

---
*Architecture research for: Nuxt 3 high-conversion landing page — miles/travel consultancy*
*Researched: 2026-03-21*
