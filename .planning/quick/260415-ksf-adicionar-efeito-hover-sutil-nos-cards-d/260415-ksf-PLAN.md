---
phase: quick
plan: 260415-ksf
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/Section/SectionAbout.vue
  - app/components/Section/SectionForWhom.vue
  - app/components/Section/SectionMethod.vue
  - app/components/Section/SectionProvas.vue
autonomous: true
requirements: []
must_haves:
  truths:
    - "Cards in SectionAbout scale up subtly and gain shadow on hover"
    - "Cards in SectionForWhom (both positive and negative) scale up subtly and gain shadow on hover"
    - "Cards in SectionMethod scale up subtly and gain shadow on hover"
    - "Cards in SectionProvas scale up subtly and gain shadow on hover"
    - "SectionPrice card is NOT affected by hover changes"
    - "Hover transition is smooth (300ms ease) with no layout shift"
  artifacts:
    - path: "app/components/Section/SectionAbout.vue"
      provides: "Hover effect on 3 benefit cards"
    - path: "app/components/Section/SectionForWhom.vue"
      provides: "Hover effect on 5 positive + 3 negative cards"
    - path: "app/components/Section/SectionMethod.vue"
      provides: "Hover effect on 4 step cards"
    - path: "app/components/Section/SectionProvas.vue"
      provides: "Hover effect on 5 proof cards"
  key_links: []
---

<objective>
Add a subtle hover effect to all card elements across 4 sections (SectionAbout, SectionForWhom, SectionMethod, SectionProvas). The effect includes a slight scale increase (scale-[1.02]) and enhanced shadow on hover, using Tailwind CSS transition utilities. SectionPrice is excluded.

Purpose: Improve interactivity feel and visual polish of the landing page.
Output: 4 updated Vue component files with consistent hover effects.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@app/components/Section/SectionAbout.vue
@app/components/Section/SectionForWhom.vue
@app/components/Section/SectionMethod.vue
@app/components/Section/SectionProvas.vue
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add hover effect classes to all card elements in 4 sections</name>
  <files>
    app/components/Section/SectionAbout.vue
    app/components/Section/SectionForWhom.vue
    app/components/Section/SectionMethod.vue
    app/components/Section/SectionProvas.vue
  </files>
  <action>
Add Tailwind hover and transition classes to every card div in the 4 target sections. The classes to add to each card element:

`transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg`

Specific targets per file:

**SectionAbout.vue** — Find the 3 benefit card divs with `rounded-xl bg-white shadow-sm border border-gray-100 p-6`. Add the transition + hover classes to each.

**SectionForWhom.vue** — Find the 5 positive card divs (`rounded-xl bg-white shadow-sm border border-gray-100 p-5`) AND the 3 negative card divs (`rounded-xl bg-slate-50 border border-slate-200 p-5`). Add the transition + hover classes to all 8 cards.

**SectionMethod.vue** — Find the 4 step card divs with `step-card rounded-xl p-6`. Add the transition + hover classes to each. Both the white and navy variants get the effect.

**SectionProvas.vue** — Find the 5 proof card divs with `rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col`. Add the transition + hover classes to each.

Do NOT touch SectionPrice.vue — it is a standalone CTA element and should not have hover scale.

Important: Use `transition-all` (not `transition-transform`) so both transform and shadow animate smoothly together.
  </action>
  <verify>
    <automated>cd /home/michel/projects/codebase/agencia201/flyupmilhas/site-flyupmilhas && grep -c "hover:scale-\[1.02\]" app/components/Section/SectionAbout.vue app/components/Section/SectionForWhom.vue app/components/Section/SectionMethod.vue app/components/Section/SectionProvas.vue && echo "--- SectionPrice should have 0 ---" && grep -c "hover:scale" app/components/Section/SectionPrice.vue || echo "0 (correct)"</automated>
  </verify>
  <done>All card divs in SectionAbout (3), SectionForWhom (8), SectionMethod (4), and SectionProvas (5) have `transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg` classes. SectionPrice has zero hover:scale classes. Production build succeeds.</done>
</task>

</tasks>

<verification>
- `grep -r "hover:scale-\[1.02\]" app/components/Section/` returns matches in exactly 4 files (About, ForWhom, Method, Provas)
- `grep "hover:scale" app/components/Section/SectionPrice.vue` returns no matches
- `pnpm build` completes without errors
</verification>

<success_criteria>
- All card elements in 4 sections have consistent hover effect (scale + shadow)
- SectionPrice is untouched
- No layout shift (CLS) introduced — scale transform does not affect document flow
- Build passes
</success_criteria>

<output>
After completion, create `.planning/quick/260415-ksf-adicionar-efeito-hover-sutil-nos-cards-d/260415-ksf-SUMMARY.md`
</output>
