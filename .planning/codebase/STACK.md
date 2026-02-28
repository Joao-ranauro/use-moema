# Technology Stack

**Analysis Date:** 2026-02-27

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- CSS - Design system and styling (`src/app/globals.css`)

**Secondary:**
- JavaScript (ESM) - Build scripts (`scripts/screenshot.mjs`, `scripts/generate-favicons.mjs`)

## Runtime

**Environment:**
- Node.js 24.13.0
- Browser (client-side React SPA with server-side rendering)

**Package Manager:**
- npm 11.6.2
- Lockfile: `package-lock.json` (present, committed)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework (App Router)
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**CSS:**
- Tailwind CSS 4.1.18 - Utility-first CSS (v4 uses `@theme inline` in `src/app/globals.css`, no `tailwind.config` file)
- PostCSS via `@tailwindcss/postcss` plugin (`postcss.config.mjs`)

**Animation:**
- GSAP 3.14.2 - Scroll-driven animations, counters, pin, scrub
- `@gsap/react` ^2.1.2 - React integration (`useGSAP` hook with `scope`)
- Motion (Framer Motion) 12.34.0 - `whileHover`, `whileInView`, `AnimatePresence`
- Lenis 1.3.17 - Smooth scroll, synced with GSAP ScrollTrigger

**Form:**
- react-hook-form 7.71.1 - Form state management
- Zod 4.3.6 - Schema validation (discriminated union pattern)

**Testing/Dev Tooling:**
- Playwright 1.58.2 - Screenshot generation (not test runner)
- ESLint 9.39.2 - Linting (`eslint-config-next` core-web-vitals + typescript)

**Build/Dev:**
- Next.js built-in bundler (Turbopack in dev, Webpack in production)
- PostCSS (`postcss.config.mjs`)

## Key Dependencies

**Critical (Production):**

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.6 | App Router framework, SSR, API routes, image optimization |
| `react` / `react-dom` | 19.2.3 | UI rendering |
| `@supabase/supabase-js` | 2.97.0 | Supabase client for lead storage (server-side only) |
| `gsap` | 3.14.2 | Scroll-driven animations (ScrollTrigger, scrub, pin) |
| `@gsap/react` | ^2.1.2 | `useGSAP` hook for scoped GSAP animations |
| `motion` | 12.34.0 | Declarative animations (hover, in-view, presence) |
| `lenis` | 1.3.17 | Smooth scrolling synced with GSAP ticker |
| `react-hook-form` | 7.71.1 | Contact form and interest modal form management |
| `zod` | 4.3.6 | Lead data validation (discriminated union schemas) |

**Dev Dependencies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.1.18 | Utility CSS framework (v4, PostCSS plugin) |
| `@tailwindcss/postcss` | ^4 | Tailwind v4 PostCSS integration |
| `typescript` | 5.9.3 | Type checking |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` / `@types/react-dom` | ^19 | React type definitions |
| `eslint` | 9.39.2 | Code linting |
| `eslint-config-next` | 16.1.6 | Next.js ESLint rules (core-web-vitals + TS) |
| `playwright` | 1.58.2 | Browser automation for screenshots |
| `@ffmpeg-installer/ffmpeg` | ^1.1.0 | FFmpeg binary (video processing scripts) |

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2017
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Incremental compilation enabled
- Next.js plugin included

**ESLint (`eslint.config.mjs`):**
- Flat config format (ESLint 9)
- Extends: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

**Next.js (`next.config.ts`):**
- Image optimization: AVIF + WebP formats
- Image cache TTL: 31536000 (1 year)
- Remote image pattern: `images.unsplash.com` (HTTPS)

**PostCSS (`postcss.config.mjs`):**
- Single plugin: `@tailwindcss/postcss`

**Tailwind v4 (`src/app/globals.css`):**
- No `tailwind.config` file - everything via `@theme inline` directive
- Custom colors: white, black, steel (with opacity variants)
- Custom easings: `--ease-out-expo`, `--ease-out-quart`
- Font: `--font-sans` mapped to `--font-inter` (Inter Variable)

**Environment:**
- `.env.local` - Supabase credentials (gitignored)
- Required vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Build & Deploy

**Scripts (`package.json`):**
```bash
npm run dev        # Next.js dev server (localhost:3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

**Utility Scripts:**
```bash
node scripts/screenshot.mjs          # Viewport screenshots (sections)
node scripts/screenshot.mjs full     # Full-page screenshot
node scripts/generate-favicons.mjs   # Generate favicon.ico + apple-icon.png from SVG
```

**Deploy Target:**
- Vercel (auto-deploy from GitHub push)
- Build command auto-detected (`npm run build`)
- Environment variables configured in Vercel dashboard

## Font Strategy

- Single font: Inter Variable (`src/fonts/InterVariable.woff2`)
- Loaded via `next/font/local` in `src/app/layout.tsx`
- CSS variable: `--font-inter`
- Display strategy: `swap`

## Image Strategy

- Remote images from Unsplash via Next.js `<Image>` (configured in `next.config.ts`)
- Local images in `public/images/` (amenities, architecture, neighborhood, residences)
- Formats: AVIF preferred, WebP fallback
- Hero video: `public/videos/hero.webm` (autoplay, muted, loop)
- Logos: SVG in `public/logos/`

## Platform Requirements

**Development:**
- Node.js >= 20 (currently 24.13.0)
- npm (lockfile present)
- `.env.local` with Supabase credentials

**Production:**
- Vercel hosting (serverless functions for API routes)
- Supabase project for lead storage

---

*Stack analysis: 2026-02-27*
