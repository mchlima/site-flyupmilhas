---
phase: 18-avatares-nos-depoimentos
plan: 01
subsystem: frontend/components
tags: [avatars, testimonials, social-proof, whatsapp-bubbles, mobile]
dependency_graph:
  requires: []
  provides: [avatar-enhanced-testimonials]
  affects: [app/components/Section/SectionSocialProof.vue]
tech_stack:
  added: []
  patterns: [vite-static-import, deterministic-color-hash, conditional-render-v-if-v-else]
key_files:
  created: []
  modified:
    - app/components/Section/SectionSocialProof.vue
decisions:
  - "Vite static imports for photos instead of NuxtImg — avoids Cloudflare Image Transformations dependency (per D-05)"
  - "flex-row-reverse on odd wrapper instead of conditional ordering — single avatar slot in markup, direction flipped by CSS"
  - "Canonical Tailwind classes (text-brand-primary, text-brand-text-muted) used throughout — fixes IDE warnings and follows v4 CSS-first convention"
  - "max-width bumped from 400px to 440px — accounts for 40px avatar + 12px gap without squishing bubble below 300px"
metrics:
  duration: 108s
  completed: 2026-03-25
  tasks_completed: 2
  files_modified: 1
---

# Phase 18 Plan 01: Avatar-Enhanced Testimonials Summary

Circular photo avatars (real photos for all 3 testimonials, initials fallback for future entries) added beside each WhatsApp chat bubble in SectionSocialProof.vue using Vite static imports and flex-row/flex-row-reverse layout.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add avatar data model and photo imports | 9b4b57e | SectionSocialProof.vue |
| 2 | Integrate avatar into chat bubble layout | b21f54a | SectionSocialProof.vue |

## What Was Built

- Added `import anaPhoto / carlosPhoto / julianaPhoto` via Vite static imports (no NuxtImg dependency)
- Added `avatar` field to each testimonial object pointing to the imported photo
- Added `getInitials(name)` — splits name, takes first char of each word, uppercases, slices to 2
- Added `getAvatarColor(name)` — deterministic djb2-style hash over a 6-color brand palette (blue-600/700, cyan-600/700, slate-600/700)
- Restructured each testimonial row from `flex flex-col` to `flex items-start gap-3` with `flex-row-reverse` on odd index
- Avatar element: `<img>` with `w-10 h-10 rounded-full object-cover shrink-0 mt-1` when photo exists; `<div>` with initials + `getAvatarColor()` class when not
- Bubble+name column: `flex flex-col items-start` (even) / `items-end` (odd) — name/city text-align follows same conditional
- Applied canonical Tailwind class names (`text-brand-primary`, `text-brand-text-muted`, `text-brand-text`) replacing `text-[var(--color-brand-*)]` syntax

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed concatenated class string on odd-index wrapper**
- **Found during:** Task 2 — IDE diagnostic showed `'ml-auto mr-0flex-row-reverse'` (missing space before `flex-row-reverse`)
- **Fix:** Corrected to `'ml-auto mr-0 flex-row-reverse'` with proper space separator
- **Files modified:** SectionSocialProof.vue
- **Commit:** b21f54a

**2. [Rule 2 - Quality] Canonical Tailwind class names applied**
- **Found during:** Task 2 — IDE warnings (suggestCanonicalClasses) on 3 lines
- **Fix:** Replaced `text-[var(--color-brand-*)]` with `text-brand-primary`, `text-brand-text`, `text-brand-text-muted` throughout template
- **Files modified:** SectionSocialProof.vue
- **Commit:** b21f54a

## Verification Results

- 3 photo imports present: `grep -c "import.*from.*assets/img/.*profile"` = 3
- `rounded-full` appears 2 times (img + fallback div)
- `object-cover` present on img element
- `flex-row-reverse` present for odd-index avatar placement
- `v-if="t.avatar"` and `v-else` both present
- `#DCF8C6` preserved on 3 occurrences (bubble bg, left arrow, right arrow)
- `getInitials` and `getAvatarColor` called in template
- `pnpm build` — success, zero errors

## Known Stubs

None — all 3 testimonials have real profile photos wired via Vite static imports. The initials fallback is a complete implementation (not a stub), ready for any future testimonial without a photo.

## Self-Check: PASSED
