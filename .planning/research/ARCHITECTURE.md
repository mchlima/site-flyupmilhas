# Architecture Research — v1.5 Integration Map

**Domain:** High-conversion landing page — miles/travel mentorship (Brazilian market)
**Researched:** 2026-03-24
**Confidence:** HIGH (based on direct codebase inspection)
**Focus:** Integration of v1.5 features into the existing single-page Nuxt 4 architecture

---

## Existing Architecture — Ground Truth

The codebase (as of v1.4) is a single-page Nuxt 4 SSR app with no `pages/` directory. All content
lives in `app/app.vue`, which composes 12 standalone SFC components. Two composables handle the only
shared logic.

### Current Component Map (app/app.vue order)

```
UApp
├── AppHeader             (sticky smart nav, mobile overlay, CTA → #formulario)
└── main#main-content
    ├── SectionHero           id="hero"               bg: dark image overlay
    ├── SectionAbout          id="sobre"               bg: white
    ├── SectionProgramContent id="conteudo-programatico" bg: brand-bg (#F9FAFB)
    ├── SectionForWhom        id="para-quem-e"         bg: white
    ├── SectionMethod         id="como-funciona"       bg: brand-bg
    ├── SectionSocialProof    id="depoimentos"         bg: white
    ├── SectionPrice          id="preco"               bg: brand-primary (navy)
    ├── SectionFAQ            id="faq"                 bg: brand-bg
    └── section#formulario    bg: brand-primary (navy)
        └── SectionLeadForm   (standalone, wraps form inside navy section)
AppFooter
BackToTop
```

### Composables

| Composable | State | Purpose |
|-----------|-------|---------|
| `useLeadForm` | `isLoading`, `isSuccess`, `error` | Zod schema + $fetch POST to Fastify `/leads` |
| `useScroll` | none | `scrollTo(id)` smooth-scroll helper for all CTA buttons |

### Backend Contract (Fastify `/leads`)

Current schema — `server/leads/schema.ts`:
```
{ nome, whatsapp, gastoMensal, objetivo: enum('executiva'|'economia'|'renda-extra'), website? }
```

### Design Token Boundaries

All brand tokens live in `app/assets/css/main.css` under `@theme {}`:
```
--color-brand-primary:    #1a3a5c   (navy — headings, header, price section bg)
--color-brand-bg:         #F9FAFB   (off-white — alternating section bg)
--color-brand-cta:        #e67e22   (orange — all CTA buttons)
--color-brand-cta-hover:  #d35400
--color-brand-text:       #1a1a1a
--color-brand-text-muted: #6b7280
--color-brand-footer:     #0f2039   (dark navy — footer only)
```

---

## v1.5 Features: New vs Modified

### NEW Components to Create

| Component | Type | Location |
|-----------|------|----------|
| `SectionTestimonialsWhatsApp` | New SFC | `app/components/Section/` |
| `SectionGuarantee` | New SFC | `app/components/Section/` |

Neither component requires new composables, shared state, or backend changes. Both are pure display.

### MODIFIED Components

| Component | What Changes | Impact |
|-----------|-------------|--------|
| `SectionSocialProof` | Replace quote-card pattern with WhatsApp bubble UI | Template-only, no logic change |
| `SectionPrice` | Add real pricing (R$ 299,90 PIX / 10x), guarantee block, expand benefits | Template + data array expansion |
| `SectionForWhom` | Add "Para quem NAO e" negative cards below existing positive cards | Add `negativeCards` array, extend template |
| `SectionProgramContent` | Add `<strong>` tags to key phrases in 8 content items; update subtitle text | Template only — text swap |
| `SectionMethod` | Add duration (30 dias), 3 encontros/mes, suporte WhatsApp into step descriptions | Data array update only |
| `SectionLeadForm` | Drop `objetivo` field (4 → 3 fields), add security badge, update Zod schema | Schema + state + template changes; **backend contract changes** |
| `SectionHero` | Rewrite copy: headline, subheadline, pain point chips | Template only — text swap |
| `SectionAbout` | Remove "renda extra" value prop card; rewrite hero card copy | Data + template (remove one card) |
| `SectionFAQ` | Replace 5 existing items with beginner-focused pain-point Q&A | Data array swap only |
| `SectionHero` / `SectionAbout` / `SectionProgramContent` | Update CTA label per position (topo/meio/final) | Text changes per component |
| `AppHeader` | CTA text may change per position strategy | Text change only |

---

## WhatsApp Chat Bubble Component

### Integration Point: SectionSocialProof

**Current state:** `SectionSocialProof` renders generic quote cards in a 2-column grid using a
`testimonials` array. The array has placeholder data.

**Target state:** Replace card pattern with WhatsApp-style chat bubbles. Title changes to
"Casos reais de quem ja aplicou."

**Implementation approach — pure template refactor:**

```
SectionSocialProof.vue
├── <script setup> — replace testimonials array shape:
│   Add: senderName, messageText, timestamp, type ('sent'|'received'), optionalImage?
│   Remove: metric, route fields (or keep as optional)
└── <template> — replace card divs with bubble layout:
    ├── WhatsApp-style container (light green/white bg matching wa.me aesthetic)
    ├── Per bubble: rounded tail, sender name header, message text, timestamp
    └── Optional: message "delivered/read" double-checkmark icon
```

**No new component file needed** unless the bubble markup grows complex enough to warrant extraction
into `app/components/UI/ChatBubble.vue`. Recommendation: keep inline in SectionSocialProof until
there are 3+ bubble types. At that point extract.

**Assets:** Real WhatsApp screenshots go to Cloudflare R2. For the bubble recreation style (built
in HTML/CSS, not screenshot embeds), no asset dependency.

**Design token alignment:**
- Chat container bg: `#ECE5DD` (WhatsApp canonical light bg) — acceptable to hardcode, not a brand token
- Received bubble bg: white
- Sent bubble bg: `#DCF8C6` (WhatsApp canonical green) — hardcode, not brand
- Timestamp text: reuse `var(--color-brand-text-muted)`

---

## Expanded Pricing + Guarantee Section

### Integration Point: SectionPrice

**Current state:** `SectionPrice` is a navy-bg section with a benefits list and a single CTA button.
No price is shown ("Condições especiais disponíveis").

**Target state:** Add real pricing display + 7-day guarantee block.

**Implementation — extend existing SectionPrice.vue:**

```
SectionPrice.vue additions:
├── Price block (above benefits list):
│   ├── Anchor price (strikethrough optional, if client provides)
│   ├── PIX price: "R$ 299,90" (prominent, large text)
│   └── Installment: "ou 10x no cartão"
├── Benefits list (existing — keep, possibly expand)
└── Guarantee block (below benefits, above CTA):
    ├── Shield icon (i-heroicons-shield-check or similar)
    ├── "Garantia de 7 dias"
    └── "100% do valor devolvido se não fizer sentido"
```

**No new component needed.** Guarantee block is 4-6 lines of template added inside SectionPrice.
If a standalone `SectionGuarantee` is desired for a separate section slot in `app.vue`, that is
also viable — but requires adding it to the component sequence in `app.vue`. Decision: keep inline
in SectionPrice unless designer wants it visually separated.

---

## "Para quem NAO e" Negative Cards

### Integration Point: SectionForWhom

**Current state:** `SectionForWhom` has a 2-column layout: family image left, 5 positive qualifier
cards right.

**Target state:** Add a "Para quem NAO e" block with negative disqualifier cards. These can appear
below the existing 2-column layout OR in a second distinct visual block.

**Implementation approach:**

```
SectionForWhom.vue additions:
├── <script setup>: add negativeCards array:
│   [{ text: 'Quem quer resultado sem esforço', icon: 'i-heroicons-x-circle' }, ...]
└── <template>: below existing 2-col grid:
    ├── Separator / new subtitle: "Esta mentoria NÃO é para você se..."
    └── New card grid (same card style but with red/muted icon instead of orange)
        └── Each card: x-circle icon (muted color) + text
```

**Icon color guidance:** Use `text-red-400` or `var(--color-brand-text-muted)` for the negative
cards — not orange CTA, which is reserved for positive affordances.

**No new component needed.** All logic stays in SectionForWhom.

---

## Simplified Lead Form (4 → 3 Fields)

### Integration Point: SectionLeadForm + useLeadForm + server/leads/schema.ts

This is the only v1.5 change that touches the backend contract. It requires coordinated updates
across three files.

**What changes:**

The `objetivo` field (the USelect dropdown with 3 enum values) is removed. This simplifies the
form from 4 fields to 3: `nome`, `whatsapp`, `gastoMensal`.

**Files to update in sequence:**

1. `server/leads/schema.ts` — Remove `objetivo` field from Zod schema:
   ```typescript
   // Before
   objetivo: z.enum(['executiva', 'economia', 'renda-extra'])
   // After: delete entirely
   ```

2. `app/composables/useLeadForm.ts` — Sync frontend schema with backend:
   ```typescript
   // Remove objetivo from LeadFormSchema
   // Remove objetivo from LeadFormData type
   ```

3. `app/components/Section/SectionLeadForm.vue` — Remove USelect field:
   - Remove `objetivoOptions` array
   - Remove `objetivo` from `state` reactive object
   - Remove `<UFormField name="objetivo">` block from template
   - Add security badge below submit button:
     ```html
     <div class="flex items-center justify-center gap-2 mt-3 text-white/60 text-xs">
       <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
       <span>Seus dados estão seguros</span>
     </div>
     ```

**Backend note:** The Fastify server validates with `LeadSchema.safeParse()`. Removing `objetivo`
from the schema means the field becomes optional-by-absence. If old leads in MongoDB have `objetivo`
set, that is fine — MongoDB is schema-less. No migration needed.

**Risk:** If the backend Fastify process is deployed separately and not updated in sync with the
frontend, removing `objetivo` from the frontend while the backend still expects it would cause
validation failures. This is mitigated because `objetivo` is not marked `.required()` at the HTTP
transport layer — Fastify uses Zod `safeParse` which returns success/error, and the `objetivo` field
was optional in that it wasn't strictly required for a 200 response (Fastify returns 400 if Zod
fails). Update the Fastify schema first, then the frontend.

---

## Progressive CTAs by Position

### Integration Points: SectionHero, SectionAbout, SectionProgramContent, AppHeader

**Current state:** All CTA buttons use the same text: "Quero dar o primeiro passo". All call
`scrollTo('formulario')`.

**Target state:** Different copy per section position (topo/meio/final).

**Implementation:** Pure text changes in each component's template. No logic change. The
`useScroll.scrollTo('formulario')` call stays identical everywhere.

Suggested copy variants:
- `SectionHero` (topo): "Quero dar o primeiro passo" (keep — strongest opening)
- `SectionAbout` / `SectionProgramContent` (meio): "Quero aprender na prática"
- `SectionPrice` (decisao): "Quero começar agora"
- `AppHeader` (sempre visível): "Começar agora" (short — fits nav bar)

---

## Bold Text in Conteudo Programatico Items

### Integration Point: SectionProgramContent

**Current state:** `items` array has plain strings. Rendered as `{{ item.text }}` in `<span>`.

**Target state:** Key phrases within each item bolded.

**Implementation:** Replace plain string with HTML string containing `<strong>` tags. Change
rendering from interpolation to `v-html`:

```typescript
// Before (plain string)
{ text: 'Como funcionam os principais programas de milhas', icon: '...' }

// After (HTML string)
{ text: '<strong>Como funcionam</strong> os principais programas de milhas', icon: '...' }
```

```html
<!-- Before -->
<span class="text-[var(--color-brand-text)]">{{ item.text }}</span>

<!-- After -->
<span class="text-[var(--color-brand-text)]" v-html="item.text" />
```

**XSS note:** The `items` array is hardcoded in the component — not user input, not CMS content.
Using `v-html` here is safe. Add a comment to document this assumption.

---

## Data Flow Changes in v1.5

### Form Submission Flow (simplified)

```
User fills 3 fields (SectionLeadForm.vue)
    ↓
useLeadForm.submit() with { nome, whatsapp, gastoMensal, website }
    ↓
$fetch POST → Fastify /leads
    ↓
Fastify validates with updated LeadSchema (no objetivo)
    ↓
MongoDB insert with 3 fields + createdAt + source
    ↓
200 { success: true, id: ... }
    ↓
isSuccess.value = true → show success + WhatsApp CTA
```

### Everything Else (no data flow changes)

All other v1.5 features are pure UI/copy changes. They do not alter:
- The `useScroll` composable
- The SSR rendering flow
- The CTA scroll targets (all still `#formulario`)
- The `useLeadForm` error handling logic
- The AppHeader scroll detection
- The BackToTop component

---

## Component Boundaries After v1.5

| Component | Status | Change Type | Backend Touch |
|-----------|--------|-------------|---------------|
| `AppHeader` | Modified | CTA text update | No |
| `SectionHero` | Modified | Copy rewrite (template only) | No |
| `SectionAbout` | Modified | Remove renda extra card, rewrite copy | No |
| `SectionProgramContent` | Modified | Bold phrases via v-html, subtitle text | No |
| `SectionForWhom` | Modified | Add negative cards block | No |
| `SectionMethod` | Modified | Expand step descriptions, add duration | No |
| `SectionSocialProof` | Modified | Replace card UI with WhatsApp bubbles | No |
| `SectionPrice` | Modified | Add pricing, guarantee block | No |
| `SectionFAQ` | Modified | Replace Q&A content array | No |
| `SectionLeadForm` | Modified | Drop objetivo field, add security badge | YES — schema sync |
| `useLeadForm.ts` | Modified | Remove objetivo from schema + types | YES — schema sync |
| `server/leads/schema.ts` | Modified | Remove objetivo field | YES — update first |
| `SectionGuarantee` | Optional new | Standalone only if visual separation required | No |

---

## Suggested Build Order for v1.5

Order is determined by: (a) backend contract first, (b) independent display components freely
parallelizable, (c) form changes last (requires schema coordination).

### Phase 1: Backend Contract First (blocks form work)

1. Update `server/leads/schema.ts` — remove `objetivo` field
   - Deploy or restart Fastify before frontend form changes land in production

### Phase 2: Pure Copy/Display Changes (fully independent, any order)

2. `SectionHero` — rewrite headline, subheadline, pain point chips, CTA text
3. `SectionAbout` — remove renda extra card, rewrite hero card copy, remove from bento grid
4. `SectionFAQ` — replace Q&A items array with beginner-focused content
5. `SectionMethod` — update step descriptions, add 30-day duration and WhatsApp support copy

### Phase 3: Structural Template Changes (independent from each other)

6. `SectionProgramContent` — add bold markup via v-html, update subtitle
7. `SectionForWhom` — add negativeCards array and "Para quem NAO e" block below existing grid
8. `SectionSocialProof` — rebuild testimonial cards as WhatsApp-style chat bubbles, update section title

### Phase 4: Pricing and Offer Clarity

9. `SectionPrice` — add real pricing (R$ 299,90 / 10x), expand guarantee block, update CTA text

### Phase 5: Form Simplification (requires Phase 1 complete)

10. `app/composables/useLeadForm.ts` — remove objetivo from schema and type
11. `app/components/Section/SectionLeadForm.vue` — remove objetivo field, add security badge

### Phase 6: CTA Copy Pass (final, after all sections settled)

12. `AppHeader`, `SectionAbout`, `SectionProgramContent` — update CTA text per position strategy

**Rationale for this order:**
- Phases 2-3 are safe to ship incrementally; they have no backend dependencies
- Phase 4 (SectionPrice) depends only on confirmed pricing from client — no code dependency
- Phase 5 must follow Phase 1; shipping the frontend form change before backend schema update
  will not break existing submissions (Fastify silently ignores unknown fields if objetivo
  is removed from validation), but the reverse (removing backend antes of frontend) could
  cause Zod 400 errors if objetivo is still sent by the old frontend
- Phase 6 is cosmetic cleanup that can be done anytime after sections are stable

---

## New Component: WhatsApp Testimonial (if extracted)

If the bubble rendering grows complex (multiple message types, timestamps, read receipts, avatar
images), extract to `app/components/UI/ChatBubble.vue`:

```
ChatBubble.vue
Props:
  - type: 'sent' | 'received'
  - senderName?: string (shown for received only)
  - message: string
  - timestamp: string
  - isRead?: boolean

Used by: SectionSocialProof (3–5 instances)
```

This is optional. Inline markup in SectionSocialProof is fine for 2–4 fixed testimonials.

---

## Anti-Patterns to Avoid in v1.5

### Do Not Create a New Composable for Pricing Data

`SectionPrice` prices and `SectionGuarantee` text are static — they don't change per user,
don't need reactive state, and don't interact with the API. Keep them as hardcoded template
values or script-level constants inside the component. A composable or Pinia store would be
gross over-engineering.

### Do Not Extract "Para quem NAO e" to a New Component

The negative cards are 3–5 static items that belong semantically to the `SectionForWhom` section.
Extracting them to `SectionForWhomNot.vue` would split a single conceptual section into two files
with no benefit. Keep in `SectionForWhom.vue`.

### Do Not Use v-html for CTA Button Text

CTA button copy variants are plain text without markup. Swap the string in the template directly.
`v-html` should only be used where `<strong>` or similar inline HTML is genuinely needed
(i.e., `SectionProgramContent` items only).

### Do Not Update the Frontend Form Before the Backend Schema

Order matters: remove `objetivo` from `server/leads/schema.ts` and redeploy Fastify first.
Then update the composable and form component. This prevents a window where the frontend omits
`objetivo` but the backend still validates its presence.

---

## Sources

- Direct codebase inspection (HIGH confidence — files read 2026-03-24):
  - `/app/app.vue` — component composition order and section IDs
  - `/app/composables/useLeadForm.ts` — current Zod schema and $fetch pattern
  - `/app/components/Section/SectionLeadForm.vue` — 4-field form implementation
  - `/app/components/Section/SectionSocialProof.vue` — current testimonial card pattern
  - `/app/components/Section/SectionPrice.vue` — current benefits list and CTA
  - `/app/components/Section/SectionForWhom.vue` — 2-col layout with positive cards
  - `/app/components/Section/SectionProgramContent.vue` — 8-item list with icon + text
  - `/app/assets/css/main.css` — design token definitions
  - `/server/leads/schema.ts` — Fastify backend Zod schema
  - `/server/leads/index.ts` — POST /leads route handler
- `v-html` XSS guidance: https://vuejs.org/guide/essentials/template-syntax#raw-html (HIGH)
- WhatsApp web color palette: documented in community (MEDIUM — visual inspection of wa.me)

---

*Architecture research for: Fly Up Milhas v1.5 — copy and conversion optimization milestone*
*Researched: 2026-03-24*
