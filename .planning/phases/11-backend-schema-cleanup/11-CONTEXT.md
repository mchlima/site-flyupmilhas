# Phase 11: Backend Schema Cleanup - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove the `gastoMensal` and `objetivo` fields from backend and frontend schemas, add `email` field, purge all "renda-extra" and "renda extra" references from the codebase. The form becomes 3 fields: nome, email (NEW), whatsapp.

</domain>

<decisions>
## Implementation Decisions

### Form field changes
- **D-01:** Remove `gastoMensal` field entirely from Zod schema (server + frontend) and form component
- **D-02:** Remove `objetivo` field entirely — the dropdown, enum, and all related types are deleted (not just the 'renda-extra' value)
- **D-03:** Add `email` field with `z.string().email()` validation in both server and frontend Zod schemas
- **D-04:** Final form fields: `nome` (string, required), `email` (string, email format, required), `whatsapp` (string, required, keeps existing phone mask)

### Schema sync order
- **D-05:** Update in strict order: `server/leads/schema.ts` → `app/composables/useLeadForm.ts` → `app/components/Section/SectionLeadForm.vue`
- **D-06:** Honeypot field remains unchanged

### "Renda extra" global purge
- **D-07:** Remove the card "Renda Extra com Milhas" entirely from SectionAbout bento grid (accept temporarily unbalanced layout — Phase 12 rewrites section)
- **D-08:** Remove "renda extra" from SectionAbout subtitle text (line 12)
- **D-09:** After all changes, `grep -ri "renda.extra" app/ server/` must return zero results (excluding node_modules)

### MongoDB compatibility
- **D-10:** No database migration needed — MongoDB is schemaless. Old documents with gastoMensal/objetivo remain untouched. Backend simply stops writing those fields on new leads.

### Claude's Discretion
- Email field placement order in the form (between nome and whatsapp, or after whatsapp)
- Exact Zod error message for email validation
- Whether to strip the objetivo-related TypeScript types or let them be removed organically

</decisions>

<specifics>
## Specific Ideas

- User explicitly said: "Deve já ter só Nome, E-mail e Telefone" — this overrides the original PDF requirement (which kept objetivo with new options)
- The email field is brand new — it did not exist in any previous version
- WhatsApp field keeps its current phone mask behavior (Brazilian format)

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Source files to modify
- `server/leads/schema.ts` — Zod schema definition (gastoMensal line 9, objetivo enum line 10)
- `server/leads/index.ts` — Fastify route handler (uses schema via import, may reference field names in response)
- `app/composables/useLeadForm.ts` — Frontend Zod schema mirror (gastoMensal line 11, objetivo enum line 12)
- `app/components/Section/SectionLeadForm.vue` — Form UI (gastoMensal field lines 137-148, objetivo dropdown, renda-extra option line 10, state initialization lines 19-20, submit data line 47)
- `app/components/Section/SectionAbout.vue` — "renda extra" copy (lines 12, 49, 51)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useLeadForm.ts` composable: Already has Zod schema + reactive state + submit handler. Adding email field follows same pattern as existing fields.
- Phone mask on whatsapp field: Already implemented, stays as-is.

### Established Patterns
- Zod schema duplicated in server and frontend (shared validation contract)
- Form state initialized as reactive object with field defaults
- UFormField + UInput pattern for each form field in template
- `$fetch` POST to `/leads` with schema-validated payload

### Integration Points
- `server/leads/schema.ts` → imported by `server/leads/index.ts` for request validation
- `useLeadForm.ts` → imported by `SectionLeadForm.vue` for frontend validation + state
- `SectionAbout.vue` → standalone component, no imports affected by card removal

</code_context>

<deferred>
## Deferred Ideas

- FORM-02 (new objetivo options) is now OBSOLETE — objetivo field removed entirely. Phase 14 scope reduced.
- Form submit CTA text change — Phase 14 (CTA-03)
- Badge "Seus dados estão seguros" — Phase 14 (FORM-04)
- Form section intro text change — Phase 14 (FORM-03)

</deferred>

---

*Phase: 11-backend-schema-cleanup*
*Context gathered: 2026-03-24*
