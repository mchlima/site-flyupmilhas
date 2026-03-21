# Phase 5: Form Polish & Footer - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Refine the lead form layout and button alignment, and add a structured footer with Agencia 201 credit. No new form fields, no new functionality — visual polish only.

</domain>

<decisions>
## Implementation Decisions

### Form card wrapper
- **D-01:** Wrap the form in a navy card (`bg-[var(--color-brand-primary)]`) with `rounded-xl` and internal padding — conversion emphasis pattern matching SectionPrice
- **D-02:** Form heading and subtitle text becomes white (`text-white`) on navy background
- **D-03:** Form fields (UInput, USelect) keep white backgrounds for contrast against the navy card
- **D-04:** Orange CTA button remains as-is (`bg-[var(--color-brand-cta)]`) — orange on navy is the highest-contrast CTA position

### Form spacing
- **D-05:** Change form field gap from `space-y-4` (16px) to `space-y-6` (24px) for more breathing room between fields
- **D-06:** All form fields and the submit button must share consistent horizontal padding — no field wider or narrower than siblings
- **D-07:** Submit button label must be vertically and horizontally centered (fix any clipping or misalignment from UButton internal styling)

### Footer design
- **D-08:** Footer uses navy background (`bg-[var(--color-brand-primary)]`) with white/light text — matches header visual language
- **D-09:** Two-column layout on desktop: left side has copyright + "Desenvolvido por Agencia 201", right side has WhatsApp contact link with icon
- **D-10:** Stacked single-column layout on mobile (text-center)
- **D-11:** "Agencia 201" is a link opening in a new tab — use `TODO: Replace with Agencia 201 URL` placeholder pattern
- **D-12:** WhatsApp link in footer reuses the same `WHATSAPP_URL` constant pattern from SectionLeadForm (or inline wa.me link with same number)

### Claude's Discretion
- Exact internal padding values for the navy form card
- WhatsApp icon implementation in footer (inline SVG or UIcon)
- Footer vertical padding
- Success state styling adjustments for navy background context

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Phase requirements
- `.planning/REQUIREMENTS.md` — FORM-01, FORM-02, FOOT-01 definitions
- `.planning/ROADMAP.md` — Phase 5 success criteria (3 items)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SectionLeadForm.vue` — Current form component, target for card wrapper and spacing changes
- `AppFooter.vue` — Current minimal footer, target for redesign
- `WHATSAPP_URL` constant in SectionLeadForm.vue — Reuse pattern for footer WhatsApp link
- WhatsApp SVG inline icon — Already used twice in SectionLeadForm.vue, can be extracted or copied for footer

### Established Patterns
- Navy card pattern: `bg-[var(--color-brand-primary)] text-white rounded-xl` — used in SectionAbout hero card, SectionMethod step 04, SectionPrice
- Orange CTA on navy: Already proven in AppHeader
- `space-y-6` gap: Standard 24px from the 8-point grid system (4, 8, 16, 24, 32, 48, 64)
- `rounded-xl shadow-sm` card pattern from Phase 4 bento grid

### Integration Points
- `app.vue` line 47 — `section#formulario` wrapper may need class adjustments for navy card context
- `AppFooter.vue` — Full rewrite (currently 5 lines)
- Form success state — Green check icon and text need contrast adjustment for navy background

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-form-polish-footer*
*Context gathered: 2026-03-21*
