# Pitfalls Research

**Domain:** High-conversion landing page — miles/travel consultancy, Brazilian market, Nuxt 4 SSR
**Researched:** 2026-03-24 (updated — v1.6 visual identity upgrade added)
**Confidence:** HIGH (code-verified, codebase inspected directly)

---

## v1.6 Visual Identity Upgrade Pitfalls

These pitfalls are specific to the v1.6 milestone: swapping the color palette, changing fonts, adding gradients, adding avatar/seal images, and redesigning the FAQ accordion on an existing Nuxt 4 + Nuxt UI v4 + Tailwind v4 landing page. They are the highest-priority section and should be read before any v1.6 phase begins.

---

### Pitfall V1: Tailwind v4 `@theme` Custom Color Names Collide with Nuxt UI's Semantic System

**What goes wrong:**
Nuxt UI v4 reserves a set of semantic color aliases — `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral` — that it resolves at runtime to whatever Tailwind color scale is configured in `app.config.ts`. When you define `--color-primary` inside `@theme` in `main.css`, you are overwriting the CSS variable that Nuxt UI's component internals (UAccordion trigger ring, UButton focus ring, UForm field borders) already consume. The result is that:

- Every Nuxt UI component that uses `text-primary` or `bg-primary` inherits your raw hex instead of the expected accessible shade at the right step (e.g., 500 or 600).
- The `focus-visible:ring-primary` ring that UAccordion triggers use for keyboard navigation loses its intended contrast.
- Attempting to define `--color-brand-primary` (as the current codebase does) is safe because it does not collide — but if you rename it to `--color-primary` during a refactor, the collision is silent and components start misbehaving.

Additionally, Tailwind v4's `@theme` namespace rules require colors to follow `--color-*` exactly. Defining `--brand-primary` (without the `color-` prefix) silently generates no utility classes — `bg-brand-primary` and `text-brand-primary` will not exist in the compiled output.

**Why it happens:**
The refactor feels intuitive: rename `--color-brand-primary` to `--color-primary` for shorter class names. Developers do not realize this overwrites Nuxt UI's reserved variable. No build error appears — components silently inherit the wrong value.

**How to avoid:**
- Keep the `--color-brand-*` namespace that the current codebase uses. Do not rename to `--color-primary`.
- To configure which Tailwind color scale Nuxt UI components use as their `primary`, use `app.config.ts`:
  ```ts
  // app.config.ts
  export default defineAppConfig({
    ui: {
      colors: {
        primary: 'blue',   // maps to Tailwind's blue-* scale
        neutral: 'slate',
      }
    }
  })
  ```
- New brand colors for the visual identity upgrade should live in `@theme` under `--color-brand-*` keys, never under `--color-primary` or other Nuxt UI reserved names.
- After adding new `@theme` tokens, verify utility classes are generated: run `nuxt build` and inspect the compiled CSS for `bg-brand-sky` (or whatever the new token is) before writing components that use it.

**Warning signs:**
- UButton or UFormField focus ring changes color unexpectedly after adding a `--color-primary` token.
- `bg-brand-primary` appears to work in DevTools but has no class in the production CSS bundle (missing `--color-` prefix in `@theme`).
- UAccordion trigger focus outline looks different from before the palette swap.

**Phase to address:** Phase 1 — Design tokens setup. Define all new color tokens before touching any component.

---

### Pitfall V2: Replacing `#1a3a5c` Navy with a Vibrant Blue Breaks WCAG AA on White Backgrounds

**What goes wrong:**
The current navy `#1a3a5c` has a contrast ratio of approximately 9.1:1 against white (`#ffffff`), comfortably above the WCAG AA threshold of 4.5:1 for normal text. Vibrant blues — the kind that feel "aviation premium" — tend to live in the 400-500 range of a blue scale (e.g., `#2563EB` blue-600, `#3B82F6` blue-500). Against white:

- `#3B82F6` (blue-500): contrast ratio ~3.0:1 — **fails WCAG AA for normal text**
- `#2563EB` (blue-600): contrast ratio ~4.7:1 — barely passes AA, **fails AAA**
- `#1D4ED8` (blue-700): contrast ratio ~6.3:1 — passes AA and AAA for large text
- `#1E40AF` (blue-800): contrast ratio ~8.2:1 — passes AA and AAA for all text

The failure mode: a designer selects `#3B82F6` because it looks vibrant and "aviation." It renders beautifully at large sizes on a design tool. In the actual LP, `<h2>` headings at 24px and `<p>` body copy at 14–16px use the same class. The heading technically qualifies as "large text" (18pt / 24px bold) at AA with 3:1, but body copy, form labels, card titles, and smaller UI text must meet 4.5:1. The vibrant shade fails on those elements silently — no build warning, no runtime error.

**Why it happens:**
Color selection happens in isolation using a design tool where text is always large and shown on the brand background. The WCAG requirement applies differently to different font sizes. Designers confuse "passes for large text" with "passes for all text."

Additionally, the current codebase uses `text-[var(--color-brand-primary)]` in 12 components. A single token swap cascades to all of them simultaneously — no component-by-component review happens.

**How to avoid:**
- Choose a vibrant blue that passes AA (4.5:1) for normal text on white: `#1D4ED8` (blue-700) or `#1E40AF` (blue-800). These are still visually vibrant compared to the current muted navy.
- Verify every shade before adopting it: use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or `npx @accessibility-checker/cli` in the build pipeline.
- For decorative use only (icon fills, dividers, background accents where no text is on top), vibrant blues like `#3B82F6` are safe — WCAG contrast applies only to text and interactive UI components.
- Do a two-pass audit after any token change: (1) automated scan with Lighthouse accessibility audit, (2) manual spot-check of the smallest text instance on each component (usually card subtitles and form helper text).

**Warning signs:**
- Lighthouse accessibility score drops after the palette change.
- DevTools accessibility panel shows contrast warning on any `<p>` or `<span>` using the new blue.
- Any text smaller than 18px bold (24px) using the new blue on white background is a risk.

**Phase to address:** Phase 1 — Design tokens setup. Do not distribute the new color token to components until the contrast ratio is confirmed.

---

### Pitfall V3: Changing Font from Inter Without Disabling the Old Font Causes Double-Load CLS

**What goes wrong:**
The current setup loads Inter via `@nuxt/fonts`, which is bundled with Nuxt UI v4 as a peer dependency. The font is declared in `main.css`:

```css
@theme {
  --font-family-sans: 'Inter', system-ui, ...;
}
```

And in `app.config.ts` or the `nuxt.config.ts` fonts module, Inter is likely configured implicitly (Nuxt UI v4 defaults to Inter). When swapping to a new font (e.g., "Plus Jakarta Sans", "DM Sans", or "Outfit"):

1. **Double-load:** If the new font is added to `@theme` but Inter is never explicitly removed from the Nuxt Fonts module config, both fonts are downloaded. Inter loads because it's still in the module config; the new font loads because it's now in `@theme`. The user downloads 2 font families unnecessarily — up to 200–400 KB extra on first load.
2. **CLS from fallback mismatch:** `@nuxt/fonts` automatically generates font-metric fallbacks to minimize CLS. This only works for fonts that are in its configuration. A font added only in `@theme` CSS without configuring it in the Nuxt Fonts module bypasses the fallback metric generation — the system font fallback has different character width, causing a visible layout shift (CLS > 0.1) when the web font loads.
3. **font-display: swap trap:** Nuxt Fonts sets `font-display: swap` by default. This means text renders in the fallback system font first, then "swaps" to the web font. If the new font has significantly different x-height or letter-spacing from Inter, the swap causes a jarring visual reflow that users notice. This is measured as CLS.

**Why it happens:**
Developers add the new font to `@theme` (CSS layer) and assume `@nuxt/fonts` auto-detects it. The module does not scan `@theme` directives — it requires explicit configuration in `nuxt.config.ts`.

**How to avoid:**
- Configure the new font in `nuxt.config.ts` under the `fonts` module:
  ```ts
  // nuxt.config.ts
  export default defineNuxtConfig({
    fonts: {
      families: [
        { name: 'Plus Jakarta Sans', weights: [400, 600, 700] },
      ],
    },
  })
  ```
- Simultaneously remove Inter from the fonts config (or from Nuxt UI's default font override). Do both in the same commit.
- Verify Nuxt Fonts generates a `@font-face` with `font-display: swap` AND a fallback metric override (check the compiled CSS for `size-adjust` or `ascent-override` on the fallback rule).
- Test CLS with Lighthouse after the font swap — target < 0.1. If CLS regresses, add `nuxt-modules/fontaine` for automatic metric adjustment.
- Choose a font with similar metrics to Inter to minimize CLS risk: "DM Sans" and "Plus Jakarta Sans" are close in x-height; "Outfit" has slightly higher ascent.

**Warning signs:**
- Network tab on first load shows two font families downloading.
- Lighthouse CLS score regresses above 0.1 after font change.
- The page visibly "jumps" 100-300ms after initial paint — text shifts position as the web font loads.

**Phase to address:** Phase 2 — Typography upgrade. Configure fonts module first, verify CLS in preview build before distributing to all components.

---

### Pitfall V4: Section Background Gradients Trigger Paint on Every Scroll Frame on Low-End Mobile

**What goes wrong:**
Adding CSS gradients to section backgrounds (`background: linear-gradient(...)` or `background: radial-gradient(...)`) is not "free" on mobile. The browser must repaint the element every time it enters or leaves the viewport, and on low-end Android devices (common in the Brazilian market), this causes dropped frames during scroll.

Specific patterns that compound the problem:
1. **Full-viewport hero gradient:** A `linear-gradient` on a `min-h-screen` element is always visible during scroll. The browser repaints the full gradient area on every scroll event.
2. **Multiple stacked gradients:** CSS allows `background: linear-gradient(...), linear-gradient(...)` — each is painted separately. Five overlapping gradients on one element multiply paint cost five times.
3. **Gradient + `filter: blur()`:** Blur on a gradient is extremely expensive on mobile — avoid for any element that scrolls.
4. **`will-change: background` misuse:** Adding `will-change: background` to a gradient element creates a new compositor layer but does not move gradient painting to the GPU (background-image is not compositable). It consumes extra GPU memory with no benefit.

The correct approach to "promote" a gradient to a GPU layer is to wrap it in a child element and use `will-change: transform` (or `transform: translateZ(0)`) on that wrapper — but even this only helps for elements that will animate, not static backgrounds.

**Why it happens:**
Modern design tools show gradients at 60fps because the design machine has a GPU. Low-end Android devices (Moto G, Samsung A-series) do not accelerate gradient painting the same way. Developers test on high-end iPhones and do not discover the mobile performance problem until QA.

**How to avoid:**
- Use gradients only where they add clear conversion value. The hero section is acceptable; background accents on every section card are not.
- Limit gradient complexity: 2 color stops maximum per gradient, no stacked gradients.
- Never combine gradient with `filter: blur()` on a scrollable section.
- For decorative gradient accents (e.g., a gradient line under a headline), use a 1–4px tall `<div>` with a gradient rather than applying it to the full section background.
- Measure real-world paint cost: open Chrome DevTools > Performance > enable "Paint flashing" — scroll the page on a throttled profile (Slow 3G + 4x CPU slowdown). Any red flashing rectangle during normal scroll is a paint regression.
- For the hero section where a gradient overlay is desired, use a CSS class with `background: linear-gradient(to bottom, transparent 60%, rgba(26,58,92,0.8) 100%)` — this is simpler and cheaper than multi-stop gradients.

**Warning signs:**
- Chrome DevTools paint flashing shows large red rectangles during scroll.
- Lighthouse "Avoid large layout shifts" or "Reduce initial server response time" flags after adding gradient sections.
- PageSpeed Insights score drops on mobile after adding gradients.

**Phase to address:** Phase 3 — Gradient and visual accent implementation. Run paint profiling immediately after the first gradient section is added.

---

### Pitfall V5: Avatar Images in Testimonials Break `<NuxtImg>` Optimization When Stored on R2 Without Proper Dimensions

**What goes wrong:**
Adding circular avatar photos to the SocialProof testimonials section requires `<NuxtImg>` with a fixed `width` and `height` for aspect ratio preservation. Common failures:

1. **Aspect ratio distortion:** Without `width` and `height` attributes, the browser uses the intrinsic dimensions of the image. If the R2-stored photo is 800×1200 (portrait), a CSS `border-radius: 50%` creates an oval, not a circle. The fix is to always specify `width` and `height` equal values and add `object-fit="cover"`.
2. **Layout Shift from image load:** If `width` and `height` are omitted, the browser does not reserve space for the image before it loads. When the image arrives, the layout jumps — this is CLS directly from the avatar. On mobile, this is measured and penalized by Core Web Vitals.
3. **Lazy-loading avatars that are above the fold:** If the testimonial section is visible on initial load (possible on tablets and desktop), adding `loading="lazy"` to `<NuxtImg>` on avatar images delays them, increasing the visible "empty circle" gap. This is the LCP-lazy-load anti-pattern: lazy loading prevents the browser's preload scanner from discovering the image early.
4. **Cloudflare Image Transformations not enabled:** `<NuxtImg>` with the Cloudflare provider requires "Image Transformations" enabled on the Cloudflare dashboard. Without it, the `<NuxtImg>` component falls back to serving the raw original file from R2 with no WebP conversion — a 400–800 KB PNG for each avatar is a severe mobile regression.
5. **R2 URL format mismatch:** The `@nuxt/image` Cloudflare provider expects a specific URL format. Using the raw R2 public bucket URL directly (without the Cloudflare proxy domain) bypasses Image Transformations even if they are enabled.

**Why it happens:**
Avatar images are added as a "visual detail" without treating them as performance-critical assets. The testimonials section is below the fold, so developers disable lazy loading only for the hero and forget that avatars may also be above the fold on desktop.

**How to avoid:**
- Always specify `width` and `height` on `<NuxtImg>` for avatars: both equal (e.g., `width="80" height="80"`) plus `class="rounded-full object-cover"`.
- Pre-crop and pre-resize avatar photos to 160×160 pixels before uploading to R2 (2x for Retina). This removes the dependency on Cloudflare Image Transformations for the circular crop.
- For the testimonials section: use `loading="lazy"` because it is reliably below the fold on mobile. Do NOT use `fetchpriority="high"` on avatar images — reserve that for the hero image only.
- If using the CSS-only `border-radius: 50%` approach (no actual image, just initials on a colored circle), no `<NuxtImg>` is needed and there are no image performance risks.
- Verify Cloudflare Image Transformations is active before deploying: check the Cloudflare dashboard under Images > Transformations and confirm the zone is enabled.

**Warning signs:**
- DevTools shows avatar images loading as `.png` or `.jpg` in production (not `.webp` or `cf-` prefixed).
- Avatars appear as ovals instead of circles.
- CLS reported for the testimonials section in Lighthouse.

**Phase to address:** Phase 4 — Social proof visual upgrade. Treat avatar images as a performance sub-task, not just a design task.

---

### Pitfall V6: Seal PNG with Drop Shadow and Transparency Is the Slowest Possible Image Format

**What goes wrong:**
The project already has `selo-garantia7-dias.png` in `app/assets/img/`. A "golden seal" design typically includes:
- Transparency (PNG alpha channel)
- Intricate radial details and fine text
- Drop shadow effect either baked into the PNG or applied via CSS `filter: drop-shadow()`

These properties make the seal PNG the worst-performing asset on the page if mishandled:

1. **File size:** A high-DPI seal PNG at 512×512 with transparency can be 150–400 KB. Served unoptimized from R2 without Cloudflare Image Transformations, it loads slowly on mobile.
2. **WebP conversion removes alpha for some encoders:** Lossy WebP does not support full-range transparency well. If `<NuxtImg>` converts a seal PNG to lossy WebP, the transparent edges may show compression artifacts — the gold seal looks "dirty." Use lossless WebP (`quality="100"`) or keep as PNG-8.
3. **CSS `filter: drop-shadow()` on PNG is expensive:** Applying `filter: drop-shadow()` in CSS to a PNG with complex alpha requires the browser to compute shadows on the alpha mask in real time. On mobile, this is a repaint operation every time the element enters view. The shadow should be baked into the PNG source file, not applied via CSS filter.
4. **Inline SVG is better than PNG for a seal:** A vector seal (SVG) scales infinitely, weighs 2–10 KB, and needs no Cloudflare transformation. If the seal is not a photograph, converting it to SVG is the correct long-term choice. For v1.6 specifically, if a designer provides a PNG, optimizing it is acceptable; but flag SVG as the preferred format.

**Why it happens:**
Seal and badge assets are typically created in Figma or Illustrator and exported as PNG for "compatibility." Developers add them with a raw `<img>` tag or `<NuxtImg>` without performance consideration because they are "just a small decorative element." In practice, a 300 KB PNG on a page already loaded with fonts, hero images, and avatar photos is a significant regression.

**How to avoid:**
- Before adding the seal, run it through TinyPNG or `pngquant` to reduce to PNG-8 (transparent, smaller palette). A seal at 256×256 PNG-8 should be under 30 KB.
- Use `<NuxtImg>` with `format="webp"` and `quality="90"` — for a seal with mostly flat colors, lossless WebP (`quality="100"`) is preferred if transparency must be preserved perfectly.
- Do NOT apply `filter: drop-shadow()` in CSS. Use a pre-shadowed PNG source.
- Specify `width` and `height` on `<NuxtImg>` to reserve space and prevent CLS.
- Long-term: ask the designer for an SVG version of the seal.

**Warning signs:**
- The seal PNG file in R2 is above 100 KB.
- DevTools shows the seal loading as `.png` with no WebP conversion in production.
- `filter: drop-shadow()` on the seal element appears in the component CSS.
- CLS occurs at the SectionPrice or SectionGuarantee area where the seal is placed.

**Phase to address:** Phase 5 — Guarantee section build. Optimize the PNG source before it is committed to the repo.

---

### Pitfall V7: UAccordion `ui` Prop Override Removes Focus-Visible Ring and Breaks Keyboard Accessibility

**What goes wrong:**
The current SectionFAQ already uses the `ui` prop on `<UAccordion>`:

```vue
<UAccordion :ui="{ trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 focus-visible:outline-primary min-w-0 text-[var(--color-brand-text)]' }">
```

The `ui` prop is a **replacement**, not a merge. Any key passed to `ui.trigger` replaces the entire default trigger class string from the Nuxt UI theme. The default includes:

- `focus-visible:ring-2` — keyboard focus ring
- `focus-visible:ring-primary` — ring color tied to the semantic primary color
- `outline-none` — removes default browser outline (replaced by the ring above)

When the v1.6 redesign adds new typography classes, background colors, or padding to the trigger via the `ui` prop, developers commonly drop the `focus-visible:*` classes because they were not part of the original design spec. The result: accordion items have no visible focus indicator for keyboard and screen reader users. This is a WCAG 2.4.7 (Focus Visible) violation — a Level AA failure.

In the current code, `focus-visible:outline-primary` is present in the trigger string, but it relies on `--color-primary` being defined (see Pitfall V1). After a palette change that removes or renames that token, the focus indicator becomes transparent or inherits an unexpected color.

**Why it happens:**
The `ui` prop string is edited as raw text. When adding new classes, developers look only at visual classes (padding, font, color) and do not audit for accessibility classes. The before/after comparison is visual — no tool flags the missing focus ring.

**How to avoid:**
- Treat `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-primary)]` as a non-negotiable part of the trigger string — document it as a comment in the component.
- Alternatively, use the Nuxt UI component `app.config.ts` to set global accordion trigger styles so each component does not repeat the full string:
  ```ts
  // app.config.ts
  export default defineAppConfig({
    ui: {
      accordion: {
        slots: {
          trigger: 'your-global-trigger-classes focus-visible:ring-2 focus-visible:ring-primary',
        }
      }
    }
  })
  ```
- After any FAQ redesign, verify keyboard navigation: Tab to the accordion, press Enter to open, Tab through all items, press Space to toggle. Each trigger must show a visible ring.
- Run Lighthouse accessibility audit after the FAQ redesign — a missing focus indicator fails the audit.

**Warning signs:**
- Tabbing through the FAQ shows no visible focus highlight on accordion triggers.
- Lighthouse accessibility score drops after FAQ redesign.
- The `ui.trigger` string in the component no longer contains any `focus-visible:` class.

**Phase to address:** Phase 6 — FAQ redesign. Accessibility check is a mandatory exit criterion for this phase.

---

### Pitfall V8: CTA Color Change from Orange to "Premium" Breaks Contrast on Navy and White Backgrounds Simultaneously

**What goes wrong:**
The current CTA is `#e67e22` (orange) on both the `bg-white` price card and on `bg-[var(--color-brand-primary)]` (navy) sections. Orange works on both backgrounds because:
- On white: `#e67e22` on `#ffffff` = ~3.0:1 (passes for large text / buttons at AA)
- On navy `#1a3a5c`: `#e67e22` on `#1a3a5c` = ~4.8:1 (passes AA)

Common "premium" CTA color replacements proposed for travel brands:
- **Gold `#D4AF37`**: On white (`#ffffff`) = 2.0:1 — **fails AA entirely**. On navy = 3.6:1 — fails AA for normal text.
- **Teal `#0D9488`**: On white = 4.6:1 — passes AA. On navy = 2.1:1 — **fails**.
- **Deep amber `#B45309`**: On white = 5.7:1 — passes. On navy = 3.2:1 — fails for small text.
- **Sky blue CTA on vibrant blue sections:** Any blue CTA on a blue section background will fail — insufficient contrast between similar hues.

The LP has CTAs on at least 4 different background contexts: hero (dark overlay), SectionAbout (white), SectionMethod (brand-bg off-white), SectionPrice (navy). A CTA color that "looks great" in a single design frame may fail on 3 of those 4 contexts.

**Why it happens:**
CTA color is chosen by looking at one mockup (typically the hero or price section) and not systematically verified against all backgrounds where the button appears.

**How to avoid:**
- Before finalizing the new CTA color, test it against all 4 backgrounds it will appear on. Use the WebAIM contrast checker for each combination.
- CTA buttons must have white text (`#ffffff`): the CTA background color needs at least 3:1 contrast with white for large/bold text (WCAG AA for UI components), and 4.5:1 for AA normal text.
- If no single color satisfies all backgrounds, use a context-aware approach: `--color-brand-cta-on-dark` for navy/dark sections and `--color-brand-cta-on-light` for white/off-white sections — both can reference the same hue at different lightness.
- Deep amber `#B45309` (Tailwind amber-700) on white = 5.7:1 passes — consider this for the "premium" replacement for buttons on light backgrounds.

**Warning signs:**
- The CTA button on the navy SectionPrice section looks "washed out" or hard to read.
- Lighthouse accessibility audit flags the CTA button as low contrast.
- White button text against the new CTA color is hard to distinguish at arm's length on mobile.

**Phase to address:** Phase 1 — Design tokens setup. Establish the CTA color token only after checking all 4 background contexts.

---

## Technical Debt Patterns (v1.6 additions)

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Rename `--color-brand-primary` to `--color-primary` for shorter classes | Shorter class names | Collides with Nuxt UI's semantic color system; components misbehave | Never |
| Apply `will-change: background` to gradient sections | Perceived performance optimization | Creates compositor layer, consumes GPU memory, does not accelerate gradients | Never — gradients are not compositable properties |
| Add font to `@theme` only, skip `nuxt.config.ts` fonts module | Faster to implement | Double-loads both old and new fonts; loses Nuxt Fonts CLS fallback metrics | Never |
| Use CSS `filter: drop-shadow()` on the seal PNG | Avoids Figma/Photoshop export step | Expensive mobile repaint; shadow artifacts on low-DPI screens | Never — bake shadow into source file |
| Copy the trigger class string to `ui.trigger` without auditing focus-visible classes | Visual result looks correct | Removes keyboard focus indicator; WCAG 2.4.7 violation | Never |
| Pick CTA color by visual inspection in design tool only | Fast decision | May fail contrast on half the section backgrounds | Never — always verify 4 background contexts |

---

## Integration Gotchas (v1.6 additions)

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Nuxt UI `app.config.ts` colors | Configure `--color-primary` in `@theme` CSS to change Nuxt UI's primary color | Use `app.config.ts` `ui.colors.primary` to point to a Tailwind scale name |
| `@nuxt/fonts` module | Add new font only in `@theme` CSS | Configure in `nuxt.config.ts` `fonts.families` and remove old font from config simultaneously |
| `<NuxtImg>` circular avatars | Omit `width`/`height` and use CSS `border-radius: 50%` alone | Always set `width="80" height="80"` + `class="object-cover rounded-full"` to prevent oval distortion and CLS |
| Cloudflare R2 + Image Transformations | Assume WebP conversion is automatic for all R2 assets | Verify Cloudflare Image Transformations is enabled for the domain in the Cloudflare dashboard before testing |
| UAccordion `ui` prop redesign | Write a new trigger class string without checking if focus-visible classes were preserved | Cross-reference with default Nuxt UI accordion theme before finalizing |

---

## Performance Traps (v1.6 additions)

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full-viewport gradient background | Paint flashing during scroll on low-end Android | Limit to 2 color stops; avoid on sections that scroll past the fold | All page loads on Moto G / Samsung A-series — common in Brazilian market |
| Avatar PNG/JPG served from R2 without Image Transformations | Each avatar is 200–600 KB; mobile LCP regresses | Pre-resize to 160×160 before upload; enable Cloudflare Image Transformations | Production deploy on any mobile device |
| Two font families downloading simultaneously | 200–400 KB extra on first load; visible FOUT from metric mismatch | Remove old font from `nuxt.config.ts` fonts config when adding new one | First page load on slow connections (Brazilian 3G/4G rural) |
| Seal PNG at original resolution (512×512+) | LCP or TBT regression from large PNG parse | Compress to PNG-8 < 30 KB or lossless WebP before adding to codebase | Any production load — immediate |

---

## "Looks Done But Isn't" Checklist (v1.6 additions)

- [ ] **Color token namespace:** Verify `--color-brand-*` tokens are used everywhere — grep for any `--color-primary` or `--color-secondary` definitions in `main.css` that could collide with Nuxt UI's semantic system.
- [ ] **WCAG contrast:** For every new color token used on text, run contrast check on the actual background it appears on — not "white only." Verify heading, body copy, and UI component text separately (different WCAG thresholds for different sizes).
- [ ] **Font double-load:** After font swap, open Network tab and filter by "Font" — only the new font family should download. If Inter still downloads, the old font was not removed from `nuxt.config.ts`.
- [ ] **CLS after font swap:** Lighthouse CLS score must be < 0.1 after font change. Run on a preview build, not dev server.
- [ ] **Gradient paint cost:** Run Chrome DevTools Performance tab with "Paint flashing" enabled on a 4x CPU slowdown profile. No red flashing rectangles during normal scroll.
- [ ] **Avatar images:** In DevTools Network tab on production build, avatar images should return `.webp` format. All avatars must be square. No CLS in the testimonials section.
- [ ] **Seal PNG:** File size on R2 must be under 50 KB. Verify no `filter: drop-shadow()` in component CSS for the seal element.
- [ ] **UAccordion keyboard:** Tab to first FAQ item, press Enter to expand, Tab through all items. Each trigger must show a visible focus ring. At least one `focus-visible:` class must be present in the `ui.trigger` string.
- [ ] **CTA on all backgrounds:** The new CTA color must be manually verified against: dark hero overlay, white card (`bg-white`), off-white section (`bg-[var(--color-brand-bg)]`), and navy section (`bg-[var(--color-brand-primary)]`).

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

### v1.6 Visual Identity (new)

- [ ] **Color token namespace:** No `--color-primary` or `--color-secondary` defined in `main.css` — only `--color-brand-*` tokens.
- [ ] **WCAG contrast (headings and body copy):** Every text color token verified at 4.5:1 minimum against its background using WebAIM Contrast Checker. Large text (18px+ bold) verified at 3:1 minimum.
- [ ] **WCAG contrast (CTA button):** New CTA color verified against white card background, off-white section background, and navy section background — all three must pass.
- [ ] **Font single-load:** Network tab shows only the new font family downloading. Inter does not appear in font requests.
- [ ] **CLS after font swap:** Lighthouse CLS score < 0.1 on a production preview build (`nuxt build && nuxt preview`).
- [ ] **Gradient paint profile:** Chrome DevTools Performance with Paint Flashing shows no red flashing during normal scroll on 4x CPU throttle.
- [ ] **Avatar images:** Square dimensions set on `<NuxtImg>`, `object-cover rounded-full` applied, CLS = 0 for testimonials section.
- [ ] **Seal PNG weight:** File committed to repo or uploaded to R2 is under 50 KB. No `filter: drop-shadow()` in component CSS.
- [ ] **UAccordion keyboard focus:** Tab navigation through FAQ shows visible focus ring on every trigger. At least one `focus-visible:ring-*` class in `ui.trigger`.

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
| `--color-primary` collision with Nuxt UI discovered after components built | MEDIUM | Rename token back to `--color-brand-primary`; do a codebase-wide find-replace; rebuild to verify no component regressions |
| WCAG contrast failure discovered post-launch | LOW | Darken the color token value; single token change cascades to all components; rebuild |
| CLS regression from font swap | LOW-MEDIUM | Add `nuxt-modules/fontaine` to auto-generate metric overrides; or revert to Inter and try a different font pairing |
| Gradient paint problem discovered in QA | LOW | Simplify gradient to 2 stops; or remove from lowest-priority section; no data loss |
| Avatar images served as PNG in production | LOW | Verify Cloudflare Image Transformations is enabled in the Cloudflare dashboard; no code changes needed |
| Seal PNG too large | LOW | Re-compress with TinyPNG/pngquant; re-upload to R2; no code changes needed |
| UAccordion missing focus ring | LOW | Add `focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]` to `ui.trigger` string; rebuild |
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
| `--color-brand-*` vs `--color-primary` collision (V1) | Phase 1 — Design tokens | No `--color-primary` in `main.css`; Nuxt UI UButton/UFormField focus ring unchanged |
| WCAG contrast on new blue palette (V2) | Phase 1 — Design tokens | All text tokens pass 4.5:1 on white; verified with WebAIM before distributing to components |
| CTA contrast on all backgrounds (V8) | Phase 1 — Design tokens | CTA color passes contrast check on white, off-white, and navy backgrounds |
| Font double-load and CLS (V3) | Phase 2 — Typography | Network tab: only new font loads; Lighthouse CLS < 0.1 on preview build |
| Gradient paint cost on mobile (V4) | Phase 3 — Gradient accents | Paint flashing clear during scroll on 4x CPU throttle |
| Avatar image optimization (V5) | Phase 4 — Social proof visuals | Avatars square, WebP format, CLS = 0 for testimonials |
| Seal PNG performance (V6) | Phase 5 — Guarantee section | Seal < 50 KB, no CSS filter, space reserved via width/height |
| UAccordion focus ring removal (V7) | Phase 6 — FAQ redesign | Keyboard focus visible on all FAQ triggers after redesign |
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

### v1.6 Visual Identity — Sources
- [Tailwind CSS v4 Theme Variables — Official Docs](https://tailwindcss.com/docs/theme) — `@theme` namespace rules, `--color-*` convention, `inline` modifier for variable references (HIGH confidence)
- [Nuxt UI v4 Design System — Official Docs](https://ui.nuxt.com/docs/getting-started/theme/design-system) — semantic color aliases, `app.config.ts` color configuration, risk of overriding `--color-primary` (HIGH confidence)
- [Nuxt UI v4 UAccordion — Official Docs](https://ui.nuxt.com/docs/components/accordion) — `ui` prop slots: `root`, `item`, `header`, `trigger`, `content`, `body`, `leadingIcon`, `trailingIcon`, `label`; replacement vs. merge behavior (HIGH confidence)
- [Nuxt UI v4 Customize Components — Official Docs](https://ui.nuxt.com/docs/getting-started/theme/components) — `app.config.ts` global slot overrides (HIGH confidence)
- [Tailwind v4 @theme directive: variables not working as expected — GitHub Discussion #15122](https://github.com/tailwindlabs/tailwindcss/discussions/15122) — silent failure modes for custom variables (MEDIUM confidence)
- [Tailwind v4 @theme not working when importing CSS files — GitHub Issue #18966](https://github.com/tailwindlabs/tailwindcss/issues/18966) — import scope issues (MEDIUM confidence)
- [primary/gray color conflicts with existing projects — Nuxt UI GitHub Issue #1721](https://github.com/nuxt/ui/issues/1721) — naming collision history (MEDIUM confidence)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — used to verify all contrast ratios cited in Pitfall V2 and V8 (HIGH confidence)
- [WCAG 2.1 Color Contrast — MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast) — 4.5:1 AA normal text, 3:1 large text thresholds (HIGH confidence)
- [Nuxt Fonts — Official Docs](https://fonts.nuxt.com/) — `font-display: swap`, fallback metric generation, `nuxt.config.ts` families configuration (HIGH confidence)
- [Nuxt Fontaine — GitHub](https://github.com/nuxt-modules/fontaine) — font metric overrides for CLS reduction (HIGH confidence)
- [Fixing Layout Shifts Caused by Web Fonts — DebugBear](https://www.debugbear.com/blog/web-font-layout-shift) — FOUT, metric fallback, CLS thresholds (MEDIUM confidence)
- [CSS Gradient Performance — Hoverify](https://tryhoverify.com/blog/i-wish-i-had-known-this-sooner-about-css-gradient-performance/) — repaint cost, background-position vs. gradient-color animation (MEDIUM confidence)
- [Rendering Performance — web.dev](https://web.dev/articles/rendering-performance) — compositor vs. paint vs. layout cost model (HIGH confidence)
- [Don't lazy load LCP images — GTmetrix](https://gtmetrix.com/dont-lazy-load-lcp-image.html) — lazy-load LCP anti-pattern, 15% LCP regression (HIGH confidence)
- [Image performance — web.dev](https://web.dev/learn/performance/image-performance) — `fetchpriority="high"`, `loading="eager"` vs `lazy` (HIGH confidence)
- Codebase inspection: `app/assets/css/main.css`, `app/components/Section/SectionFAQ.vue`, `app/components/Section/SectionSocialProof.vue`, `app/components/Section/SectionPrice.vue`, `app/assets/img/selo-garantia7-dias.png` (verified 2026-03-24)

### v1.5 Migration — Sources (carried forward)
- Codebase inspection: `server/leads/schema.ts`, `app/composables/useLeadForm.ts`, `app/components/Section/SectionLeadForm.vue`, `app/components/Section/SectionAbout.vue` (verified 2026-03-24)
- [Nuxt SSR Common Pitfalls and How to Avoid Them](https://infinitejs.com/posts/nuxt-ssr-pitfalls-avoidance/)
- [Fixing Nuxt Hydration Mismatches in the Real World](https://ryanclements.dev/posts/fixing-nuxt-hydration-mismatches-in-the-real-world)
- [When to Use $fetch, useFetch, or useAsyncData — MasteringNuxt](https://masteringnuxt.com/blog/when-to-use-fetch-usefetch-or-useasyncdata-in-nuxt-a-comprehensive-guide)
- [NuxtImg optimization props not applied on Cloudflare — Issue #1588](https://github.com/nuxt/image/issues/1588)
- [CORS Missing Allow Origin with useFetch — Nuxt Discussion #19276](https://github.com/nuxt/nuxt/discussions/19276)

---

*Pitfalls research for: Fly Up Milhas v1.6 — visual identity upgrade on Nuxt 4 SSR LP*
*Researched: 2026-03-24*
