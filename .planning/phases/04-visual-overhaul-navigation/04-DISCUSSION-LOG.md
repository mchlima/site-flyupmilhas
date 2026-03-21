# Phase 4: Visual Overhaul & Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-03-21
**Phase:** 04-visual-overhaul-navigation
**Areas discussed:** Bento grid style, Menu design, Secao Sobre, Background & cores

---

## Bento Grid Style

| Option | Description | Selected |
|--------|-------------|----------|
| Cards uniformes | Grid regular | |
| Cards variados | 1x1, 2x1, 1x2 — Apple style | ✓ |

**Cards background:** Coloridos (alguns com azul/laranja para destaque)
**Onde aplicar:** Como Funciona, Depoimentos, Sobre, toda a pagina
**Arredondamento:** rounded-xl (~12px)

---

## Menu Design

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky | Sempre visivel | |
| Estatico | Some ao rolar | |
| Smart sticky | Aparece ao rolar para cima | ✓ |

**Fundo:** Azul da marca (#1a3a5c) com texto branco
**Mobile:** Fullscreen overlay com links centralizados
**Links:** Sobre, Como Funciona, Depoimentos, FAQ + CTA laranja

---

## Secao Sobre

| Option | Description | Selected |
|--------|-------------|----------|
| Historia + valores | Tom institucional | |
| Resultados + beneficios | Numeros e servicos | |
| Proposta de valor | Direto e vendedor | ✓ |

**Renda extra:** Bullet na lista de beneficios
**Visual:** Icones/ilustracoes em vez de foto pessoal

---

## Background & Cores

**Background:** #F9FAFB (gray-50, neutro frio) — Claude's choice (user said "nao pode ser branco solido")
**FAQ contraste:** Texto mais escuro (brand-text #1a1a1a em vez de brand-text-muted)
**Outras cores:** Sem mudancas

---

## Claude's Discretion

- Bento grid CSS template
- Card shadow values
- Hamburger animation
- Icons for SectionAbout
- Sticky scroll threshold
- Card hover effects
- Fullscreen menu transitions

## Deferred Ideas

- Scroll animations on cards
- Dark mode
- Logo image no header
