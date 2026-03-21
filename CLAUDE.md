<!-- GSD:project-start source:PROJECT.md -->
## Project

**Fly Up Milhas**

Uma landing page de alta conversao para a Fly Up Milhas, focada na venda de consultoria personalizada (R$ 200) para otimizacao de acumulo de milhas e emissao estrategica de passagens aereas. O produto principal e uma consultoria VIP de 1 mes com 2 reunioes online, diagnostico de cartoes/programas e planejamento de rotas.

**Core Value:** Converter visitantes em clientes da consultoria VIP atraves de uma LP que transmita autoridade, confianca e resultados reais no mercado de milhas.

### Constraints

- **Tech Stack**: Nuxt 3 (SSR) + Nuxt UI (Tailwind CSS) — definido no PRD
- **Backend**: Fastify API ja existente — integrar, nao recriar
- **Database**: MongoDB — para leads e configuracoes
- **Storage**: Cloudflare R2 — para imagens e assets estaticos
- **Performance**: Mobile-first, carregamento ultra rapido
- **Design**: Paleta azul aviacao, fundo branco gelo/cinza ultra claro, CTA laranja/dourado
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Critical Version Note
- **Nuxt 3** is on security-only maintenance until July 31, 2026 (EOL approaching)
- **Nuxt 4** (released July 2025) is the current active major with full support
- **Nuxt UI v4** (released September 2025) unifies Nuxt UI and Nuxt UI Pro into one free library with 110+ components
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
| @nuxtjs/seo | ^2.x | SEO meta, sitemap, robots.txt, OG images | Install immediately; wraps useSeoMeta, sitemap generation, and schema.org in one package; single-page LP still benefits from proper meta and sitemap |
| @nuxt/image | ^1.x | Image optimization | Serve images from Cloudflare R2 with automatic WebP conversion, lazy loading, and responsive sizing; critical for Core Web Vitals on mobile |
| @nuxt/fonts | ^1.x (bundled via @nuxt/ui) | Font loading optimization | Zero-config font optimization; prevents CLS (Cumulative Layout Shift); already included as a dependency of Nuxt UI v4 |
| @vee-validate/nuxt | ^4.x | Form validation orchestration | Optional if using Nuxt UI's built-in UForm + Zod integration; only add if form complexity grows beyond lead capture |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Fastest installs, strict dependency resolution; standard in the Nuxt ecosystem |
| nuxi | Nuxt CLI | Use `pnpm dlx nuxi@latest init` to scaffold; manages dev/build/generate commands |
| ESLint + @nuxt/eslint | Linting | Nuxt 4's official ESLint config; use `@nuxt/eslint` module for auto-config |
| Vite | Bundler (built into Nuxt) | Already included; no separate configuration needed for this project scope |
## Backend Stack (Fastify — existing, integrate don't rebuild)
| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Fastify | ^5.x | HTTP API server | Existing; expose a POST /leads endpoint for form submission |
| @fastify/mongodb | ^3.x | MongoDB connection pool | Official Fastify plugin using native MongoDB driver; faster than Mongoose for simple lead writes; no ODM overhead needed for this use case |
| @fastify/cors | ^10.x | CORS for Nuxt frontend | Configure to allow only the LP's production domain; restrict in production |
| @fastify/rate-limit | ^10.x | Abuse prevention on lead endpoint | Rate-limit POST /leads by IP; prevents form spam without captcha complexity |
| Zod | ^3.x | API-side schema validation | Share the same Zod schema used in the frontend; validate lead payload on the server before MongoDB write |
## Assets — Cloudflare R2
| Technology | Configuration | Notes |
|------------|---------------|-------|
| Cloudflare R2 | S3-compatible object storage | Store hero images, testimonial photos, expert portrait |
| @nuxt/image + custom provider | Configure with R2 public URL as base | Use `providers.cloudflare` in `@nuxt/image` config pointing at the R2 public bucket URL |
| Cloudflare Image Resizing (optional) | Enable via Cloudflare dashboard | If using a domain proxied through Cloudflare, Image Resizing handles WebP conversion at the CDN edge instead of build time |
## Installation
# Scaffold Nuxt 4 project
# Core: Nuxt UI (includes Tailwind v4, @nuxt/fonts, @nuxt/icon automatically)
# SEO toolkit
# Image optimization
# Schema validation (shared with backend)
# Dev dependencies
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Nuxt 4 | Nuxt 3 | Only if existing codebase already on Nuxt 3 with complex upgrades; greenfield should always use Nuxt 4 |
| @nuxt/ui v4 | shadcn-vue / PrimeVue | shadcn-vue is a valid alternative for projects needing more design control; PrimeVue for enterprise feature density. Neither integrates as tightly with Nuxt's module system |
| Nuxt UI UForm + Zod | VeeValidate + Yup | VeeValidate adds a layer for complex multi-step forms; overkill for a single lead capture form with 4 fields |
| @fastify/mongodb (native driver) | Mongoose | Mongoose if schema enforcement and middleware hooks are needed across many collections; not justified for a leads-only API |
| @nuxtjs/seo | Manual useSeoMeta | Manual is fine for a single page; @nuxtjs/seo adds sitemap and robots.txt automatically which matters for Google indexing |
| SSR (server-side rendering) | SSG (static generation) | SSG if lead form submission handled externally (e.g. Typeform); SSR preferred here because form data must reach the Fastify backend securely without exposing the API key client-side |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Nuxt 3 for new projects | Security-only maintenance ending July 2026; starting greenfield on it means near-term forced migration | Nuxt 4 |
| Nuxt UI v2 / v3 (old major) | Merged into v4 and superseded; separate install paths, Tailwind v3 dependency | @nuxt/ui v4 |
| Tailwind CSS v3 separately | Nuxt UI v4 ships Tailwind v4 as a peer dep; installing v3 alongside causes conflicts | Let @nuxt/ui manage Tailwind |
| axios | Nuxt 4 ships `$fetch` (ofetch) natively; axios adds bundle weight and duplicates functionality | `$fetch` for POST requests, `useFetch` for SSR data |
| @nuxt/content | For blog/documentation sites; adds unnecessary overhead for a single-page LP with no Markdown content | None needed |
| Google Analytics via gtag.js | CLS and LCP impact; violates LGPD without explicit consent flow; browser may block | Use privacy-first analytics (Plausible, Fathom) or server-side event logging |
| next/image or other Next.js primitives | Wrong framework; listed as a caution because AI-generated code sometimes bleeds Next.js patterns into Nuxt projects | @nuxt/image |
## Stack Patterns by Variant
- Add `@nuxt/content` for Markdown-based content pages
- Nuxt's hybrid rendering lets you set SSG per-route while keeping SSR for the LP
- Use a plain `<a href="https://wa.me/55...">` tag; no library needed
- Track clicks with a Nuxt plugin wrapping `window.gtag` or Plausible goal events
- Use Nuxt's `useRuntimeConfig` to feature-flag variants per environment
- Do NOT use a client-side A/B library; it causes layout shift and LCP regression
- Cloudflare Turnstile (free, privacy-preserving, works with Fastify rate limiting)
- Avoid reCAPTCHA v2 — UX friction kills conversion on mobile
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| @nuxt/ui ^4.5.1 | nuxt ^4.x, tailwindcss ^4.x | UI v4 requires Nuxt 4; does NOT support Nuxt 3 |
| @nuxtjs/seo ^2.x | nuxt ^3.x and ^4.x | Compatible with both; uses Nuxt's useSeoMeta under the hood |
| @nuxt/image ^1.x | nuxt ^3.x and ^4.x | Cloudflare provider works with R2 public URLs |
| zod ^3.x | Node.js 18+, TypeScript ^5 | Stable; v4 alpha exists but do NOT use in production (API still changing) |
| @fastify/mongodb ^3.x | fastify ^5.x, mongodb driver ^6.x | Use with official MongoDB Node.js driver ^6; not ^5 or ^4 |
| @fastify/rate-limit ^10.x | fastify ^5.x | Match major versions with Fastify |
## Sources
- https://github.com/nuxt/nuxt/releases — Nuxt version history (verified: v4.4.2 latest as of Mar 2026)
- https://github.com/nuxt/ui/releases — Nuxt UI version history (verified: v4.5.1 latest)
- https://endoflife.date/nuxt — EOL dates (Nuxt 3 security support until July 31, 2026)
- https://ui.nuxt.com/docs/getting-started/installation/nuxt — Official Nuxt UI v4 install guide
- https://tailwindcss.com/blog/tailwindcss-v4 — Tailwind v4 release (v4.2.2 current)
- https://nuxtseo.com/docs/nuxt-seo/getting-started/introduction — @nuxtjs/seo documentation
- https://image.nuxt.com/providers/cloudflare — @nuxt/image Cloudflare provider
- https://github.com/fastify/fastify-mongodb — @fastify/mongodb official plugin
- https://vee-validate.logaretm.com/v4/integrations/zod-schema-validation/ — VeeValidate + Zod integration
- https://masteringnuxt.com/blog/nuxt-4-performance-optimization-complete-guide-to-faster-apps-in-2026 — Nuxt 4 performance patterns
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
