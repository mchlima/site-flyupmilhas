---
phase: quick
plan: 260323-mwb
type: execute
wave: 1
depends_on: []
files_modified:
  - app/components/Section/SectionForWhom.vue
autonomous: true
requirements: []
must_haves:
  truths:
    - "ForWhom section shows 5 info cards on the left and 2 images stacked on the right on desktop"
    - "On mobile, info cards appear first, images appear below"
    - "Images have rounded corners and subtle shadow matching site aesthetic"
  artifacts:
    - path: "app/components/Section/SectionForWhom.vue"
      provides: "2-column layout with cards left, images right"
      contains: "young-professional-planning"
  key_links: []
---

<objective>
Redesign SectionForWhom to a 2-column layout: info cards stacked on the left, two lifestyle images stacked on the right. Mobile stacks vertically (cards first, images below).

Purpose: Add visual appeal and emotional connection to the "Para quem e" section with relatable planning imagery.
Output: Updated SectionForWhom.vue with 2-column responsive layout.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/components/Section/SectionForWhom.vue
</context>

<interfaces>
<!-- Current SectionForWhom uses UIcon from Nuxt UI. Images are local assets imported via ~/assets/img/ pattern. -->
<!-- Site uses CSS custom properties: --color-brand-primary (headings), --color-brand-cta (accents), --color-brand-text (body) -->
<!-- Rounded cards with shadow-sm border-gray-100 is the established card pattern -->
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Refactor SectionForWhom to 2-column layout with images</name>
  <files>app/components/Section/SectionForWhom.vue</files>
  <action>
Refactor SectionForWhom.vue to a 2-column responsive layout:

1. Add two image imports at the top of script setup:
   ```
   import youngProfessionalImg from '~/assets/img/young-professional-planning.png'
   import familyPlanningImg from '~/assets/img/bazillian-family-planning.png'
   ```

2. Keep the existing `cards` array and h2 heading unchanged.

3. Replace the current grid layout with a 2-column structure:
   - Outer container: `grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto`
   - LEFT column (cards): `flex flex-col gap-4` containing all 5 cards stacked vertically as single column. Each card keeps its current styling (`rounded-xl bg-white shadow-sm border border-gray-100 p-6 flex items-start gap-4`). Remove the `md:col-span-2` special case on the 5th card since all cards are now single-column.
   - RIGHT column (images): `flex flex-col gap-6 items-center justify-center` containing both images stacked vertically.

4. Each image: `<img :src="imageVar" alt="descriptive alt text" class="rounded-2xl shadow-md w-full object-cover" />`
   - First image alt: "Jovem profissional planejando viagens com milhas"
   - Second image alt: "Familia brasileira planejando viagem juntos"
   - Do NOT use NuxtImg since these are local assets (not R2 CDN images).

5. Keep the h2 heading centered above both columns with `text-center mb-10`.
  </action>
  <verify>
    <automated>cd /home/michel/projects/codebase/agencia201/flyupmilhas/site-flyupmilhas && pnpm build 2>&1 | tail -5</automated>
  </verify>
  <done>SectionForWhom renders with cards on left, two stacked images on right at desktop widths. Mobile shows cards first then images below. Build succeeds with no errors.</done>
</task>

</tasks>

<verification>
- `pnpm build` completes without errors
- Visual check: desktop shows 2-column layout (cards left, images right)
- Visual check: mobile (375px) shows cards stacked above images
- Both images render with rounded-2xl corners and shadow
</verification>

<success_criteria>
- SectionForWhom.vue updated with 2-column responsive grid
- Both planning images visible and properly styled
- No build errors or missing imports
</success_criteria>

<output>
After completion, create `.planning/quick/260323-mwb-add-planning-images-to-forwhom-section-2/260323-mwb-SUMMARY.md`
</output>
