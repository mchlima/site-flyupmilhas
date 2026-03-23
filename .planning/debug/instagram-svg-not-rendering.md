---
status: awaiting_human_verify
trigger: "instagram-svg-not-rendering — Instagram SVG icon in footer not rendering"
created: 2026-03-22T00:00:00Z
updated: 2026-03-22T00:00:00Z
---

## Current Focus

hypothesis: The SVG arc command for the Instagram lens circle contains `100` instead of `1 0 0` (flags run together without spaces), causing the browser SVG parser to misread the arc flags and fail to draw the inner circle, producing an empty/invisible shape.
test: Compare the arc segment `a6.162 6.162 0 100 12.324` vs correct `a6.162 6.162 0 1 0 0 12.324`
expecting: Fixing the whitespace in the arc flags will restore the circle, making the icon visible.
next_action: Replace malformed arc segment in both occurrences of the Instagram path (line 7 and line 56)

## Symptoms

expected: Instagram SVG icon visible in the footer alongside WhatsApp icon
actual: Instagram icon not showing — likely empty space or invisible element
errors: Unknown — may be SVG path issue, viewBox, or fill/color problem
reproduction: View the footer in the browser
started: Just added in Phase 10 — never worked

## Eliminated

(none)

## Evidence

- timestamp: 2026-03-22T00:00:00Z
  checked: AppFooter.vue lines 7 and 56 — both Instagram SVG path `d` attributes
  found: Both paths contain the segment `a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324` — the `100` is three arc parameters (`large-arc-flag=1`, `sweep-flag=0`, `dx=0`) run together without separating spaces. The SVG spec requires arc flags to be separated; without spaces the parser reads `100` as a single number (100), making the arc parameters invalid.
  implication: The inner "lens" circle of the Instagram icon is never drawn. The outer rounded-square shape may or may not render depending on parser tolerance, but the icon effectively appears empty.

- timestamp: 2026-03-22T00:00:00Z
  checked: WhatsApp SVG path in the same file (line 44-46)
  found: The WhatsApp path uses no arc commands with run-together flags — it uses only C/c bezier and L/l line commands. This is why WhatsApp renders correctly while Instagram does not.
  implication: Confirms the bug is specific to the Instagram arc segment, not a broader SVG or CSS issue.

## Resolution

root_cause: SVG arc command flags run together without spaces: `0 100 12.324` should be `0 1 0 0 12.324`. The `large-arc-flag` (1) and `sweep-flag` (0) and `dx` (0) were concatenated into `100`, which the SVG parser reads as a single invalid number, causing the lens circle sub-path to fail silently and produce no rendered shape.
fix: Replace `0 100 12.324 6.162 6.162 0 100-12.324` with `0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324` in both Instagram SVG path occurrences (lines 7 and 56).
verification: Fix applied to both Instagram SVG path occurrences (lines 7 and 56). Arc flags `100` corrected to `1 0 0` with proper whitespace separation. Awaiting visual confirmation in browser.
files_changed:
  - app/components/App/AppFooter.vue
