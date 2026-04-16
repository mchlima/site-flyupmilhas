---
phase: quick-260416-otk
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - nuxt.config.ts
autonomous: false
requirements:
  - QUICK-260416-OTK-01
must_haves:
  truths:
    - "Every page (index, /admin, /avaliacao, /encontros, /pagamento, etc.) loads the Google tag script from googletagmanager.com in the HTML <head> during SSR"
    - "window.dataLayer is initialized and gtag('js', Date) + gtag('config', 'G-HNPWG94BEE') run on page load"
    - "The tracking ID G-HNPWG94BEE appears in the initial SSR HTML (viewable via curl / View Source)"
    - "The loader script has the async attribute so it does not block page render (LCP/CLS unaffected)"
  artifacts:
    - path: "nuxt.config.ts"
      provides: "app.head.script entries for Google tag (gtag.js) loader + inline gtag init"
      contains: "G-HNPWG94BEE"
  key_links:
    - from: "nuxt.config.ts (app.head.script)"
      to: "every rendered page's <head>"
      via: "Nuxt SSR head injection (Nitro renders app.head globally)"
      pattern: "googletagmanager\\.com/gtag/js\\?id=G-HNPWG94BEE"
---

<objective>
Integrate Google Analytics (gtag.js) with measurement ID G-HNPWG94BEE across every page of the Fly Up Milhas Nuxt 4 site.

Purpose: Start collecting GA4 analytics data on production (pageviews, sessions, conversions). The user has explicitly requested this tag installed now; LGPD consent flow is noted as a follow-up concern but not blocking (see CLAUDE.md "What NOT to Use" note — acknowledged, user accepts tradeoff).

Output: A single `nuxt.config.ts` change that adds two `<script>` entries to `app.head` so the tag renders SSR on every route.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@nuxt.config.ts
@app/app.vue

<interfaces>
<!-- Current nuxt.config.ts app block (from inspection): -->
```typescript
app: {
  htmlAttrs: {
    lang: 'pt-BR',
  },
},
```

<!-- Nuxt 4 supports extending `app.head` with `link`, `meta`, and `script` arrays.
     The `script` array accepts objects with `src` + attrs for external scripts,
     and objects with `innerHTML` for inline code. SSR injects these into the
     final HTML <head> for every route rendered by Nuxt. Reference:
     https://nuxt.com/docs/api/nuxt-config#head -->

<!-- Exact tag to integrate (provided by user):
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HNPWG94BEE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-HNPWG94BEE');
</script>
-->

<!-- Pages that must inherit the tag (from app/pages/):
     index.vue, admin.vue, admin/*, avaliacao/*, encontros/*, pagamento/*
     Note: admin, pagamento, encontros are SSR-disabled (ssr:false in routeRules)
     but app.head still applies — the shell HTML served for the CSR route still
     contains the script tag. -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add gtag.js loader + init inline script to nuxt.config.ts app.head</name>
  <files>nuxt.config.ts</files>
  <action>
In `nuxt.config.ts`, extend the existing `app` block to add a `head.script` array with two entries that mirror the exact Google-provided snippet.

Replace:
```typescript
app: {
  htmlAttrs: {
    lang: 'pt-BR',
  },
},
```

with:
```typescript
app: {
  htmlAttrs: {
    lang: 'pt-BR',
  },
  head: {
    script: [
      // Google tag (gtag.js) — loader
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-HNPWG94BEE',
        async: true,
      },
      // Google tag (gtag.js) — init
      {
        innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HNPWG94BEE');`,
      },
    ],
  },
},
```

Rationale / why this approach (NOT alternatives):
- `nuxt.config.ts > app.head.script` is the Nuxt 4 idiomatic way to inject a script into every route's SSR HTML. Documented at https://nuxt.com/docs/api/nuxt-config#head
- Chose this over `useHead()` in `app/app.vue`: `app.vue` only wraps `<NuxtPage />`; placing the script here would still apply globally, but `nuxt.config.ts` is the canonical "global, static head" location and keeps `app.vue` clean.
- Chose this over `@nuxt/scripts` / `useScript()`: that module is NOT installed (see package.json — only @nuxt/ui, @nuxt/image, @nuxtjs/seo, @nuxt/eslint, @vercel/analytics, @vercel/speed-insights). Adding a new module for one GA tag is overkill and adds bundle weight.
- Chose this over a custom Nuxt plugin (`plugins/gtag.client.ts`): plugins run client-side only, meaning the script tag would not appear in the initial SSR HTML — hurting GA's ability to attribute the first pageview correctly and missing the first few hundred ms of user activity.
- `async: true` preserves non-blocking load (critical per CLAUDE.md performance constraint and STATE.md v1.6 CLS < 0.1 requirement). No `defer` — `async` matches Google's official snippet exactly.
- Inline `innerHTML` block uses the EXACT code Google provided, unmodified (whitespace/formatting preserved where relevant). Do NOT "improve" or minify it — keep it literal so it matches Google's documentation for troubleshooting.
- The tag loads on every route because Nuxt applies `app.head` globally across SSR and CSR route rendering. Routes with `ssr: false` (admin, pagamento, encontros) still receive the script tag in the shell HTML before Nuxt hydrates.

Do NOT:
- Do NOT add a consent gate / LGPD banner in this task (user explicitly requested raw tag now; consent flow is a separate future task).
- Do NOT install `@nuxt/scripts` or any additional module.
- Do NOT edit `app/app.vue` — keep it minimal.
- Do NOT use `useHead()` in a plugin or layout — `nuxt.config.ts` is the right scope.
- Do NOT hardcode the ID in multiple places — it lives in exactly two strings in the script entries (one URL, one config call), matching Google's snippet verbatim.
  </action>
  <verify>
    <automated>
grep -c "G-HNPWG94BEE" nuxt.config.ts  # Expect: 2 (once in src URL, once in config('...') call)
grep -c "googletagmanager.com/gtag/js" nuxt.config.ts  # Expect: 1
grep -c "async: true" nuxt.config.ts  # Expect: >=1
pnpm build 2>&1 | tail -20  # Expect: build succeeds, no TS errors on app.head.script shape
    </automated>
  </verify>
  <done>
    - `nuxt.config.ts` contains `app.head.script` array with loader entry (src + async) and inline entry (innerHTML) — both referencing G-HNPWG94BEE.
    - `pnpm build` completes successfully with no TypeScript errors.
    - The existing `app.htmlAttrs.lang: 'pt-BR'` config is preserved (not removed by the edit).
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Verify tag loads on live dev server and fires in GA Realtime</name>
  <what-built>
    Google tag (gtag.js) with ID G-HNPWG94BEE injected into the `<head>` of every Nuxt route via `nuxt.config.ts > app.head.script`. Task 1 modified only `nuxt.config.ts`.
  </what-built>
  <how-to-verify>
    1. Start dev server: `pnpm dev` (runs on port 3002 per devServer config).
    2. Visit http://localhost:3002 in a browser. Open DevTools > Elements > search the `<head>` for `googletagmanager.com` — confirm the `<script async src="...gtag/js?id=G-HNPWG94BEE">` tag is present.
    3. In the same DevTools session, open Network tab, filter by `gtag` or `google-analytics` — confirm the loader request (200 OK) and at least one `collect` / `g/collect` request fires on page load.
    4. In the browser console, type `window.dataLayer` — should return an array with at least the `js` and `config` events pushed.
    5. Navigate to another route (e.g. `/avaliacao` if accessible, or `/admin`) — confirm the tag is present there too (View Source > search `G-HNPWG94BEE`).
    6. (Optional but recommended) Open https://analytics.google.com/analytics/web/ > property with ID G-HNPWG94BEE > Reports > Realtime. Your visit should appear within 30 seconds.
    7. Verify no console errors related to gtag or dataLayer.
    8. Run `pnpm build` and `pnpm preview` — confirm the tag also appears in the production SSR HTML (View Source on preview URL).

    Expected outcome: Tag renders SSR, async loader fetches successfully, dataLayer populates, no regressions on page load performance.
  </how-to-verify>
  <resume-signal>
    Type "approved" if the tag loads on all routes and Realtime shows activity (or confirm via DevTools alone if GA Realtime access is unavailable). Otherwise describe what you see (missing on a route / console error / network failure / build error) and I will iterate.
  </resume-signal>
</task>

</tasks>

<verification>
- `nuxt.config.ts` builds cleanly (`pnpm build`).
- View Source on `/` shows both the `<script async src=".../gtag/js?id=G-HNPWG94BEE">` and the inline init script in the `<head>`.
- `window.dataLayer` is populated on page load in the browser console.
- At least one GA4 network event fires on initial pageview.
- No regressions: existing `htmlAttrs.lang` still set, no TypeScript errors, no new console warnings.
</verification>

<success_criteria>
- Google Analytics tag G-HNPWG94BEE is live on every page of the site (SSR-rendered into `<head>`).
- Tag loads asynchronously (`async` attribute present) — zero measurable impact on LCP/CLS.
- User can see Realtime activity in the G-HNPWG94BEE GA4 property.
- Zero new files created; one file modified (`nuxt.config.ts`).
- Implementation is the idiomatic Nuxt 4 way (no extra modules, no client-only plugin, no duplication across layouts).
</success_criteria>

<output>
After completion, create `.planning/quick/260416-otk-integrar-google-analytics-tag-g-hnpwg94b/260416-otk-SUMMARY.md` with:
- Exact diff applied to `nuxt.config.ts`
- Verification evidence (View Source excerpt showing the injected tag)
- Note reminding user that LGPD consent flow remains a future consideration (not blocked on it now per explicit request)
</output>
