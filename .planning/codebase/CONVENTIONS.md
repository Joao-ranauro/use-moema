# Coding Conventions

**Analysis Date:** 2026-02-27

## Naming Patterns

**Files:**
- Components: PascalCase matching the export name (`HeroSection.tsx`, `GlassCard.tsx`, `SmoothScrollProvider.tsx`)
- Libraries/utils: camelCase (`constants.ts`, `utils.ts`, `leads.ts`, `supabase.ts`)
- API routes: `route.ts` inside a named directory (`src/app/api/leads/route.ts`)
- Scripts: kebab-case with `.mjs` extension (`screenshot.mjs`, `generate-favicons.mjs`)
- CSS: `globals.css` (single file for the entire design system)

**Components:**
- Named exports only -- no default exports for components. Example: `export function Button(...)` not `export default function Button`
- Exception: `src/app/page.tsx` and `src/app/layout.tsx` use `export default function` (required by Next.js)
- Component name matches filename exactly: `Button.tsx` exports `Button`, `HeroSection.tsx` exports `HeroSection`

**Functions:**
- camelCase for all functions: `handleClose`, `toggleMotivation`, `isStepValid`, `formatPhone`, `submitLead`
- Event handlers use `handle` or `on` prefix: `handleClose`, `handleNavClick`, `onSubmit`
- Boolean functions use `is` prefix: `isRateLimited`, `isStepValid`

**Variables:**
- camelCase for local variables and state: `scrolled`, `menuOpen`, `sectionRef`, `submitError`
- UPPER_SNAKE_CASE for module-level constants and data arrays: `NAV_ITEMS`, `DISTANCES`, `AMENITIES`, `TYPOLOGIES`, `PAYMENT_FLOW`, `FEATURES`, `GRID_IMAGES`, `BUDGETS`, `MOTIVATIONS`, `STEPS`
- Refs use descriptive name + `Ref` suffix: `sectionRef`, `videoRef`, `trackRef`, `imageWrapperRef`, `counterRef`, `lenisRef`

**Types/Interfaces:**
- PascalCase with descriptive suffix: `ButtonProps`, `HeaderProps`, `InterestModalProps`, `CounterProps`, `FormData`, `SubmitResult`
- Props interfaces named `{ComponentName}Props`
- Use `interface` for component props and object shapes. Use `type` only for Zod-inferred types (`type Lead = z.infer<typeof leadSchema>`)

**CSS Classes (custom):**
- Kebab-case for custom utility classes defined in `globals.css`: `glass`, `glass-strong`, `glass-dark`, `noise`, `noise-strong`, `rule`, `rule-dark`, `btn-mask`, `hover-underline`, `scroll-indicator`
- Typography scale classes prefixed with `text-`: `text-display`, `text-mega`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-caption`
- Animation target classes use short prefixes per section: `m-line`, `m-accent`, `m-body` (ManifestoSection), `dist-item` (LocationSection), `typo-row` (ResidencesSection), `price-block` (InvestmentSection), `arch-img`, `feat-item` (ArchitectureSection), `idh-num` (LocationSection)

## Component Patterns

**Section Components** (`src/components/sections/*.tsx`):
Every section follows this exact structure:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Optional: section-local data as UPPER_SNAKE_CASE const
const TYPOLOGIES = [...];

// Optional: props interface for callback props
interface LocationSectionProps {
  onInterestClick: () => void;
}

export function LocationSection({ onInterestClick }: LocationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      // GSAP animations with ScrollTrigger here
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="localizacao" className="relative bg-white overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-24 md:py-40">
        {/* Section label */}
        <p className="text-caption text-black/25 mb-6">Section Name</p>
        {/* Section title */}
        <h2 className="text-h1 text-black">Title.</h2>
        {/* Content in 12-col grid */}
      </div>
    </section>
  );
}
```

**Key patterns:**
- Every section is `"use client"` -- no server components for sections
- Every section uses `useRef<HTMLElement>(null)` for the root `<section>` element
- Every section calls `gsap.registerPlugin(ScrollTrigger)` at module level
- Every section uses `useGSAP(() => {...}, { scope: sectionRef })` for animation isolation
- Guard clause `if (!sectionRef.current) return;` at the start of every `useGSAP` callback
- Props consist only of callback functions (e.g., `onInterestClick`), never data -- data comes from imports or local constants

**UI Components** (`src/components/ui/*.tsx`):
- Always `"use client"`
- Accept a `className?: string` prop defaulting to `""` for composition
- Use `interface` for props with explicit optional defaults
- Smaller, reusable, animation-aware (use GSAP or Motion)

```tsx
"use client";

import { motion } from "motion/react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}

export function GlassCard({ children, className = "", strong = false }: GlassCardProps) {
  return (
    <motion.div
      className={`rounded-2xl ${strong ? "glass-strong" : "glass"} p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

**Layout Components** (`src/components/layout/*.tsx`):
- `Header.tsx` and `MobileMenu.tsx` are `"use client"` (use hooks and event listeners)
- `Footer.tsx` is a server component (no `"use client"` directive, no hooks)
- Receive callbacks via props (`onInterestClick`, `onNavClick`, `onClose`)

**Provider Components** (`src/components/providers/*.tsx`):
- `"use client"` with `useEffect` for side-effect initialization
- Accept `children: React.ReactNode` and render `<>{children}</>`
- Handle cleanup in `useEffect` return

**State Management:**
- No global state library. State is local via `useState` in components
- Modal state (`interestOpen`) lifted to `src/app/page.tsx` and passed as callbacks (`onInterestClick`, `onClose`)
- Form state managed by `react-hook-form` (`useForm<FormData>()`)
- Scroll state (`scrolled`) local to `Header.tsx`

## Styling Approach

**Methodology:** Tailwind CSS v4 + custom utility classes in `src/app/globals.css`

**No tailwind.config file.** All design tokens defined via `@theme inline` in `globals.css`:
```css
@theme inline {
  --color-steel: #BCBFCC;
  --color-steel-5: rgba(188, 191, 204, 0.05);
  /* ... */
  --font-sans: var(--font-inter);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Container pattern:** Always `max-w-[1400px] mx-auto px-6 md:px-12`

**Grid system:** Use `lg:grid-cols-12` with explicit `lg:col-span-N` divisions:
- 5+7: Location, Residences, Contact
- 6+6: Architecture header
- 7+5: Investment header
- 8+4: Manifesto
- 4+4+4: Footer

**Breakpoints:** Only two: `md:` (768px) and `lg:` (1024px). No `sm:`, `xl:`, or `2xl:`.

**Color opacity:** Use Tailwind's built-in opacity syntax: `text-black/25`, `text-white/40`, `border-white/10`, `bg-white/[0.02]` (bracket syntax for non-standard values).

**Class concatenation:** Use template literals for conditional classes, not `cn()`:
```tsx
// Actual pattern used throughout the codebase
className={`base-classes ${condition ? "active-classes" : "inactive-classes"}`}
```
The `cn()` utility exists in `src/lib/utils.ts` but is not currently used by any component. Prefer template literals for consistency.

**Dark sections:** `bg-black text-white overflow-hidden noise-strong` with subtle radial gradients via inline `bg-[radial-gradient(...)]`.

**Light sections:** `bg-white overflow-hidden` with optional `noise` class.

## Import Organization

**Order (observed consistently across all files):**
1. `"use client"` directive (first line, when needed)
2. React hooks: `import { useRef, useState, useEffect } from "react"`
3. Next.js: `import Image from "next/image"`, `import type { Metadata } from "next"`
4. Third-party libraries: `gsap`, `motion/react`, `react-hook-form`, `zod`, `lenis`
5. Internal absolute imports using `@/` alias: `import { Button } from "@/components/ui/Button"`
6. Relative imports (only for sibling files): `import { MobileMenu } from "./MobileMenu"`

**Path alias:** `@/*` maps to `./src/*` (defined in `tsconfig.json`). Always use `@/` for cross-directory imports.

**Named exports only:** All imports use destructuring. No default import from internal modules.

**GSAP plugin registration:** Always at module level, immediately after imports:
```tsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
```

## Animation Patterns

**Two animation systems coexist:**

**1. GSAP (scroll-driven, complex animations):**
- Used for: scroll-triggered reveals, scrub animations, pinning, counters, stagger sequences
- Always wrapped in `useGSAP(() => {...}, { scope: sectionRef })` for cleanup
- Standard ScrollTrigger config: `toggleActions: "play none none none"` (animate once, no reverse)
- Common start positions: `"top 80%"`, `"top 85%"`, `"top 70%"`, `"top 75%"`
- Common eases: `"power3.out"`, `"power4.out"`, `"power2.out"`
- Target elements via CSS class selectors: `sectionRef.current.querySelectorAll(".dist-item")`
- Scrub animations use `scrub: 1` or `scrub: 1.5`

```tsx
// Standard reveal pattern
gsap.fromTo(
  items,
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: items[0],
      start: "top 85%",
      toggleActions: "play none none none",
    },
  }
);
```

**2. Motion (Framer Motion, mount/unmount, hover, simple viewport):**
- Import from `"motion/react"` (NOT `"framer-motion"`)
- Used for: `whileHover`, `whileInView`, `AnimatePresence` (mount/unmount transitions), `whileTap`
- Standard ease: `[0.16, 1, 0.3, 1]` (expo out curve, matches `--ease-out-expo`)
- Variants pattern for multi-element orchestration:

```tsx
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
```

**3. Lenis (smooth scroll):**
- Global smooth scroll via `SmoothScrollProvider` wrapping the entire app
- Synced with GSAP ScrollTrigger via `lenis.on("scroll", ScrollTrigger.update)`
- Config: `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true`

**Performance patterns:**
- `style={{ willChange: "transform" }}` on heavy animated elements (hero video)
- GSAP `scope` parameter isolates animations per section
- `gsap.matchMedia()` for responsive animations (horizontal scroll only on `lg+`)

## Error Handling

**API route** (`src/app/api/leads/route.ts`):
- Structured JSON error responses with `success: false` and descriptive `error` string
- HTTP status codes used correctly: 400 (bad payload), 422 (validation), 429 (rate limit), 500 (server error)
- Zod `.safeParse()` for validation with `result.error.flatten()` in response
- `try/catch` around `request.json()` for malformed payloads
- Rate limiting errors return Portuguese-language messages
- `console.error` for Supabase insert failures

```tsx
const result = leadSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { success: false, error: "Dados invalidos.", details: result.error.flatten() },
    { status: 422 }
  );
}
```

**Client-side** (`src/lib/leads.ts`):
- `submitLead()` returns `{ success: boolean; error?: string }` -- never throws
- Network errors caught with bare `catch {}` (no error variable)
- Portuguese error messages for user-facing strings
- Fallback error messages: `body?.error || "Erro ao enviar. Tente novamente."`

**Form components:**
- `submitError` state displayed in a colored banner (`text-red-400` or `text-red-500`)
- Loading state via `isSubmitting` boolean disabling the submit button
- Validation errors from `react-hook-form` displayed inline under each field

**GSAP guard pattern:**
- Every `useGSAP` callback starts with `if (!ref.current) return;` to prevent null access

## TypeScript Usage

**Strictness:** `"strict": true` in `tsconfig.json`. Full strict mode enabled.

**Patterns:**
- `interface` for component props and object shapes
- `type` for Zod-inferred types: `type Lead = z.infer<typeof leadSchema>`
- Non-null assertions (`!`) used for env vars: `process.env.SUPABASE_URL!`
- Generic refs: `useRef<HTMLElement>(null)`, `useRef<HTMLDivElement>(null)`, `useRef<HTMLVideoElement>(null)`
- `as const` assertions on static data arrays for literal type inference: `NAV_ITEMS`, `DISTANCES`, `AMENITIES`, `STEPS`, `MOTIVATIONS`, `BUDGETS`
- `Record<string, string>` for key-value maps: `BUDGET_LABELS`
- `Record<string, unknown>` for dynamic insert rows
- `Readonly<{ children: React.ReactNode }>` for layout props (Next.js convention)
- `React.ReactNode` for `children` props

**No custom type files.** All types defined inline or co-located with their usage. No `types/` directory.

**Polymorphic prop pattern:**
```tsx
interface RevealTextProps {
  as?: "h1" | "h2" | "h3" | "p" | "span";  // string union for tag selection
}
// Used as: const Tag = as; <Tag className={...}>
```

## Logging

**Framework:** `console` (native)

**Patterns:**
- `console.error("Supabase insert error:", error)` in API routes for server-side errors
- `console.log` in scripts (`screenshot.mjs`, `generate-favicons.mjs`) for progress output
- No client-side logging in production components

## Comments

**When to comment:**
- Section separators using `/* --- Label --- */` pattern in multi-concern files (e.g., `src/lib/leads.ts`, `src/app/api/leads/route.ts`)
- JSX section markers: `{/* Overlay */}`, `{/* Card */}`, `{/* Desktop Nav */}`, `{/* Footer buttons */}`
- Brief inline comments for non-obvious logic: `// GPU-accelerated counter-scale reveal`
- Reference to RAG chunks in `globals.css`: `/* Liquid Glass (BRD-003) */`

**Comment style:** Use `/* --- Label --- */` as visual separators:
```tsx
/* --- Zod Schemas --- */
/* --- Types --- */
/* --- Client-side submit --- */
```

**No JSDoc/TSDoc.** No documentation comments on functions or interfaces.

## Module Design

**Exports:** Named exports exclusively. One component per file.

**Barrel files:** None. Every import references the specific file path directly:
```tsx
import { Button } from "@/components/ui/Button";
import { HeroSection } from "@/components/sections/HeroSection";
```

**Data co-location:** Section-specific data arrays (e.g., `TYPOLOGIES`, `PAYMENT_FLOW`, `FEATURES`, `GRID_IMAGES`) live in the same file as the section component, above the component definition. Shared data (`NAV_ITEMS`, `DISTANCES`, `AMENITIES`, `LEGAL_TEXT`, `ADDRESS`) lives in `src/lib/constants.ts`.

**Rule of thumb:** If data is used by only one section, define it as a module-level `const` in that section file. If data is used by multiple components, put it in `src/lib/constants.ts`.

## Form Patterns

**Library:** `react-hook-form` (no resolver integration -- validation via register options)

**Registration pattern:**
```tsx
<input
  {...register("name", { required: "Nome e obrigatorio" })}
  placeholder="Nome"
  className={inputClasses}
/>
{errors.name && (
  <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
)}
```

**Submission pattern:**
```tsx
const onSubmit = async (data: FormData) => {
  setSubmitError(null);
  const result = await submitLead({ source: "...", ...data });
  if (result.success) {
    setSubmitted(true);
  } else {
    setSubmitError(result.error ?? "Erro ao enviar.");
  }
};
```

**Two forms exist:**
- `ContactSection.tsx`: Simple linear form (name, email, phone, message)
- `InterestModal.tsx`: Multi-step wizard form (3 steps: contact, motivation, budget) using `createPortal`

## Validation Patterns

**Server-side:** Zod schemas with discriminated union in `src/lib/leads.ts`:
```tsx
export const leadSchema = z.discriminatedUnion("source", [
  contactLeadSchema,
  interestLeadSchema,
]);
```

**Client-side:** `react-hook-form` register options for immediate field validation. Zod schemas exist but are only used server-side in the API route (`leadSchema.safeParse(body)`).

---

*Convention analysis: 2026-02-27*
