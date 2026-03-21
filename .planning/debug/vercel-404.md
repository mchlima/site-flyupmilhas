---
status: awaiting_human_verify
trigger: "Nuxt 4 app deployed to Vercel returns 404 on access"
created: 2026-03-21T00:00:00Z
updated: 2026-03-21T00:01:00Z
---

## Current Focus

hypothesis: nitro.preset is set to 'cloudflare_pages' but the app is deployed to Vercel, causing the build output to target Cloudflare Workers runtime instead of Vercel's Node.js serverless runtime — Vercel cannot serve the output correctly, resulting in 404 on all routes
test: Read nuxt.config.ts and confirm preset value
expecting: preset = 'cloudflare_pages' confirms hypothesis
next_action: Remove nitro.preset so Vercel auto-detects and uses 'vercel' preset, and remove cloudflare_pages-only prerender option

## Symptoms

expected: Landing page renders when accessing the Vercel deployment URL
actual: 404 error on all routes
errors: HTTP 404
reproduction: Deploy to Vercel and access any URL
started: First deploy attempt — app works locally with `nuxt build && nuxt preview`

## Eliminated

(none — root cause confirmed on first file read)

## Evidence

- timestamp: 2026-03-21T00:00:00Z
  checked: nuxt.config.ts nitro block
  found: nitro.preset = 'cloudflare_pages' and nitro.prerender.autoSubfolderIndex = false
  implication: Build produces Cloudflare Pages output format (/_worker.js + static assets in Cloudflare's expected layout). Vercel expects either a .vercel/output directory (built by @vercel/nuxt) or a standard Node.js server. The cloudflare_pages preset outputs neither, so Vercel has no handler to serve — 404 on every route.

- timestamp: 2026-03-21T00:00:00Z
  checked: package.json scripts
  found: build script is plain 'nuxt build' with no NITRO_PRESET env override
  implication: The preset in nuxt.config.ts is the one used for Vercel deploys.

- timestamp: 2026-03-21T00:00:00Z
  checked: vercel.json
  found: file does not exist
  implication: No manual Vercel routing override present. Vercel relies entirely on the build output format.

## Resolution

root_cause: nitro.preset = 'cloudflare_pages' in nuxt.config.ts causes Nuxt's Nitro bundler to emit a Cloudflare Workers-compatible output. Vercel cannot interpret this output — it expects the 'vercel' preset (which Nitro auto-selects when VERCEL=1 env is present and no preset is hardcoded). The hardcoded preset overrides Vercel's auto-detection, so every request returns 404.
fix: Removed the entire nitro block from nuxt.config.ts (preset 'cloudflare_pages' and prerender.autoSubfolderIndex). Vercel injects VERCEL=1 at build time; Nitro auto-detects and uses 'vercel' preset correctly.
verification: Local build succeeds with 'Nitro preset: node-server' (expected — VERCEL=1 is not set locally). On Vercel the same removal causes Nitro to select 'vercel' preset automatically. No build errors.
files_changed: [nuxt.config.ts]
