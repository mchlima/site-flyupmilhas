---
phase: quick-260416-otk
plan: 01
subsystem: analytics
tags: [analytics, seo, ssr, nuxt-config, gtag, ga4]
requires:
  - Nuxt 4 app.head.script support
provides:
  - Global SSR-injected Google Analytics 4 tag (G-HNPWG94BEE) on every route
affects:
  - nuxt.config.ts
tech-stack:
  added: []
  patterns:
    - app.head.script array for global <head> script injection (Nuxt 4 idiomatic)
key-files:
  created: []
  modified:
    - nuxt.config.ts
decisions:
  - Use nuxt.config.ts app.head.script over useHead() or a client plugin so the tag ships in the initial SSR HTML (preserves first-pageview attribution)
  - No new module (@nuxt/scripts) — one global tag does not justify the extra dependency
  - Inline init script kept verbatim from Google's snippet to match their troubleshooting docs
  - LGPD consent flow explicitly deferred (user accepts tradeoff; future task)
metrics:
  duration: 76s
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
  completed: "2026-04-16T20:55:46Z"
---

# Quick 260416-otk: Integrar Google Analytics Tag (G-HNPWG94BEE) Summary

Google Analytics 4 (gtag.js) with measurement ID `G-HNPWG94BEE` is now injected into the `<head>` of every rendered route via `nuxt.config.ts > app.head.script`, loaded asynchronously to avoid LCP/CLS impact.

## What Was Done

### Task 1: Add gtag.js loader + init inline script to nuxt.config.ts app.head — commit `1c0f681`

Extended the existing `app` block in `nuxt.config.ts` with a `head.script` array containing two entries: the async loader pointing at `googletagmanager.com/gtag/js?id=G-HNPWG94BEE`, and the inline `window.dataLayer` / `gtag('config', ...)` initializer. The existing `htmlAttrs.lang: 'pt-BR'` configuration was preserved.

**Diff applied:**

```diff
   app: {
     htmlAttrs: {
       lang: 'pt-BR',
     },
+    head: {
+      script: [
+        // Google tag (gtag.js) — loader
+        {
+          src: 'https://www.googletagmanager.com/gtag/js?id=G-HNPWG94BEE',
+          async: true,
+        },
+        // Google tag (gtag.js) — init
+        {
+          innerHTML: `window.dataLayer = window.dataLayer || [];
+function gtag(){dataLayer.push(arguments);}
+gtag('js', new Date());
+gtag('config', 'G-HNPWG94BEE');`,
+        },
+      ],
+    },
   },
```

### Task 2: Checkpoint verification (auto-approved)

Auto-mode was active (`workflow.auto_advance = true`), so the human-verify checkpoint was auto-approved after automated verification passed. Evidence collected during Task 1:

- **Production build:** `pnpm build` completed with no TypeScript errors on the `app.head.script` shape.
- **SSR renderer bundle:** `grep -c "G-HNPWG94BEE" .output/server/chunks/routes/renderer.mjs` → 1 (tracking ID baked into global SSR head).
- **Live SSR test (preview server on `:3000`, HTTP 200):** `curl` of `/` returned HTML containing all three expected markers:
  - `googletagmanager.com/gtag/js?id=G-HNPWG94BEE`
  - `G-HNPWG94BEE`
  - `dataLayer`

This confirms the tag renders SSR into the `<head>` and will fire on every pageview across index, admin, avaliacao, encontros, pagamento, and any other route (including `ssr:false` routes, whose shell HTML still receives `app.head`).

## Files Modified

- `nuxt.config.ts` — added `app.head.script` array with gtag loader + init entries

## Commits

- `1c0f681` — feat(quick-260416-otk): integrate Google Analytics gtag.js (G-HNPWG94BEE)

## Verification Evidence

**grep counts on `nuxt.config.ts`:**
- `G-HNPWG94BEE` → 2 (loader URL + config call) — matches plan expectation
- `googletagmanager.com/gtag/js` → 1 — matches plan expectation
- `async: true` → 1 — matches plan expectation

**Live SSR curl excerpt (`curl http://localhost:3000/` against preview build):**
```
googletagmanager.com/gtag/js?id=G-HNPWG94BEE
G-HNPWG94BEE
dataLayer
HTTP 200
```

## Deviations from Plan

None — plan executed exactly as written.

## Notes & Follow-ups

- **LGPD consent flow remains a future consideration.** CLAUDE.md explicitly flags gtag.js as privacy-sensitive under LGPD, but the user accepted this tradeoff for the initial install. A future task should wrap the tag behind an explicit opt-in consent banner before heavy traffic / ad spend, or switch to a privacy-first analytics provider (Plausible/Fathom) as suggested in CLAUDE.md's "What NOT to Use" section.
- **Realtime verification in GA UI** was not performed by Claude (requires browser + logged-in GA account). The user can confirm the tag is firing by visiting https://analytics.google.com/analytics/web/ → property G-HNPWG94BEE → Reports → Realtime.
- **No consent gating on `ssr:false` admin routes.** The admin/pagamento/encontros routes also load the tag. If these should be excluded from analytics (e.g., to avoid polluting GA with internal ops traffic), add a route-aware exclusion later.

## Self-Check: PASSED

- [x] `nuxt.config.ts` modified (verified via `git show 1c0f681 --stat`)
- [x] Commit `1c0f681` exists on `main`
- [x] SSR output confirmed to contain `G-HNPWG94BEE` (grep of renderer.mjs + live curl)
- [x] `pnpm build` succeeded with no TypeScript errors
- [x] Existing `htmlAttrs.lang: 'pt-BR'` preserved
