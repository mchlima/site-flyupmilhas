# Phase 3: Lead Form & Conversion - Research

**Researched:** 2026-03-21
**Domain:** Nuxt 4 form submission, Zod validation, $fetch, Nuxt UI v4 form components, honeypot anti-spam, WhatsApp CTA
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Form Layout & Fields (LEAD-01)**
- D-01: Single-column stacked form layout inside the existing `#formulario` section in app.vue
- D-02: 4 visible fields + 1 hidden honeypot:
  1. `nome` — UInput text field, placeholder "Seu nome completo"
  2. `whatsapp` — UInput with `inputmode="numeric"`, Brazilian phone mask `(XX) XXXXX-XXXX`
  3. `gastoMensal` — UInput with `inputmode="numeric"`, placeholder "Média mensal em cartão de crédito (R$)"
  4. `objetivo` — USelect with 3 options: "Viagem executiva", "Economia familiar", "Renda extra com milhas"
  5. `website` — hidden honeypot field (CSS `display: none`, `tabindex="-1"`, `autocomplete="off"`)
- D-03: Submit button: "Quero minha Consultoria" in brand-cta color, full-width on mobile

**Client-side Validation (LEAD-02)**
- D-04: Zod schema matching Phase 1 backend contract (D-09)
- D-05: Validation triggers on blur AND on submit
- D-06: Inline error messages below each field in red, using Nuxt UI's built-in form error display
- D-07: All fields required — submit button disabled until all pass validation

**Form Submission (LEAD-03)**
- D-08: Use `$fetch` (NOT `useFetch`) for form submission
- D-09: POST to `${useRuntimeConfig().public.apiBase}/leads` with JSON body
- D-10: Include honeypot `website` field in request body (backend handles rejection silently)
- D-11: Submit button shows loading spinner and is disabled during request — prevents double submit

**Success State (LEAD-04)**
- D-12: On 200 response: replace entire form with success message in-place (no redirect, no modal)
- D-13: Success message: "Recebi! Marcio vai te chamar no WhatsApp em ate 24h." with checkmark icon
- D-14: Success state also shows the WhatsApp CTA button so user can reach out immediately

**Error States (LEAD-04)**
- D-15: On 400 (validation error): show inline error banner above form, form stays filled, user can fix and retry
- D-16: On 429 (rate limit): show "Muitas tentativas. Tente novamente em 1 minuto." — form stays filled
- D-17: On network/500 error: show "Erro de conexao. Tente novamente." — form stays filled

**Anti-spam (LEAD-05)**
- D-18: Honeypot field `website` hidden via CSS (`display: none`) — bots fill it, humans don't see it
- D-19: `tabindex="-1"` and `autocomplete="off"` on honeypot to prevent keyboard/autofill interaction
- D-20: No CAPTCHA or Turnstile in v1

**WhatsApp CTA (CTA-01)**
- D-21: WhatsApp button as secondary CTA below the form: "Falar no WhatsApp" with WhatsApp icon
- D-22: Link: `https://wa.me/55XXXXXXXXXXX?text=Ola%20Marcio%2C%20quero%20saber%20mais%20sobre%20a%20consultoria%20VIP%20de%20milhas.`
- D-23: Phone number uses placeholder `55XXXXXXXXXXX` with TODO marker — Marcio provides real number
- D-24: WhatsApp button also appears in success state after form submission
- D-25: Opens in new tab (`target="_blank"`, `rel="noopener noreferrer"`)

### Claude's Discretion
- Exact phone mask implementation (custom directive vs library)
- UForm vs manual form handling approach
- Exact error message positioning and animation
- Whether to add a "form section" heading/subheading above the form
- Gastos mensais field: free text vs preset ranges

### Deferred Ideas (OUT OF SCOPE)
- WhatsApp Business API notification to Marcio on form submission — v2 (NOTF-01)
- Email confirmation to the lead — v2 (NOTF-02)
- Cloudflare Turnstile CAPTCHA — only if honeypot proves insufficient
- Form analytics (submission tracking, drop-off) — v2, needs LGPD consent
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LEAD-01 | Form with 4 fields: nome, WhatsApp (mascara BR), gasto mensal no cartao, objetivo principal | UInput/USelect components confirmed available; Brazilian phone mask via computed input handler (no library needed) |
| LEAD-02 | Validacao client-side com Zod (campos obrigatorios, formato WhatsApp) | Nuxt UI UForm + Zod `toTypedSchema` pattern confirmed; blur+submit trigger supported natively |
| LEAD-03 | Submissao via $fetch para endpoint Fastify POST /leads | `$fetch` native in Nuxt 4; backend contract confirmed from server/leads/schema.ts and server/leads/index.ts |
| LEAD-04 | Feedback visual de sucesso/erro apos submissao | `isSuccess`/`error` refs in composable stub; v-if toggle pattern for success message replacement |
| LEAD-05 | Protecao anti-spam (honeypot field) | Honeypot name `website` confirmed in server/leads/schema.ts and index.ts; CSS-hidden approach locked |
| CTA-01 | WhatsApp como CTA primario com link wa.me/ e mensagem pre-preenchida | Plain `<a>` tag approach confirmed by CLAUDE.md stack patterns; no library needed |
</phase_requirements>

---

## Summary

Phase 3 wires together client-side form handling with the existing Fastify backend that was built in Phase 1. All backend infrastructure is already in place and confirmed: `POST /leads` accepts `{ nome, whatsapp, gastoMensal, objetivo, website }`, validates with Zod, stores in MongoDB, rate-limits at 5/min, and handles honeypot silently at the server side. The frontend task is purely UI + composable implementation.

The composable stub `app/composables/useLeadForm.ts` already exists with `isLoading`, `isSuccess`, and `error` refs. The `#formulario` section is present in `app.vue` with a placeholder comment ready for `SectionLeadForm`. All Nuxt UI components (`UInput`, `USelect`, `UButton`, `UForm`) are available via the existing `@nuxt/ui` module.

The key implementation decision left to Claude's discretion is the phone mask approach. The recommended approach is a computed watcher pattern that strips non-digits and formats the string on `@input` — no additional library is needed. Nuxt UI `UForm` with Zod `toTypedSchema` is the authoritative pattern for validation wiring.

**Primary recommendation:** Implement `SectionLeadForm.vue` as a self-contained component that uses `useLeadForm.ts` composable. The composable owns all state and the `$fetch` call; the component owns presentation and form binding.

---

## Standard Stack

### Core (already installed — no new installations required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @nuxt/ui | ^4.5.1 | UInput, USelect, UButton, UForm components | Already installed in nuxt.config.ts; provides accessible form primitives with built-in error slot support |
| zod | ^3.x | Frontend schema validation | Already installed (pinned v3 per STATE.md); shared schema pattern with backend |
| $fetch (ofetch) | native in Nuxt 4 | Form POST request | Built into Nuxt 4; no install; correct tool for user-triggered actions per PITFALLS.md D-08 |

### No New Dependencies

This phase requires **zero new npm packages**. All needed libraries are already present:
- Form components: `@nuxt/ui` (UInput, USelect, UButton, UForm, UIcon)
- Schema validation: `zod` v3 (already in package.json from Phase 1)
- HTTP: `$fetch` (Nuxt 4 built-in)
- Phone mask: computed handler pattern (no library — avoids bundle cost and SSR complexity)

**Installation:** None required.

---

## Architecture Patterns

### Component Structure for This Phase

```
app/
├── components/
│   └── Section/
│       └── SectionLeadForm.vue   # NEW — full form UI + state display
├── composables/
│   └── useLeadForm.ts            # IMPLEMENT — currently a stub
└── app.vue                       # line 47-53: replace stub section contents
```

`SectionLeadForm.vue` replaces the inner `<div>` stub inside the existing `<section id="formulario">` in `app.vue`. The section element itself and its `id="formulario"` anchor are NOT moved — all scroll CTAs depend on it.

### Pattern 1: Composable Owns State, Component Owns Presentation

The `useLeadForm.ts` composable handles:
- Reactive state: `isLoading`, `isSuccess`, `error`
- Zod schema definition (mirroring backend `server/leads/schema.ts`)
- `$fetch` call construction
- Error classification by HTTP status code

The `SectionLeadForm.vue` component handles:
- Field binding and `v-model`
- Phone mask formatting via `@input` handler
- Conditional rendering of form vs. success message
- WhatsApp CTA button (appears in both normal and success states per D-14/D-24)

```typescript
// app/composables/useLeadForm.ts — FULL IMPLEMENTATION
import { z } from 'zod'

// Mirror server/leads/schema.ts exactly — field names must match backend contract
const LeadFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  whatsapp: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 dígitos'
  ),
  gastoMensal: z.string().min(1, 'Campo obrigatório'),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra'], {
    errorMap: () => ({ message: 'Selecione um objetivo válido' }),
  }),
  website: z.string().optional(), // Honeypot
})

export type LeadFormData = z.infer<typeof LeadFormSchema>

export function useLeadForm() {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig()

  async function submit(data: LeadFormData) {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`${config.public.apiBase}/leads`, {
        method: 'POST',
        body: data,
      })
      isSuccess.value = true
    }
    catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as { status: number }).status
        if (status === 429) {
          error.value = 'Muitas tentativas. Tente novamente em 1 minuto.'
        }
        else if (status === 400) {
          error.value = 'Dados inválidos. Verifique os campos e tente novamente.'
        }
        else {
          error.value = 'Erro de conexao. Tente novamente.'
        }
      }
      else {
        error.value = 'Erro de conexao. Tente novamente.'
      }
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, isSuccess, error, submit }
}
```

### Pattern 2: UForm + Zod toTypedSchema for Blur + Submit Validation

Nuxt UI v4's `UForm` component integrates natively with Zod via `toTypedSchema`. This provides blur-triggered validation (D-05) and submit-triggered validation without manual wiring.

```vue
<!-- SectionLeadForm.vue — UForm integration pattern -->
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  whatsapp: z.string().regex(/^\d{10,11}$/, 'WhatsApp deve conter 10 ou 11 dígitos'),
  gastoMensal: z.string().min(1, 'Campo obrigatório'),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra']),
  website: z.string().optional(),
})

const state = reactive({
  nome: '',
  whatsapp: '',
  gastoMensal: '',
  objetivo: undefined as 'executiva' | 'economia' | 'renda-extra' | undefined,
  website: '',
})

const { isLoading, isSuccess, error, submit } = useLeadForm()

async function onSubmit() {
  await submit({ ...state, objetivo: state.objetivo! })
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField name="nome" label="Seu nome">
      <UInput v-model="state.nome" placeholder="Seu nome completo" />
    </UFormField>
    <!-- ... other fields ... -->
  </UForm>
</template>
```

**Note on UForm API:** In Nuxt UI v4, the form field wrapper is `UFormField` (not `UFormGroup`). The `label` prop goes on `UFormField`. Errors are displayed automatically when `name` matches a Zod schema field.

### Pattern 3: Brazilian Phone Mask — Computed Input Handler (No Library)

The phone mask formats `(XX) XXXXX-XXXX` for 11-digit numbers and `(XX) XXXX-XXXX` for 10-digit. Implement as an `@input` handler that strips non-digits and reformats:

```typescript
// In SectionLeadForm.vue <script setup>
// The displayed value is masked; the raw digits are submitted to the API
const whatsappDisplay = ref('')

function onWhatsappInput(e: Event) {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
  // Format for display
  let formatted = digits
  if (digits.length > 10) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  else if (digits.length > 6) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  else if (digits.length > 2) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  whatsappDisplay.value = formatted
  // Store raw digits in state.whatsapp for submission and validation
  state.whatsapp = digits
}
```

**Critical:** The `state.whatsapp` field holds raw digits (`\d{10,11}`) matching the backend regex. The display input shows the masked version but is NOT the value validated or submitted.

### Pattern 4: Success State Toggle (In-Place Replacement)

Per D-12, the entire form is replaced with a success message — not a modal, not a redirect.

```vue
<template>
  <div class="max-w-xl mx-auto">
    <!-- Success state -->
    <div v-if="isSuccess">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-check-circle" class="text-green-500 w-12 h-12 mx-auto mb-4" />
        <p class="text-lg font-semibold text-[var(--color-brand-primary)]">
          Recebi! Marcio vai te chamar no WhatsApp em ate 24h.
        </p>
      </div>
      <!-- WhatsApp CTA also shown in success state (D-24) -->
      <WhatsAppButton />
    </div>

    <!-- Form state -->
    <div v-else>
      <!-- Error banner (D-15/D-16/D-17) -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
        {{ error }}
      </div>

      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <!-- fields -->
      </UForm>

      <!-- WhatsApp CTA below form (D-21) -->
      <WhatsAppButton class="mt-4" />
    </div>
  </div>
</template>
```

### Pattern 5: Honeypot Field Implementation

The honeypot field must be present in the DOM (so bots encounter it) but invisible to humans. Using `display: none` is correct per D-18 — `type="hidden"` would prevent bots from filling it.

```vue
<!-- Honeypot — must be AFTER the visible fields to catch form-filling bots -->
<div style="display: none;" aria-hidden="true">
  <label for="website">Website</label>
  <input
    id="website"
    v-model="state.website"
    type="text"
    name="website"
    tabindex="-1"
    autocomplete="off"
  />
</div>
```

### Pattern 6: WhatsApp CTA Button

Plain `<a>` tag — no component library needed (confirmed by CLAUDE.md stack patterns):

```vue
<!-- Can be extracted to App/AppWhatsAppCTA.vue or inlined in SectionLeadForm -->
<a
  href="https://wa.me/55XXXXXXXXXXX?text=Ola%20Marcio%2C%20quero%20saber%20mais%20sobre%20a%20consultoria%20VIP%20de%20milhas."
  target="_blank"
  rel="noopener noreferrer"
  class="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg border-2 border-green-500 text-green-700 font-semibold hover:bg-green-50 transition-colors"
>
  <!-- WhatsApp icon via @nuxt/ui icon system -->
  <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5" />
  Falar no WhatsApp
</a>
```

**TODO marker required:** The phone number `55XXXXXXXXXXX` must be replaced with Marcio's real number before launch. Add a code comment: `// TODO: Replace 55XXXXXXXXXXX with Marcio's real WhatsApp number`.

### Anti-Patterns to Avoid

- **Using `useFetch` for form submission:** `useFetch` runs on SSR — a form POST triggered by user click must use `$fetch`. See PITFALLS.md Pitfall 1.
- **Putting `$fetch` at top-level of `<script setup>`:** This fires on SSR, causing the double-fetch pitfall. `$fetch` for forms must only fire inside the submit handler function.
- **Using `type="hidden"` for honeypot:** Bots don't fill hidden inputs. Use CSS `display: none` instead.
- **Validating masked whatsapp display value:** Only raw digits should hit the Zod regex. Strip non-digits before validation.
- **Using `UFormGroup`:** This is the Nuxt UI v3 API. In Nuxt UI v4, the correct component is `UFormField`.
- **Calling `$fetch` without try/catch:** ofetch throws on non-2xx responses. Always wrap in try/catch.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management | Custom reactive form store | `useLeadForm` composable + Vue `reactive()` | Stub already exists; Vue reactive is sufficient for single-form use |
| Schema validation | Manual field validators | Zod schema mirroring backend | Backend already defines the authoritative schema in `server/leads/schema.ts`; mirror it exactly |
| Error display per field | Custom error rendering | `UFormField` with `name` prop | Nuxt UI v4 auto-renders errors from UForm validation results when `name` matches schema field |
| HTTP client | axios, node-fetch | `$fetch` (native ofetch) | Already in Nuxt 4 bundle; handles JSON serialization, error status codes, and TypeScript inference |
| WhatsApp link construction | URL encoder utility | Inline `<a href>` with pre-encoded string | wa.me URL format is static; no dynamic encoding needed |
| Icon components | SVG sprites or custom icon components | `UIcon` from `@nuxt/ui` with Heroicons/SimpleIcons | Already available; `i-simple-icons-whatsapp` for WhatsApp, `i-heroicons-check-circle` for success |

**Key insight:** This phase is almost entirely configuration and wiring of existing tools. The backend contract is locked, the components exist, and the composable stub is ready. The implementation risk is in getting the `UForm`/Zod integration right, not in building anything novel.

---

## Common Pitfalls

### Pitfall 1: UForm/Zod Schema Mismatch with Backend
**What goes wrong:** Frontend Zod schema differs subtly from `server/leads/schema.ts` — e.g., `objetivo` enum values use display labels ("Viagem executiva") instead of backend slugs ("executiva"). Form passes client validation but gets 400 from Fastify.
**Why it happens:** Developer writes frontend schema from memory rather than from the backend file.
**How to avoid:** Open `server/leads/schema.ts` first. The exact enum values are `'executiva'`, `'economia'`, `'renda-extra'`. The USelect `value` props must match these slugs; the display `label` can differ.
**Warning signs:** Form submits, backend returns 400 with `{ error: { fieldErrors: { objetivo: [...] } } }`, console shows validation error.

### Pitfall 2: WhatsApp Field Submits Masked String Instead of Raw Digits
**What goes wrong:** `state.whatsapp` holds `"(11) 99999-9999"` (with mask characters). Backend regex `/^\d{10,11}$/` rejects it → 400 error.
**Why it happens:** Developer binds `v-model="state.whatsapp"` directly to the UInput and formats it in-place.
**How to avoid:** Maintain two separate values: `whatsappDisplay` (formatted, for UInput display) and `state.whatsapp` (raw digits, for submission and Zod validation). The `@input` handler strips non-digits and writes to `state.whatsapp`; the UInput's `:model-value` is `whatsappDisplay`.

### Pitfall 3: CORS Failure in Production
**What goes wrong:** Form POST works in `nuxt dev` (same origin or proxy) but fails in production with "CORS policy" error in browser console. Leads are silently lost.
**Why it happens:** Browser enforces CORS on cross-origin `$fetch` calls. Dev environment often bypasses this.
**How to avoid:** Confirm Fastify's `@fastify/cors` plugin is configured with the production LP domain (`flyupmilhas.com.br`) in the allowlist. Test from a real browser against the staging URL before launch. See PITFALLS.md Pitfall 4.

### Pitfall 4: Submit Button Not Disabled During Loading
**What goes wrong:** User clicks "Quero minha Consultoria" twice. Two POST requests fire. If the first succeeds, `isSuccess` becomes true before the second resolves — or worse, the second gets a 400 because the first already stored the lead.
**How to avoid:** Button must have `:disabled="isLoading"` and show a spinner when `isLoading` is true (D-11). UButton's `:loading="isLoading"` prop handles both.

### Pitfall 5: $fetch Error Shape Assumption
**What goes wrong:** Developer assumes `err.statusCode` when ofetch actually puts the status on `err.status` (for `FetchError` from ofetch). Or assumes error body shape without checking what Fastify actually sends.
**Why it happens:** `$fetch` wraps errors in ofetch's `FetchError` type. The status is at `err.status`, not `err.statusCode`.
**How to avoid:** Use `err && typeof err === 'object' && 'status' in err` to check. For 429 errors, the message comes from Fastify's `errorResponseBuilder` in `server/leads/index.ts`. For 400, the body is `{ error: { fieldErrors, formErrors } }` from Zod's `flatten()`.

### Pitfall 6: Hydration Mismatch from Form State
**What goes wrong:** The form section renders differently on server vs. client — e.g., if `isSuccess` defaults to `true` in some edge case, or if reactive state initializes differently.
**How to avoid:** Form reactive state always starts empty/false. No browser-only APIs used in `useLeadForm`. No `window`, `localStorage`, or `navigator` references. The composable is SSR-safe as designed. Test with `nuxt build && nuxt preview`.

### Pitfall 7: Section Anchor Disrupted
**What goes wrong:** Developer wraps `#formulario` in `SectionLeadForm.vue` with its own `<section id="formulario">`, creating a duplicate anchor. Or replaces the entire `<section id="formulario">` element instead of just its contents.
**Why it happens:** Confusion about what "replace the stub" means.
**How to avoid:** `app.vue` keeps its `<section id="formulario" ...>` element. `SectionLeadForm` is inserted as the inner content — not a wrapper that recreates the section. The component should NOT have its own `id="formulario"`.

---

## Code Examples

### Backend Contract (Confirmed from server/leads/schema.ts)

```typescript
// Source: server/leads/schema.ts (Phase 1 — LOCKED, do not modify)
export const LeadSchema = z.object({
  nome: z.string().min(2).max(100),
  whatsapp: z.string().regex(/^\d{10,11}$/),  // RAW DIGITS ONLY — no mask chars
  gastoMensal: z.string().min(1),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra']),
  website: z.string().optional(),  // Honeypot — server ignores lead if populated
})
```

Backend response codes:
- `200 { success: true, id: string }` — success (including honeypot — silent rejection returns 200)
- `400 { error: ZodError.flatten() }` — validation failed
- `429 { statusCode: 429, error: 'Too Many Requests', message: 'Muitas tentativas...' }` — rate limit
- `500 { error: 'Database unavailable' }` — server error

### USelect Options for objetivo Field

```typescript
// The VALUE must match backend enum slugs
// The LABEL is what users see
const objetivoOptions = [
  { label: 'Viagem executiva', value: 'executiva' },
  { label: 'Economia familiar', value: 'economia' },
  { label: 'Renda extra com milhas', value: 'renda-extra' },
]
```

```vue
<UFormField name="objetivo" label="Objetivo principal">
  <USelect
    v-model="state.objetivo"
    :options="objetivoOptions"
    placeholder="Selecione seu objetivo"
    value-key="value"
    label-key="label"
  />
</UFormField>
```

### Existing Section Component Pattern (from SectionHero.vue)

```vue
<!-- Established pattern in Phase 2 — SectionLeadForm follows this structure -->
<script setup lang="ts">
// Composables at top
// No top-level $fetch calls
// No browser-only APIs without import.meta.client guard
</script>

<template>
  <section id="[section-id]" class="[tailwind classes using brand tokens]">
    <div class="max-w-xl mx-auto px-6 py-12">
      <!-- content -->
    </div>
  </section>
</template>
```

**Note:** `SectionLeadForm` does NOT include its own `<section>` wrapper — `app.vue` already provides `<section id="formulario">`. The component renders the inner content directly.

### Established Brand Tokens Available

```css
/* From app/assets/css/main.css — already configured */
--color-brand-primary: #1a3a5c;      /* headings */
--color-brand-bg: #f8f9fa;           /* page background */
--color-brand-cta: #e67e22;          /* CTA orange */
--color-brand-cta-hover: #d35400;    /* CTA hover */
--color-brand-text: #1a1a1a;         /* body text */
--color-brand-text-muted: #6b7280;   /* secondary text */
```

Submit button class pattern (from SectionHero.vue precedent):
```
bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| UFormGroup (Nuxt UI v3) | UFormField (Nuxt UI v4) | Nuxt UI v4 release Sep 2025 | Wrong component name causes form validation not to render |
| vee-validate for form orchestration | UForm + Zod natively | Nuxt UI v4 | No separate library needed for this use case |
| Separate Tailwind config file | CSS @theme block in main.css | Tailwind v4 | Already in place in this project |

**Deprecated/outdated in this project context:**
- `UFormGroup`: Nuxt UI v3 API — replaced by `UFormField` in v4
- `process.client`: Nuxt 4 deprecated — use `import.meta.client` (already established in `useScroll.ts`)

---

## Open Questions

1. **WhatsApp phone number for Marcio**
   - What we know: Placeholder `55XXXXXXXXXXX` per D-23; opens in new tab per D-25
   - What's unclear: Actual number not yet provided by Marcio
   - Recommendation: Add `// TODO: Replace 55XXXXXXXXXXX with Marcio's real WhatsApp number` comment in code; do not block phase implementation on this

2. **UIcon availability for WhatsApp logo**
   - What we know: `@nuxt/ui` includes icon support; `i-simple-icons-whatsapp` should be available via Simple Icons collection
   - What's unclear: Whether `@iconify-json/simple-icons` package was installed in Phase 1
   - Recommendation: Verify with `ls node_modules/@iconify-json/` during implementation; fallback is an inline SVG `<svg>` for the WhatsApp logo (17x17, pure green)

3. **USelect API for value-key/label-key**
   - What we know: Nuxt UI v4 USelect accepts `options` array; the exact prop names for value and label may vary between v4 minor versions
   - What's unclear: Whether it's `value-key`/`label-key` or `value-attribute`/`option-attribute` in the installed version
   - Recommendation: During implementation, check `node_modules/@nuxt/ui/dist` or local docs; fallback is passing options as plain strings if the object format has issues

---

## Sources

### Primary (HIGH confidence)
- `server/leads/schema.ts` — Authoritative backend Zod schema (confirmed in codebase)
- `server/leads/index.ts` — Confirmed endpoint behavior, response codes, honeypot logic
- `app/composables/useLeadForm.ts` — Confirmed stub interface to implement
- `app/app.vue` — Confirmed `#formulario` section location and structure
- `app/assets/css/main.css` — Confirmed brand token names
- `nuxt.config.ts` — Confirmed `runtimeConfig.public.apiBase` key name
- `.planning/phases/01-foundation-infrastructure/01-CONTEXT.md` §Fastify Endpoint Contract — Locked backend decisions D-09 through D-13
- `.planning/research/PITFALLS.md` — $fetch vs useFetch, CORS production pitfall, phone mask guidance

### Secondary (MEDIUM confidence)
- CLAUDE.md / STACK.md section — `$fetch` for form submission convention, plain `<a>` for WhatsApp CTA
- STATE.md — Confirmed architectural constraints, no Pinia, no `pages/` directory
- Nuxt UI v4 component API — `UFormField` (not `UFormGroup`) confirmed as current API name from CLAUDE.md version table

### Tertiary (LOW confidence — flag for implementation-time verification)
- USelect `value-key`/`label-key` prop names in installed v4.5.1 — verify during implementation
- `i-simple-icons-whatsapp` icon availability — verify `@iconify-json/simple-icons` is installed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all tools confirmed installed and in use
- Architecture: HIGH — component location, composable interface, and backend contract all confirmed from codebase
- Pitfalls: HIGH — sourced from existing PITFALLS.md research plus direct code inspection
- UForm v4 API details: MEDIUM — API names verified from CLAUDE.md version table; one prop name detail flagged for implementation-time check

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable libraries; Nuxt UI v4 API unlikely to change in this window)
