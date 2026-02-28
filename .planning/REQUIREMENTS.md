# Requirements — use.moema Restauracao Local

## v1 Requirements

### Ambiente Local
- [x] **ENV-01**: Configurar .env.local com credenciais reais do Supabase (copiar do Vercel) ✓ Complete
- [x] **BUILD-01**: npm run build completa sem erros ✓ Complete
- [x] **DEV-01**: npm run dev serve a pagina corretamente em localhost:3000 ✓ Complete

### Paridade com Producao
- [ ] **PARITY-01**: Todas as secoes visiveis em producao estao renderizadas localmente
- [ ] **PARITY-02**: Visual local corresponde ao site em producao (layout, imagens, animacoes)

### Deploy Pipeline
- [ ] **DEPLOY-01**: Verificar que Vercel esta conectado ao repo joaoranauro1/use-moema
- [ ] **DEPLOY-02**: Push para GitHub dispara deploy automatico no Vercel

### Funcionalidade
- [ ] **LEADS-01**: Formulario de leads (InterestModal) funciona localmente — submissao chega no Supabase

## v2 Requirements (Deferred)

- Adicionar ContactSection e ArchitectureSection ao page.tsx
- Corrigir rate limiting para serverless
- Adicionar analytics e monitoramento
- Melhorar acessibilidade (focus trap, ARIA roles)
- Adicionar testes automatizados
- Adicionar robots.txt, sitemap, OG image

## Out of Scope

- Mudancas de design ou copy — restauracao apenas
- Refatoracao de codigo — nao alterar o que ja funciona
- Novas features — foco em paridade

## Traceability

| REQ | Phase |
|-----|-------|
| ENV-01 | 1 |
| BUILD-01 | 1 |
| DEV-01 | 1 |
| PARITY-01 | 2 |
| PARITY-02 | 2 |
| DEPLOY-01 | 3 |
| DEPLOY-02 | 3 |
| LEADS-01 | 2 |
