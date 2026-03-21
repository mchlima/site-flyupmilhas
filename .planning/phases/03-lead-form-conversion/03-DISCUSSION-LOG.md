# Phase 3: Lead Form & Conversion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-03-21
**Phase:** 03-lead-form-conversion
**Areas discussed:** Form UX & validation, Success/error states, WhatsApp CTA, Field behavior
**Mode:** Auto

---

## Form UX & Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked single-column | Mobile-optimized, one field per row | ✓ |
| Two-column desktop | Side by side on wider screens | |

**User's choice:** [auto] Stacked single-column (recommended — mobile-first BR market)

## Success/Error States

| Option | Description | Selected |
|--------|-------------|----------|
| In-place replacement | Form replaced by success message | ✓ |
| Modal/toast notification | Overlay confirmation | |
| Redirect to thank-you page | Separate page | |

**User's choice:** [auto] In-place replacement (recommended — no navigation, keeps scroll position)

## WhatsApp CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Below form as secondary | "Falar no WhatsApp" with wa.me/ link | ✓ |
| Primary CTA replacing form | WhatsApp as main conversion | |

**User's choice:** [auto] Below form as secondary (recommended — form captures data, WhatsApp is immediate alternative)

## Field Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Numeric keyboard + phone mask | inputmode=numeric, (XX) XXXXX-XXXX | ✓ |
| Free text input | No mask or keyboard hint | |

**User's choice:** [auto] Numeric keyboard + phone mask (recommended — BR mobile UX)

## Claude's Discretion

- Phone mask implementation approach
- UForm vs manual form handling
- Error message animation
- Form section heading
- Gastos field: free text vs ranges

## Deferred Ideas

- WhatsApp Business API notifications — v2
- Email confirmation — v2
- Cloudflare Turnstile — if honeypot insufficient
- Form analytics — v2/LGPD
