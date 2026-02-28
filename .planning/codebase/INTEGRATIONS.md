# External Integrations

**Analysis Date:** 2026-02-27

## APIs & External Services

**Supabase (Database / Lead Storage):**
- Service: Supabase (PostgreSQL-as-a-service)
- What it's used for: Storing lead submissions from contact form and interest modal
- SDK/Client: `@supabase/supabase-js` 2.97.0
- Client file: `src/lib/supabase.ts`
- Auth method: Service Role Key (server-side only, never exposed to client)
- Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

**Unsplash (Remote Images):**
- Service: Unsplash image CDN
- What it's used for: Architecture and placeholder images loaded via Next.js `<Image>`
- No SDK - uses Next.js remote patterns
- Config: `next.config.ts` allows `images.unsplash.com` hostname
- Auth: None (public image URLs)

**Vercel (Hosting & Deploy):**
- Service: Vercel Platform
- What it's used for: Production hosting, serverless API routes, CDN, auto-deploy
- No SDK needed - integrated via GitHub
- Auth: GitHub integration + Vercel dashboard
- Env vars configured in Vercel dashboard

## Data Storage

**Database:**
- Provider: Supabase (PostgreSQL)
- Connection: `SUPABASE_URL` env var
- Client: `@supabase/supabase-js` (not an ORM, direct client)
- Client initialization: `src/lib/supabase.ts`
- Table: `leads`
- Columns: `source`, `name`, `email`, `phone`, `message`, `motivation`, `budget`, `utm_source`, `utm_medium`, `utm_campaign`

**File Storage:**
- Local filesystem only (static assets in `public/`)
- No cloud file storage integration

**Caching:**
- Next.js built-in image cache (31536000s TTL configured in `next.config.ts`)
- No external caching service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- None for end users (public landing page, no user accounts)
- Supabase Service Role Key used for server-to-database auth only

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)
- Errors logged to `console.error` in API route (`src/app/api/leads/route.ts` line 104)

**Logs:**
- `console.error` for Supabase insert failures
- No structured logging framework
- Vercel provides basic function logs in dashboard

**Analytics:**
- None detected (no Google Analytics, Plausible, etc.)

## CI/CD & Deployment

**Hosting:**
- Vercel (auto-detected Next.js project)

**CI Pipeline:**
- GitHub push triggers Vercel auto-deploy
- No separate CI pipeline (GitHub Actions, CircleCI, etc.)
- No automated tests in CI

**Build Process:**
- `npm run build` (Next.js production build)
- Vercel auto-detects and runs build

## Environment Configuration

**Required env vars:**

| Variable | Service | Required | Location |
|----------|---------|----------|----------|
| `SUPABASE_URL` | Supabase | Yes (for lead capture) | `.env.local` + Vercel dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Yes (for lead capture) | `.env.local` + Vercel dashboard |

**Secrets location:**
- Development: `.env.local` (gitignored)
- Production: Vercel environment variables dashboard
- Template in repo: `.env.local` contains placeholder values (not real credentials)

**Important security notes:**
- Supabase client uses Service Role Key (full access) -- used only server-side in API route
- No client-side Supabase exposure (client calls `/api/leads` which proxies to Supabase)

## API Routes

**`POST /api/leads`** (`src/app/api/leads/route.ts`):
- Purpose: Receive lead form submissions and store in Supabase
- Rate limiting: 5 requests/min per IP (in-memory Map, resets on deploy)
- Validation: Zod discriminated union schema (`src/lib/leads.ts`)
- Sources: `formulario_contato` (contact form) or `modal_interesse` (interest modal)
- UTM tracking: Extracts `utm_source`, `utm_medium`, `utm_campaign` from referer URL
- Response: `{ success: boolean, error?: string }`
- Error codes: 400 (bad JSON), 422 (validation), 429 (rate limit), 500 (DB error)

## Data Flow

**Lead Capture Flow:**

1. User fills form in `ContactSection` or `InterestModal` (client-side, `react-hook-form`)
2. Client calls `submitLead()` from `src/lib/leads.ts` which POSTs to `/api/leads`
3. API route (`src/app/api/leads/route.ts`) checks rate limit (in-memory, 5/min per IP)
4. Zod validates payload against discriminated union schema
5. API route extracts UTM params from `Referer` header
6. Supabase client (`src/lib/supabase.ts`) inserts row into `leads` table
7. Success/error response returned to client

**Image Loading Flow:**

1. Next.js `<Image>` components reference Unsplash URLs
2. Next.js image optimizer fetches, converts to AVIF/WebP, caches for 1 year
3. Subsequent requests served from Vercel CDN cache

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Third-Party Client Libraries

| Library | Import Path | Used In | Purpose |
|---------|-------------|---------|---------|
| `@supabase/supabase-js` | `createClient` | `src/lib/supabase.ts` | Database client |
| `gsap` | `gsap`, `ScrollTrigger` | All section components, `SmoothScrollProvider.tsx` | Animation engine |
| `@gsap/react` | `useGSAP` | All section components | React-scoped GSAP |
| `lenis` | `Lenis` | `src/components/providers/SmoothScrollProvider.tsx` | Smooth scroll |
| `motion` | `motion/react` | UI components | Declarative animations |
| `react-hook-form` | `useForm` | `ContactSection.tsx`, `InterestModal.tsx` | Form state |
| `zod` | `z` | `src/lib/leads.ts` | Schema validation |
| `playwright` | `chromium` | `scripts/screenshot.mjs` | Dev-only screenshots |

## Missing / Not Integrated

- **Analytics**: No page view or event tracking
- **Error monitoring**: No Sentry or equivalent
- **Email notifications**: No email sent on lead submission
- **CRM integration**: Leads stored in Supabase only, no CRM sync
- **Payment gateway**: None (informational landing page)
- **Maps API**: No Google Maps or Mapbox integration (location shown as text/distances)
- **Chat widget**: None

---

*Integration audit: 2026-02-27*
