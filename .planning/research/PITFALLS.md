# Pitfalls Research

**Domain:** High-conversion landing page — miles/travel consultancy, Brazilian market, Nuxt 3 SSR
**Researched:** 2026-03-21
**Confidence:** HIGH (Nuxt 3 technical pitfalls), MEDIUM (conversion/UX patterns), MEDIUM (Brazil-specific market patterns)

---

## Critical Pitfalls

### Pitfall 1: $fetch Double-Fetching in SSR — Lead Form Payload Sent Twice

**What goes wrong:**
Using `$fetch` directly inside a component that runs during SSR causes the HTTP request to fire once on the server and again on the client during hydration. For a lead form submit this means no double-submit (user clicks once), but for any data loaded on page render (e.g., dynamic testimonials, Marcio's bio data pulled from API) you silently pay double the Fastify API calls and inflate TTFB.

**Why it happens:**
Developers coming from Vue SPA habits reach for `$fetch` everywhere. Nuxt SSR has a different contract: `useFetch` and `useAsyncData` serialize the result into the page payload so the client never re-fetches. `$fetch` does not.

**How to avoid:**
Use `useFetch` or `useAsyncData` for all data loaded at page render time. Reserve `$fetch` exclusively for user-triggered actions (form submissions, button clicks). Never call `$fetch` inside `<script setup>` at the top level of a server-rendered page.

**Warning signs:**
- Network tab shows the same GET request twice on initial page load (once in SSR waterfall, once after hydration)
- Fastify logs show duplicate requests on every page view
- Nuxt DevTools payload panel shows empty `data` for a fetch that "works"

**Phase to address:** Foundation / project setup phase — establish the fetch convention before writing any component that touches the Fastify API.

---

### Pitfall 2: Hydration Mismatch Breaks LCP and Causes CLS

**What goes wrong:**
The server renders HTML that differs from what the client produces after hydration. Vue throws a warning but silently discards the server HTML and re-renders the entire component tree. This causes a visible flash, destroys Largest Contentful Paint, and creates layout shift — all of which lower conversion and Google ranking simultaneously.

**Why it happens:**
Common triggers in this project:
- Reading `window`, `localStorage`, or `navigator` during SSR (doesn't exist on server)
- Using `new Date()` or `Math.random()` during render (server and client produce different values)
- Nuxt UI components that reference browser globals internally if misconfigured
- Conditionally rendering content based on a reactive value that initializes differently on server vs. client

**How to avoid:**
- Wrap any browser-only logic in `<ClientOnly>` or guard with `if (import.meta.client)`
- Use `useNuxtApp().$config` for env-dependent values, not raw `process.env` in components
- Never derive rendered content from `Date.now()` without memoization
- Test with `nuxt build && nuxt preview` — hydration mismatches often don't appear in `nuxt dev`

**Warning signs:**
- Browser console: "Hydration node mismatch" errors
- Visible flash of layout on page load
- CLS score above 0.1 in PageSpeed Insights
- Lighthouse reports LCP element changing between server and client paint

**Phase to address:** Component build phase — enforce the rule before building the Hero, testimonials, and form sections.

---

### Pitfall 3: Nuxt Image + Cloudflare R2 Optimization Not Applied in Production

**What goes wrong:**
`<NuxtImg>` applies format conversion (WebP/AVIF), resizing, and quality compression during local development but silently serves the original unoptimized file after deployment to Cloudflare. The hero image (typically 2–4 MB) loads at full size, destroying LCP — the single most important Core Web Vital for a landing page's Google ranking and paid traffic quality score.

**Why it happens:**
Cloudflare Image Transformations is a separate dashboard feature that must be explicitly enabled per domain. Without it, the Cloudflare provider in `@nuxt/image` falls back to serving the raw R2 object. Multiple confirmed open issues exist in the `nuxt/image` repo (#1588, #1061, #980).

**How to avoid:**
1. Enable Cloudflare Image Transformations in the Cloudflare dashboard (Images > Transformations) before deploying
2. If using R2 as origin, enable "Resize Image from Any Origin"
3. Pre-optimize all images before uploading to R2 (use Squoosh or sharp CLI): hero images below 200 KB, testimonial photos below 60 KB
4. Set `fetchpriority="high"` and `loading="eager"` on the hero image — never lazy-load the LCP element
5. Test with `nuxt preview` pointed at staging Cloudflare to verify optimization is active before launch

**Warning signs:**
- PageSpeed Insights shows "Serve images in next-gen formats" warning
- Network tab shows `.jpg`/`.png` being loaded instead of `.webp`
- LCP above 2.5 seconds on mobile
- R2 bandwidth spikes without corresponding traffic spikes

**Phase to address:** Infrastructure / deployment phase — validate Cloudflare configuration before any asset upload, not as an afterthought.

---

### Pitfall 4: CORS Failure Between Nuxt SSR and Fastify on Client-Side Navigation

**What goes wrong:**
On initial page load, `useFetch` runs server-side — Nuxt's Node process talks directly to Fastify, no browser CORS check applies. But when the user interacts with the form and the submit fires `$fetch` from the browser, the browser enforces CORS. If Fastify isn't configured with the correct `Access-Control-Allow-Origin` header, the lead form submission silently fails — the user sees no error, the lead is lost, and Marcio never knows.

**Why it happens:**
Developers test the form in dev mode where Nuxt proxies requests or the ports match. In production with different domains (e.g., `flyupmilhas.com.br` calling `api.flyupmilhas.com.br`), CORS becomes active. SSR data fetches always "work" (they bypass CORS), masking the misconfiguration.

**How to avoid:**
- Configure Fastify's `@fastify/cors` plugin with explicit allowed origins matching the production domain — never use wildcard `*` for form endpoints
- Add a Nuxt server-side proxy route (`/api/leads` proxied to Fastify) so the form submit also runs through Nuxt's server, eliminating browser CORS entirely
- Smoke-test the form submit from a browser pointed at the staging URL before launch

**Warning signs:**
- Form works in `nuxt dev` but fails silently after deploy
- Browser console shows "CORS policy" error on form POST
- Fastify access logs show no POST request when form is submitted

**Phase to address:** Backend integration phase — define the proxy strategy before wiring up the form, not after.

---

### Pitfall 5: Lead Form with Too Many Fields Kills Qualified Leads on Mobile

**What goes wrong:**
The qualification form asks for name, WhatsApp, gastos mensais (monthly spend), and objective. That is 4 fields — the safe maximum for mobile. If any field is added (email, city, card type, etc.), form completion rates drop sharply. On mobile (Brazil's dominant access device), each additional field is a thumb-friction point that costs 10–20% of completions.

**Why it happens:**
Stakeholders want more qualification data. Developers add fields because "it's just one more input." The cumulative effect is a form that feels like a questionnaire, breaking the low-commitment promise of the R$200 consultancy pitch.

**How to avoid:**
- Freeze the form at exactly 4 fields as defined in PROJECT.md — no new fields without removing one
- Use WhatsApp number input with Brazilian phone mask (`(XX) XXXXX-XXXX`) and validation — malformed numbers are the #1 reason Marcio can't follow up
- Mark all 4 fields as required — partial lead data is useless without WhatsApp
- On mobile, use `inputmode="numeric"` for the WhatsApp field and `inputmode="numeric"` for monthly spend to trigger the numeric keyboard
- Place the form both above the fold (or reachable via sticky CTA) and after the social proof section

**Warning signs:**
- Form abandonment rate above 60% (visible in analytics event tracking)
- Submissions missing the WhatsApp field (validation not enforced)
- User testing shows hesitation before the "gastos mensais" field

**Phase to address:** UI/form build phase — lock the field count before implementation and treat additions as scope creep.

---

### Pitfall 6: CTA Dilution — Multiple Actions Competing for Attention

**What goes wrong:**
The page ends up with a "Fale no WhatsApp" button, a "Preencha o formulário" section, a "Conheça o Marcio" anchor link, and a footer contact email. Each additional action reduces the probability that the user takes the primary one. Research consistently shows that removing competing CTAs increases primary CTA conversion by 20–50%.

**Why it happens:**
Sections are built in isolation. Each section designer adds a "logical" local CTA. By launch, the page has 5 different action paths.

**How to avoid:**
- Define one primary conversion action upfront: the qualification form submit
- All other CTAs (WhatsApp, social links) are secondary and should not appear before the form section
- The floating/sticky CTA button should scroll to the form, not open WhatsApp directly (WhatsApp bypass skips qualification)
- Audit all clickable elements in a final pass before launch

**Warning signs:**
- Heatmaps show clicks scattered across multiple "CTA" areas
- WhatsApp button gets more clicks than the form (users bypass qualification)
- Stakeholder keeps adding "quick contact" options during review

**Phase to address:** Design/UX phase — establish CTA hierarchy in the wireframe, before any section is coded.

---

### Pitfall 7: Social Proof That Triggers Skepticism Instead of Trust

**What goes wrong:**
Generic testimonials ("Marcio is amazing!"), screenshots with blurred names, or a suspiciously perfect 5-star collection actively reduce trust in the Brazilian market, where distrust of online services is high. Vague proof ("helped me save thousands") without specifics is treated as fabricated.

**Why it happens:**
Testimonials are collected last-minute, whatever is available gets used, and no specificity is enforced.

**How to avoid:**
- Collect testimonials with specific numbers: routes flown, miles accumulated, money saved in R$, cabin class achieved
- Show real first names, city, and a profile photo — avoid stock photos
- Include at least one "before/after" result screenshot from the actual consultancy
- Aim for 4–5 testimonials, not 10+ (too many looks manufactured)
- If Marcio has Instagram/LinkedIn engagement, use a follower count or post engagement as social proof — Brazil responds strongly to social media credibility

**Warning signs:**
- No testimonials ready at content collection time
- Testimonials contain no specific numbers or routes
- Photos are visibly stock or watermarked

**Phase to address:** Content/copywriting phase — establish the testimonial collection template before design, not after.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline all styles in components instead of Tailwind classes | Faster initial iteration | Inconsistent spacing/color that breaks design system | Never — use Tailwind from day one |
| Skip `<NuxtImg>` and use raw `<img>` tags for "speed" | Avoids Cloudflare config complexity | Full-size images destroy LCP; no lazy loading | Never for any image above the fold |
| Use `$fetch` everywhere for simplicity | One mental model | Double requests on SSR pages, Fastify load doubles | Only for user-triggered actions (form submit) |
| Skip WhatsApp field validation, accept any string | Less frontend code | Marcio receives leads he can't follow up on | Never — number is the critical field |
| Hard-code Fastify URL in `nuxt.config` | Works in dev | Breaks in staging/production; env swap is manual | Never — use runtime config |
| Skip spam protection on form | Faster to build | MongoDB fills with bot leads; Fastify spammed | Never — add honeypot from day one |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Fastify API | Call `$fetch(apiUrl)` from component top level (SSR + client double-fetch) | Use `useFetch` for render-time data; `$fetch` only for user actions |
| Fastify API | Hard-code `http://localhost:3001` in source code | Use `useRuntimeConfig().public.apiBase` with env var per environment |
| Cloudflare R2 | Expect `<NuxtImg>` to auto-optimize R2 images without dashboard config | Enable Cloudflare Image Transformations first; pre-optimize images before upload |
| Cloudflare R2 | Use unsigned public R2 URLs with no caching headers | Set explicit `Cache-Control: public, max-age=31536000` on R2 objects for hero/static assets |
| MongoDB leads | Expose MongoDB connection string in Nuxt `runtimeConfig.public` | Keep in `runtimeConfig` (server-only) — `runtimeConfig.public` is sent to the browser |
| Nuxt UI forms | Use Nuxt UI's built-in `UForm` without schema validation | Always pair with `valibot` or `zod` schema for field validation before submit |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hero image served unoptimized from R2 | LCP > 3s on mobile; PageSpeed score below 50 | Pre-optimize to WebP < 200 KB; enable Cloudflare Image Transformations | Every page load on mobile — immediate |
| No server-side caching on Nuxt (TTFB unacceptably high under load) | Page response slow when traffic spikes from paid ad campaign | Use Nitro route rules with `cache: { maxAge: 3600 }` for the static LP | First paid traffic campaign |
| All JS in one bundle (no async components) | Large initial JS payload; slow TTI on mobile 3G | Use `defineAsyncComponent` or Nuxt's lazy component imports for below-fold sections | Any mobile user on Brazilian carrier 3G/4G |
| Unoptimized Google Fonts import | Render-blocking font request; FCP delayed | Use `@nuxt/fonts` module or self-host Inter/Geist on R2; preconnect hint | Every page load |
| Form sends to Fastify on every keystroke (no debounce) | Not a perf issue per se, but server log pollution | Validate on submit only, not on input event | Not a scale issue — but pollutes Fastify logs |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| No honeypot field on lead form | Bot submissions flood MongoDB; Marcio wastes time on fake leads | Add CSS-hidden honeypot field; reject any submission where it is filled; add minimum-time-on-page check (< 3 seconds = bot) |
| MongoDB connection string in `runtimeConfig.public` | String exposed in browser JS bundle; anyone can directly write to MongoDB | Move all DB credentials to server-only `runtimeConfig` (no `public` prefix) |
| Fastify endpoint accepts any origin | CSRF attacks from third-party sites can submit fake leads using a victim's browser session | Validate `Origin` header on Fastify; use Nuxt server proxy so the endpoint is never directly public |
| No rate limiting on lead submission endpoint | Bot can submit 1000 leads per minute | Add `@fastify/rate-limit` plugin on the POST /leads route; limit to 5 submissions per IP per hour |
| User-supplied WhatsApp number used directly in outgoing message without sanitization | WhatsApp injection if Marcio's tooling auto-opens `wa.me/` links | Validate number format with regex before storage; strip all non-digit characters server-side |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| CTA button says "Enviar" or "Submit" | Low click rate — no value signal | Use specific copy: "Quero Minha Consultoria" or "Solicitar Consultoria VIP" |
| Form section not reachable from hero without scrolling on mobile | Users who are ready to convert immediately bounce | Add a sticky CTA button visible on mobile that jumps to form; place form link in hero |
| No confirmation message after form submit | User doesn't know if submission worked; may submit multiple times | Show a clear success message with next-steps: "Recebi! Marcio vai te chamar no WhatsApp em até 24h" |
| Price displayed without context | R$200 feels arbitrary; user doesn't know if it's worth it | Show price only after value proposition and social proof; anchor with what clients saved (e.g., "Economizou R$3.200 em uma passagem business") |
| Testimonials without photos or identifiable details | Skepticism in the Brazilian market where fake reviews are common | Use real first name + city + specific result; link to the client's Instagram if available |
| Loading spinner on form submit with no timeout | If Fastify is slow, user waits indefinitely and refreshes (double submit) | Add a 10-second timeout with a friendly error: "Algo deu errado, tente novamente" |
| Navigation menu or external links on the LP | Users click away, conversion lost | No navigation — single-page LP with zero exit links except the form CTA |

---

## "Looks Done But Isn't" Checklist

- [ ] **Hero CTA:** The button visible above the fold — verify it scrolls to the form, not opens WhatsApp (WhatsApp bypasses qualification)
- [ ] **Form validation:** WhatsApp field — verify it rejects invalid formats before submit, not just "required"
- [ ] **Image optimization:** Hero and testimonial photos — verify they load as WebP in production (not only in dev), check Network tab after Cloudflare deployment
- [ ] **Spam protection:** Lead form — verify honeypot field is present in the DOM but hidden via CSS (not `display:none` or `type="hidden"`)
- [ ] **Success state:** Form submit — verify the success message appears and the form resets; check that Fastify actually wrote to MongoDB
- [ ] **CORS in production:** Form submit from the real domain — verify no "CORS policy" error in browser console after deployment
- [ ] **Mobile keyboard:** WhatsApp and gastos mensais fields — verify numeric keyboard appears on iOS and Android
- [ ] **SSR check:** Verify `nuxt build && nuxt preview` matches what `nuxt dev` shows — hydration mismatches only appear in production builds
- [ ] **No competing CTAs:** Audit the DOM for all `<a>` and `<button>` elements — any that send users off the page before the form is a conversion leak
- [ ] **Fastify env config:** Verify `NUXT_PUBLIC_API_BASE` is set correctly in production and the app does not fall back to `localhost`

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Double-fetch discovered after launch | LOW | Replace `$fetch` calls in `<script setup>` with `useAsyncData`; no DB or infra changes needed |
| Hydration mismatch causing flash | MEDIUM | Identify affected component with Nuxt DevTools hydration diff; wrap with `<ClientOnly>` or fix conditional |
| Images not optimizing on Cloudflare | LOW | Enable Image Transformations in Cloudflare dashboard; clear CDN cache; re-test |
| CORS blocking form submissions | LOW | Add Fastify CORS config or Nuxt proxy route; redeploy; no data loss since submissions were blocked |
| MongoDB full of bot leads | MEDIUM | Add honeypot + rate limit; purge bot submissions (filter by time-on-page < 3s or honeypot flag); legitimate leads are unaffected |
| Form with too many fields already built | LOW | Remove a field from the UI and the MongoDB schema — no migration needed if done before production data |
| Weak social proof discovered after launch | HIGH | Must collect real testimonials; page must be re-deployed; conversion suffers until fixed — collect testimonials before design phase |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `$fetch` double-fetching | Foundation / project setup | Audit all `$fetch` uses in `<script setup>`; check Fastify logs for duplicate GETs |
| Hydration mismatch | Component build phase | Run `nuxt build && nuxt preview`; check browser console for hydration warnings |
| Cloudflare R2 image optimization | Infrastructure / deployment phase | Load production URL; Network tab must show `.webp`; LCP under 2.5s on PageSpeed |
| CORS Fastify failure | Backend integration phase | Submit form from staging URL in a real browser; verify no CORS error |
| Too many form fields | UI/form design phase | Count fields before implementation; lock at 4 |
| CTA dilution | Design/wireframe phase | Count all clickable elements; only one primary CTA per viewport |
| Weak social proof | Content collection phase (before design) | Testimonials must include: name, city, photo, specific result in R$ or miles |
| Spam/bot submissions | Backend integration phase | Verify honeypot field present; verify rate limit active on POST /leads in Fastify |
| Price without context | Copywriting / section order phase | Price appears only after value section and testimonials in the page scroll order |

---

## Sources

- [Nuxt SSR Common Pitfalls and How to Avoid Them](https://infinitejs.com/posts/nuxt-ssr-pitfalls-avoidance/)
- [Fixing Nuxt Hydration Mismatches in the Real World](https://ryanclements.dev/posts/fixing-nuxt-hydration-mismatches-in-the-real-world)
- [Optimizing Nuxt Server Side Rendering (SSR) Performance — DebugBear](https://www.debugbear.com/blog/nuxt-ssr-performance)
- [Nuxt and Hydration Best Practices — nuxt.com](https://nuxt.com/docs/3.x/guide/best-practices/hydration)
- [When to Use $fetch, useFetch, or useAsyncData — MasteringNuxt](https://masteringnuxt.com/blog/when-to-use-fetch-usefetch-or-useasyncdata-in-nuxt-a-comprehensive-guide)
- [NuxtImg optimization props not applied on Cloudflare — Issue #1588](https://github.com/nuxt/image/issues/1588)
- [Cloudflare Provider — Nuxt Image docs](https://image.nuxt.com/providers/cloudflare)
- [CORS Missing Allow Origin with useFetch — Nuxt Discussion #19276](https://github.com/nuxt/nuxt/discussions/19276)
- [Landing Page Mistakes That Kill Conversions 2025 — GrowthFueling](https://growthfueling.com/landing-page-mistakes-that-kill-conversions-in-2025/)
- [Social Proof on Landing Page — LanderLab](https://landerlab.io/blog/social-proof-examples)
- [Honeypot Fields: Bot Protection — DEV Community](https://dev.to/alexisfranorge/honeypot-fields-bot-protection-thats-free-and-takes-5-minutes-2eid)
- [Landing Pages que Convertem 2025 — Tornera Brasil](https://www.tornera.com.br/blogs/post/landing-pages-que-convertem-o-que-n%C3%A3o-pode-faltar-em-2025)
- [WhatsApp Lead Generation Brazil — FlowCart](https://www.flowcart.ai/blog/whatsapp-lead-generation)

---

*Pitfalls research for: High-conversion landing page — Fly Up Milhas, Nuxt 3 SSR, Brazilian market*
*Researched: 2026-03-21*
