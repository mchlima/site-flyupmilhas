---
type: quick
plan: 260323-me4
status: complete
completed: "2026-03-23T19:09:54Z"
duration: 51s
tasks_completed: 1
tasks_total: 1
key-files:
  modified:
    - app/components/Section/SectionHero.vue
commits:
  - hash: a2ca962
    message: "feat(260323-me4): add bg-hero.png as hero section background with dark overlay"
decisions:
  - "bg-black/60 overlay opacity — bright golden hour sunset needs strong overlay for white text readability"
---

# Quick Task 260323-me4: Use bg-hero.png as Hero Section Background — Summary

**One-liner:** Full-bleed airplane wing sunset background with 60% dark overlay replacing flat brand-bg color on hero section

## What Changed

Replaced the flat `bg-[var(--color-brand-bg)]` background on SectionHero with the `bg-hero.png` aviation photography (airplane wing at sunset) as a CSS background-image, layered with a `bg-black/60` dark overlay for text contrast.

### Key modifications to SectionHero.vue:

1. **Removed** `bg-[var(--color-brand-bg)]` from the `<section>` element
2. **Added** `relative overflow-hidden` to the section for absolute positioning context
3. **Added** background image div with `bg-cover bg-center bg-no-repeat` and dynamic style binding to the imported asset
4. **Added** dark overlay div with `bg-black/60` for text readability
5. **Added** `relative z-10` to the content div so it sits above the overlay
6. **Switched** pain point chip text from `text-[var(--color-brand-text-muted)]` to `text-white/90` and borders to `border-white/30`
7. **Switched** h1 from `text-[var(--color-brand-primary)]` to `text-white`
8. **Switched** subtitle from `text-[var(--color-brand-text-muted)]` to `text-white/80`
9. **Kept** CTA button unchanged (orange on dark background provides excellent contrast)

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

- `pnpm build` completed successfully with no errors
- All text colors switched to white/light variants
- CTA button remains orange (`--color-brand-cta`)

## Known Stubs

None.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | a2ca962 | feat(260323-me4): add bg-hero.png as hero section background with dark overlay |
