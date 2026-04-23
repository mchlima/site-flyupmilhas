---
phase: quick-260423-jzz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/Section/SectionPrice.vue
autonomous: true
requirements:
  - QUICK-260423-JZZ
must_haves:
  truths:
    - "The benefits list in 'Tudo o que você recebe na mentoria' includes a new entry with text 'Grupo VIP com alertas de passagens (bônus especial)'"
    - "The new entry has a Heroicon consistent with the existing list style (one icon per item, same w-6 h-6 sizing)"
    - "Existing 4 benefit entries, their order, text, and icons remain unchanged"
    - "Section layout, heading, price card, CTA, and guarantee block are unchanged"
  artifacts:
    - path: "app/components/Section/SectionPrice.vue"
      provides: "Benefits list with VIP group bonus item"
      contains: "Grupo VIP com alertas de passagens"
---

<objective>
Add a new benefit entry "Grupo VIP com alertas de passagens (bônus especial)" to the benefits list inside `SectionPrice.vue` ("Tudo o que você recebe na mentoria"). Same visual pattern as the existing 4 items (icon + text row).

Output: Updated `SectionPrice.vue` with a 5th entry in the `benefits` array.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/components/Section/SectionPrice.vue
@CLAUDE.md

<interfaces>
Current benefits array (lines 16-21 of SectionPrice.vue):
```ts
const benefits = [
  { text: '3 encontros estratégicos (início, meio e fim)', icon: 'i-heroicons-video-camera' },
  { text: 'Suporte direto via WhatsApp', icon: 'i-heroicons-chat-bubble-left-right' },
  { text: 'Material prático para aplicação imediata', icon: 'i-heroicons-document-text' },
  { text: 'Plano personalizado para seu perfil', icon: 'i-heroicons-user-circle' },
]
```

Icon choice: `i-heroicons-bell-alert` — captures the "alertas de passagens" value proposition (a bell-alert signals real-time notifications). Alternative considered: `i-heroicons-user-group` (leans on "grupo") or `i-heroicons-sparkles` (leans on "bônus"). Chose bell-alert because the existing icons are functionally descriptive (video-camera, chat, document, user-circle), not decorative.

Positioning: Append as the last entry so it reads as an additive bonus — consistent with the "(bônus especial)" framing which implies it comes after the core offering.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Append "Grupo VIP com alertas de passagens (bônus especial)" to benefits array</name>
  <files>app/components/Section/SectionPrice.vue</files>
  <behavior>
    - Benefits list renders 5 rows instead of 4
    - The 5th row shows a bell-alert icon + text "Grupo VIP com alertas de passagens (bônus especial)"
    - Order of the first 4 items is unchanged
    - All other markup (heading, price card, button, guarantee) is unchanged
  </behavior>
  <action>
    In `app/components/Section/SectionPrice.vue`, update the `benefits` array by appending one entry:

    Replace:
    ```ts
      { text: 'Plano personalizado para seu perfil', icon: 'i-heroicons-user-circle' },
    ]
    ```
    with:
    ```ts
      { text: 'Plano personalizado para seu perfil', icon: 'i-heroicons-user-circle' },
      { text: 'Grupo VIP com alertas de passagens (bônus especial)', icon: 'i-heroicons-bell-alert' },
    ]
    ```

    Do NOT change anything else in the file.
  </action>
  <verify>
    <automated>pnpm build 2>&1 | tail -15</automated>
  </verify>
  <done>
    - `pnpm build` completes without errors
    - `SectionPrice.vue` contains the exact string `Grupo VIP com alertas de passagens (bônus especial)`
    - The benefits array has 5 entries
    - First 4 entries are byte-identical to the pre-change version
  </done>
</task>

</tasks>

<success_criteria>
- New benefit item rendered in the list
- Build passes
- No other markup changed
</success_criteria>

<output>
After completion, create `.planning/quick/260423-jzz-em-tudo-o-que-voc-recebe-na-mentoria-inc/260423-jzz-SUMMARY.md`
</output>
