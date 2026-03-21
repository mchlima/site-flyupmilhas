---
phase: 03-lead-form-conversion
plan: 01
subsystem: ui
tags: [nuxt, vue, zod, nuxt-ui, form, lead-capture, whatsapp, honeypot]

# Dependency graph
requires:
  - phase: 01-foundation-infrastructure
    provides: useLeadForm.ts stub, Fastify POST /leads backend, Zod schema at server/leads/schema.ts, runtimeConfig.public.apiBase
  - phase: 02-display-sections
    provides: app.vue with #formulario section anchor stub

provides:
  - useLeadForm composable with Zod validation and $fetch POST to Fastify /leads
  - SectionLeadForm.vue with 4-field form, phone masking, honeypot, success/error states, WhatsApp CTA
  - app.vue wired with live SectionLeadForm replacing stub placeholder
  - Fully functional lead capture: visitor submits contact, MongoDB stores lead, WhatsApp CTA closes conversion loop

affects: [launch-readiness, conversion, lead-storage]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useLeadForm composable pattern: Zod schema exported alongside composable for UForm integration"
    - "Phone mask with dual-value pattern: whatsappDisplay (formatted) for UI, state.whatsapp (raw digits) for Zod/API"
    - "Honeypot hidden with display:none + aria-hidden + tabindex=-1, field name website agreed with backend"
    - "Inline SVG for WhatsApp icon (simple-icons @iconify-json package not installed)"
    - "USelect uses items prop (not options) with value-key/label-key in Nuxt UI v4"

key-files:
  created:
    - app/components/Section/SectionLeadForm.vue
  modified:
    - app/composables/useLeadForm.ts
    - app/app.vue

key-decisions:
  - "USelect uses items prop (not options) — confirmed from Nuxt UI v4 Select.vue source"
  - "value-key and label-key props work correctly in USelect (not value-attribute/option-attribute)"
  - "simple-icons @iconify-json package not installed — used inline SVG for WhatsApp icon in both CTA buttons"
  - "wa.me URL defined as WHATSAPP_URL constant (one definition, two usages) — TODO marker left for Marcio's real number"
  - "SectionLeadForm.vue renders inner content only — section#formulario wrapper stays in app.vue"

patterns-established:
  - "Composable exports schema alongside composable: export const LeadFormSchema for UForm :schema binding"
  - "Phone input dual-value: display ref for formatted string, state field for raw digits validated by Zod"

requirements-completed: [LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, CTA-01]

# Metrics
duration: 3min
completed: 2026-03-21
---

# Phase 3 Plan 01: Lead Form and Conversion Layer Summary

**Zod-validated 4-field lead form with phone masking, honeypot, and WhatsApp CTA wired to Fastify POST /leads via $fetch**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-21T06:32:12Z
- **Completed:** 2026-03-21T06:34:56Z
- **Tasks:** 3 of 3
- **Files modified:** 3

## Accomplishments

- Replaced useLeadForm.ts stub with full implementation: Zod schema mirrors server/leads/schema.ts exactly, $fetch POST to apiBase/leads inside submit() only (SSR-safe), 400/429/other error classification
- Built SectionLeadForm.vue with 4 UFormField elements, phone mask (whatsappDisplay + raw digits), honeypot hidden field, isSuccess/error state toggling, WhatsApp CTA in both success and form states
- Wired SectionLeadForm into app.vue replacing the Phase 2 stub; pnpm nuxt build passes clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement useLeadForm composable with Zod schema and $fetch POST** - `bb3a360` (feat)
2. **Task 2: Build SectionLeadForm.vue with form, phone mask, honeypot, and WhatsApp CTA** - `37a6f37` (feat)
3. **Task 3: Wire SectionLeadForm into app.vue and verify end-to-end build** - `bf0ff0c` (feat)

## Files Created/Modified

- `app/composables/useLeadForm.ts` - Full implementation: LeadFormSchema (Zod), LeadFormData type, useLeadForm() with $fetch POST, error state by HTTP status code
- `app/components/Section/SectionLeadForm.vue` - 4-field form with phone mask, honeypot, success/error states, WhatsApp CTA in both states
- `app/app.vue` - SectionLeadForm wired inside #formulario; stub placeholder removed

## Decisions Made

- **USelect API:** Nuxt UI v4 USelect uses `items` prop (not `options`) and `value-key`/`label-key` (not `value-attribute`/`option-attribute`). Confirmed from source at `node_modules/@nuxt/ui/dist/runtime/components/Select.vue`.
- **WhatsApp icon:** `@iconify-json/simple-icons` is not installed. Used inline SVG path (WhatsApp logo) in both CTA button instances.
- **WHATSAPP_URL constant:** Defined once as a constant; both links use `:href="WHATSAPP_URL"`. TODO comment left for Marcio's real number replacement before launch.
- **No SectionLeadForm wrapper section:** Component renders inner content only; `<section id="formulario">` stays in app.vue to avoid duplicating the scroll anchor.
- **Build output to dist/:** Project uses Cloudflare Pages preset — output goes to `dist/` not `.output/`. Build passes with exit code 0.

## Known Stubs

- **WhatsApp phone number placeholder** — `app/components/Section/SectionLeadForm.vue` line 5: `WHATSAPP_URL = 'https://wa.me/55XXXXXXXXXXX?...'`. Intentional stub — requires Marcio to provide his real WhatsApp number before launch. TODO comment present.

## Deviations from Plan

None — plan executed exactly as written. The inline SVG fallback for WhatsApp icon was explicitly documented in Task 2 action as an expected fallback path.

## Issues Encountered

None — build passed first attempt with no errors.

## User Setup Required

**Open item: Marcio's WhatsApp number.** Replace `55XXXXXXXXXXX` in `app/components/Section/SectionLeadForm.vue` line 5 with the real number (format: 55 + DDD + number, e.g. 5511999999999) before launch.

## Next Phase Readiness

- Lead form fully functional end-to-end: visitor submits → $fetch POST to Fastify → MongoDB stores lead → success message shown
- WhatsApp CTA closes conversion loop for visitors who prefer direct contact
- Phase 3 complete — all 6 requirements satisfied (LEAD-01 through LEAD-05, CTA-01)
- Pre-launch: Marcio's WhatsApp number must be configured

---
*Phase: 03-lead-form-conversion*
*Completed: 2026-03-21*
