# Testing Patterns

**Analysis Date:** 2026-02-27

## Test Framework

**Runner:** Not configured. No test runner is installed or configured.

**No test framework dependency** in `package.json`. No Jest, Vitest, Mocha, or any other test runner present.

**No test configuration files:** No `jest.config.*`, `vitest.config.*`, or any test-related config exists in the project root.

**Assertion Library:** None installed.

**Run Commands:**
```bash
# No test command exists in package.json scripts
# Only available scripts:
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Test File Organization

**Location:** No test files exist anywhere in the `src/` directory.

**No test files found:**
- No `*.test.ts` or `*.test.tsx` files
- No `*.spec.ts` or `*.spec.tsx` files
- No `__tests__/` directories
- No `test/` or `tests/` directory at project root

## Coverage

**Test Coverage: 0%**

No automated tests exist for any part of the codebase.

**Untested areas (all code):**

| Area | Files | Risk |
|------|-------|------|
| API route (leads) | `src/app/api/leads/route.ts` | **High** -- handles user data, rate limiting, Supabase inserts |
| Lead submission client | `src/lib/leads.ts` | **High** -- form submission, error handling |
| Zod schemas | `src/lib/leads.ts` | **Medium** -- discriminated union validation logic |
| Form components | `src/components/sections/ContactSection.tsx`, `src/components/ui/InterestModal.tsx` | **Medium** -- multi-step wizard, validation, state transitions |
| Utility functions | `src/lib/utils.ts` (`cn()`), `InterestModal.tsx` (`formatPhone()`) | **Low** -- simple pure functions |
| Constants | `src/lib/constants.ts` | **Low** -- static data |
| UI Components | `src/components/ui/*.tsx` | **Low** -- mostly visual/animation |
| Section components | `src/components/sections/*.tsx` | **Low** -- visual/layout, scroll animations |

## Linting as Sole Quality Gate

**ESLint** is the only automated code quality tool:
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Run: `npm run lint` (or `npx eslint`)
- No custom rules added beyond Next.js defaults

**No Prettier** or other formatter configured. Code formatting relies on editor settings.

## CI/CD Testing

**No CI pipeline detected.** No `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, or similar CI config files.

**Deployment:** Vercel auto-deploy from GitHub push. Vercel runs `npm run build` but no test step.

**Build-time checks only:**
- TypeScript type checking (via `next build`)
- ESLint (if configured in Vercel build)
- No pre-commit hooks (`package.json` has no `lint-staged`, `husky`, or `lefthook` configuration)

## Visual Testing

**Screenshot utility** exists but is manual:
- Script: `scripts/screenshot.mjs`
- Uses Playwright (installed as dev dependency) for headless screenshots
- Run: `node scripts/screenshot.mjs` (requires dev server running)
- Outputs to `screenshots/` directory
- Two modes: `full` (full-page screenshot) or `sections` (viewport-by-viewport)
- **Not automated** -- purely manual visual inspection tool, not a visual regression test

## Recommended Test Setup (if adding tests)

Based on the stack (Next.js 16 + React 19 + TypeScript), the recommended setup would be:

**Framework:** Vitest (preferred for Vite-compatible Next.js projects) or Jest with `@testing-library/react`

**Priority files to test first:**
1. `src/app/api/leads/route.ts` -- API route with rate limiting, validation, and database interaction
2. `src/lib/leads.ts` -- Zod schemas and `submitLead()` function
3. `src/lib/utils.ts` -- `cn()` utility function
4. `src/components/ui/InterestModal.tsx` -- `formatPhone()` helper, multi-step form logic

**Test file convention to adopt (matching codebase style):**
- Co-locate tests: `src/lib/leads.test.ts` next to `src/lib/leads.ts`
- Or use `__tests__/` directories: `src/lib/__tests__/leads.test.ts`

## E2E Testing

**Framework:** Playwright is installed (`"playwright": "^1.58.2"` in devDependencies) but only used for the screenshot utility, not for end-to-end tests.

**No Playwright test config** (`playwright.config.ts`) exists. No `e2e/` or `tests/` directory with Playwright test files.

---

*Testing analysis: 2026-02-27*
