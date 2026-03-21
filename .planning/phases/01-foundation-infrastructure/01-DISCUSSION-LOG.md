# Phase 1: Foundation & Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-21
**Phase:** 01-foundation-infrastructure
**Areas discussed:** Nuxt version & scaffold, R2 asset strategy, Fastify endpoint contract, Deployment target
**Mode:** Auto (all decisions auto-selected based on research recommendations)

---

## Nuxt Version & Scaffold

| Option | Description | Selected |
|--------|-------------|----------|
| Nuxt 3 | Per PRD specification, but EOL July 2026 | |
| Nuxt 4 | Current major version, low-friction migration from 3 | ✓ |

**User's choice:** [auto] Nuxt 4 (recommended — research flagged Nuxt 3 EOL)
**Notes:** Directory structure auto-set to `app/` (Nuxt 4 default). No `pages/` needed for single-page LP.

---

## R2 Asset Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| NuxtImg with custom R2 provider | Runtime optimization, requires Cloudflare Image Transformations | |
| Absolute URLs to pre-optimized assets | Simpler, no runtime dependency on CF plan tier | ✓ |
| NuxtImg with default provider | Won't optimize R2-hosted images | |

**User's choice:** [auto] Absolute URLs with pre-optimized assets (recommended — avoids CF plan tier dependency)
**Notes:** Custom subdomain for R2 bucket recommended (cdn.flyupmilhas.com)

---

## Fastify Endpoint Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Cross-origin with @fastify/cors | Separate domains, explicit whitelist | ✓ |
| Same-origin via Nuxt server proxy | No CORS needed, adds Nuxt middleware | |

**User's choice:** [auto] Cross-origin with CORS whitelist (recommended — keeps frontend/backend independent)
**Notes:** Schema: `{ nome, whatsapp, gastoMensal, objetivo }`. Honeypot via `website` field. Rate limit 5/min/IP.

---

## Deployment Target

| Option | Description | Selected |
|--------|-------------|----------|
| Cloudflare Pages (SSR) | Nitro preset cloudflare-pages, edge SSR | ✓ |
| Cloudflare Workers | More control, more config | |
| Static (SSG) | No SSR, prerendered | |

**User's choice:** [auto] Cloudflare Pages with SSR (recommended — matches PRD performance requirements)
**Notes:** Fastify backend deployed separately, not part of this project's deployment.

---

## Claude's Discretion

- Exact Nitro configuration
- ESLint/Prettier setup
- Git hooks
- Rate limit tuning
- Loading/error page design

## Deferred Ideas

- LGPD consent banner — v2
- Cloudflare Image Transformations — depends on plan tier
- WhatsApp Business API notifications — v2
