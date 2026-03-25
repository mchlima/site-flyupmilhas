# Requirements: Fly Up Milhas

**Defined:** 2026-03-24
**Core Value:** Converter visitantes em clientes da mentoria Fly Up Milhas atraves de uma LP de alta conversao

## v1.6 Requirements

Requirements for milestone v1.6 — Upgrade de Identidade Visual. Each maps to roadmap phases.

### Paleta

- [x] **PAL-01**: Design tokens atualizados com azul vibrante #1D4ED8 como cor primaria em toda a LP
- [x] **PAL-02**: CTA cyan #06B6D4 substituindo laranja #e67e22 em todos os botoes de acao
- [x] **PAL-03**: Gradientes sutis azul-to-transparent aplicados em secoes chave (hero, price, guarantee)
- [x] **PAL-04**: Todos os componentes passam WCAG AA de contraste com a nova paleta

### Tipografia

- [x] **TIPO-01**: Plus Jakarta Sans substitui Inter como fonte principal em toda a LP
- [x] **TIPO-02**: Hierarquia tipografica aprimorada (pesos e tamanhos de heading mais impactantes)
- [x] **TIPO-03**: CLS < 0.1 apos troca de fonte (verificado via Lighthouse)

### Depoimentos

- [ ] **DEP-01**: Cada depoimento WhatsApp exibe foto circular da pessoa que testemunhou
- [ ] **DEP-02**: Fallback avatar circular com iniciais coloridas quando foto nao disponivel
- [ ] **DEP-03**: Layout de chat bubble mantido com avatar integrado harmonicamente

### Garantia

- [x] **GAR-01**: Nova secao dedicada SectionGuarantee com selo dourado (PNG existente)
- [x] **GAR-02**: Copy de confianca enfatizando garantia de 7 dias sem risco
- [x] **GAR-03**: Posicionamento estrategico da secao proximo ao preco/formulario

### FAQ

- [ ] **FAQ-01**: FAQ redesenhado com mais impacto visual (cards, icones, ou numeracao)
- [ ] **FAQ-02**: Hierarquia visual clara entre pergunta e resposta
- [ ] **FAQ-03**: Acessibilidade preservada (keyboard navigation, focus ring, ARIA)

## Future Requirements

### Alternativa CTA

- **CTA-ALT-01**: Testar variante de botao branco com borda azul como alternativa ao cyan

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mudanca de copy/texto | Copy aprovado no v1.5, milestone e visual apenas |
| Mudanca de layout/ordem de secoes | Estrutura aprovada, foco na identidade visual |
| Novas funcionalidades (pagamento, login) | Fora do escopo desde v1.0 |
| Dark mode completo | Estilo Descobridor de Milhas descartado; manter fundo claro |
| Fonte serif nos titulos (Playfair Display) | Pode ser explorado futuramente; v1.6 usa Plus Jakarta Sans uniforme |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAL-01 | Phase 15 | Complete |
| PAL-02 | Phase 15 | Complete |
| PAL-03 | Phase 15 | Complete |
| PAL-04 | Phase 15 | Complete |
| TIPO-01 | Phase 16 | Complete |
| TIPO-02 | Phase 16 | Complete |
| TIPO-03 | Phase 16 | Complete |
| GAR-01 | Phase 17 | Complete |
| GAR-02 | Phase 17 | Complete |
| GAR-03 | Phase 17 | Complete |
| DEP-01 | Phase 18 | Pending |
| DEP-02 | Phase 18 | Pending |
| DEP-03 | Phase 18 | Pending |
| FAQ-01 | Phase 19 | Pending |
| FAQ-02 | Phase 19 | Pending |
| FAQ-03 | Phase 19 | Pending |

**Coverage:**
- v1.6 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 — all 16 requirements mapped to phases 15-19*
