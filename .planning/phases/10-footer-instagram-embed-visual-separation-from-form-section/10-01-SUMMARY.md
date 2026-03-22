---
phase: 10-footer-instagram-embed-visual-separation-from-form-section
plan: 01
subsystem: footer
tags: [footer, instagram, social-links, visual-separation, brand-colors]
dependency_graph:
  requires: []
  provides: [footer-instagram-cta, footer-dark-background, footer-visual-separation]
  affects: [app/components/App/AppFooter.vue, app/assets/css/main.css]
tech_stack:
  added: []
  patterns: [inline-svg-social-icons, css-custom-properties, tailwind-utility-classes]
key_files:
  created: []
  modified:
    - app/components/App/AppFooter.vue
    - app/assets/css/main.css
decisions:
  - "--color-brand-footer (#0f2039) creates clear visual separation from form section navy (#1a3a5c) — 22% darker value"
  - "Instagram CTA block placed above bottom bar with icon + headline + description + @flyupmilhas pill button"
  - "border-t border-white/10 on footer element provides subtle boundary between form section and footer"
  - "Instagram icon reused as inline SVG (same pattern as WhatsApp — no @iconify-json package installed)"
metrics:
  duration: "2 minutes"
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_modified: 2
---

# Phase 10 Plan 01: Footer Instagram CTA and Visual Separation Summary

**One-liner:** Footer redesigned with dark navy (#0f2039) background, full Instagram CTA block with icon/headline/pill-button, and WhatsApp+Instagram social links in the bottom bar.

## What Was Built

Added Instagram presence to the site footer and created clear visual separation between the navy form section (#1a3a5c) and footer (#0f2039).

Key additions:
- `--color-brand-footer: #0f2039` CSS custom property added to `main.css` `@theme` block
- Footer element switched from `bg-[var(--color-brand-primary)]` to `bg-[var(--color-brand-footer)]`
- `border-t border-white/10` on footer element creates subtle boundary with form section above
- Instagram CTA block (icon + "Acompanhe a Fly Up Milhas no Instagram" headline + description + @flyupmilhas pill button)
- Horizontal `<hr class="border-white/10">` separator between CTA block and bottom bar
- Instagram SVG icon + "Siga no Instagram" link added alongside existing WhatsApp link in bottom bar social links

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add footer dark color and Instagram icon + link alongside WhatsApp | ec983dd | app/assets/css/main.css, app/components/App/AppFooter.vue |
| 2 | Add Instagram CTA block above footer bottom bar | ec983dd | app/components/App/AppFooter.vue |

Note: Both tasks were implemented atomically in a single file write and committed together in ec983dd. The commit covers all changes from both tasks.

## Verification Results

1. `grep "instagram.com/flyupmilhas" AppFooter.vue` — 2 matches (CTA block + bottom bar link)
2. `grep "@flyupmilhas" AppFooter.vue` — 1 match (CTA pill button)
3. `grep "color-brand-footer" main.css` — 1 match (CSS var defined)
4. `grep "color-brand-footer" AppFooter.vue` — 1 match (applied to footer element)
5. `grep "wa.me" AppFooter.vue` — 1 match (WhatsApp preserved)
6. `pnpm run build` — build complete, no errors

## Deviations from Plan

None — plan executed exactly as written. Both tasks were implemented in a single atomic file write due to the complete footer restructure; all specified content is present and verified.

## Known Stubs

- WhatsApp URL placeholder `55XXXXXXXXXXX` remains in both `AppFooter.vue` and `SectionLeadForm.vue` — requires Marcio's real WhatsApp number before launch (tracked as open item in STATE.md).

## Self-Check: PASSED

- app/components/App/AppFooter.vue: FOUND
- app/assets/css/main.css: FOUND
- Commit ec983dd: FOUND
