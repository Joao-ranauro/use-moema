# use.moema — Landing Page

## Projeto
- **Framework**: Next.js 16.1.6 + React 19 + TypeScript
- **CSS**: Tailwind v4 (sem tailwind.config — tudo definido em `src/app/globals.css` via `@theme inline`)
- **Animações**: GSAP + `@gsap/react` (useGSAP) + Motion (`motion/react`) + Lenis (smooth scroll)
- **Formulário**: react-hook-form + zod (validação wired no lead schema)
- **Notificações**: Resend (email) + Telegram Bot (mensagem instantânea a cada lead)
- **Idioma**: pt-BR
- **Dev**: `npm run dev` → localhost:3000
- **Build**: `npm run build`
- **Deploy**: `npx vercel --prod --yes` (force deploy) ou push para `master` (auto-deploy Vercel)
- **Screenshot**: `node scripts/screenshot.mjs` → `screenshots/full-page.png` (usa Playwright)
- **Produção**: https://usemoema.com.br

---

## Documento RAG — Fonte de Verdade do Empreendimento

**Caminho**: `./use_moema_rag_master_v1.1.md`

Documento com 30 chunks canônicos. Todas as informações sobre o empreendimento (números, textos, posicionamento) vêm deste arquivo. **Nunca invente dados — consulte o RAG.**

### Índice por Categoria
| Categoria | Chunks | Conteúdo |
|---|---|---|
| Brand/Design | BRD-001~007 | Essência, paleta, liquid glass, tipografia, fotografia, tom de voz, checklist |
| Identidade | ID-001~002 | Carta do fundador, proposta de valor |
| Cliente | CUS-001~002 | Perfil do comprador (investidor 40+), dor central |
| Tese | THS-001 | Por que é melhor: design por experiência + tese por modelo |
| Localização | LOC-001~002 | Narrativa Moema, endereço oficial, 4 distâncias canônicas |
| Projeto | PRJ-001, PRD-001~002 | Ficha técnica (53 un, 14 andares), tipologias 20-56m², unidades-exemplo |
| Amenidades | AMN-001~005 | Tese, rooftop, coworking, bem-estar, praticidade urbana |
| Comercial | COM-001 | Fluxo de pagamento (sinal 7%, complemento 4.5%, mensal 2.9%, intermediárias 6%) |
| Marketing | MRK-001~003 | Posicionamento, provas objetivas, comparativo preço/m² e TIR |
| Vendas | SLS-001~003 | Pitch 20s, 10 mensagens prontas, objeções e respostas |
| Parceiro | PAR-001~002 | Lobie: papel (operador, NÃO centro do pitch) e taxa (12%) |
| Rentabilidade | REN-000~003 | Compliance, cenários base/pessimista/otimista, sensibilidade |
| Legal | LGL-001 | Matrícula 147.561, Alvará 54088-25-SP-ALV |
| Glossário | GLO-001 | Definições financeiras |

### Mapeamento: Seção da LP → Chunks do RAG
| Seção LP | Chunks Relevantes |
|---|---|
| Hero | ID-001, ID-002, BRD-006, MRK-001 |
| Location | LOC-001, LOC-002 |
| Manifesto | ID-001, THS-001, BRD-006, CUS-001, CUS-002 |
| Residences | PRJ-001, PRD-001, PRD-002 |
| Investment | MRK-003, COM-001, REN-000~003, PAR-001~002 |
| Amenities | AMN-001~005 |
| Architecture | BRD-001, BRD-005 |
| Contact | LGL-001, LOC-001 |

### Quando CONSULTAR o RAG
- Alterar qualquer texto/copy de uma seção
- Adicionar ou modificar números (preço, distâncias, yield, unidades)
- Criar claims de marketing ou mensagens de venda
- Decisões de brand (paleta, fotografia, tom de voz)
- Referências legais ou disclaimers

### Quando NÃO CONSULTAR o RAG
- Ajustes de CSS, animações, espaçamentos
- Refatoração de componentes sem mudança de conteúdo
- Layout, responsividade, z-index, overflow
- Configurações Next.js, TypeScript, ESLint
- Performance, lazy loading, build

### Números Canônicos (nunca inventar)
| Dado | Valor Exato |
|---|---|
| Endereço | Alameda dos Anapurus, 1216 — Moema — São Paulo — SP |
| Parque Ibirapuera | 1,8 km |
| Metrô Moema | 900 m |
| Shopping Ibirapuera | 750 m |
| Aeroporto Congonhas | 2,1 km |
| IDH Moema | 0,962 |
| Unidades | 53 |
| Andares | 14 |
| Tipologias | 20 m² a 56 m² |
| Entrega | Dezembro 2027 |
| Preço/m² use.moema | R$ 14.600 |
| Preço/m² mercado | R$ 20.400 |
| TIR estimada | 32% a 44% a.a. (sempre como cenário, nunca garantia) |
| Ticket referência | R$ 546.685 |
| Taxa Lobie | 12% receita operacional líquida |
| Matrícula | 147.561 — 14º Oficial de Registro de Imóveis SP |
| Alvará | 54088-25-SP-ALV |

---

## Arquitetura de Arquivos

```
src/
  app/
    page.tsx          ← ordena as seções: Hero→Location→Manifesto→Residences→Investment→Amenities (6 seções + InterestModal)
    layout.tsx        ← InterVariable font, SmoothScrollProvider, metadata pt-BR
    globals.css       ← todo o design system (cores, tipografia, efeitos, utilidades)
  components/
    sections/         ← 8 componentes disponíveis (6 ativas em page.tsx + ArchitectureSection e ContactSection não usadas)
    layout/           ← Header, Footer, MobileMenu
    ui/               ← Button, Counter, GlassCard, RevealText, ParallaxImage
    providers/        ← SmoothScrollProvider (Lenis + GSAP ScrollTrigger sync)
  lib/
    constants.ts      ← NAV_ITEMS, DISTANCES, AMENITIES, LEGAL_TEXT, ADDRESS
    utils.ts          ← cn() — class name merge
  fonts/
    InterVariable.woff2
public/
  logos/              ← use-moema-branco.svg, use-moema-preto.svg
  videos/             ← hero.webm
  images/             ← pastas amenities/, architecture/, neighborhood/, residences/ (vazias — usando Unsplash)
```

**Dados locais por seção** (não estão em constants.ts):
- `ResidencesSection`: `TYPOLOGIES` — Studio 20m², Studio Plus 28m², Compacto 38m², Compacto Plus 56m²
- `InvestmentSection`: `PAYMENT_FLOW` — Sinal 7%, Complemento 4.5%, Mensal 2.9%, Intermediárias 6%
- `ArchitectureSection`: `FEATURES` (4 itens) + `GRID_IMAGES` (3 URLs Unsplash)

---

## Design System (globals.css)

### Paleta
- **White** `#FFFFFF` — dominante (60-70%)
- **Black** `#000000` — secundário (20-30%)
- **Steel** `#BCBFCC` — accent (5-10%) + variantes: steel-5, steel-10, steel-12, steel-18, steel-20, steel-40, steel-60

### Tipografia (Inter — única fonte)
| Classe | Tamanho (clamp) | Peso | Uso |
|---|---|---|---|
| `.text-display` | 3.5–9rem | 200 | Não usado atualmente |
| `.text-mega` | 5–12rem | 150 | Números grandes (IDH, preço, contadores) |
| `.text-h1` | 2.5–5rem | 250 | Títulos principais de seção |
| `.text-h2` | 1.5–2.25rem | 400 | Subtítulos |
| `.text-h3` | 1.125–1.5rem | 400 | Itens, nomes de tipologia |
| `.text-body` | 0.9375–1.0625rem | 400 | Parágrafos |
| `.text-caption` | 0.6875–0.75rem | 500 | Labels de seção (uppercase, tracking 0.12em) |

### Efeitos e Utilidades
| Classe | Uso |
|---|---|
| `.glass` / `.glass-strong` / `.glass-dark` | Painéis frosted-glass (blur + border steel) |
| `.noise` / `.noise-strong` | Textura SVG fractalNoise (4% / 8% opacity) |
| `.rule` / `.rule-dark` | Linhas divisórias 1px (gradiente steel / white) |
| `.btn-mask` | Efeito clip-path fill no hover de botões |
| `.hover-underline` | Underline que aparece com scaleX no hover |
| `.scroll-indicator` | Animação CSS bounce para indicador de scroll |

### Easing
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-out-quart`: `cubic-bezier(0.25, 1, 0.5, 1)`

---

## Padrões de Código

### Layout
- Container: `max-w-[1400px] mx-auto px-6 md:px-12`
- Grid: `lg:grid-cols-12` com divisões típicas: 5+7, 6+6, 7+5, 8+4
- Breakpoints: apenas `md:` (768px) e `lg:` (1024px)

### Seções
- Toda seção é `"use client"` com `useRef` + `useGSAP({ scope: sectionRef })`
- Label padrão: `<p className="text-caption text-black/25">` acima de `<h2 className="text-h1">`
- ScrollTrigger padrão: `toggleActions: "play none none none"` (anima uma vez)
- Seções escuras (Investment, Footer): fundo preto, `.noise-strong`, `.rule-dark`

### Animações
- **GSAP**: scroll-driven, scrub, pin, stagger, counters. Sempre com `scope` para isolar
- **Motion**: `whileHover`, `whileInView`, `AnimatePresence` (mount/unmount)
- **Lenis**: smooth scroll global, synced com GSAP via `SmoothScrollProvider`

### Header
- Fixo `z-50`, transparente com logo branca no topo, `.glass-strong` com logo preta ao scrollar (>80px)
- Nav desktop: `lg:` — items com `.hover-underline`
- Mobile: hamburger → `MobileMenu` (overlay fullscreen, AnimatePresence)

---

## Regras de Brand (resumo — detalhes no RAG)

### Tom de Voz
- Frases curtas e assertivas. Confiante sem arrogância
- Usar "sofisticado" — nunca "luxo"
- Ser específico, não genérico. Clareza vence adjetivos
- Dados objetivos > promessas emocionais

### Visual
- 1 mensagem por tela. Na dúvida, remova o elemento
- Espaçamento é elemento de design — não "preencher espaço"
- Hierarquia: H1 dominante, H2 estrutural, corpo enxuto
- Fotos: muito branco, arquitetura como produto, composição limpa
- Proibido: gradientes exagerados, muitas cores, textos longos, ícones em excesso

---

## Referência Rápida das Seções

| Seção | Arquivo | Anchor | Fundo | Animação Principal | Dados |
|---|---|---|---|---|---|
| Hero | `HeroSection.tsx` | — | video `hero.webm` + gradient | GSAP scrub scale+fade no vídeo | Hardcoded (logo, subtítulo) |
| Location | `LocationSection.tsx` | `#localizacao` | branco | GSAP stagger rows de distâncias | `DISTANCES`, `ADDRESS` |
| Manifesto | `ManifestoSection.tsx` | `#manifesto` | branco | GSAP 3D rotateX flip-in por linha | Hardcoded (53 un, Dez 2027) |
| Residences | `ResidencesSection.tsx` | `#residencias` | branco | GSAP clipPath inset reveal (scrub) | `TYPOLOGIES` (local) |
| Investment | `InvestmentSection.tsx` | `#investimento` | preto | Counter GSAP + stagger price blocks | `PAYMENT_FLOW` (local), `Counter` UI |
| Amenities | `AmenitiesSection.tsx` | `#amenidades` | branco | GSAP horizontal scroll pin (lg+) | `AMENITIES` |
| Architecture | `ArchitectureSection.tsx` | — | branco | GSAP clipPath wipe-up stagger | `FEATURES`, `GRID_IMAGES` (local) | **Não ativa em page.tsx** |
| Contact | `ContactSection.tsx` | `#contato` | branco + `.noise` | Motion AnimatePresence form→success | `react-hook-form`, `Button` | **Substituída por InterestModal** |

> **Nota**: ContactSection foi substituída pelo InterestModal (modal global acessível via Header e CTAs). ArchitectureSection existe com conteúdo real mas não está renderizada em page.tsx.

---

## Assets

- **Logos**: `public/logos/use-moema-branco.svg` (Hero, Footer, Header transparente) / `use-moema-preto.svg` (Header scrolled)
- **Vídeo**: `public/videos/hero.webm` (autoplay, muted, loop)
- **Fonte**: `src/fonts/InterVariable.woff2` (variable, carregada via next/font/local → `--font-inter`)
- **Imagens**: todas via URLs Unsplash. `next.config.ts` permite `images.unsplash.com` em remotePatterns
- **Pastas de imagem** (`public/images/amenities|architecture|neighborhood|residences`): existem mas estão vazias

---

## Pipeline de Leads

**Fluxo completo:** InterestModal (form) → POST `/api/leads` → Supabase `lp_leads` → Email (Resend) → Telegram Bot

### API Route (`src/app/api/leads/route.ts`)
- Validação com zod (`leadSchema`)
- Rate limiter in-memory (5 req/min por IP)
- Captura UTM params do referer
- Budget labels mapeados: `ate-500k`, `500k-1m`, `1m-1.5m`, `acima-1.5m`
- Sources: `modal_interesse`, `formulario_contato`

### Variáveis de Ambiente (`.env.local`)
| Variável | Serviço |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase (evnehcjypsnzranpygek) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `RESEND_API_KEY` | Resend (email) |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot |
| `TELEGRAM_CHAT_ID` | Telegram Chat |

### Integrações Verificadas
- Supabase insert: funcionando
- Email (Resend): funcionando
- Telegram notificação: funcionando
- Instagram: funcionando (verificado 2026-03-12)

---

## Deploy

- **Plataforma**: Vercel
- **Repo**: `joaoranauro1/use-moema` (branch `master`)
- **Auto-deploy**: push para `master` → Vercel detecta e deploya
- **Deploy manual**: `npx vercel --prod --yes` (sem precisar de push)
- **Domínio**: usemoema.com.br
- **MCP disponíveis**: GitHub (mcp__github__), Supabase (mcp__plugin_supabase_supabase__) — Vercel MCP não configurado, usar CLI
