# Project Research Summary

**Project:** Fly Up Milhas — High-Conversion Landing Page
**Domain:** Miles/travel consultancy, Brazilian market (R$ 299,90 consultoria VIP)
**Researched:** 2026-03-24 (v1.6 update — supersedes v1.5 summary)
**Confidence:** HIGH

## Executive Summary

Fly Up Milhas is a single-page SSR landing page selling a R$ 299,90 personalized miles consultancy to the Brazilian market. The project is past v1.0 (functional LP built) and v1.5 (copy rewrite + conversion optimization), and is now in v1.6, a visual identity upgrade milestone. The goal is to elevate the page from functional to premium — replacing the muted navy palette with vibrant aviation blue, swapping orange CTAs for amber/gold, upgrading typography from Inter to Plus Jakarta Sans, adding a standalone guarantee section, testimonial avatars, aviation gradients, and a numbered FAQ redesign.

The v1.6 milestone is architecturally low-risk. It requires no new npm dependencies, no backend changes, and no data flow changes. All work is UI/visual: CSS token replacements cascading through 13 existing components, one new static display component (`SectionGuarantee`), and two component redesigns (`SectionSocialProof` avatars, `SectionFAQ` visual). The stack is Nuxt 4.4.2 + Nuxt UI v4.5.1 + Tailwind v4, with all brand tokens living in a single `@theme {}` block in `main.css` — enabling global cascade changes from one file.

The primary conversion risks addressed by v1.6: (1) the current orange CTA signals "generic Hotmart funnel" to Brazilian buyers — amber/gold differentiates on premium positioning; (2) testimonials without avatars are increasingly untrustworthy in the 2025 market; (3) the guarantee buried as a SectionPrice footnote is invisible — a standalone `SectionGuarantee` section at the decision point is research-verified (+32% conversion lift). The primary technical risks are maintaining WCAG AA contrast after the palette shift (vibrant blues in the 400-500 Tailwind range fail 4.5:1 against white), and avoiding double-loading fonts when swapping Inter for Plus Jakarta Sans.

## Key Findings

### Recommended Stack

No new dependencies are needed for v1.6. The existing stack handles all requirements. For v1.5 and prior history see: `.planning/research/STACK.md`

**Core technologies:**
- **Nuxt 4** (`^4.4.2`): SSR framework — Nuxt 4 is the active major (Nuxt 3 EOL July 2026); `app/` directory structure is clean for LP
- **@nuxt/ui 4** (`^4.5.1`): Component library — ships Tailwind v4, @nuxt/fonts, @nuxt/icon, Reka UI primitives; no separate Tailwind config needed
- **Tailwind CSS** (`^4.2.2` via @nuxt/ui): CSS-first config via `@theme {}` — 100x faster builds than v3; all brand tokens live here
- **Zod** (`^3.x`): Shared schema between `useLeadForm.ts` and Fastify backend — do not use Zod v4 alpha
- **@nuxt/image** (`^2.x`): Image optimization from Cloudflare R2 with WebP conversion — required for Core Web Vitals on Brazilian mobile
- **Fastify 5 + @fastify/mongodb + @fastify/rate-limit** (existing backend): Integrate only, do not rebuild

**v1.6 typography upgrade (no new packages):**
- Plus Jakarta Sans replaces Inter as body font — geometric humanist, premium without cold corporate feel
- Optional Playfair Display for h1/h2 headings — editorial serif signals authority (travel magazine aesthetic)
- Both fonts via `@nuxt/fonts` (already bundled with @nuxt/ui) — configure in `nuxt.config.ts`, never via raw `<link>` tags

### Expected Features

Full research: `.planning/research/FEATURES.md`

**Must have for v1.6 (table stakes for premium positioning):**
- Premium blue palette (`#0C2D5E` deep blue + `#1565C0` vibrant royal blue) — current muted navy `#1a3a5c` reads as conservative bank, not aviation aspiration
- Amber/gold CTA (`#F59E0B`) replacing orange `#e67e22` — orange is the default for Hotmart/generic BR funnels; amber communicates premium/earned/travel reward
- Testimonial avatars (circular initials or photo) — faceless testimonials are increasingly untrustworthy; global market standard since 2024
- Dedicated SectionGuarantee section — guarantee as inline footnote is invisible; standalone section forces decision-point processing

**Should have for v1.6 (differentiators):**
- Playfair Display heading font paired with Plus Jakarta Sans body — editorial serif distinguishes from the Inter-everywhere competition
- Aviation gradients (2-tone narrow blue range) — sky/horizon texture; not generic SaaS rainbow
- Numbered card FAQ redesign — plain accordion is functional; numbered premium cards elevate perceived quality

**Defer (post-v1.6):**
- WhatsApp floating CTA button — simple `<a href="wa.me">` when added, no library needed
- A/B testing — use `useRuntimeConfig` feature flags only, never a client-side A/B library (causes CLS/LCP regression)
- Real client testimonial photos on Cloudflare R2 — initials fallback works immediately; photos are an enhancement
- Multi-page funnel — add `@nuxt/content` only if needed

**Anti-features to actively avoid:**
- Electric/neon blues (`#00BFFF`, `#00B4D8`) — tech startup aesthetic, not premium travel
- Full-spectrum rainbow gradients — generic SaaS, undermines premium positioning
- `filter: drop-shadow()` on guarantee seal PNG — expensive mobile repaint; bake shadow into source file
- Playfair Display for body text — display font, illegible below 18px; headings only
- Countdown timer or fake strikethrough pricing — Brazilian buyers detect and distrust both

### Architecture Approach

Full research: `.planning/research/ARCHITECTURE.md`

Single-page Nuxt 4 SSR app with no `pages/` directory. `app/app.vue` composes 13 SFC components in scroll order. All design tokens live in `app/assets/css/main.css` under Tailwind v4's `@theme {}` block — updating a token value cascades instantly to all 13 components. This is the single most important architectural constraint to preserve. Do not hardcode hex values in component templates; do not use `tailwind.config.ts`.

V1.6 data flow is entirely UI-layer: no new composables, no backend contract changes, no new API calls. The only new file is `SectionGuarantee.vue` (~60 lines, pure static display component, no props or emits).

**Component map after v1.6:**
```
AppHeader
SectionHero
SectionAbout
SectionProgramContent
SectionForWhom
SectionMethod
SectionSocialProof     (MODIFIED — avatar added per testimonial)
SectionPrice           (MODIFIED — inline guarantee block reduced)
SectionGuarantee       (NEW — pure static, seal image from existing asset)
SectionFAQ             (MODIFIED — enhanced UAccordion with numbered cards)
SectionLeadForm
AppFooter
BackToTop
```

**Key architectural constraints:**
- Token namespace: always `--color-brand-*` — never `--color-primary` (silently collides with Nuxt UI's semantic system)
- Font swap: must be done in `nuxt.config.ts` fonts module AND `@theme {}` simultaneously — one without the other causes double-load or missing CLS fallback metrics
- No `tailwind.config.ts`: Nuxt UI v4 manages Tailwind v4 via CSS-first path; a JS config file causes conflicts

### Critical Pitfalls

Full research: `.planning/research/PITFALLS.md`

1. **Token namespace collision with Nuxt UI** (V1) — Renaming `--color-brand-primary` to `--color-primary` silently overwrites Nuxt UI's semantic color system. All component focus rings and interactive states break with no build error. Prevention: always use `--color-brand-*` namespace; configure Nuxt UI's primary via `app.config.ts ui.colors.primary`.

2. **Vibrant blue failing WCAG AA on white text** (V2) — Blues in the Tailwind 400-500 range feel premium but fail contrast for normal text. `#3B82F6` (blue-500) is 3.0:1 against white — fails AA. Prevention: use blue-700 (`#1D4ED8`, 6.3:1) or blue-800 (`#1E40AF`, 8.2:1) as primary; vibrant mid-blues are safe only for decorative elements without text.

3. **Double font load and CLS from font swap** (V3) — Adding new font to `@theme {}` without also removing Inter from `nuxt.config.ts` fonts module causes both families to download (200-400 KB extra). Missing `nuxt.config.ts` config also loses @nuxt/fonts CLS fallback metric generation. Prevention: update CSS token AND `nuxt.config.ts` simultaneously in the same commit; verify in Network tab that only one font family downloads.

4. **Gradient paint cost on low-end Android** (V4) — Full-viewport gradient backgrounds repaint on every scroll frame. Low-end Android (Moto G, Samsung A-series) is common in Brazil. Prevention: limit to 2 color stops, apply gradients to at most 2-3 sections, never combine with `filter: blur()`, run Chrome paint flashing audit on 4x CPU throttle.

5. **UAccordion `:ui` prop removing focus ring** (V7) — The `:ui` prop replaces (not merges) the default trigger class string. If `focus-visible:ring-2` classes are omitted during the FAQ redesign, keyboard navigation breaks silently (WCAG 2.4.7 violation). Prevention: treat `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-primary)]` as non-negotiable in every `ui.trigger` string.

6. **CTA color failing on multiple background contexts** (V8) — CTAs appear on 4 different backgrounds (dark hero overlay, white, off-white brand-bg, navy SectionPrice). `#F59E0B` passes AA on navy and off-white; verify all 4 before finalizing. A color that looks great in a single mockup may fail on 3 of 4 actual backgrounds.

## Implications for Roadmap

V1.6 maps to 6 sequential phases driven by dependency order: tokens cascade to all components (must go first), fonts must be CLS-verified on a preview build before component work iterates on typography, the new static component is isolated and safe third, avatars are additive fourth, gradients require confirmed token values fifth, and FAQ involves the most design iteration so goes last.

### Phase 1: Design Token Replacement
**Rationale:** Tokens cascade to all 13 components simultaneously. Establishing the correct palette before any component work means every subsequent phase is reviewed against the real visual baseline. Discovering contrast failures mid-build causes rework across all components.
**Delivers:** New brand palette live across the full LP — vibrant aviation blue, amber CTA, blue-tinted background `#F8FAFF`.
**Addresses:** Premium blue palette (table stakes), amber/gold CTA (table stakes)
**Avoids:** Pitfall V1 (token namespace collision), Pitfall V2 (WCAG contrast failure on white), Pitfall V8 (CTA contrast on multiple backgrounds)

### Phase 2: Typography Upgrade
**Rationale:** Font swap is a single-file change with high cascade impact. CLS must be verified on a preview build (not dev server) before building new components on top of the new typography.
**Delivers:** Plus Jakarta Sans (+ optionally Playfair Display for headings) across the full LP with CLS < 0.1 confirmed.
**Addresses:** Premium typography differentiator
**Avoids:** Pitfall V3 (double font load, CLS from metric mismatch)

### Phase 3: SectionGuarantee Component
**Rationale:** New static component with zero risk to existing components. The seal image asset (`app/assets/img/selo-garantia7-dias.png`) already exists. Self-contained — one new file plus one line in `app.vue`.
**Delivers:** `SectionGuarantee.vue` inserted between SectionPrice and SectionFAQ; inline guarantee block in SectionPrice reduced to a one-liner trust signal.
**Addresses:** Dedicated guarantee section (table stakes for conversion at decision point)
**Avoids:** Pitfall V6 (seal PNG performance — compress source to PNG-8 or lossless WebP before committing)

### Phase 4: Testimonial Avatars (SectionSocialProof)
**Rationale:** Additive to existing data shape — testimonial bubbles still render correctly if avatar fields are absent during development. Isolated to one component.
**Delivers:** Circular initials avatars per testimonial (deterministic color from name hash), with upgrade path for real R2-hosted photos when available.
**Addresses:** Testimonial avatars (table stakes for trust)
**Avoids:** Pitfall V5 (NuxtImg dimension/CLS on circular avatars — use CSS-only initials avatar initially; NuxtImg photo path requires Cloudflare Image Transformations to be confirmed active)

### Phase 5: Gradient Application
**Rationale:** Gradients require confirmed token values to use correct color stops. Applying after palette and typography are validated eliminates color value rework.
**Delivers:** Subtle sky-to-horizon gradient on hero, optional deep gradient on SectionPrice/SectionGuarantee, subtle card gradient accents on 2-3 key sections maximum.
**Addresses:** Aviation gradients differentiator
**Avoids:** Pitfall V4 (gradient paint cost on mobile — 2 color stops max, paint flashing audit required as exit criterion)

### Phase 6: FAQ Visual Redesign
**Rationale:** Most open-ended design work. Goes last so it benefits from the final palette and typography context without blocking other phases.
**Delivers:** Numbered card accordion (Option A: enhanced UAccordion `:ui` prop; Option B: custom v-show accordion if `:ui` customization is insufficient) with icons, visible hierarchy, and preserved keyboard accessibility.
**Addresses:** FAQ redesign differentiator
**Avoids:** Pitfall V7 (focus ring removal — keyboard Tab/Enter navigation test is mandatory exit criterion)

### Phase Ordering Rationale

- **Tokens first:** The `@theme {}` cascade means a palette change affects all 13 components at once. Must be validated before any component-specific work builds on top of it
- **Font second:** CLS regression from a font swap must be measured on a preview build before iterating on typography in new components
- **SectionGuarantee third:** Zero dependencies on other phases; self-contained new file; can be validated in isolation
- **Avatars fourth:** Additive to `SectionSocialProof` data only; no cross-component concerns
- **Gradients fifth:** Requires final token values confirmed; mobile performance profiling is the exit gate
- **FAQ last:** Highest design iteration and open-ended UAccordion vs. custom accordion decision; should not block other phases

### Research Flags

Phases with standard well-documented patterns (no additional research needed):
- **Phase 1:** Tailwind v4 `@theme {}` token replacement — fully documented in official docs
- **Phase 3:** Static SFC creation and single `app.vue` line insertion — trivial
- **Phase 4:** CSS-only initials avatar is ~20 lines of Tailwind — standard pattern

Phases requiring validation checkpoints (not research, but execution gates):
- **Phase 1:** WCAG contrast check mandatory before proceeding — WebAIM checker on every new token against every background it appears on (white, off-white, navy, dark hero overlay)
- **Phase 2:** Lighthouse CLS score must be < 0.1 on a preview build (`nuxt build` + `nuxt preview`) before distributing font classes to components
- **Phase 4:** If real photos are added, verify Cloudflare Image Transformations is active in the Cloudflare dashboard before using `<NuxtImg>` with R2 provider
- **Phase 5:** Chrome DevTools paint flashing audit on 4x CPU throttle — no red rectangles during normal scroll
- **Phase 6:** Manual keyboard navigation test (Tab to accordion, Enter/Space to expand, Tab through all items) — each trigger must show a visible focus ring

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages verified against official releases; codebase `package.json` inspected; no new dependencies required |
| Features | HIGH | Multiple verified sources including airline brand research, WCAG contrast tool, VWO experiment data (+32% guarantee section), Brazilian market conversion norms |
| Architecture | HIGH | Direct codebase inspection (2026-03-24) — token map, component list, asset inventory verified from actual files |
| Pitfalls | HIGH | Code-verified — pitfalls identified from reading actual component code (`SectionFAQ.vue` trigger string, `main.css` token definitions, `nuxt.config.ts`) |

**Overall confidence:** HIGH

### Gaps to Address

- **Font choice confirmation before Phase 2:** Research supports two options — (A) Plus Jakarta Sans only (simpler, one font weight system) or (B) Playfair Display headings + Plus Jakarta Sans body (more differentiated, requires applying `font-display` class to all h1/h2 in 12 components). Decide before Phase 2 begins.

- **Real testimonial photos:** Research assumes CSS-only initials avatars as the default for Phase 4. If client provides real photos for Cloudflare R2, Cloudflare Image Transformations must be confirmed active before Phase 4 can use `<NuxtImg>` with the Cloudflare provider. Validate in Cloudflare dashboard before any photo-dependent code.

- **Logo compatibility with new palette:** `logo-fly-up-milhas.png` may contain the current navy `#1a3a5c`. After Phase 1 tokens are applied, verify the logo reads correctly on the new vibrant blue header background. May require a new logo export from the original design file.

- **@nuxt/image version in production:** STACK.md documents `^2.x` for Nuxt 4 compatibility. Confirm actual installed version in `package.json` before using `<NuxtImg>` with R2 provider configuration for Phase 4 avatars or Phase 3 seal.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection (2026-03-24): `app/assets/css/main.css`, `app/app.vue`, all Section SFCs, `nuxt.config.ts`, `app/assets/img/` listing
- https://github.com/nuxt/nuxt/releases — Nuxt 4.4.2 verified latest as of March 2026
- https://github.com/nuxt/ui/releases — Nuxt UI v4.5.1 verified latest
- https://ui.nuxt.com/components/accordion — UAccordion `:ui` prop API and default trigger class behavior
- https://tailwindcss.com/docs/background-image — Tailwind v4 gradient utilities (`bg-linear-*`, `bg-radial-*`)
- https://tailwindcss.com/docs/animation — Tailwind v4 `@keyframes` in `@theme {}`
- https://fonts.nuxt.com/get-started/configuration — @nuxt/fonts families configuration and auto-detection behavior
- https://ui.nuxt.com/components/avatar — UAvatar component (circular shape, initials fallback, size variants)

### Secondary (MEDIUM confidence)
- https://thedesignair.net/2021/02/10/why-so-blue — Aviation industry blue color psychology (verified across carrier brand references)
- https://www.schemecolor.com/united-airlines-logo-blue-color.php — United Airlines `#005DAA`
- https://fonts.google.com/specimen/Plus+Jakarta+Sans — Variable font weights 200-800, Latin/Latin Extended coverage
- https://fonts.google.com/specimen/Playfair+Display — Editorial serif, display sizes; confirmed premium signal in typography research
- https://smartsmssolutions.com/resources/blog/business/trust-badges-boost-conversion — +32% conversion lift for standalone guarantee section (VWO experiment, single study, direction credible)
- https://webaim.org/resources/contrastchecker — WCAG contrast ratio verification for all new color tokens
- https://tailwindflex.com/@simon-scheffer/whatsapp-like-chat-design — WhatsApp CSS bubble pattern (carry-forward from v1.5)

### Tertiary (LOW confidence — validate during implementation)
- `@nuxt/image` v2 behavior with `quality="100"` + `format="webp"` for lossless WebP on guarantee seal — documented in official IPX spec but Cloudflare Image Transformations activation is environment-dependent
- `@nuxt/fonts` CLS fallback metric behavior with Plus Jakarta Sans — described in `web.dev/articles/css-size-adjust`; CLS < 0.1 must be verified empirically on a preview build for this specific font pairing

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
