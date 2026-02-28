# Architecture

**Analysis Date:** 2026-02-27

## Pattern Overview

**Overall:** Single-page component-based architecture (Next.js App Router)

**Key Characteristics:**
- Single-route landing page with all content rendered on one page (`src/app/page.tsx`)
- Section-based composition: 8 full-viewport sections assembled vertically
- Client-side rendering dominant: every component uses `"use client"` except `Footer.tsx` and `layout.tsx`
- Minimal server-side logic: only one API route (`src/app/api/leads/route.ts`) for lead capture
- Animation-first: GSAP ScrollTrigger and Motion drive all user interactions
- No client-side routing: navigation uses anchor links with smooth scroll

## Layers

**Presentation Layer (Sections):**
- Purpose: Render the 8 landing page sections with scroll-driven animations
- Location: `src/components/sections/`
- Contains: `HeroSection.tsx`, `LocationSection.tsx`, `ManifestoSection.tsx`, `ResidencesSection.tsx`, `InvestmentSection.tsx`, `AmenitiesSection.tsx`, `ArchitectureSection.tsx`, `ContactSection.tsx`
- Depends on: UI components (`src/components/ui/`), constants (`src/lib/constants.ts`), GSAP, Motion
- Used by: `src/app/page.tsx`

**UI Components Layer:**
- Purpose: Reusable presentational primitives with animation behaviors
- Location: `src/components/ui/`
- Contains: `Button.tsx`, `Counter.tsx`, `GlassCard.tsx`, `InterestModal.tsx`, `ParallaxImage.tsx`, `RevealText.tsx`
- Depends on: GSAP, Motion, `src/lib/leads.ts` (InterestModal only)
- Used by: Section components, `src/app/page.tsx` (InterestModal)

**Layout Layer:**
- Purpose: Persistent chrome (header, footer, mobile menu)
- Location: `src/components/layout/`
- Contains: `Header.tsx`, `Footer.tsx`, `MobileMenu.tsx`
- Depends on: `src/lib/constants.ts` (NAV_ITEMS, LEGAL_TEXT, ADDRESS), Motion
- Used by: `src/app/page.tsx`

**Infrastructure Layer (Providers):**
- Purpose: Global behavior wrappers (smooth scrolling)
- Location: `src/components/providers/`
- Contains: `SmoothScrollProvider.tsx`
- Depends on: Lenis, GSAP ScrollTrigger
- Used by: `src/app/layout.tsx`

**Data/Logic Layer:**
- Purpose: Shared constants, validation schemas, API client helpers
- Location: `src/lib/`
- Contains: `constants.ts`, `leads.ts`, `supabase.ts`, `utils.ts`
- Depends on: Zod, Supabase SDK
- Used by: Sections, UI components, API route

**API Layer:**
- Purpose: Server-side lead capture endpoint
- Location: `src/app/api/leads/route.ts`
- Contains: POST handler with rate limiting, Zod validation, Supabase insert
- Depends on: `src/lib/leads.ts` (schemas), `src/lib/supabase.ts` (client)
- Used by: Client-side `submitLead()` in `src/lib/leads.ts`

## Data Flow

**Lead Submission (Contact Form):**

1. User fills form in `ContactSection.tsx` (react-hook-form manages state)
2. On submit, `submitLead()` from `src/lib/leads.ts` sends POST to `/api/leads`
3. API route (`src/app/api/leads/route.ts`) checks rate limit (5/min per IP)
4. Zod validates payload via `leadSchema` discriminated union
5. Row inserted into Supabase `leads` table with UTM params from referer
6. Success/error response flows back to component, which shows success state via AnimatePresence

**Lead Submission (Interest Modal):**

1. `InterestModal` opens via `onInterestClick` callback lifted to `src/app/page.tsx` state
2. Multi-step wizard (3 steps: contact, motivation, budget) collects data
3. On final step submit, same `submitLead()` path as contact form
4. Discriminated union schema (`source: "modal_interesse"`) validates modal-specific fields (motivation, budget)

**Navigation Flow:**

1. User clicks nav item in `Header.tsx` or `MobileMenu.tsx`
2. `handleNavClick()` calls `document.querySelector(href).scrollIntoView()`
3. Lenis (via `SmoothScrollProvider.tsx`) intercepts and provides smooth scrolling
4. GSAP ScrollTrigger animations fire as sections enter viewport

**State Management:**
- No global state store. All state is component-local via `useState`/`useRef`
- `interestOpen` boolean lifted to `src/app/page.tsx` and passed as callback to Header, LocationSection, AmenitiesSection
- Form state managed by react-hook-form (ContactSection, InterestModal)
- Scroll state managed by Lenis instance (SmoothScrollProvider) synced to GSAP ticker
- Header scroll state (`scrolled`) tracked via `window.scrollY > 80` listener

## Key Abstractions

**Section Component:**
- Purpose: Self-contained full-page section with scroll-triggered animations
- Examples: `src/components/sections/HeroSection.tsx`, `src/components/sections/ManifestoSection.tsx`
- Pattern: Every section follows the same structure:
  ```tsx
  "use client";
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => { /* ScrollTrigger animations */ }, { scope: sectionRef });
  return <section ref={sectionRef} id="anchor-name">...</section>;
  ```

**Glass Effect System:**
- Purpose: Frosted-glass UI panels defined via CSS classes
- Examples: `.glass`, `.glass-strong`, `.glass-dark` in `src/app/globals.css`
- Pattern: CSS-only, applied as utility classes. Used by Header (scrolled state), GlassCard component

**Design System (CSS-only):**
- Purpose: Typography scale, color palette, effects defined entirely in CSS
- Examples: `src/app/globals.css` lines 9-235
- Pattern: Tailwind v4 `@theme inline` for token definitions + custom utility classes (`.text-h1`, `.text-mega`, `.noise`, `.rule`, `.btn-mask`, `.hover-underline`)

**Lead Schema (Discriminated Union):**
- Purpose: Validate two lead sources with different required fields
- Examples: `src/lib/leads.ts`
- Pattern: Zod discriminated union on `source` field: `"formulario_contato"` (optional message) vs `"modal_interesse"` (required motivation[], budget)

## Entry Points

**Page Entry (`src/app/page.tsx`):**
- Location: `src/app/page.tsx`
- Triggers: Root route `/`
- Responsibilities: Composes all sections in order, manages InterestModal open state, renders Header and Footer

**Layout Entry (`src/app/layout.tsx`):**
- Location: `src/app/layout.tsx`
- Triggers: Wraps all pages (only one page exists)
- Responsibilities: Loads Inter font, sets HTML lang to pt-BR, wraps children in SmoothScrollProvider, exports metadata/SEO

**API Entry (`src/app/api/leads/route.ts`):**
- Location: `src/app/api/leads/route.ts`
- Triggers: POST requests to `/api/leads`
- Responsibilities: Rate limiting, Zod validation, UTM extraction, Supabase insert

## Rendering Strategy

**Static Generation (SSG) with Client Hydration:**
- `layout.tsx` is a Server Component (exports metadata, loads font)
- `Footer.tsx` is the only non-layout Server Component (no `"use client"` directive)
- `page.tsx` and all sections use `"use client"` for GSAP/Motion interactivity
- No `getStaticProps`, `getServerSideProps`, or dynamic routes. The single page is statically generated at build time, then hydrated client-side for animations
- API route runs server-side on each request (serverless function on Vercel)

## Error Handling

**Strategy:** Minimal, focused on form submission

**Patterns:**
- API route returns structured JSON errors: `{ success: false, error: "message" }` with appropriate HTTP status codes (400, 422, 429, 500)
- Client-side `submitLead()` in `src/lib/leads.ts` wraps fetch in try/catch, returns `{ success: boolean, error?: string }`
- Form components (`ContactSection.tsx`, `InterestModal.tsx`) display error via inline `<p>` elements
- No global error boundary
- GSAP animations use null-checks (`if (!sectionRef.current) return`) to guard against missing DOM refs

## Cross-Cutting Concerns

**Logging:** `console.error` only in API route (`src/app/api/leads/route.ts` line 104) for Supabase insert failures. No structured logging.

**Validation:** Zod schemas in `src/lib/leads.ts` for API payloads. react-hook-form inline validation rules in ContactSection and InterestModal. No validation library shared between client and server forms (forms use react-hook-form rules, API uses Zod).

**Authentication:** None. The API route is unauthenticated. Supabase uses service role key (server-side only) for writes.

**Rate Limiting:** In-memory Map in `src/app/api/leads/route.ts` (5 requests/min per IP). Resets on serverless function cold start.

**Scroll Synchronization:** `SmoothScrollProvider.tsx` syncs Lenis smooth scroll with GSAP's ScrollTrigger via `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add()`. This is a critical integration point; breaking it breaks all scroll-triggered animations.

**Responsive Design:** Two breakpoints only: `md:` (768px) and `lg:` (1024px). AmenitiesSection uses `gsap.matchMedia()` to enable horizontal scroll pinning only on `lg+`.

---

*Architecture analysis: 2026-02-27*
