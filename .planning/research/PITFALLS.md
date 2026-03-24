# Pitfalls Research

**Domain:** High-conversion landing page — miles/travel consultancy, Brazilian market, Nuxt 4 SSR
**Researched:** 2026-03-24 (updated — v1.5 copy/conversion migration added)
**Confidence:** HIGH (code-verified, codebase inspected directly)

---

## v1.5 Migration Pitfalls — Copy Rewrite + Conversion Optimization

These pitfalls are specific to the v1.5 milestone: a major copy rewrite and conversion optimization applied to an existing, working Nuxt 4 LP. They are distinct from the general pitfalls in the section below and should be addressed first.

---

### Pitfall M1: Backend Schema Out of Sync After Removing `gastoMensal`

**What goes wrong:**
The form reduction from 4 to 3 fields removes `gastoMensal`. This field exists in **three separate places** that must all change atomically:
1. `server/leads/schema.ts` — the Zod schema used by Fastify to validate the POST body
2. `app/composables/useLeadForm.ts` — the `LeadFormSchema` Zod object (mirrored from server per comment on line 4)
3. `app/components/Section/SectionLeadForm.vue` — the `state` reactive object, the `<UFormField>` block, and the `onSubmit()` call

If even one of the three is updated without the others, the following breaks silently:
- If only the frontend removes the field: the backend Zod schema rejects the request with `gastoMensal: Required` (400 error) or accepts but logs schema warnings if the field is optional
- If only the backend schema removes the field: the frontend still sends `gastoMensal` and it is silently ignored — but the MongoDB document will lack the field even though the UX still asks for it
- If `useLeadForm.ts` is updated but the component is not: TypeScript may catch this, but only if `strict` mode is on and the `onSubmit` payload is typed

**Why it happens:**
The schema was intentionally duplicated ("Mirror server/leads/schema.ts EXACTLY" is the comment in `useLeadForm.ts`). This is the correct pattern — but it means a field removal requires a synchronized 3-file change. Developers who only update the visible UI component forget the composable and the server schema.

**How to avoid:**
Execute the change in this exact order:
1. Remove `gastoMensal` from `server/leads/schema.ts` first — this makes the Fastify server accept submissions without it
2. Remove `gastoMensal` from `app/composables/useLeadForm.ts` second — this aligns the frontend schema
3. Remove `gastoMensal` from `SectionLeadForm.vue` last — remove the `state.gastoMensal` field, the `<UFormField>` block, and the `onSubmit` payload key
4. Run `nuxt build` after all three changes — TypeScript will catch any payload shape mismatch

Do not use `.optional()` on `gastoMensal` as an intermediate step — that creates a false sense of completion while leaving the field in the UX.

**Warning signs:**
- Form submits return 400 after frontend change — backend schema not updated
- `state` object has `gastoMensal` but the form field is removed — the field is still being sent to the backend invisibly
- TypeScript error: `Object literal may only specify known properties` on the `submit()` call

**Phase to address:** Phase 1 — Form simplification. Must be the first code change in v1.5, before any copy work, to verify the schema chain is intact.

---

### Pitfall M2: `objetivo` Enum Contains `renda-extra` — Must Be Removed Everywhere

**What goes wrong:**
The "renda extra" removal is not just a copy change — the string `'renda-extra'` is a hard-coded enum value in three critical locations:

1. `server/leads/schema.ts` line 10: `z.enum(['executiva', 'economia', 'renda-extra'])`
2. `app/composables/useLeadForm.ts` line 12: `z.enum(['executiva', 'economia', 'renda-extra'])`
3. `app/components/Section/SectionLeadForm.vue` line 10: `{ label: 'Renda extra com milhas', value: 'renda-extra' }`

Additionally, `SectionAbout.vue` contains a bento card titled "Renda Extra com Milhas" with copy about earning extra income. If only the card is removed from `SectionAbout` but the `objetivo` dropdown option remains, users who want "renda extra" can still submit that intent — contradicting the product positioning change.

If the `objetivo` enum is changed without updating all three schema files, the same desync failure from Pitfall M1 applies.

**Why it happens:**
"Removing renda extra" sounds like a copy task. Developers focus on visible text strings and miss the enum value embedded in the Zod schema contract that drives both validation and what gets written to MongoDB.

**How to avoid:**
Treat "renda extra removal" as a 5-location change:
1. `server/leads/schema.ts` — remove `'renda-extra'` from the enum
2. `app/composables/useLeadForm.ts` — remove `'renda-extra'` from the enum
3. `SectionLeadForm.vue` — remove the `renda-extra` option from `objetivoOptions`
4. `SectionAbout.vue` — remove the "Renda Extra com Milhas" bento card and rewrite the subtitle
5. Run a codebase-wide text search for `renda.extra|renda_extra|renda-extra` before considering the task done

**Warning signs:**
- The `objetivo` dropdown still shows "Renda extra com milhas" after the SectionAbout card is removed
- MongoDB `leads` collection still contains `objetivo: 'renda-extra'` after launch
- Text search finds the string in any `.vue` or `.ts` file outside of `node_modules`

**Phase to address:** Phase 1 — Schema + positioning cleanup. Treat as atomic with Pitfall M1 changes.

---

### Pitfall M3: Copy Spread Across 10+ Components Creates Inconsistency

**What goes wrong:**
The v1.5 milestone rewrites copy in at least 10 components: SectionHero, SectionAbout, SectionMethod, SectionSocialProof, SectionPrice, SectionForWhom, SectionProgramContent, SectionFAQ, SectionLeadForm, and the Header CTA. When each component is edited independently without a reference document, inconsistencies accumulate:
- The price appears as "R$ 299,90" in SectionPrice but "R$ 299" in SectionMethod
- The guarantee is "7 dias" in SectionPrice but not mentioned in the FAQ
- The CTA copy varies: "Quero dar o primeiro passo" in Hero, "Comece agora" in SectionAbout, "Quero minha mentoria" in SectionPrice

These inconsistencies do not cause errors. They only become visible in a full review pass and require another editing round, adding time. More importantly, copy inconsistencies reduce trust — the LP reads as if multiple people wrote it independently.

**Why it happens:**
Copy rewrites are done component by component in isolation. There is no single source of truth for key repeated values (price, duration, guarantee, CTA text).

**How to avoid:**
Before touching any component, define a copy constants file or at minimum a reference table for all repeated values:
- Price: `R$ 299,90` (PIX) / `10x no cartão`
- Duration: `30 dias`
- Meetings: `3 encontros`
- Guarantee: `7 dias — 100% devolvido`
- Primary CTA: `Quero dar o primeiro passo` (locked per PROJECT.md v1.3)
- Support: `suporte via WhatsApp`

After each component is updated, run a visual review pass of the full rendered LP (not individual components) before marking the phase complete.

**Warning signs:**
- Price figure appears with different formatting in different sections
- Guarantee period mentioned in SectionPrice but absent from the FAQ
- CTA text differs between the sticky header and the hero

**Phase to address:** Phase 2 — Copy rewrite. Define the constants table before the first component edit, not after.

---

### Pitfall M4: WhatsApp Chat Bubble CSS Breaks Mobile Responsiveness

**What goes wrong:**
WhatsApp-style testimonials use absolutely or fixed-positioned "chat bubble" elements that mimic the WhatsApp chat interface. Common failures on mobile:
- Bubbles use `max-width: 500px` that looks correct on desktop but overflows viewport on 375px iPhone SE screens
- Sender name + timestamp row on a single line wraps awkwardly on small screens, breaking the chat metaphor
- `word-break: break-word` missing on bubble text — long email addresses or URLs in testimonial text overflow the bubble container
- If the bubble uses `position: fixed` (floating), it overlaps the sticky header or CTA button, blocking tap targets

Additionally, WhatsApp-style bubbles often use a green (`#25D366`) color scheme — this conflicts with the LP's orange/navy design system. Using the WhatsApp brand green risks visual conflict and creates brand confusion if the LP also has WhatsApp CTA buttons nearby.

**Why it happens:**
WhatsApp chat bubble components are frequently copied from CodePen or UI kits that target chat applications, not responsive landing pages. They assume a container of fixed width, not a fluid LP column.

**How to avoid:**
- Use `max-width: min(85%, 400px)` for bubble width — handles both small phones and large desktop columns
- Add `word-break: break-word; overflow-wrap: anywhere` to bubble text
- Do not use WhatsApp green (`#25D366`) for the bubble background — use the LP's off-white (`#F9FAFB`) for received and a muted navy tint for sent
- If adding a floating WhatsApp button, use `bottom: 80px` to avoid overlap with sticky CTA or back-to-top button
- Test at 375px (iPhone SE), 390px (iPhone 14), and 412px (Pixel) before marking done

**Warning signs:**
- Horizontal scroll appears on mobile at the testimonials section
- Bubble text or sender name is truncated rather than wrapping
- The testimonial section overlaps with the bottom CTA floating button on certain screen sizes

**Phase to address:** Phase 3 — Social proof / testimonials. Do the mobile responsiveness check immediately after the first bubble component is written, not at final review.

---

### Pitfall M5: Price Display with Installments Breaks on Tailwind Flex Wrapping

**What goes wrong:**
The v1.5 price display adds two payment options: `R$ 299,90 no PIX` and `10x no cartão`. A common pattern is to display these side by side in a flex row. On mobile, the row wraps but the two elements become visually indistinguishable — the installment line reads as a continuation of the PIX line instead of a separate option.

Additionally:
- The installment value (`10x de R$ 29,99`) must be calculated and formatted precisely. `29.99 * 10 = 299.90` in JavaScript is `299.9000000000001` due to floating-point arithmetic. Using `Number.toFixed(2)` on the computed value before displaying it prevents displaying `R$ 299,90000001`.
- Brazilian number formatting uses `.` as the thousand separator and `,` as the decimal separator: `R$ 299,90` not `R$ 299.90`. Hard-coding the string `"R$ 299,90"` is safer than using `Intl.NumberFormat` (which requires correct locale `pt-BR` and `currency: 'BRL'` — easy to misconfigure in SSR).
- If the guarantee block ("7 dias") is placed inside the same `<SectionPrice>` component after the price, the visual hierarchy can become crowded. The guarantee should visually breathe — a separate row with a trust icon, not inline with the price.

**Why it happens:**
Developers add price display as a UI concern without considering number formatting edge cases or the mobile flex-wrap behavior of a side-by-side layout.

**How to avoid:**
- Hard-code price strings as literals: `"R$ 299,90"` and `"10x de R$ 29,99"` — do not compute them at runtime
- Use a column layout on mobile (stack PIX price above installment), switch to row on `md:` breakpoint
- Keep the guarantee block as a separate visual element below the price, not inline
- Test the price section at 375px to confirm no wrapping issues before approval

**Warning signs:**
- Price value displays decimal formatting with `.` instead of `,`
- On mobile, the installment line is on the same visual "row" as the PIX price and looks like a continuation
- Guarantee text is visually crowded against the price display

**Phase to address:** Phase 4 — SectionPrice expansion. Format check is a mandatory step before phase completion.

---

### Pitfall M6: Security Badge Adds DOM Weight Without Visual Payoff on Mobile

**What goes wrong:**
Adding a "Seus dados estão seguros" security badge to the form creates a layout decision: where does it go? Common mistakes:
- Placing it inside the `<UForm>` as a non-field element confuses Nuxt UI's form layout (UForm with a Zod schema only expects `<UFormField>` children in its default slot — arbitrary markup can cause unexpected spacing)
- Using a padlock icon from `@heroicons` at `w-4 h-4` is too small to register on mobile Retina displays
- The badge row ("Dados protegidos · SSL 256-bit") placed below the submit button is below the fold on some short-screen phones — the user never sees it

**Why it happens:**
Security badges are added as an afterthought after the form is built. Nuxt UI's `<UForm>` component has specific slot expectations that make injecting arbitrary content between fields fragile.

**How to avoid:**
- Place the security badge **outside** the `<UForm>` tag but within the same container `<div>` — directly below the submit button
- Use `w-5 h-5` minimum for the padlock icon on mobile
- Keep the badge text short: "Seus dados estão seguros" on one line — avoid two-line wrapping on 375px screens
- Do not add the badge inside the `<UForm>` component — treat it as UI decoration, not a form element

**Warning signs:**
- The security badge causes unexpected spacing between form fields
- The badge icon is invisible on Retina/high-DPI screens due to small size
- On 667px height screens (iPhone SE landscape), the badge is below the fold

**Phase to address:** Phase 5 — Form simplification UI pass. Verify badge placement on mobile before completing.

---

### Pitfall M7: Varied CTAs Per Position Create Inconsistency in Click Tracking

**What goes wrong:**
The milestone calls for varied CTA copy by position: different text in Hero vs. mid-page vs. bottom. This is valid conversion optimization. The pitfall is that all CTAs still call `scrollTo('formulario')` — if this identifier ever changes (e.g., the section `id` is renamed), all CTAs silently break simultaneously.

Additionally, once varied CTAs are in place, you cannot measure which CTA drives the most conversions without click tracking differentiated by position. Without this, A/B decisions are based on guessing.

**Why it happens:**
CTA copy is changed in the component template without adding position identifiers to the click handler. The form `id` is assumed stable but not documented.

**How to avoid:**
- Document the form anchor `id="formulario"` as a contract (it already exists in the layout) — add a comment `<!-- anchor: do not rename -->` on the form section
- Add a `data-cta-position="hero|mid|bottom"` attribute to each CTA button for future analytics differentiation
- The `useScroll()` composable already handles `scrollTo('formulario')` — do not duplicate this logic in individual components

**Warning signs:**
- CTA copy changes but scrollTo behavior breaks (section `id` was renamed during refactor)
- Multiple CTA components each contain their own inline scroll logic instead of using `useScroll()`

**Phase to address:** Phase 6 — CTA variation pass. Add position attributes at the same time as the copy changes.

---

### Pitfall M8: `Para quem NAO e` Negative Cards Require Careful Tone Calibration

**What goes wrong:**
Adding "Para quem NAO e" negative qualification cards to `SectionForWhom` can backfire if the negative framing is too broad or harsh. Visitors who are borderline-qualified may self-exclude prematurely. In the Brazilian market, direct rejection language ("Nao e para voce se...") feels confrontational in formal copy but works well in a lighter, empathetic tone.

Technically, the `SectionForWhom` component uses a `v-for` loop over a `cards` array. Adding negative cards as a second array (or mixing into the existing array with a `type: 'negative'` field) requires either:
- A conditional CSS class based on `card.type` to visually differentiate positive vs. negative cards
- Or two separate `v-for` loops with distinct visual sections

If implemented as mixed cards in one array without visual differentiation, the "who it's NOT for" cards visually blend with the "who it IS for" cards, defeating the qualification purpose.

**Why it happens:**
Developers add a `type` flag to the existing array without planning for visual differentiation. The negative and positive cards look identical, making the distinction invisible to users.

**How to avoid:**
- Use two separate arrays: `positiveCards` and `negativeCards`
- Render them in separate visual sections with distinct headings ("Esta mentoria e para voce se..." vs. "Esta mentoria NAO e para voce se...")
- Negative cards should use a muted visual treatment (e.g., gray border, `x` icon instead of `checkmark`) to signal "not recommended" without being aggressive
- Keep the negative list to 3 items maximum — enough to qualify out bad fits, not enough to scare off the target audience

**Warning signs:**
- Negative cards use identical styling to positive cards
- The visual section has no clear heading distinguishing the two groups
- More than 4 negative qualifiers (over-qualification that reduces volume)

**Phase to address:** Phase 7 — SectionForWhom integration. Decide the visual treatment before writing the copy.

---

## Original Foundation Pitfalls (v1.0 — still applicable)

### Pitfall 1: $fetch Double-Fetching in SSR

**What goes wrong:**
Using `$fetch` directly inside a component that runs during SSR causes the HTTP request to fire once on the server and again on the client during hydration.

**Why it happens:**
Developers coming from Vue SPA habits reach for `$fetch` everywhere. Nuxt SSR has a different contract: `useFetch` and `useAsyncData` serialize the result into the page payload so the client never re-fetches.

**How to avoid:**
Use `useFetch` or `useAsyncData` for all data loaded at page render time. Reserve `$fetch` exclusively for user-triggered actions (form submissions, button clicks).

**Warning signs:**
- Network tab shows the same GET request twice on initial page load
- Fastify logs show duplicate requests on every page view

**Phase to address:** Foundation phase.

---

### Pitfall 2: Hydration Mismatch Breaks LCP and Causes CLS

**What goes wrong:**
Server renders HTML that differs from what the client produces after hydration. Vue discards the server HTML and re-renders, causing visible flash and destroying LCP.

**Why it happens:**
Reading `window`, `localStorage`, or `navigator` during SSR; using `new Date()` or `Math.random()` during render.

**How to avoid:**
Wrap browser-only logic in `<ClientOnly>` or guard with `if (import.meta.client)`. Test with `nuxt build && nuxt preview`.

**Warning signs:**
- Browser console: "Hydration node mismatch" errors
- CLS score above 0.1 in PageSpeed Insights

**Phase to address:** Component build phase.

---

### Pitfall 3: Nuxt Image + Cloudflare R2 Optimization Not Active in Production

**What goes wrong:**
`<NuxtImg>` serves unoptimized originals after Cloudflare deployment unless Image Transformations is explicitly enabled in the Cloudflare dashboard.

**How to avoid:**
Enable Cloudflare Image Transformations before deploying. Pre-optimize all images (hero below 200 KB, testimonials below 60 KB). Set `fetchpriority="high"` and `loading="eager"` on the hero.

**Warning signs:**
- PageSpeed shows "Serve images in next-gen formats"
- Network tab shows `.jpg`/`.png` instead of `.webp`

**Phase to address:** Infrastructure / deployment phase.

---

### Pitfall 4: CORS Failure Between Nuxt SSR and Fastify on Form Submit

**What goes wrong:**
Form submit fires `$fetch` from the browser; if Fastify `@fastify/cors` is not configured for the production domain, submissions silently fail in production but work in dev.

**How to avoid:**
Configure `@fastify/cors` with explicit allowed origins. Add a Nuxt server-side proxy so the form submit never crosses domains in the browser.

**Warning signs:**
- Form works in `nuxt dev` but fails silently after deploy
- Browser console shows "CORS policy" error

**Phase to address:** Backend integration phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Update only the Vue component when removing a form field | Fast copy change | Backend schema rejects or silently ignores requests | Never |
| Use `.optional()` on `gastoMensal` instead of removing | Avoids schema sync work | Field stays in UX, confusing form simplification intent | Only as a 1-hour bridge while coordinating backend deploy |
| Hard-code CTA text inline in each component | No abstraction needed | Copy audit requires 10+ component edits for every CTA change | Acceptable if CTA text is intentionally different per position |
| Mix positive and negative ForWhom cards in one array | Simpler data structure | No visual differentiation without CSS conditionals | Only if both types share identical styling |
| Compute installment price with JS division | DRY, single source of truth | Floating-point formatting errors | Never — hard-code formatted strings for price display |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Fastify Zod schema | Remove field from frontend only | Remove from `server/leads/schema.ts` first, then frontend schema, then component |
| `useLeadForm.ts` | Update composable schema without updating component state | Remove field from `state` object and `onSubmit` payload at the same time as the schema change |
| Nuxt UI `<UForm>` | Add non-field elements (security badge, helper text) inside `<UForm>` default slot | Place decorative elements outside `<UForm>` tag in the parent container |
| WhatsApp bubble | Use CSS `position: fixed` for bubble-within-LP context | Use `position: relative` within the testimonial card container; let the card handle its own layout |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hero image served unoptimized from R2 | LCP > 3s on mobile | Pre-optimize to WebP < 200 KB; enable Cloudflare Image Transformations | Every page load on mobile — immediate |
| All JS in one bundle | Slow TTI on mobile 3G | Use Nuxt lazy component imports for below-fold sections | Any mobile user on Brazilian carrier 3G/4G |
| WhatsApp bubble images (screenshots) unoptimized | LCP regression if bubble screenshots are large | Compress testimonial screenshots below 80 KB; use `<NuxtImg>` with lazy loading | On mobile when testimonials section scrolled into view |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| No honeypot field on lead form | Bot submissions flood MongoDB | Honeypot already implemented — do not remove during form simplification refactor |
| MongoDB connection string in `runtimeConfig.public` | String exposed in browser JS bundle | Keep in server-only `runtimeConfig` |
| No rate limiting on lead endpoint | Bot can submit thousands of leads | `@fastify/rate-limit` already configured at 5/minute — verify it stays active after schema changes |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Price displayed without value context above it | R$ 299,90 feels arbitrary | Price section must come after testimonials and method section in page scroll order |
| Guarantee block below the fold or missing from FAQ | Users who need reassurance scroll away | Put 7-day guarantee in SectionPrice and mention it in the FAQ |
| 3-field form with no explanation for what happens after submit | Anxiety about "what am I signing up for?" | Keep success state copy clear: "Marcio entra em contato em ate 24h pelo WhatsApp" |
| Negative "Para quem NAO e" cards visually aggressive | Qualified prospects self-exclude | Use soft language ("Talvez nao seja para voce se...") and muted styling |

---

## "Looks Done But Isn't" Checklist

### v1.5 Migration Specific

- [ ] **`gastoMensal` removal:** Verify the field is absent from `server/leads/schema.ts`, `useLeadForm.ts`, and `SectionLeadForm.vue` — and that a POST without `gastoMensal` returns 200 from Fastify
- [ ] **`renda-extra` enum removal:** Run `grep -r "renda.extra" app/ server/` — zero results expected outside `node_modules`
- [ ] **`SectionAbout` subtitle:** Verify the text "renda extra" or "renda-extra" does not appear anywhere in the rendered HTML (check `View Source` on the built page)
- [ ] **Price formatting:** Verify `R$ 299,90` uses comma as decimal separator (not period) everywhere it appears
- [ ] **Installment display:** Verify `10x de R$ 29,99` is displayed — not computed at runtime from division
- [ ] **Security badge placement:** Verify badge is outside `<UForm>` tag and visible on 667px height screens
- [ ] **WhatsApp bubbles mobile:** Test testimonials section at 375px — no horizontal overflow
- [ ] **CTA varied copy:** Verify each CTA position has distinct copy AND all still use `scrollTo('formulario')`
- [ ] **ForWhom negative cards:** Verify negative cards are visually distinct from positive cards (icon, border, or background differs)

### Foundation (from v1.0)

- [ ] **Hero CTA:** Scrolls to form, not opens WhatsApp
- [ ] **Form validation:** WhatsApp field rejects invalid formats before submit
- [ ] **Image optimization:** Hero loads as WebP in production
- [ ] **Spam protection:** Honeypot field present and unaffected by form simplification changes
- [ ] **Success state:** Form submit shows confirmation and composable `isSuccess` is set
- [ ] **CORS in production:** Form submit from real domain returns no CORS error

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Backend and frontend schema out of sync post-deploy | LOW | Update the missing schema file; redeploy Fastify (if server schema) or Nuxt (if frontend schema); no data loss if backend accepted requests |
| `renda-extra` still appears in submitted leads after launch | LOW | Update enum in both schemas; redeploy; existing MongoDB documents with `objetivo: 'renda-extra'` are historical data — do not retroactively rewrite |
| Copy inconsistency discovered after full review | LOW | One editing pass with the constants reference table; no code changes needed |
| WhatsApp bubble overflow on mobile discovered at QA | LOW | Add `max-width` and `word-break` CSS; re-test on real device |
| Price formatting error in production | LOW | Fix the hard-coded string; rebuild; Fastify backend unaffected |
| Security badge inside `<UForm>` causing layout issues | LOW | Move badge to parent container outside `<UForm>`; no schema changes needed |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `gastoMensal` schema desync (M1) | Phase 1 — Schema cleanup | POST without `gastoMensal` returns 200; TypeScript build has no errors |
| `renda-extra` enum removal (M2) | Phase 1 — Schema cleanup | `grep -r "renda.extra" app/ server/` returns zero results |
| Copy inconsistency across components (M3) | Phase 2 — Define copy constants before editing | Full LP visual review confirms consistent price, duration, guarantee, CTA text |
| WhatsApp bubble mobile breakage (M4) | Phase 3 — Testimonials build | DevTools mobile simulator at 375px shows no horizontal scroll |
| Price display formatting (M5) | Phase 4 — SectionPrice | `R$ 299,90` with comma separator visible in production build |
| Security badge placement (M6) | Phase 5 — Form simplification | Badge outside `<UForm>`, visible on 667px height screens |
| CTA varied copy breaks scrollTo (M7) | Phase 6 — CTA pass | All CTAs scroll to `#formulario`; `id="formulario"` unchanged |
| Negative ForWhom cards visually ambiguous (M8) | Phase 7 — SectionForWhom | Visual diff between positive and negative cards confirmed in browser |
| `$fetch` double-fetching | Foundation phase | No duplicate GETs in Fastify logs |
| Hydration mismatch | Component build phase | `nuxt build && nuxt preview` shows no hydration warnings |
| Cloudflare R2 image optimization | Infrastructure phase | Network tab shows `.webp` in production |
| CORS failure | Backend integration phase | Form submit from real domain succeeds with no CORS error |

---

## Sources

- Codebase inspection: `server/leads/schema.ts`, `app/composables/useLeadForm.ts`, `app/components/Section/SectionLeadForm.vue`, `app/components/Section/SectionAbout.vue` (verified 2026-03-24)
- [Nuxt SSR Common Pitfalls and How to Avoid Them](https://infinitejs.com/posts/nuxt-ssr-pitfalls-avoidance/)
- [Fixing Nuxt Hydration Mismatches in the Real World](https://ryanclements.dev/posts/fixing-nuxt-hydration-mismatches-in-the-real-world)
- [When to Use $fetch, useFetch, or useAsyncData — MasteringNuxt](https://masteringnuxt.com/blog/when-to-use-fetch-usefetch-or-useasyncdata-in-nuxt-a-comprehensive-guide)
- [NuxtImg optimization props not applied on Cloudflare — Issue #1588](https://github.com/nuxt/image/issues/1588)
- [CORS Missing Allow Origin with useFetch — Nuxt Discussion #19276](https://github.com/nuxt/nuxt/discussions/19276)
- [Landing Page Mistakes That Kill Conversions 2025 — GrowthFueling](https://growthfueling.com/landing-page-mistakes-that-kill-conversions-in-2025/)
- [WhatsApp Lead Generation Brazil — FlowCart](https://www.flowcart.ai/blog/whatsapp-lead-generation)
- [Landing Pages que Convertem 2025 — Tornera Brasil](https://www.tornera.com.br/blogs/post/landing-pages-que-convertem-o-que-n%C3%A3o-pode-faltar-em-2025)

---

*Pitfalls research for: Fly Up Milhas v1.5 — copy rewrite + conversion optimization on Nuxt 4 SSR LP*
*Researched: 2026-03-24*
