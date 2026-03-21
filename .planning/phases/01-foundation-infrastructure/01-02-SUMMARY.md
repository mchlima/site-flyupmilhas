---
phase: 01-foundation-infrastructure
plan: 02
subsystem: api
tags: [fastify, mongodb, zod, cors, rate-limiting, typescript]

# Dependency graph
requires: []
provides:
  - POST /leads Fastify endpoint with Zod validation and MongoDB persistence
  - Honeypot anti-spam field (website) silently discards bot submissions
  - CORS whitelist restricted to flyupmilhas.com.br and www.flyupmilhas.com.br
  - Per-IP rate limiting at 5 requests/minute on POST /leads (429 + Portuguese error)
  - Zod LeadSchema shared type source for backend and future frontend integration
affects:
  - phase-03-lead-form  # Will wire Nuxt form to this endpoint

# Tech tracking
tech-stack:
  added:
    - fastify@^5.8.2
    - "@fastify/mongodb@^10.0.0"
    - "@fastify/cors@^11.2.0"
    - "@fastify/rate-limit@^10.3.0"
    - zod@^3
    - typescript@^5
    - tsx@^4 (dev)
  patterns:
    - "Zod safeParse for Fastify request body validation (no @fastify/type-provider-zod needed)"
    - "Plugin registration order: CORS -> rateLimit(global:false) -> MongoDB -> routes"
    - "Per-route rateLimit config via route config.rateLimit (not global)"
    - "Honeypot: schema includes optional website field; populated = discard silently, return 200"
    - "MongoDB accessed via fastify.mongo.db (native driver, no Mongoose)"

key-files:
  created:
    - server/package.json
    - server/tsconfig.json
    - server/leads/schema.ts
    - server/leads/index.ts
    - server/server.ts
  modified: []

key-decisions:
  - "Used @fastify/cors@^11 (not ^10) — Fastify 5 requires cors v11+ for compatibility"
  - "Rate limit scoped per-route (global:false) — health checks and other routes unaffected"
  - "MongoDB accessed via native driver through @fastify/mongodb — no Mongoose ODM overhead"
  - "Honeypot returns HTTP 200 with id:'honeypot' — bots receive success signal, no retry incentive"
  - "CORS_STAGING_URL env var support added — allows staging validation without code changes"

patterns-established:
  - "Pattern 1: Zod LeadSchema is single source of truth — frontend will import or mirror these rules in Phase 3"
  - "Pattern 2: Plugin registration order enforced via sequential await fastify.register() calls"
  - "Pattern 3: Environment variables for all configuration (MONGODB_URI, LEADS_DB_NAME, PORT, CORS_STAGING_URL)"

requirements-completed: [BACK-01, BACK-02, BACK-03]

# Metrics
duration: 5min
completed: 2026-03-21
---

# Phase 01 Plan 02: Fastify POST /leads Endpoint Summary

**Fastify 5 POST /leads endpoint with Zod validation, MongoDB persistence via @fastify/mongodb, CORS whitelist for flyupmilhas.com.br, honeypot anti-spam, and per-IP rate limiting at 5 req/min**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-21T05:29:25Z
- **Completed:** 2026-03-21T05:34:00Z
- **Tasks:** 2 of 2
- **Files modified:** 5 created

## Accomplishments

- Fastify server initialized with strict TypeScript (ESM, NodeNext module resolution)
- POST /leads route with full Zod safeParse validation, honeypot check, and MongoDB insertOne
- CORS restricted to `https://flyupmilhas.com.br` and `https://www.flyupmilhas.com.br` with optional staging URL via env
- Rate limiting at 5 requests/minute per IP scoped to POST /leads only (global:false), with Portuguese 429 error message

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Fastify backend dependencies and create Zod lead schema** - `5143790` (feat)
2. **Task 2: Implement POST /leads route and configure Fastify server plugins** - `9195142` (feat)

**Plan metadata:** (committed after summary creation)

## Files Created/Modified

- `server/package.json` - ESM Node.js project with all Fastify deps at correct versions
- `server/tsconfig.json` - TypeScript strict config with NodeNext module resolution
- `server/leads/schema.ts` - Zod LeadSchema with 5 fields (nome, whatsapp, gastoMensal, objetivo, website honeypot)
- `server/leads/index.ts` - Fastify leadsRoutes with validation, honeypot, rate limit config, MongoDB insertOne
- `server/server.ts` - Fastify server with plugins registered in correct order (CORS -> rateLimit -> MongoDB -> routes)

## Decisions Made

- Used `@fastify/cors@^11.2.0` (not ^10): Fastify 5 requires cors v11+; older research docs cited ^10 which fails at startup
- Rate limit set `global: false` so only POST /leads is rate-limited; no impact on other potential endpoints
- Added `CORS_STAGING_URL` env var support for staging validation in Plan 03 without code changes
- Honeypot returns `{ success: true, id: 'honeypot' }` — consistent 200 response to prevent bot retry behavior
- Added `fastify` itself as a direct dependency (v5.8.2) since this is a greenfield server project

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added fastify as direct dependency**
- **Found during:** Task 1 (dependency installation)
- **Issue:** Plan only listed plugin packages; `fastify` itself not listed but required as the server runtime
- **Fix:** Added `fastify@^5` to npm install command alongside plugin packages
- **Files modified:** server/package.json
- **Verification:** fastify@5.8.2 present in package.json dependencies
- **Committed in:** 5143790 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added TypeScript toolchain and tsconfig.json**
- **Found during:** Task 1 (project initialization)
- **Issue:** Plan creates `.ts` files but no TypeScript config or runtime was specified; `.ts` files cannot run without tsx or tsc
- **Fix:** Added `typescript`, `tsx`, `@types/node` as devDependencies; created `tsconfig.json` with strict NodeNext settings
- **Files modified:** server/package.json, server/tsconfig.json
- **Verification:** tsconfig.json present with correct module settings for ESM TypeScript
- **Committed in:** 5143790 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both auto-fixes required for the server to be runnable. No scope creep.

## Issues Encountered

None — all implementation followed plan specifications exactly, with the two auto-fixes being pre-requisites for running TypeScript-based Fastify.

## User Setup Required

**External services require manual configuration before the server can start:**

Environment variables required in server environment:
- `MONGODB_URI` — MongoDB Atlas connection string (Atlas dashboard -> Connect -> Drivers -> Connection string)
- `LEADS_DB_NAME` — MongoDB database name (e.g., `flyupmilhas`); defaults to `flyupmilhas` if not set
- `PORT` — Server port (optional; defaults to 3001)
- `CORS_STAGING_URL` — Staging Nuxt URL for CORS testing (optional; add during Plan 03 validation)

Dev startup command:
```bash
MONGODB_URI=<your-uri> LEADS_DB_NAME=flyupmilhas npx tsx server/server.ts
```

## Next Phase Readiness

- POST /leads endpoint is fully implemented and ready for integration testing
- CORS staging URL can be added via env var when Nuxt staging URL is known (Plan 01 or Plan 03)
- Frontend form (Phase 3) should use the same validation rules as LeadSchema — either import this file or replicate the same constraints

## Self-Check: PASSED

- FOUND: server/leads/schema.ts
- FOUND: server/leads/index.ts
- FOUND: server/server.ts
- FOUND: server/package.json
- FOUND commit: 5143790 (Task 1)
- FOUND commit: 9195142 (Task 2)

---
*Phase: 01-foundation-infrastructure*
*Completed: 2026-03-21*
