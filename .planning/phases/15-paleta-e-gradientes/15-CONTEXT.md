# Phase 15: Paleta e Gradientes - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Atualizar toda a paleta de cores da LP (design tokens + hardcoded values) e adicionar gradientes sutis diagonais. Copy, layout e estrutura de componentes nao mudam. Todos os 12 componentes devem refletir a nova paleta sem quebrar contraste WCAG AA.

</domain>

<decisions>
## Implementation Decisions

### Paleta de tokens
- **D-01:** Azul primario muda de #1a3a5c para #1D4ED8 (Tailwind blue-700, 6.3:1 contra branco)
- **D-02:** CTA muda de #e67e22 (laranja) para #06B6D4 (cyan). Hover: escurecer 10% (~#0891B2)
- **D-03:** Header/form background muda de #1a3a5c para #0F172A (slate-900) — contraste forte, azul como destaque
- **D-04:** Footer muda de #0f2039 para #020617 (slate-950) — quase preto, separacao visual mantida
- **D-05:** Fundo da pagina #F9FAFB permanece inalterado
- **D-06:** Texto body #1a1a1a e muted #6b7280 permanecem inalterados

### Azul como destaque sobre fundo escuro
- **D-07:** Sobre fundos escuros (#0F172A/#020617), o azul #1D4ED8 aparece em: link hover states, bordas sutis, badges — nao como fundo ou elemento dominante
- **D-08:** Links no header: branco → hover #1D4ED8
- **D-09:** Links no footer: branco/80 → hover #1D4ED8

### Gradientes
- **D-10:** Estilo diagonal sutil (135deg), maximo 2 color stops
- **D-11:** Secoes escuras com gradiente forte: Hero (#0F172A → #1D4ED8), Price (#1E3A8A → #1D4ED8), Form (#0F172A → #1E3A8A)
- **D-12:** Secoes claras com gradiente accent: Method (#F9FAFB → #EFF6FF), About (#FFFFFF → #F0F7FF) — tint azulado muito sutil
- **D-13:** Demais secoes: fundo solido sem gradiente (ForWhom, ProgramContent, SocialProof, FAQ)

### Hardcoded colors
- **D-14:** Chat bubble #DCF8C6 (verde WhatsApp) em SectionSocialProof.vue — manter inalterado, e fidelidade ao WhatsApp

### Claude's Discretion
- CTA hover exact shade (escurecer 10-15% do #06B6D4)
- Angulo exato dos gradientes (135deg ± 10deg)
- Opacidade dos gradientes accent nas secoes claras (0.5-2%)
- Ajustes de contraste pontuais se algum texto nao passar WCAG AA

</decisions>

<specifics>
## Specific Ideas

- Cliente referenciou Descobridor de Milhas como inspiracao: fundo escuro (#000b16) com elementos vibrantes (#6EC1E4 turquesa)
- O estilo e "azul brilha como destaque sobre fundo escuro" — nao "tudo azul"
- Gradientes sutis criam ritmo visual entre secoes claras e escuras
- Depois do milestone, testar CTA branco com borda como alternativa ao cyan (capturado em Future Requirements CTA-ALT-01)

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design tokens
- `.planning/research/STACK.md` — Tailwind v4 @theme token syntax, gradient utilities (bg-linear-*), what NOT to add
- `.planning/research/ARCHITECTURE.md` — Token cascade mechanics, single-file swap in main.css, component integration map
- `.planning/research/PITFALLS.md` — V1 (token namespace collision), V2 (WCAG contrast), V6 (CTA on multiple backgrounds)

### Color references
- `.planning/research/FEATURES.md` — Premium blue palette research, airline brand references, CTA color rationale

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/assets/css/main.css` — All 7 brand tokens defined in `@theme {}`. Updating these 7 values cascades to all 12 components automatically
- Token pattern: `bg-[var(--color-brand-primary)]`, `text-[var(--color-brand-cta)]` — used consistently across all components

### Established Patterns
- All components use CSS custom properties via Tailwind arbitrary values — no hardcoded hex except #DCF8C6 in SectionSocialProof.vue
- CTA pattern: `bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white` — consistent across all 7 CTA instances
- Dark sections: `bg-[var(--color-brand-primary)]` (header, price, form) and `bg-[var(--color-brand-footer)]` (footer)

### Integration Points
- `app.vue` line 48: formulario section uses `bg-[var(--color-brand-primary)]` — will pick up new token automatically
- `AppHeader.vue`: nav background uses brand-primary — changes to slate-900 via token
- `BackToTop.vue`: uses brand-cta for button — changes to cyan via token
- Gradientes: novas classes CSS ou inline styles nos componentes de secao (hero, price, form, method, about)

</code_context>

<deferred>
## Deferred Ideas

- CTA branco com borda como alternativa ao cyan — capturado em REQUIREMENTS.md como CTA-ALT-01 (Future)
- Logo PNG pode precisar de re-export se nao funcionar sobre o novo header (#0F172A) — verificar na Phase 15 e escalar se necessario

</deferred>

---

*Phase: 15-paleta-e-gradientes*
*Context gathered: 2026-03-24*
