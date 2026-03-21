# Phase 3: Lead Form & Conversion - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the 4-field lead qualification form into the `#formulario` section, implement `useLeadForm.ts` with Zod validation and `$fetch` submission to the Fastify POST /leads endpoint, add WhatsApp CTA button, and handle all success/error/loading states. Every valid submission stored in MongoDB, spam blocked by honeypot.

</domain>

<decisions>
## Implementation Decisions

### Form Layout & Fields (LEAD-01)
- **D-01:** Single-column stacked form layout inside the existing `#formulario` section in app.vue
- **D-02:** 4 visible fields + 1 hidden honeypot:
  1. `nome` — UInput text field, placeholder "Seu nome completo"
  2. `whatsapp` — UInput with `inputmode="numeric"`, Brazilian phone mask `(XX) XXXXX-XXXX`
  3. `gastoMensal` — UInput with `inputmode="numeric"`, placeholder "Média mensal em cartão de crédito (R$)"
  4. `objetivo` — USelect with 3 options: "Viagem executiva", "Economia familiar", "Renda extra com milhas"
  5. `website` — hidden honeypot field (CSS `display: none`, `tabindex="-1"`, `autocomplete="off"`)
- **D-03:** Submit button: "Quero minha Consultoria" in brand-cta color, full-width on mobile

### Client-side Validation (LEAD-02)
- **D-04:** Zod schema matching Phase 1 backend contract (D-09): `{ nome: string, whatsapp: string, gastoMensal: string, objetivo: enum }`
- **D-05:** Validation triggers on blur (field loses focus) AND on submit
- **D-06:** Inline error messages below each field in red, using Nuxt UI's built-in form error display
- **D-07:** All fields required — submit button disabled until all pass validation

### Form Submission (LEAD-03)
- **D-08:** Use `$fetch` (NOT `useFetch`) for form submission — user-triggered action, not SSR data loading
- **D-09:** POST to `${useRuntimeConfig().public.apiBase}/leads` with JSON body
- **D-10:** Include honeypot `website` field in request body (backend handles rejection silently)
- **D-11:** Submit button shows loading spinner and is disabled during request — prevents double submit

### Success State (LEAD-04)
- **D-12:** On 200 response: replace entire form with success message in-place (no redirect, no modal)
- **D-13:** Success message: "Recebi! Marcio vai te chamar no WhatsApp em ate 24h." with checkmark icon
- **D-14:** Success state also shows the WhatsApp CTA button so user can reach out immediately

### Error States (LEAD-04)
- **D-15:** On 400 (validation error): show inline error banner above form, form stays filled, user can fix and retry
- **D-16:** On 429 (rate limit): show "Muitas tentativas. Tente novamente em 1 minuto." — form stays filled
- **D-17:** On network/500 error: show "Erro de conexao. Tente novamente." — form stays filled

### Anti-spam (LEAD-05)
- **D-18:** Honeypot field `website` hidden via CSS (`display: none`) — bots fill it, humans don't see it
- **D-19:** `tabindex="-1"` and `autocomplete="off"` on honeypot to prevent keyboard/autofill interaction
- **D-20:** No CAPTCHA or Turnstile in v1 — honeypot + rate limiting is sufficient for initial launch

### WhatsApp CTA (CTA-01)
- **D-21:** WhatsApp button as secondary CTA below the form: "Falar no WhatsApp" with WhatsApp icon
- **D-22:** Link: `https://wa.me/55XXXXXXXXXXX?text=Ola%20Marcio%2C%20quero%20saber%20mais%20sobre%20a%20consultoria%20VIP%20de%20milhas.`
- **D-23:** Phone number uses placeholder `55XXXXXXXXXXX` with TODO marker — Marcio provides real number
- **D-24:** WhatsApp button also appears in success state after form submission
- **D-25:** Opens in new tab (`target="_blank"`, `rel="noopener noreferrer"`)

### Claude's Discretion
- Exact phone mask implementation (custom directive vs library)
- UForm vs manual form handling approach
- Exact error message positioning and animation
- Whether to add a "form section" heading/subheading above the form
- Gastos mensais field: free text vs preset ranges

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend Contract (LOCKED — Phase 1)
- `.planning/phases/01-foundation-infrastructure/01-CONTEXT.md` §Fastify Endpoint Contract — D-09 through D-13 define the exact POST /leads schema, response codes, CORS, rate limiting, and honeypot behavior
- `server/leads/schema.ts` — Zod LeadSchema (source of truth for field names and types)
- `server/leads/index.ts` — Route handler with honeypot logic and MongoDB insertion

### Existing Code
- `app/composables/useLeadForm.ts` — Stub composable to be fully implemented
- `app/app.vue` line 48 — `#formulario` section anchor already in place

### Research
- `.planning/research/FEATURES.md` — WhatsApp CTA patterns in BR market, form field count limits
- `.planning/research/PITFALLS.md` — $fetch vs useFetch SSR pitfall, CORS production-only issue, form field count impact on conversion

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/composables/useLeadForm.ts` — Stub with `isLoading`, `isSuccess`, `error` refs and empty `submit()` — ready for implementation
- `app/composables/useScroll.ts` — SSR-safe scroll composable (pattern for `import.meta.client` guard)
- `server/leads/schema.ts` — Backend Zod schema to mirror in frontend validation
- Nuxt UI form components: `UInput`, `USelect`, `UButton`, `UForm` available

### Established Patterns
- `$fetch` not yet used in frontend — this is the first client-side API call
- `useRuntimeConfig().public.apiBase` configured in nuxt.config.ts (from Phase 1)
- All section components follow `Section/Section[Name].vue` naming
- Brand tokens available: `--color-brand-cta`, `--color-brand-cta-hover`, `--color-brand-primary`

### Integration Points
- `app/app.vue` `#formulario` section — form component will be placed here (or replace the stub section)
- CTA buttons in SectionHero, SectionExpert, SectionPrice all scroll to `#formulario`
- Backend at `apiBase` URL expects exact schema from `server/leads/schema.ts`

</code_context>

<specifics>
## Specific Ideas

- Research strongly recommends keeping form to 4 fields max — each additional field costs 10-20% of completions on mobile
- WhatsApp number field should trigger numeric keyboard on mobile (`inputmode="numeric"`) — critical for BR mobile UX
- Success message should create urgency to check WhatsApp ("Marcio vai te chamar em ate 24h") rather than passive confirmation
- The backend Zod schema in `server/leads/schema.ts` is the source of truth — frontend validation should mirror it exactly to avoid 400 errors

</specifics>

<deferred>
## Deferred Ideas

- WhatsApp Business API notification to Marcio on form submission — v2 (NOTF-01)
- Email confirmation to the lead — v2 (NOTF-02)
- Cloudflare Turnstile CAPTCHA — only if honeypot proves insufficient
- Form analytics (submission tracking, drop-off) — v2, needs LGPD consent

</deferred>

---

*Phase: 03-lead-form-conversion*
*Context gathered: 2026-03-21*
