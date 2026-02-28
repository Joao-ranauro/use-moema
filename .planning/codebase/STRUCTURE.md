# Codebase Structure

**Analysis Date:** 2026-02-27

## Directory Layout

```
use-moema/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── leads/
│   │   │       └── route.ts          # POST endpoint for lead capture
│   │   ├── globals.css               # Full design system (Tailwind v4 @theme + custom classes)
│   │   ├── layout.tsx                # Root layout: font loading, metadata, SmoothScrollProvider
│   │   ├── page.tsx                  # Single page: composes all sections
│   │   ├── favicon.ico               # Generated favicon
│   │   ├── icon.svg                  # SVG favicon
│   │   └── apple-icon.png            # Apple touch icon
│   ├── components/
│   │   ├── sections/                 # 8 landing page sections (scroll order)
│   │   │   ├── HeroSection.tsx       # Video background + logo + tagline
│   │   │   ├── LocationSection.tsx   # Moema neighborhood, distances, IDH
│   │   │   ├── ManifestoSection.tsx  # Brand statement, 3D text reveals
│   │   │   ├── ResidencesSection.tsx # Typologies list, image reveal
│   │   │   ├── InvestmentSection.tsx # Price comparison counters
│   │   │   ├── AmenitiesSection.tsx  # Horizontal scroll gallery (lg+)
│   │   │   ├── ArchitectureSection.tsx # Image grid + features
│   │   │   └── ContactSection.tsx    # Contact form (react-hook-form)
│   │   ├── layout/                   # Persistent chrome
│   │   │   ├── Header.tsx            # Fixed header, transparent→glass on scroll
│   │   │   ├── Footer.tsx            # Dark footer with nav + legal text
│   │   │   └── MobileMenu.tsx        # Fullscreen overlay menu (<lg)
│   │   ├── ui/                       # Reusable primitives
│   │   │   ├── Button.tsx            # Animated button with clip-path fill effect
│   │   │   ├── Counter.tsx           # GSAP scroll-triggered number counter
│   │   │   ├── GlassCard.tsx         # Frosted glass panel with whileInView
│   │   │   ├── InterestModal.tsx     # Multi-step lead capture modal (portal)
│   │   │   ├── ParallaxImage.tsx     # GSAP parallax scroll image wrapper
│   │   │   └── RevealText.tsx        # GSAP staggered text reveal by line/word
│   │   └── providers/
│   │       └── SmoothScrollProvider.tsx  # Lenis + GSAP ScrollTrigger sync
│   ├── lib/
│   │   ├── constants.ts              # NAV_ITEMS, DISTANCES, AMENITIES, LEGAL_TEXT, ADDRESS
│   │   ├── leads.ts                  # Zod schemas + submitLead() client helper
│   │   ├── supabase.ts              # Supabase client (service role key)
│   │   └── utils.ts                  # cn() class name merge utility
│   └── fonts/
│       └── InterVariable.woff2       # Inter variable font file
├── public/
│   ├── logos/
│   │   ├── use-moema-branco.svg      # White logo (hero, footer, header transparent)
│   │   ├── use-moema-preto.svg       # Black logo (header scrolled)
│   │   └── Logotipo_preto.svg        # Alternative black logotype
│   ├── videos/
│   │   └── hero.webm                 # Hero background video (autoplay, muted, loop)
│   └── images/
│       ├── amenities/                # Amenity photos (rooftop.webp, academia.webp, etc.)
│       └── residences/               # Residence photos (fachada.webp)
├── scripts/
│   ├── screenshot.mjs                # Full-page screenshot via Playwright
│   └── generate-favicons.mjs         # Favicon generator
├── package.json                      # Dependencies and scripts
├── next.config.ts                    # Image optimization config (Unsplash remote patterns)
├── tsconfig.json                     # TypeScript config (strict, @/* path alias)
├── postcss.config.mjs                # PostCSS with @tailwindcss/postcss plugin
├── eslint.config.mjs                 # ESLint: next/core-web-vitals + next/typescript
├── CLAUDE.md                         # Project documentation for AI assistants
└── use_moema_rag_master_v1.1.md      # Source-of-truth content document (30 chunks)
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and API routes
- Contains: Single page (`page.tsx`), root layout, global CSS, API route, favicons
- Key files: `page.tsx` (section composition order), `layout.tsx` (metadata/font), `globals.css` (entire design system)

**`src/components/sections/`:**
- Purpose: The 8 full-viewport sections that make up the landing page
- Contains: One `.tsx` file per section, ordered by scroll position
- Key files: All 8 section files. Each is self-contained with its own GSAP animations

**`src/components/layout/`:**
- Purpose: Persistent UI elements that stay visible across the page
- Contains: Header (fixed, scroll-aware), Footer (dark theme), MobileMenu (overlay)
- Key files: `Header.tsx` (most complex: scroll state, logo swap, mobile hamburger)

**`src/components/ui/`:**
- Purpose: Reusable presentational components with animation behaviors
- Contains: 6 UI primitives, each wrapping GSAP or Motion functionality
- Key files: `InterestModal.tsx` (most complex: 590 lines, multi-step wizard with portal), `Counter.tsx` (scroll-triggered number animation)

**`src/components/providers/`:**
- Purpose: React context/wrapper providers for global behaviors
- Contains: Only `SmoothScrollProvider.tsx` (Lenis smooth scroll + GSAP sync)
- Key files: `SmoothScrollProvider.tsx` (critical: removing it breaks all ScrollTrigger animations)

**`src/lib/`:**
- Purpose: Shared logic, data, and configuration
- Contains: Constants, Zod schemas, Supabase client, utility functions
- Key files: `constants.ts` (all shared data), `leads.ts` (validation + client-side submit)

**`src/fonts/`:**
- Purpose: Self-hosted font files loaded via next/font/local
- Contains: `InterVariable.woff2` (Inter variable font, the only font)

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: Logos (SVG), hero video (WebM), amenity/residence images (WebP)

**`scripts/`:**
- Purpose: Development/build utility scripts
- Contains: Playwright screenshot script, favicon generator
- Key files: Run via `node scripts/screenshot.mjs`, not through npm scripts

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Single page entry, composes all sections in order
- `src/app/layout.tsx`: Root layout (font, metadata, SmoothScrollProvider wrapper)
- `src/app/api/leads/route.ts`: API endpoint for lead capture

**Configuration:**
- `src/app/globals.css`: Entire design system (colors, typography, effects, utilities)
- `src/lib/constants.ts`: All shared data constants (nav items, distances, amenities, legal text)
- `next.config.ts`: Image optimization settings, Unsplash remote patterns
- `tsconfig.json`: TypeScript strict mode, `@/*` path alias to `./src/*`
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin
- `eslint.config.mjs`: Next.js core web vitals + TypeScript ESLint rules

**Core Logic:**
- `src/lib/leads.ts`: Lead validation schemas (Zod) + `submitLead()` client helper
- `src/lib/supabase.ts`: Supabase client creation (server-side service role key)
- `src/lib/utils.ts`: `cn()` classname merge function
- `src/components/providers/SmoothScrollProvider.tsx`: Lenis + GSAP integration

**Section-Local Data (not in constants.ts):**
- `src/components/sections/ResidencesSection.tsx`: `TYPOLOGIES` array (Studio 20m2, 1 Dorm 35m2, 1 Dorm Plus 42m2, Double Suite 56m2)
- `src/components/sections/InvestmentSection.tsx`: Price per sqm values (14600 use.moema, 20400 market) hardcoded in Counter components
- `src/components/sections/ArchitectureSection.tsx`: `FEATURES` array (4 items) + `GRID_IMAGES` array (3 Unsplash URLs)

## Naming Conventions

**Files:**
- Components: PascalCase with descriptive suffix: `HeroSection.tsx`, `GlassCard.tsx`, `SmoothScrollProvider.tsx`
- Sections always end in `Section`: `LocationSection.tsx`, `ContactSection.tsx`
- Lib files: camelCase: `constants.ts`, `leads.ts`, `supabase.ts`, `utils.ts`
- Config files: lowercase with dots: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`

**Directories:**
- All lowercase: `sections/`, `layout/`, `ui/`, `providers/`, `lib/`, `fonts/`
- Flat structure within directories (no nesting beyond one level)

**Exports:**
- Named exports only (no default exports except `page.tsx`, `layout.tsx`, configs)
- Components export a single function: `export function ComponentName()`
- Constants export individual named values: `export const NAV_ITEMS = ...`

## Import Patterns

**Path Alias:**
- Use `@/*` for all imports from `src/`: `import { Button } from "@/components/ui/Button"`
- Configured in `tsconfig.json`: `"@/*": ["./src/*"]`

**Import Order (observed convention):**
1. React/Next.js imports: `import { useRef } from "react"`, `import Image from "next/image"`
2. Third-party libraries: `import gsap from "gsap"`, `import { motion } from "motion/react"`
3. Internal imports via `@/`: `import { DISTANCES } from "@/lib/constants"`
4. Relative imports (only within same directory): `import { MobileMenu } from "./MobileMenu"`

**GSAP Registration Pattern:**
- Every file using ScrollTrigger repeats: `import { ScrollTrigger } from "gsap/ScrollTrigger"` + `gsap.registerPlugin(ScrollTrigger)`
- This is redundant but harmless; GSAP handles duplicate registrations

## Where to Add New Code

**New Section:**
1. Create `src/components/sections/NewSection.tsx` with the standard section pattern:
   ```tsx
   "use client";
   import { useRef } from "react";
   import gsap from "gsap";
   import { ScrollTrigger } from "gsap/ScrollTrigger";
   import { useGSAP } from "@gsap/react";
   gsap.registerPlugin(ScrollTrigger);
   export function NewSection() {
     const sectionRef = useRef<HTMLElement>(null);
     useGSAP(() => { /* animations */ }, { scope: sectionRef });
     return <section ref={sectionRef} id="anchor-name">...</section>;
   }
   ```
2. Import and place in `src/app/page.tsx` at the desired scroll position
3. If the section needs an anchor link, add to `NAV_ITEMS` in `src/lib/constants.ts`
4. If the section has an "interest" CTA, accept `onInterestClick` prop from `page.tsx`

**New UI Component:**
- Create `src/components/ui/ComponentName.tsx` with `"use client"` directive
- Use named export: `export function ComponentName()`
- Import in consuming section/component via `@/components/ui/ComponentName`

**New Shared Constants:**
- Add to `src/lib/constants.ts` with `export const`
- Use `as const` for readonly arrays/objects

**New API Route:**
- Create directory `src/app/api/route-name/route.ts`
- Export named function for HTTP method: `export async function POST(request: NextRequest)`

**New Utility Function:**
- Add to `src/lib/utils.ts` if general-purpose
- Create new file in `src/lib/` if domain-specific (e.g., `src/lib/formatting.ts`)

**New Design System Token/Class:**
- Add to `src/app/globals.css`:
  - Color tokens inside `@theme inline { }` block
  - Custom utility classes as standalone CSS rules with descriptive comment headers

**New Static Asset:**
- Logos: `public/logos/`
- Images: `public/images/{category}/` (use `.webp` format)
- Videos: `public/videos/`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and dev server cache
- Generated: Yes (by `npm run dev` and `npm run build`)
- Committed: No (gitignored)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by codebase mapping agents)
- Committed: Varies (depends on project policy)

**`scripts/`:**
- Purpose: Development utility scripts (not part of the app)
- Generated: No (manually written)
- Committed: Yes
- Run via: `node scripts/screenshot.mjs`, `node scripts/generate-favicons.mjs`

**`public/images/amenities/` and `public/images/residences/`:**
- Purpose: Local image assets for amenities and residences
- Contains: `.webp` files (rooftop, academia, wellness, coworking, lavanderia, bicicletario, fachada)
- Note: `ArchitectureSection.tsx` still uses Unsplash URLs (`images.unsplash.com`) instead of local files

---

*Structure analysis: 2026-02-27*
