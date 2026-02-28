# Roadmap — use.moema Restauracao Local

## Milestone 1: Ambiente Local Funcional

### Phase 1: Configuracao do Ambiente
**Goal:** Ambiente local configurado e buildando sem erros

**Requirements:** ENV-01, BUILD-01, DEV-01

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Verify build and dev server (BUILD-01, DEV-01)

**Success Criteria:**
1. .env.local contem credenciais reais do Supabase (copiadas do Vercel)
2. `npm run build` completa com exit code 0
3. `npm run dev` serve a pagina em localhost:3000 sem erros de console

---

### Phase 2: Verificacao de Paridade e Funcionalidade
**Goal:** Site local identico ao de producao com leads funcionando

**Requirements:** PARITY-01, PARITY-02, LEADS-01

**Plans:** 2 plans

Plans:
- [ ] 02-01-PLAN.md — Verify section rendering and visual parity (PARITY-01, PARITY-02)
- [ ] 02-02-PLAN.md — Test lead submission end-to-end (LEADS-01)

**Success Criteria:**
1. Todas as 6 secoes + header + footer renderizam corretamente em localhost
2. Layout, imagens e animacoes correspondem visualmente ao site em producao
3. InterestModal abre, aceita dados e submete lead com sucesso ao Supabase

---

### Phase 3: Verificacao do Pipeline de Deploy
**Goal:** Push para GitHub dispara deploy automatico no Vercel

**Requirements:** DEPLOY-01, DEPLOY-02

**Success Criteria:**
1. Vercel dashboard mostra conexao com repo joaoranauro1/use-moema branch master
2. Um push de teste (ou verificacao do ultimo deploy) confirma auto-deploy funcionando
3. Site em producao continua funcionando apos verificacao

---

## Phase Summary

| # | Phase | Goal | Requirements | Criteria |
|---|-------|------|--------------|----------|
| 1 | Configuracao do Ambiente | Build e dev funcionando | ENV-01, BUILD-01, DEV-01 | 3 |
| 2 | Paridade e Funcionalidade | Local = Producao + leads | PARITY-01, PARITY-02, LEADS-01 | 3 |
| 3 | Pipeline de Deploy | Push → Deploy automatico | DEPLOY-01, DEPLOY-02 | 3 |

**Total:** 3 fases | 8 requirements | Todas mapeadas
