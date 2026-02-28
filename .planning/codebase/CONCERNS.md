# Codebase Concerns

**Analysis Date:** 2026-02-27

## Critical Issues

**Two sections defined but not rendered in the page:**
- Issue: `ContactSection` and `ArchitectureSection` exist as fully implemented components but are NOT imported or rendered in `src/app/page.tsx`. The CLAUDE.md documents them as part of the page flow (Hero > Location > Manifesto > Residences > Investment > Amenities > Architecture > Contact), but the actual page only renders Hero, Location, Manifesto, Residences, Investment, and Amenities.
- Files: `src/app/page.tsx`, `src/components/sections/ContactSection.tsx`, `src/components/sections/ArchitectureSection.tsx`
- Impact: Users cannot submit contact forms (the primary lead capture form is missing). The Architecture section with its image grid and features is invisible. The only lead capture currently available is via the `InterestModal` triggered by "Tenho Interesse" buttons.
- Fix approach: Import and render both sections in `src/app/page.tsx` in their documented order. `ArchitectureSection` requires an `onInterestClick` prop. `ContactSection` has no props.

**In-memory rate limiting will not work in serverless:**
- Issue: The rate limiter in `src/app/api/leads/route.ts` uses a `Map` stored in module scope. On Vercel (serverless), each invocation may run in a different function instance, so the rate map is effectively reset constantly and offers no real protection.
- Files: `src/app/api/leads/route.ts` (lines 13-32)
- Impact: Rate limiting is ineffective in production. A malicious actor could flood the leads table with unlimited submissions.
- Fix approach: Use Vercel's `@vercel/kv` or Upstash Redis for distributed rate limiting, or use Supabase RLS policies / database-level constraints to limit inserts by IP or email.

## Tech Debt

| Area | Description | Severity | Effort |
|------|-------------|----------|--------|
| Dead code | `GlassCard`, `RevealText`, `ParallaxImage` UI components are defined but never imported or used anywhere in the codebase | Low | Low |
| Missing sections | `ContactSection` and `ArchitectureSection` not wired into `page.tsx` (see Critical Issues) | High | Low |
| Hardcoded Unsplash URLs | `ArchitectureSection` uses 3 hardcoded Unsplash URLs instead of local images; all other sections now use local webp files | Med | Low |
| Duplicated button patterns | "Tenho Interesse" button is implemented inline 3 times (`LocationSection`, `AmenitiesSection`, `ArchitectureSection`) with identical styles instead of reusing the `Button` component | Low | Low |
| No barrel exports | Each component is imported by full path. No `index.ts` barrel files in `components/sections/`, `components/ui/`, or `components/layout/` | Low | Low |
| Supabase client singleton | `src/lib/supabase.ts` uses non-null assertion (`!`) on env vars without runtime validation. If env vars are missing, the error is a cryptic Supabase client failure rather than a clear message | Med | Low |

**Dead UI Components:**
- Issue: Three UI components exist but are never used anywhere in the codebase
- Files: `src/components/ui/GlassCard.tsx`, `src/components/ui/RevealText.tsx`, `src/components/ui/ParallaxImage.tsx`
- Impact: Increases cognitive load and bundle size (though tree-shaking should eliminate them from production). Creates confusion about what is active.
- Fix approach: Either use them or delete them. If they exist as future utilities, add a comment noting that.

**Hardcoded Unsplash URLs in ArchitectureSection:**
- Issue: `ArchitectureSection` still references 3 external Unsplash URLs while all other sections have migrated to local webp files in `public/images/`
- Files: `src/components/sections/ArchitectureSection.tsx` (lines 18-31)
- Impact: External dependency for rendering, slower load, no offline support, potential broken images if Unsplash changes URL structure. Also means `public/images/architecture/` directory does not exist.
- Fix approach: Download and optimize images as webp, place in `public/images/architecture/`, update `GRID_IMAGES` array to use local paths.

## Security Considerations

**Supabase service role key used server-side (acceptable):**
- Risk: The `SUPABASE_SERVICE_ROLE_KEY` is used correctly in a server-side API route only, never exposed to the client
- Files: `src/lib/supabase.ts`, `src/app/api/leads/route.ts`
- Current mitigation: Key is in `.env.local` (gitignored), only used in server API route
- Recommendations: Confirmed safe. No action needed.

**No CSRF protection on the leads API endpoint:**
- Risk: The `/api/leads` POST endpoint has no CSRF token validation. Any external site could submit forms to this endpoint.
- Files: `src/app/api/leads/route.ts`
- Current mitigation: Zod validation ensures correct payload shape. Rate limiting exists but is ineffective in serverless (see Critical Issues).
- Recommendations: Add origin/referer validation to ensure requests come from the same domain. Consider adding a honeypot field for bot protection.

**No Content Security Policy headers:**
- Risk: No CSP, X-Frame-Options, or other security headers configured. The site could be embedded in iframes on malicious domains.
- Files: No `middleware.ts`, no `next.config.ts` headers configuration
- Current mitigation: None
- Recommendations: Add security headers via `next.config.ts` headers config or a `middleware.ts` file. At minimum: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, basic CSP.

**Zod validation error details exposed to client:**
- Risk: The API route returns `result.error.flatten()` in the 422 response, which may expose internal schema structure to attackers
- Files: `src/app/api/leads/route.ts` (line 63)
- Impact: Low severity -- schema is simple, but it's a best practice to return generic error messages
- Recommendations: Return generic "Dados invalidos" without the `details` field in production

## Performance

**No video fallback or poster image:**
- Problem: The hero section uses `<video autoPlay muted loop playsInline>` with only a webm source. No `<source>` fallback for Safari (which may not support webm), and no `poster` attribute for the loading state.
- Files: `src/components/sections/HeroSection.tsx` (lines 40-50)
- Cause: Single format video, no poster frame
- Improvement path: Add an MP4 fallback `<source>` for Safari compatibility. Add a `poster` attribute with a still frame image for instant visual feedback while the video loads.

**All sections are client components ("use client"):**
- Problem: Every section component is marked `"use client"` even though most of them render static content with GSAP scroll animations. This means the entire page is client-rendered, preventing any server-side rendering benefits.
- Files: All files in `src/components/sections/`, `src/app/page.tsx`
- Cause: GSAP `useGSAP` hook requires client-side rendering
- Improvement path: This is a known trade-off with GSAP-heavy pages. Consider wrapping static content in server components and only making the animation wrappers client components, though this is a significant refactor.

**GSAP registered multiple times:**
- Problem: `gsap.registerPlugin(ScrollTrigger)` is called at module scope in 9 different files. While GSAP handles duplicate registration gracefully, it adds unnecessary module initialization overhead.
- Files: `src/components/sections/HeroSection.tsx`, `LocationSection.tsx`, `ManifestoSection.tsx`, `ResidencesSection.tsx`, `InvestmentSection.tsx`, `AmenitiesSection.tsx`, `ArchitectureSection.tsx`, `src/components/ui/Counter.tsx`, `RevealText.tsx`, `ParallaxImage.tsx`, `src/components/providers/SmoothScrollProvider.tsx`
- Improvement path: Register GSAP plugins once in `SmoothScrollProvider.tsx` or a dedicated `src/lib/gsap.ts` module, then import from there.

**Large amenity images:**
- Problem: Some amenity images are large: `academia.webp` (608KB), `coworking.webp` (764KB). These load in a horizontal scroll section that may not be immediately visible.
- Files: `public/images/amenities/academia.webp`, `public/images/amenities/coworking.webp`
- Improvement path: Compress to target ~100-200KB each, or use Next.js Image component with appropriate `sizes` and `quality` props (already done). Consider `loading="lazy"` if not already applied by Next.js Image defaults.

## Accessibility

**No skip-to-content link:**
- Files: `src/app/layout.tsx`, `src/components/layout/Header.tsx`
- Impact: Keyboard users must tab through the entire header navigation before reaching main content
- Fix: Add a visually hidden skip link as the first focusable element in the layout

**Interactive elements without focus styles:**
- Files: `src/components/sections/LocationSection.tsx` (line 109-114), `src/components/sections/AmenitiesSection.tsx` (line 103-108), `src/components/sections/ArchitectureSection.tsx` (line 145-149)
- Impact: Inline `<button>` elements used for "Tenho Interesse" CTAs have no visible focus indicator. The `focus:outline-none` on form inputs in `InterestModal.tsx` (line 351) and `ContactSection.tsx` (line 43) removes the default focus ring without providing an alternative.
- Fix: Add `focus-visible:ring-2` or similar visible focus states to all interactive elements

**Modal does not trap focus:**
- Files: `src/components/ui/InterestModal.tsx`
- Impact: When the InterestModal is open, users can tab to elements behind the modal overlay. Keyboard navigation escapes the modal boundary.
- Fix: Implement focus trapping using a library like `focus-trap-react` or manual `tabIndex` management. Also set `aria-modal="true"` and `role="dialog"` on the modal container.

**Missing ARIA roles on modal:**
- Files: `src/components/ui/InterestModal.tsx` (line 243-249)
- Impact: Screen readers do not announce the modal as a dialog. The card container lacks `role="dialog"` and `aria-modal="true"`.
- Fix: Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the step title

**MobileMenu does not trap focus:**
- Files: `src/components/layout/MobileMenu.tsx`
- Impact: Same focus trapping issue as the InterestModal. Menu overlay can be escaped via Tab.
- Fix: Add focus trap and `role="dialog"` / `aria-modal="true"`

**Form labels not associated with inputs via htmlFor/id:**
- Files: `src/components/sections/ContactSection.tsx` (lines 95-147)
- Impact: Labels use `<label>` elements but rely on nesting for association. The `InterestModal.tsx` inputs have no visible labels at all (only placeholders).
- Fix: Add `id` attributes to inputs and `htmlFor` to labels. Add visually hidden labels for InterestModal inputs.

**Horizontal scroll section inaccessible via keyboard:**
- Files: `src/components/sections/AmenitiesSection.tsx`
- Impact: The GSAP-powered horizontal scroll section on desktop (lg+) cannot be navigated via keyboard. There are no keyboard controls to scroll horizontally.
- Fix: Add keyboard event handlers or make the section scrollable via standard overflow controls as a fallback

**"Arraste para explorar" misleading instruction:**
- Files: `src/components/sections/AmenitiesSection.tsx` (line 61)
- Impact: Text says "Arraste para explorar" (Drag to explore) but the section is scroll-driven, not drag-driven. Confusing for users.
- Fix: Change to "Role para explorar" (Scroll to explore)

## Missing Pieces

**No error boundary:**
- What's missing: No `error.tsx` file in `src/app/`, no React error boundaries wrapping any components
- Files: `src/app/` (no `error.tsx` exists)
- Impact: Any runtime error in a client component crashes the entire page with a blank screen and no recovery path
- Fix: Create `src/app/error.tsx` with a user-friendly error UI and retry functionality

**No loading state:**
- What's missing: No `loading.tsx` in `src/app/`
- Impact: No visual feedback during route transitions or initial page load
- Fix: Create `src/app/loading.tsx` with a skeleton or spinner

**No 404 page:**
- What's missing: No `not-found.tsx` in `src/app/`
- Impact: Users hitting invalid URLs see the default Next.js 404 page, not a branded experience
- Fix: Create `src/app/not-found.tsx` matching the site's design

**No robots.txt or sitemap:**
- What's missing: No `robots.ts`, `sitemap.ts`, `public/robots.txt`, or `public/sitemap.xml`
- Impact: Search engine crawlers have no guidance, sitemap not provided for indexing
- Fix: Create `src/app/robots.ts` and `src/app/sitemap.ts` using Next.js metadata API

**No structured data (JSON-LD):**
- What's missing: No schema.org structured data for the real estate development
- Files: `src/app/layout.tsx`
- Impact: Search engines cannot understand the page as a real estate listing, missing rich snippet opportunities
- Fix: Add `RealEstateAgent` or `Product` JSON-LD schema to the layout or page

**No Open Graph image:**
- What's missing: The `openGraph` metadata in `src/app/layout.tsx` has no `images` property
- Files: `src/app/layout.tsx` (lines 36-42)
- Impact: Social media shares show no preview image, reducing click-through rates
- Fix: Add an OG image (1200x630px) and reference it in metadata

**No analytics or conversion tracking:**
- What's missing: No Google Analytics, Meta Pixel, or any analytics integration
- Impact: No visibility into traffic, user behavior, or conversion rates for the lead forms
- Fix: Add analytics via `next/script` or a provider component

**No logging beyond console.error:**
- What's missing: Only one `console.error` call in the entire codebase (in the API route). No structured logging, no error reporting service.
- Files: `src/app/api/leads/route.ts` (line 104)
- Impact: Production errors go unnoticed. No alerting when lead capture fails.
- Fix: Integrate an error tracking service (Sentry, LogRocket) or at minimum structured logging

**Zero test files:**
- What's missing: No test files exist anywhere in `src/`. No test runner configured (no jest.config, vitest.config, or playwright.config for app tests).
- Impact: No automated verification of form validation, API route behavior, or component rendering. Changes can break functionality silently.
- Fix: Start with API route unit tests (`src/app/api/leads/route.test.ts`) and Zod schema tests (`src/lib/leads.test.ts`). Add Playwright e2e tests for the lead capture flow.

## Test Coverage Gaps

**Entire codebase is untested:**
- What's not tested: Everything -- API route, Zod schemas, form submission flows, component rendering
- Files: All files in `src/`
- Risk: Any change to the lead capture pipeline (validation, API, Supabase insert) could break without detection. The Zod discriminated union schema and form validation logic are the highest-risk areas.
- Priority: High -- focus on `src/app/api/leads/route.ts` and `src/lib/leads.ts` first

## Dependencies at Risk

**None critical**, but worth noting:

- GSAP free tier licensing: GSAP's "no charge" license requires the project to not be a "tool" or "product" for others. As a marketing landing page, this is fine, but verify if the license terms change.
- `motion` (Framer Motion successor): The project uses the `motion/react` import path which is the current standard, no risk here.

## Improvement Opportunities

**Quick wins (Low effort, high impact):**
1. Wire `ContactSection` and `ArchitectureSection` into `src/app/page.tsx` -- restores the full page flow and primary contact form
2. Add `poster` attribute to hero video for instant visual feedback
3. Create `src/app/error.tsx` with basic error UI
4. Add `role="dialog"` and `aria-modal="true"` to `InterestModal` and `MobileMenu`
5. Add focus-visible styles to all interactive buttons
6. Add OG image to metadata

**Medium effort:**
1. Replace in-memory rate limiter with Redis-based solution (Upstash or Vercel KV)
2. Add security headers via `next.config.ts`
3. Add unit tests for API route and Zod schemas
4. Centralize GSAP plugin registration to one file
5. Create `robots.ts` and `sitemap.ts`
6. Download Architecture section images to local webp files
7. Add focus trapping to modals

**Longer-term:**
1. Add analytics and conversion tracking
2. Add Sentry or similar error monitoring
3. Add e2e tests with Playwright for lead capture flow
4. Consider partial server rendering for static content sections
5. Add structured data (JSON-LD) for SEO

## Scaling Limits

**Supabase leads table:**
- Current capacity: Supabase free tier allows up to 500MB database storage and 50,000 rows
- Limit: At high traffic volumes with no effective rate limiting, the table could fill quickly with spam entries
- Scaling path: Add bot protection (honeypot, reCAPTCHA), fix rate limiting, upgrade Supabase plan if needed

---

*Concerns audit: 2026-02-27*
