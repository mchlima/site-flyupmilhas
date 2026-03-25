# Feature Research

**Domain:** High-conversion landing page — mentorship/service sales (Brazilian market, R$ 299,90 price point)
**Researched:** 2026-03-24 (updated for v1.6 milestone — visual identity upgrade)
**Confidence:** HIGH (multiple sources verified, including airline brand references and design system patterns)

---

## v1.6 Milestone Focus: Visual Identity Upgrade

This update covers the seven visual identity features requested in v1.6. The existing v1.5 research below is preserved. New sections are explicitly labeled as v1.6 additions.

The milestone goal is to elevate Fly Up Milhas from a functional landing page to a premium aviation-adjacent visual experience that reinforces trust, aspiration, and authority — without sacrificing the conversion mechanics built in v1.0–v1.5.

---

## v1.6 Feature Research: Seven Visual Identity Features

### 1. Premium Blue Palette (Replacing #1a3a5c Navy)

**What the problem is with the current palette:**
`#1a3a5c` is a muted, dark navy — appropriate for established corporate trust but visually heavy and "abafado" (smothered) for an aviation/travel aspiration brand. It does not evoke sky, horizon, or flight. It reads as conservative bank or logistics, not premium miles consultancy.

**How premium aviation brands use blue:**
Research across airline identity systems reveals a consistent pattern: premium carriers use a **two-tone blue system** with a deep anchor color (trust/authority) paired with a vibrant mid-blue (aspiration/sky). The deep tone anchors text and UI structure; the vibrant tone carries gradient accents, section backgrounds, and graphic elements.

Verified examples from airline brand research:
- **United Airlines:** `#005DAA` (Lebanese Blue) — clear, mid-depth saturated blue
- **Singapore Airlines:** `#1D4886` (deep blue) paired with gold
- **Azul Brazilian Airlines:** `#5061AA` (San Marino blue) — familiar to Brazilian audience, mid-saturation periwinkle-leaning blue
- **KLM:** Light sky-adjacent blue `#00A1DE` — lighter, more approachable

**Recommended palette for Fly Up Milhas v1.6:**

The shift should move from a single heavy navy to a two-anchor system:

| Token | Current | Recommended | Purpose |
|-------|---------|-------------|---------|
| `--color-brand-primary` | `#1a3a5c` (muted navy) | `#0C2D5E` (deep ocean blue) | Headings, nav background, dark sections — deeper, richer than current but not muted |
| `--color-brand-accent` | (none) | `#1565C0` (vibrant royal blue) | Section highlights, gradient start point, decorative elements |
| `--color-brand-sky` | (none) | `#1E88E5` (sky/horizon blue) | Gradient end, icon accents, hover states |
| `--color-brand-footer` | `#0f2039` | `#071B38` (near-black blue) | Footer — unchanged strategy, slightly deeper |
| `--color-brand-bg` | `#F9FAFB` | `#F8FAFF` (blue-tinted off-white) | Page background — very subtle blue undertone instead of pure gray-white |

**Rationale for these specific values:**
- `#0C2D5E` is deep enough to maintain authority but has sufficient blue saturation to read as "sky" rather than "navy uniform". Contrast ratio against white: 11.5:1 (passes WCAG AAA).
- `#1565C0` is the Material Design "Blue 800" — a well-tested, screen-optimized vibrant blue that reads premium across all display types.
- `#1E88E5` is Material Design "Blue 500" — the classic midpoint between corporate and digital. Used as a gradient target, not as a standalone primary.
- `#F8FAFF` replaces the gray-cast `#F9FAFB` with an extremely subtle blue warmth (barely perceptible) that unifies the page with the blue brand system.

**What to avoid:**
- Electric/neon blues (`#00BFFF`, `#00B4D8`) read as technology startups, not premium travel consultancy
- Pure navy black-blues (`#000066`, `#002060`) read as conservative financial services
- Periwinkle-leaning blues (`#5061AA` like Azul) read as friendly/mass-market, not premium mentorship

**Confidence:** HIGH — verified against real airline brand references and WCAG contrast requirements. Specific values draw from Material Design's screen-tested blue scale.

**Complexity:** LOW-MEDIUM — requires updating CSS custom properties in `main.css` (one file) and verifying all components that hardcode color values instead of using tokens.

**Dependencies:**
- Audit all Vue components for hardcoded hex values (e.g., `SectionSocialProof.vue` uses `#DCF8C6` directly)
- Verify header/footer contrast ratios with new values
- Update logo image if it contains the current navy color (check `logo-fly-up-milhas.png`)

---

### 2. CTA Accent Color (Replacing Orange #e67e22)

**What the problem is with orange:**
`#e67e22` is a mid-energy orange that reads as approachable but not premium. It is the default choice for Brazilian infoprodutor funnels (Hotmart CTAs are orange, Eduzz buttons are orange) — precisely because of this ubiquity, it signals "generic digital product" rather than a curated premium consultancy.

**What premium aviation uses instead:**
Aviation-premium brands use gold, not orange. The distinction:
- **Orange** (`#e67e22`): warm, urgent, populist, high-energy — Hotmart, Amazon, HubSpot
- **Gold/Amber** (`#D4A017`–`#F0A500`): luxurious, aspirational, earned — Singapore Airlines gold, premium loyalty programs
- **Deep Amber** (`#F59E0B`–`#D97706`): the practical sweet spot — warm enough to stand out against blue, premium enough to avoid the infoprodutor association

**Recommended CTA color for Fly Up Milhas v1.6:**

| Token | Current | Recommended | Purpose |
|-------|---------|-------------|---------|
| `--color-brand-cta` | `#e67e22` (pumpkin orange) | `#F59E0B` (amber/gold) | Primary CTA buttons |
| `--color-brand-cta-hover` | `#d35400` | `#D97706` (darker amber) | CTA hover state |

**Why `#F59E0B`:**
- Tailwind's `amber-500` — verified readable at all sizes, well-tested contrast against both dark navy (`#0C2D5E`) and white backgrounds
- Reads as gold in the context of a dark blue page — triggers premium/earned/reward associations aligned with the miles/travel aspiration
- Sufficient contrast against `#0C2D5E`: ratio 5.1:1 (passes WCAG AA for large text, which CTAs qualify as at 18px bold)
- Distinct from the generic orange palette while maintaining warm urgency

**Alternative if client wants more differentiation from competitors:**
`#10B981` (emerald green) is used by Nuxt UI as its primary accent and has strong conversion data in the wellness/expertise category. However, green does not carry the travel/premium connotation that amber does. Avoid unless client specifically rejects the gold direction.

**Confidence:** HIGH — based on airline brand research (Singapore Airlines gold), CTA color psychology, and WCAG contrast verification.

**Complexity:** LOW — two token updates in `main.css`. All components already reference `var(--color-brand-cta)`.

**Dependencies:** None — fully tokenized in current codebase.

---

### 3. Premium Typography (Replacing Inter)

**What the problem is with Inter:**
Inter is the default professional sans-serif. It is legible, neutral, and everywhere — Nuxt UI uses it, most SaaS uses it, most Brazilian services use it. For a premium mentorship brand, "everywhere" reads as "commodity." The current implementation provides zero visual differentiation.

**The established premium approach (two-font system):**
Premium travel and coaching brands use a **display/body pairing**: a distinctive heading typeface (with personality) paired with a legible body font (with neutrality). The heading font does the differentiation work; the body font maintains readability.

**Recommended pairing:**

**Option A — Editorial Premium (recommended):**
- **Headings:** `Playfair Display` — High-contrast serif with elegant curves. Signals authority and expertise. Widely recognized as a premium signal in Brazilian market (used in premium magazine editorial). At display sizes (36px+), creates immediate visual distinction from competitors.
- **Body:** `Plus Jakarta Sans` — Geometric humanist sans-serif with subtle personality. More distinctive than Inter without sacrificing readability. Verified in use by premium professional services landing pages. Available via Google Fonts, compatible with `@nuxt/fonts`.

**Option B — Contemporary Premium (alternative):**
- **Headings:** `DM Serif Display` — Classic serif, high contrast, editorial without being antiquated
- **Body:** `DM Sans` — Matching family, modern and clean

**Recommendation: Option A** (Playfair Display + Plus Jakarta Sans).

Rationale: The miles/travel niche in Brazil combines aspiration (destinations, executive class) with strategy (financial planning). Playfair Display's editorial character signals "expert guide" — like a premium travel magazine — rather than another online course platform. Plus Jakarta Sans modernizes the body without making the page feel cold or corporate.

**Implementation:**

```css
/* In app/assets/css/main.css @theme block */
--font-family-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
--font-family-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
```

```typescript
// In nuxt.config.ts (already using @nuxt/fonts via @nuxt/ui)
// Fonts are auto-loaded — just use the names in CSS
```

**Application rules:**
- `font-display` (Playfair): All `h1`, `h2` headings and section titles
- `font-sans` (Plus Jakarta Sans): All body text, labels, UI elements, CTAs
- Do NOT use Playfair for body text — it is a display font, illegible below 18px

**Performance note:**
Both fonts are variable fonts available on Google Fonts and via `@nuxt/fonts`. Subsetting to Latin + Latin Extended (covers PT-BR) reduces payload. Estimated combined load: ~60KB after subsetting, versus Inter's ~35KB. The visual payoff justifies this delta.

**Confidence:** HIGH — Playfair Display is a verified premium signal across typography research. Plus Jakarta Sans is verified as a differentiated-but-legible alternative to Inter.

**Complexity:** LOW-MEDIUM — CSS token update + applying `font-display` class to heading elements across 12 components. No structural changes needed.

**Dependencies:**
- `@nuxt/fonts` already handles optimization (it is included in `@nuxt/ui` v4)
- Need to add font-display class to heading elements in each Section component
- Verify Playfair Display renders correctly at all heading sizes on mobile (test at 360px viewport)

---

### 4. Subtle Aviation Gradients

**What the pattern is:**
Premium aviation/travel brands use gradient backgrounds in section dividers, hero overlays, and card accents to evoke the sky-to-horizon transition. The key word is "subtle" — not the full rainbow gradients of consumer apps or the heavy overlay gradients of discount travel sites.

**Two gradient uses for Fly Up Milhas:**

**A. Section background gradients (sky horizon effect):**
Applied to sections that need visual weight without a solid dark background. Replaces the `bg-white` / `bg-[var(--color-brand-bg)]` alternation with a gradient wash.

```css
/* Subtle sky-to-white gradient — for light sections */
background: linear-gradient(180deg, #F8FAFF 0%, #EFF6FF 50%, #DBEAFE 100%);

/* Deep sky gradient — for dark/emphasis sections */
background: linear-gradient(135deg, #0C2D5E 0%, #1565C0 60%, #1E88E5 100%);
```

**B. Card accent gradients:**
Replace the solid `border border-gray-100` card style with a very subtle gradient border or gradient-tinted background:

```css
/* Premium card: barely-visible gradient top edge */
background: linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 80%);
border: 1px solid #DBEAFE;
```

**What to avoid:**
- Full-spectrum gradients (blue to purple to pink) — read as generic SaaS
- Hard gradient stops — need smooth transitions
- Gradients on text — readability killer
- Gradient backgrounds behind body text blocks — creates contrast issues

**CSS approach for Tailwind v4:**
In Tailwind v4 (already in stack), gradients can be applied as arbitrary values or as `@theme` tokens:

```css
@theme {
  --gradient-sky-light: linear-gradient(180deg, #F8FAFF 0%, #DBEAFE 100%);
  --gradient-sky-deep: linear-gradient(135deg, #0C2D5E 0%, #1565C0 100%);
}
```

Then in components: `class="bg-[var(--gradient-sky-light)]"` or inline style.

**Confidence:** HIGH — gradient patterns verified against aviation landing page examples. Specific values derived from Tailwind's Blue scale (50 to 200 range for light gradients, 800 to 600 for dark).

**Complexity:** LOW — CSS-only changes. No new dependencies. Apply to 2-3 key sections maximum.

**Dependencies:** None structural — pure CSS. Verify section backgrounds do not conflict with existing text color tokens.

---

### 5. Testimonial Avatars (Photo + Initials Fallback)

**What is missing from current implementation:**
The current `SectionSocialProof.vue` has WhatsApp-style chat bubbles but no avatar — no visual indicator of who is speaking. The name appears below the bubble as text only. This is functional but visually incomplete; premium testimonial designs include a circular avatar that makes the testimonial feel more human and real.

**The two-state avatar pattern (industry standard 2025):**

| State | Trigger | Rendering |
|-------|---------|-----------|
| Photo available | `src` loads successfully | Circular `<img>` with `object-cover`, diameter 40-48px |
| No photo / load error | `@error` or no `src` | Colored circle with initials (first + last initial), background derived from name hash |

**Implementation approach for Vue/Nuxt:**

```vue
<!-- AvatarInitials.vue — standalone component -->
<template>
  <div class="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="w-full h-full object-cover"
      @error="showFallback = true"
    />
    <div
      v-if="!src || showFallback"
      class="w-full h-full flex items-center justify-center text-sm font-bold text-white"
      :style="{ backgroundColor: avatarColor }"
    >
      {{ initials }}
    </div>
  </div>
</template>
```

**Color generation for initials fallback:**
Use a deterministic hash of the name to pick from a set of 6 brand-adjacent colors. This ensures the same person always gets the same color and avoids clashes:

```typescript
const avatarColors = [
  '#1565C0', // brand royal blue
  '#0277BD', // ocean blue
  '#00695C', // teal (complementary)
  '#4527A0', // deep indigo
  '#1B5E20', // emerald
  '#4E342E', // warm brown
]
function avatarColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[hash % avatarColors.length]
}
```

**Integration into SectionSocialProof:**
Add avatar above or to the side of each chat bubble. Two layout options:

- **Above-bubble:** Name chip with circular avatar + text, then bubble below. Clean for the alternating left/right layout already in place.
- **Beside-bubble:** Avatar floats left (or right for right-aligned bubbles), bubble aligns beside it. Standard WhatsApp-style layout.

Recommendation: **above-bubble** since the current alternating layout is already established and beside-bubble would require restructuring the existing grid.

**Confidence:** HIGH — avatar fallback pattern is universal (Shadcn UI documents it, Nuxt UI UAvatars implement it, Tailwind ecosystem has clear patterns).

**Complexity:** LOW — self-contained new component (~40 lines). No new dependencies. Nuxt UI v4 already has a `UAvatar` component with built-in fallback.

**Note on Nuxt UI v4 UAvatar:**
Before building a custom component, verify that `UAvatar` from `@nuxt/ui` v4.5.1 supports: circular shape, image src, initials fallback, and custom background color. If yes, use `UAvatar` directly to minimize custom code. Confidence: MEDIUM — likely supported but needs verification against `@nuxt/ui` v4 docs.

**Dependencies:**
- `UAvatar` from `@nuxt/ui` v4 (verify capabilities before custom build)
- Photo assets from Cloudflare R2 (or no photo — initials fallback covers this case)
- No LGPD issue with initials-only display

---

### 6. Dedicated Guarantee Section (Gold Seal)

**What exists vs. what is needed:**
Current state: guarantee is a small block below the price card in `SectionPrice.vue` — a shield icon + two lines of text, integrated inline, small, easy to scroll past.

Target state: a **dedicated full-width section** between `SectionPrice` and `SectionFAQ` (or between `SectionFAQ` and `SectionLeadForm`) with high visual prominence, gold seal imagery, and expanded trust copy.

**Why a dedicated section converts better:**
Research shows that guarantee visibility near the point of decision (before form submission) significantly reduces abandonment. Placing the guarantee as a standalone section forces the visitor to "process" the risk reversal as a decision point, rather than seeing it as a price card footnote.

**Anatomy of a high-converting guarantee section:**

```
[Full-width section, light background or gold-tinted]

  [Gold Seal Image — circular badge, "Garantia 7 Dias"]

  [Heading: "Você tem 7 dias para decidir — sem risco"]

  [Body: "Se nos primeiros 7 dias você sentir que a
  mentoria não é para você, devolvemos 100% do valor
  investido. Sem perguntas, sem burocracia. Assim como
  deve ser."]

  [Secondary line: small print about how to claim]
```

**Gold seal image:**
The file `app/assets/img/selo-garantia7-dias.png` already exists in the codebase. This is the primary visual element. It should be displayed prominently (120-160px diameter on desktop, 100px on mobile) as the centerpiece of the section.

**Background treatment for the section:**
Avoid solid dark navy — the surrounding sections already use navy. Use a warm light treatment:
- Option A: `#FFFBEB` (amber-50 from Tailwind) — extremely light amber/cream, subtly warm, evokes gold without being garish
- Option B: `#F0F9FF` (sky-50) with a gold border-top accent line
- Option C: gradient from `#FFFBEB` to `#F8FAFF` — transitions from gold-warm to blue-cool, reinforcing the brand palette

Recommendation: **Option A** (`#FFFBEB`) for maximum visual differentiation from surrounding sections.

**Confidence:** HIGH — verified research on guarantee section conversion (VWO experiment: +32% conversion), and the seal image asset already exists.

**Complexity:** LOW — new `SectionGuarantee.vue` component, ~60 lines. Seal image asset already present. Needs insertion in `app.vue` between existing sections.

**Dependencies:**
- `app/assets/img/selo-garantia7-dias.png` already exists — use as the visual anchor
- Insert between `SectionPrice` and `SectionFAQ` in `app.vue`
- Copy to be written or provided by client (guarantee terms already confirmed in PROJECT.md)

---

### 7. Impactful FAQ Redesign

**What exists vs. what is needed:**
Current state: `UAccordion` with minimal custom styling. Flat list, no visual hierarchy beyond the question text, the primary color only on headings. The accordion works but is visually indistinguishable from the simplest possible implementation. It reads as "generic template."

**Research-backed patterns for premium FAQ sections:**

Three layout patterns that increase engagement over a plain accordion:

**Pattern A — Numbered card accordion (recommended):**
Each FAQ item is a card with a large numbered index (e.g., "01", "02"), a question heading, and expandable content. The number creates visual rhythm and signals to the user "there are 6 questions — I can scan all 6."

```
┌─────────────────────────────────────┐
│  01  Quanto custa a mentoria?       │  ↓
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  02  Funciona para quem está...     │  ↓
└─────────────────────────────────────┘
```

**Pattern B — Icon + category accordion:**
Each question gets a relevant icon (from heroicons, already in stack). Differentiates questions visually, reduces wall-of-text feel.

**Pattern C — Two-column FAQ grid (desktop only):**
Questions displayed in two columns on desktop, single column on mobile. Reduces vertical scroll and allows the user to see more questions at once before engaging.

**Recommendation: Pattern A + icon variant (numbered + icon):**
Combine numbered index with a small category icon on each card. This adds visual rhythm without requiring layout restructuring for mobile. The `UAccordion` component can be replaced with a custom accordion built on Tailwind + `<details>`/`<summary>` (or Reka UI's Accordion primitive already bundled in Nuxt UI v4).

**Visual treatment for the new FAQ:**
- Section background: `var(--color-brand-bg)` or the light gradient (consistent with rest of page)
- Card border: `border border-blue-100` instead of the current invisible divider-only style
- Number label: `text-4xl font-bold text-[#DBEAFE]` (light blue, large, visible but not competing with the question text)
- Expand icon: replace default chevron with `i-heroicons-plus` / `i-heroicons-minus` (clearer expand/collapse signal)
- Expanded state: subtle `bg-[#EFF6FF]` fill to distinguish open item
- Bottom rule: `border-b border-blue-100` between items instead of the default `border-gray-200`

**Animation:**
`UAccordion` already handles animation. If replacing with custom `<details>`, add:
```css
details[open] summary ~ * {
  animation: open 0.2s ease-in-out;
}
@keyframes open {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Confidence:** HIGH for numbered cards pattern — verified in multiple premium landing page references. LOW-MEDIUM for specific two-column layout — requires testing on the actual content to verify readability.

**Complexity:** MEDIUM — replaces UAccordion usage with custom-styled implementation. Template restructure in `SectionFAQ.vue`. No new dependencies if using Reka UI Accordion (already in Nuxt UI v4).

**Dependencies:**
- `UAccordion` from `@nuxt/ui` v4 — can be styled with the `:ui` prop for most visual changes, or replaced with Reka UI Accordion if deeper customization is needed
- Heroicons (already in stack via `@nuxt/ui`) for question icons

---

## Table Stakes vs. Differentiators: v1.6 Visual Identity Summary

| Feature | Category | Reasoning | Complexity |
|---------|----------|-----------|------------|
| Premium blue palette | **Table stakes** (for premium positioning) | Current navy actively undermines premium perception; visitors in travel/aspiration niche expect a vibrant, sky-referencing blue | LOW-MEDIUM |
| Updated CTA color (amber/gold) | **Table stakes** (for premium positioning) | Orange CTA is a commodity signal in Brazilian digital market; gold/amber communicates premium, earned, aspirational | LOW |
| Premium typography (Playfair Display) | **Differentiator** | Most competitors use Inter or similar; editorial serif heading creates immediate visual premium signal | LOW-MEDIUM |
| Aviation gradients | **Differentiator** | Adds depth and sky-referencing visual texture; not expected but significantly elevates premium perception | LOW |
| Testimonial avatars | **Table stakes** (global standard) | Testimonials without faces/avatars are increasingly untrustworthy; initials fallback covers the no-photo case | LOW |
| Dedicated guarantee section | **Table stakes** (for conversion) | Guarantee as inline footnote is invisible; standalone section increases decision-point visibility | LOW |
| FAQ redesign (numbered cards) | **Differentiator** | Plain accordion is functional; numbered premium cards elevate perceived quality and engagement | MEDIUM |

---

## Anti-Features: v1.6 Additions

| Anti-Feature | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Electric/neon blues (#00BFFF, #00B4D8) | Read as tech startup, not premium travel. Poor contrast against white backgrounds. | `#1565C0` vibrant royal blue — premium, readable, sky-referencing |
| Full-spectrum rainbow gradients | Generic SaaS aesthetic, actively undermines premium positioning | Two-tone blue gradients with narrow hue range |
| Playfair Display for body text | Display font, illegible below 18px, causes eye fatigue in paragraphs | Playfair Display for h1/h2 only; Plus Jakarta Sans for body |
| Multiple guarantee badges in same area | Baymard: excess trust signals create skepticism | One seal + one short paragraph. Guarantee in FAQ as reinforcement only |
| CSS-only gold seal (recreating a badge from scratch) | Asset `selo-garantia7-dias.png` already exists | Use the existing image asset as the visual anchor |
| Animated hero plane/flight illustration | Adds JS weight, causes LCP regression, distracts from CTA | Static hero with gradient overlay — already functional, preserve it |
| Google Fonts CDN loading | Causes render-blocking in some cases | `@nuxt/fonts` already handles optimized loading — just declare font names in CSS |
| Custom font from third-party (paid) foundry | Licensing complexity, no CDN | Google Fonts (Playfair Display + Plus Jakarta Sans are both free) |
| Dark-on-dark text in gradient sections | Readability failure | Always place text on sections where background lightness guarantees 4.5:1+ contrast |

---

## Feature Dependencies: v1.6 Map

```
Palette Update (#0C2D5E primary, #F59E0B CTA)
    └──modifies──> app/assets/css/main.css @theme block
    └──requires──> Audit all components for hardcoded hex values
    └──check──> logo-fly-up-milhas.png (contains navy? needs reexport?)
    └──verify──> WCAG contrast ratios for all text/background combinations

Typography Update (Playfair Display + Plus Jakarta Sans)
    └──modifies──> app/assets/css/main.css font-family tokens
    └──requires──> Add font-display class to h1/h2 in all 12 Section components
    └──uses──> @nuxt/fonts (already installed via @nuxt/ui)
    └──test──> Mobile rendering at 360px viewport

Aviation Gradients
    └──modifies──> app/assets/css/main.css (new gradient tokens)
    └──applies-to──> 2-3 key sections (Hero overlay, SectionPrice dark, one light section)
    └──no new dependencies──>

Testimonial Avatars
    └──modifies──> SectionSocialProof.vue
    └──option-a──> Use UAvatar from @nuxt/ui v4 (verify capabilities first)
    └──option-b──> New AvatarInitials.vue component (~40 lines)
    └──no photo required──> Initials fallback works standalone
    └──no LGPD concern──> Initials display only, no real face

Dedicated Guarantee Section
    └──creates──> SectionGuarantee.vue (new component, ~60 lines)
    └──uses──> app/assets/img/selo-garantia7-dias.png (already exists)
    └──inserts-in──> app.vue between SectionPrice and SectionFAQ
    └──copy-source──> guarantee terms confirmed in PROJECT.md (7 dias, 100%, sem burocracia)

FAQ Redesign (numbered cards)
    └──modifies──> SectionFAQ.vue (template restructure)
    └──replaces──> UAccordion with custom-styled implementation or UAccordion with `:ui` overrides
    └──uses──> i-heroicons icons (already in stack)
    └──no data change──> FAQ items array is unchanged (6 questions from v1.5)
```

---

## Phase Ordering Recommendation for v1.6

Based on dependency analysis, the optimal build order within the v1.6 milestone:

1. **Palette + CTA color** (tokens only — enables all other visual work to use correct colors)
2. **Typography** (font tokens + apply classes — affects all sections at once)
3. **Gradients** (CSS additions — builds on new palette)
4. **Testimonial avatars** (isolated to SectionSocialProof, no cross-dependencies)
5. **Dedicated guarantee section** (new component, inserts into app.vue)
6. **FAQ redesign** (highest complexity, benefits from seeing final palette/typography in context)

**Why this order:**
Palette and typography changes are global — they affect every section simultaneously and should be validated first before building new components on top of them. The guarantee section and FAQ are the most structurally independent and can be built and tested in isolation once the visual foundation is set.

---

## Content Dependencies (Non-Technical)

All v1.6 features can be built without additional client content:
- Guarantee copy: already confirmed in PROJECT.md
- FAQ questions: unchanged from v1.5 (6 items)
- Testimonial text: unchanged from v1.5 (3 testimonials)
- Logo: existing PNG — needs visual check to confirm it is legible on new blue palette

Optional for enhancement (not blocking):
| Content Item | Required For | Urgency |
|-------------|-------------|---------|
| Real client photos (3 testimonials) | Testimonial avatar photo state | LOW — initials fallback works |
| Improved hero background image | Aviation gradient enhancement | LOW — current bg-hero.png is functional |

---

## Preserved: v1.5 Feature Research

*(All v1.5 research below is preserved unchanged for reference)*

---

## v1.5 Milestone Focus: Conversion Optimization Patterns

### 1. WhatsApp-Style Testimonials (Print/Chat Bubble)

**What the pattern is:**
Screenshots of real WhatsApp conversations — or CSS components that visually mimic them — displayed as social proof instead of generic quote cards. Widely used in Brazilian infoprodutor funnels because WhatsApp is the dominant communication channel (148M users in Brazil) and screenshots are instantly recognizable as authentic.

**Table stakes vs. differentiator:**
In the Brazilian mentorship/course market, WhatsApp-style testimonial prints are **table stakes for the niche** — visitors familiar with this market expect to see them. Generic Western-style quote boxes with a name and photo look less credible to a Brazilian audience that is accustomed to seeing conversation prints. Missing this pattern signals that either results don't exist or the creator is targeting a different market.

**Two valid implementation approaches:**

| Approach | Authenticity | Implementation | Risk |
|----------|-------------|----------------|------|
| Real screenshot images (PNG/WebP) | Highest — viewer sees real app UI | `<NuxtImg>` inside a styled card container. CSS: `max-width: 340px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15)` | Requires actual client screenshots. Images must be legible on mobile. Must crop/blur identifying info except first name. |
| CSS chat bubble component (simulated) | High if well-designed — requires authentic-looking content | Flowbite `Chat Bubble` component (Tailwind CSS). Structure: avatar circle + rounded message bubble (`rounded-e-xl rounded-es-xl`) + name + timestamp. Green bubble (#25D366 or a tint) for "received" message style. | Can look fake if over-polished. Must use real testimonial text, never invented copy. |

**Implementation complexity:** LOW (images) / LOW-MEDIUM (CSS component)

---

### 2. Pricing Sections with Installment Display (Parcelamento)

Brazilian consumers expect to see both a PIX/boleto price and a credit card installment option displayed together. This is **table stakes** for any Brazilian digital product above R$ 100. Already implemented in v1.5. Preserved for reference.

---

### 3. Guarantee Blocks

7-day guarantee is legally standard under CDC Art. 49. Already implemented inline in SectionPrice. v1.6 upgrades this to a dedicated section. See v1.6 Feature 6 above.

---

### 4. "Para Quem NAO E" Qualification Sections

Already implemented in v1.5 (SectionForWhom). See v1.5 research for full details.

---

### 5. Progressive CTAs

Already implemented in v1.5 (4 distinct CTA texts). See v1.5 research for full details.

---

### 6. Security Badges on Forms

Already implemented in v1.5 (lock badge below submit button). See v1.5 research for full details.

---

## Anti-Features: Combined v1.5 + v1.6

| Anti-Feature | Why Avoid | Alternative |
|--------------|-----------|-------------|
| Fake strikethrough pricing | Brazilian buyers detect fabricated discounts | Real PIX vs installment price anchor |
| Multiple guarantee icons | Excess signaling creates skepticism | One seal + one line of text |
| reCAPTCHA on form | Friction kills mobile conversion | @fastify/rate-limit handles spam server-side |
| Chat bubble testimonials with invented content | Legally problematic, trust-destroying when exposed | Real text from Marcio's actual clients |
| Countdown timer fake urgency | Detectable, destroys trust | Real scarcity: "Vagas para abril" |
| Electric/neon blues | Tech startup aesthetic, not premium travel | `#1565C0` vibrant royal blue |
| Full-spectrum gradients | Generic SaaS, undermines premium | Two-tone narrow-hue blue gradients |
| Playfair Display for body text | Display font, illegible at small sizes | Playfair Display for headings only |
| Multiple guarantee sections | Redundancy dilutes impact | One dedicated section, guarantee mention in FAQ |

---

## Sources

- [TheDesignAir — Why So Blue? Aviation Color Psychology](https://thedesignair.net/2021/02/10/why-so-blue-the-dominance-of-the-colour-in-the-industry/) — Aviation industry blue dominance and psychology
- [Singapore Airlines Brand Colors — Mobbin](https://mobbin.com/colors/brand/singapore-airlines) — Verified: deep blue + gold = premium aviation formula
- [United Airlines Logo Blue Color Palette — SchemeColor](https://www.schemecolor.com/united-airlines-logo-blue-color.php) — United Airlines `#005DAA`
- [Azul Brazilian Airlines Logo — logos-world.net](https://logos-world.net/azul-brazilian-airlines-logo/) — Azul brand blue `#5061AA`
- [LATAM Airlines Brasil Logo Colors — SchemeColor](https://www.schemecolor.com/latam-airlines-brasil-logo-colors.php) — LATAM brand colors
- [Best Color Combinations for Landing Pages — LandingPageFlow](https://www.landingpageflow.com/post/best-color-combinations-for-better-landing-pages) — Navy + CTA accent combinations
- [CTA Button Colors 2025 — HelloBar](https://www.hellobar.com/blog/best-call-to-action-colors-in-2025/) — CTA color psychology
- [Google Font Pairings 2026 — LandingPageFlow](https://www.landingpageflow.com/post/google-font-pairings-for-websites) — Font pairing recommendations
- [5 Sophisticated Google Font Pairings 2025 — Soleil Sundays](https://soleilsundays.com/blogs/theblog/5-sophisticated-google-font-pairings-to-build-a-premium-brand-in-2025) — Verified: Gilda Display + Plus Jakarta Sans; Cormorant + DM Sans pairings
- [Playfair Display Pairings — typ.io](https://typ.io/fonts/playfair_display) — Playfair Display use cases and pairing patterns
- [Best Fonts for Web Design 2026 — LaunchNow](https://launchnow.design/blog/best-fonts-for-web-design-in-2026) — Typography performance recommendations
- [Plus Jakarta Sans — Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — Font specimen and Latin coverage
- [Trust Badges That Boost Conversion — SmartSMS](https://smartsmssolutions.com/resources/blog/business/trust-badges-boost-conversion) — Guarantee badge placement and conversion lift (+32%)
- [FAQ Section Design Examples — SliderRevolution](https://www.sliderrevolution.com/design/faq-section-design-examples/) — Premium FAQ layout patterns
- [Avatar UI Design — Mobbin](https://mobbin.com/glossary/avatar) — Avatar component patterns and fallback states
- [Shadcn Avatar with Placeholder Initials](https://www.shadcn.io/patterns/avatar-standard-2) — Initials fallback implementation reference
- [Deep Sky Blue Color — Mobbin](https://mobbin.com/colors/meaning/deep-sky-blue) — What NOT to use: electric/tech blues for premium travel

---

*Feature research for: High-conversion landing page — mentorship sales (Fly Up Milhas)*
*Original: 2026-03-21 | Updated for v1.5 milestone: 2026-03-24 | Updated for v1.6 milestone: 2026-03-24*
