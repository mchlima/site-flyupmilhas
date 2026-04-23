---
phase: quick-260423-jwh
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/Section/SectionForWhom.vue
autonomous: true
requirements:
  - QUICK-260423-JWH
must_haves:
  truths:
    - "Each of the 3 negative qualification cards renders the X icon inside a red circular background"
    - "The circular wrapper matches the 10x10 (w-10 h-10) size used by the positive cards for visual parity"
    - "The X glyph is red-colored and centered within its circular wrapper"
    - "Card layout, background, border, hover behavior, and text content remain unchanged"
  artifacts:
    - path: "app/components/Section/SectionForWhom.vue"
      provides: "Negative cards with red circular X icon"
      contains: "rounded-full bg-red"
---

<objective>
In `SectionForWhom.vue`, the negative qualification cards ("Não é pra quem...") currently render a bare `i-heroicons-x-mark` icon in muted gray. Wrap that icon in a red circular badge (mirroring the positive cards' blue circle pattern) so the "not-for-you" signal reads visually distinct and emphatic.

Output: Updated `SectionForWhom.vue` with the 3 negative cards using a red circle wrapper around the X icon.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/components/Section/SectionForWhom.vue
@CLAUDE.md

<interfaces>
Current negative card icon markup (to replace):
```vue
<UIcon :name="card.icon" class="w-7 h-7 text-brand-text-muted shrink-0" />
```

Positive cards already use this circle-wrapper pattern (reference for sizing/structure):
```vue
<div class="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
  <UIcon :name="card.icon" class="w-5 h-5 text-brand-primary" />
</div>
```

Target negative-card replacement (red variant):
```vue
<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
  <UIcon :name="card.icon" class="w-5 h-5 text-red-600" />
</div>
```

Notes:
- Use Tailwind's built-in `red-100` (light red bg) + `red-600` (strong red glyph). These match the existing `bg-blue-100` / `text-brand-primary` density used elsewhere in the component.
- `text-red-600` is the same hue weight as `text-green-700` already used in SectionProvas, keeping the site's color vocabulary consistent.
- No changes to the `negativeCards` data array — icon name stays `i-heroicons-x-mark`.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Wrap negative-card X icon in a red circular badge</name>
  <files>app/components/Section/SectionForWhom.vue</files>
  <behavior>
    - Each of the 3 negative cards shows a w-10 h-10 red circle containing a w-5 h-5 red X icon
    - Circle bg uses `bg-red-100` (light red), icon uses `text-red-600` (strong red)
    - Card container layout, bg-slate-50, border, padding, hover effects unchanged
    - Positive cards and all other markup unchanged
  </behavior>
  <action>
    In `app/components/Section/SectionForWhom.vue`, inside the `v-for="card in negativeCards"` block (around lines 57-66), replace the single line:
    ```
    <UIcon :name="card.icon" class="w-7 h-7 text-brand-text-muted shrink-0" />
    ```
    with:
    ```vue
    <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
      <UIcon :name="card.icon" class="w-5 h-5 text-red-600" />
    </div>
    ```
    Do NOT change anything else — positive cards, heading, separator, CTA, and negativeCards array all stay as-is.
  </action>
  <verify>
    <automated>pnpm build 2>&1 | tail -20</automated>
  </verify>
  <done>
    - `pnpm build` completes without errors
    - `SectionForWhom.vue` contains `bg-red-100` and `text-red-600` tokens inside the negative-card loop
    - The string `text-brand-text-muted shrink-0` no longer appears on the UIcon inside the negativeCards block
  </done>
</task>

</tasks>

<success_criteria>
- Negative cards render X icons inside red circular badges, matching the size/shape of the positive cards' blue badges
- Only `SectionForWhom.vue` modified; positive cards untouched
- Build passes
</success_criteria>

<output>
After completion, create `.planning/quick/260423-jwh-na-se-o-para-quem-essa-mentoria-nos-iten/260423-jwh-SUMMARY.md`
</output>
