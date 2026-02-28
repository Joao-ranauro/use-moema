# PROJECT: use.moema — Restauracao do Ambiente Local

## What This Is

Restauracao do ambiente de desenvolvimento local da landing page **use.moema** (https://usemoema.com.br/) para permitir edicoes e deploys futuros. A pasta local foi apagada acidentalmente; o codigo foi recuperado via GitHub, mas faltam credenciais e verificacao de paridade com producao.

## Core Value

**Paridade local-producao**: o ambiente local deve ser identico ao site em producao, pronto para editar e deployar a qualquer momento.

## Context

- **Situacao**: Landing page de empreendimento imobiliario em Moema, SP
- **Framework**: Next.js 16.1.6 + React 19 + Tailwind v4 + GSAP + Motion + Lenis
- **Deploy**: Vercel (auto-deploy via GitHub push)
- **Backend**: Supabase (captura de leads via API route server-side)
- **Dominio**: usemoema.com.br (DNS configurado no Vercel)
- **Repo GitHub**: https://github.com/joaoranauro1/use-moema.git (origin)
- **Problema**: Pasta local apagada, recuperada do GitHub. Faltam credenciais e verificacao.

## What It Is NOT

- Nao e uma reescrita ou refatoracao da landing page
- Nao e uma adicao de features novas (isso vira depois)
- Nao e uma correcao de bugs (exceto se necessario para paridade com producao)

## Constraints

- Nao alterar o codigo-fonte — o objetivo e restaurar, nao modificar
- Credenciais do Supabase estao no dashboard do Vercel (usuario tem acesso)
- O site em producao e a fonte de verdade para validar paridade

## Requirements

### Validated

- ✓ Codigo-fonte recuperado do GitHub — existing
- ✓ Repositorio git configurado com origin apontando para GitHub — existing
- ✓ node_modules instalado (npm install ja executado) — existing
- ✓ Estrutura de arquivos completa (8 secoes, layout, UI components, lib, API route) — existing
- ✓ Design system definido em globals.css (Tailwind v4 @theme inline) — existing
- ✓ Formulario de leads com validacao Zod (discriminated union) — existing
- ✓ Animacoes GSAP + Motion + Lenis configuradas — existing
- ✓ Dominio usemoema.com.br configurado no Vercel — existing

### Active

- [ ] ENV-01: Configurar .env.local com credenciais reais do Supabase
- [ ] BUILD-01: npm run build completa sem erros
- [ ] DEV-01: npm run dev roda e serve a pagina corretamente em localhost:3000
- [ ] PARITY-01: Verificar paridade visual entre localhost e producao
- [ ] PARITY-02: Verificar se todas as secoes renderizadas em producao estao no codigo local
- [ ] DEPLOY-01: Verificar que o Vercel esta conectado ao repo GitHub correto
- [ ] DEPLOY-02: Confirmar que push para GitHub dispara deploy automatico no Vercel
- [ ] LEADS-01: Formulario de leads funciona localmente (submissao chega no Supabase)

### Out of Scope

- Correcoes de bugs nao relacionados a paridade (tech debt, acessibilidade, SEO)
- Adicao de novas features ou secoes
- Mudancas de design ou copy
- Configuracao de analytics ou monitoramento
- Testes automatizados

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Restaurar, nao reescrever | O codigo ja funciona em producao; o objetivo e ter o ambiente local funcional | Pendente |
| Credenciais do Vercel | Usuario confirmou que as env vars estao no dashboard do Vercel | Pendente |
| Nao alterar codigo-fonte | Foco em ambiente, nao em features | Pendente |

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Codigo do GitHub pode estar desatualizado vs producao | Secoes faltando ou diferentes do site live | Comparar visualmente com producao |
| Credenciais do Supabase podem ter mudado | Leads nao funcionam | Verificar no dashboard do Vercel |
| Vercel pode estar apontando para outro repo/branch | Deploy nao funciona | Verificar no dashboard do Vercel |

## Codebase Findings (from map)

**Alerta critico do codebase map**: `ContactSection` e `ArchitectureSection` existem como componentes mas NAO estao importados/renderizados em `src/app/page.tsx`. Precisa verificar se o site em producao tem essas secoes — se sim, o codigo do GitHub esta desatualizado.

**Outros achados relevantes**:
- `.env.local` tem placeholders, nao credenciais reais
- Supabase service role key usado corretamente (server-side only)
- In-memory rate limiting nao funciona em serverless (Vercel) — nao e escopo deste projeto
- 3 UI components nao utilizados (GlassCard, RevealText, ParallaxImage) — nao e escopo

---
*Last updated: 2026-02-27 after initialization*
