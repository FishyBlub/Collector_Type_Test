# CLAUDE.md

This file guides Claude's behavior when working in this codebase. Follow these rules precisely and consistently.

---

## What this project is

**Collector DNA** is a psychological profiling tool for art collectors. Users curate artworks across three conceptual chambers (Hart, Rede, Jacht), score each piece on 7 psychological axes, and receive a personality archetype match from a set of 10 predefined collector profiles. The engine computes Euclidean distances, soft-max distributions, hybrid detection, shadow triggers, and artwork contribution metrics.

This is a **single-page application**. There is no routing — all UI lives on `app/page.tsx`. Three server-only API routes handle PDF extraction, web scraping, and health checks.

---

## Stack

- **Framework:** Next.js 15 (App Router) — single page, no client-side routing
- **Language:** TypeScript 5.8 (strict mode)
- **Styling:** Tailwind CSS v4 with custom `@theme` CSS variables
- **Charts:** Recharts (radar, bar) + custom Canvas (boxplot in `ContributionChart`)
- **State:** React Context (`DNAContext`) + debounced `localStorage` persistence
- **Testing:** Vitest (unit, `environment: node`), Playwright (E2E, not yet written)
- **i18n:** Dutch (nl) primary, English (en), French (fr) fallback

---

## Project structure

```
app/
  page.tsx              ← full app UI (client component)
  layout.tsx            ← root layout, wraps DNAProvider
  globals.css           ← design tokens, @theme variables
  api/
    pdf-extract/route.ts  ← server: PDF → artwork suggestions
    scrape/route.ts       ← server: 2DGalleries URL → artworks
    health/route.ts       ← server: health check

components/             ← one component per file, flat (no feature folders)
  LibraryPanel.tsx      ← artwork input (manual, PDF, scrape) + search
  ChamberPanel.tsx      ← object card grid per chamber
  ObjectCard.tsx        ← artwork card with 7-axis scoring
  ResultsPanel.tsx      ← report container
  RadarChart.tsx        ← 7-axis radar (Recharts)
  MixBars.tsx           ← axis percentage bars
  ContributionChart.tsx ← canvas-based boxplot (custom, not Recharts)
  ProfileCatalog.tsx    ← archetype distribution
  ...

lib/
  DNAContext.tsx        ← global state, localStorage sync, all actions
  engine.ts             ← report generation: averages, ranking, distribution, shadows
  engine.test.ts        ← ~80 unit tests for engine logic
  scraper.ts            ← 2DGalleries HTML parser
  i18n.ts               ← locale-aware text getters
  utils.ts              ← cn(), generateId(), shared CSS helpers
  placeholders.ts       ← default image fallback

constants/              ← immutable domain data, never modify without domain reason
  axes.ts               ← 7 DNA axes (Jager, Estheet, Verwant, etc.)
  archetypes.ts         ← 10 collector archetypes + translations
  chambers.ts           ← 3 chambers (Hart, Rede, Jacht) + translations
  shadows.ts            ← psychological blind-spot rules + translations
  ui-strings.ts         ← full UI text translations (nl/en/fr)
  demo.ts               ← sample artworks + scores for demo mode

types/
  index.ts              ← all shared TypeScript types (30+ types)
  pdf-parse.d.ts        ← type shim for pdf-parse
```

---

## State and data flow

All application state lives in `DNAContext` (`lib/DNAContext.tsx`):

- `artworks` — the collected library
- `entries` — 15 scored slots (5 per chamber × 3 chambers), configurable to 3–5
- `locale` — active language
- `report` — generated analysis output
- `axisVariants` — primary or alternate question per axis

State is session-only — there is no localStorage persistence. Every page load starts from a clean slate. Persistence will be revisited when the UX journey is more mature.

**Data fetching is simple `fetch` + local state.** Do not introduce SWR or React Query — this project explicitly avoids them.

The report is built by `lib/engine.ts`:
1. Compute axis averages across all scored entries
2. Rank archetypes by Euclidean distance (with omnivore penalty)
3. Detect hybrid profiles (margin < 0.4)
4. Soft-max distribution across all 10 archetypes (temperature 0.75)
5. Evaluate shadow trigger rules
6. Derive collector status (spread/intensity rules)
7. Calculate per-artwork contribution metrics

---

## Code quality principles

### Keep it boring

Write code any mid-level developer can read and understand in 30 seconds. Avoid:

- Clever one-liners that sacrifice clarity
- Deep nesting or complex chaining
- Obscure language features or patterns not yet widely adopted
- Abstract factory / decorator / metaprogramming unless the problem genuinely demands it

Prefer **explicit over implicit**. If something needs a comment to be understood, simplify first — comment second.

### TypeScript

- Always strict. Never `any`. Use `unknown` and narrow it.
- All shared types go in `types/index.ts`. Inline only if trivial and local.
- Prefer `type` for unions/intersections, `interface` for object shapes.
- No `as` casts unless absolutely necessary; always add a comment explaining why.
- No enums — use `const` objects with `as const`.

```ts
// Bad
const role: any = getRole();

// Good
const role = getRole() as unknown;
if (role !== 'admin' && role !== 'user') throw new Error('Invalid role');
```

### Functions and components

- One responsibility per function or component. If a function does two things, split it.
- Keep functions under ~40 lines. Extract helpers if longer.
- Name by **what they do or represent**, not how they work.
- No boolean parameters — use option objects or separate functions.

```ts
// Bad
renderButton(true, false, 'Submit');

// Good
renderButton({ label: 'Submit', isLoading: false, isDisabled: true });
```

### Components

- One component per file. Filename matches component name in kebab-case.
- Components live flat in `components/` — no feature subfolders.
- No class components. Function components only.

### Localization

- All user-facing strings come from `constants/ui-strings.ts` via `getUiStrings(locale)`.
- Dutch (`nl`) is the source of truth. Missing `en`/`fr` keys fall back to `nl`.
- Axis, archetype, chamber, and shadow labels have their own translation modules in `constants/`.
- Never hardcode display strings in components.

---

## Styling

- Use **Tailwind CSS v4** utility classes. No custom CSS unless there is no Tailwind equivalent.
- No `style={{}}` inline styles except for dynamic values that cannot be expressed as Tailwind classes (e.g. computed pixel values from JS).
- Mobile-first responsive design. Use `sm:`, `md:`, `lg:` breakpoints intentionally.
- Colors and radii use CSS variables defined in `globals.css` via `@theme`. Do not hardcode color values in components.
- Use `cn()` from `@/lib/utils` for dynamic class composition:

```tsx
import { cn } from '@/lib/utils';

<div
  className={cn(
    'flex items-center gap-4 rounded-lg border p-4',
    isActive && 'border-primary bg-primary/10',
    className
  )}
/>
```

---

## Testing

Testing is not optional. Every feature must ship with tests.

### Unit tests (Vitest)

- Test files colocate next to source: `engine.test.ts` alongside `engine.ts`.
- Vitest runs in `node` environment — no DOM, no React Testing Library.
- Test **behaviour**, not implementation. Do not test internal state or private methods.
- Single, clear assertion focus per test.
- Descriptive names: `it('returns null when user is not authenticated')`.
- Mock external dependencies — never make real network calls in unit tests.
- Target 80%+ coverage on `lib/`. `engine.ts` is the most critical file to cover.

```ts
describe('formatCurrency', () => {
  it('formats positive numbers with EUR symbol', () => {
    expect(formatCurrency(1234.5, 'EUR')).toBe('€1,234.50');
  });
  it('returns "—" for null or undefined input', () => {
    expect(formatCurrency(null, 'EUR')).toBe('—');
  });
});
```

### E2E tests (Playwright)

- E2E tests live in `e2e/` at the project root.
- Test **user journeys**: add artwork → score axes → run analysis → view results.
- Use `data-testid` attributes for selectors. Never select by class or style.
- Avoid brittle waits — use `waitForSelector`, `waitForResponse`, or Playwright's auto-waiting.
- Tests must be idempotent — they should pass whether run once or ten times.

### When to write what

| Scenario | Test type |
|---|---|
| Engine algorithm (averages, ranking, shadows) | Unit (Vitest) |
| Pure utility function | Unit (Vitest) |
| API route | Unit (Vitest, mock external calls) |
| Full user journey (add artwork, score, analyse) | E2E (Playwright) |

---

## Commands

```bash
npm run dev            # dev server on http://localhost:3000
npm run build          # production build
npm start              # start production server
npm run test           # unit tests (single run)
npm run test:watch     # unit tests (watch mode)
npm run test:coverage  # coverage report
npm run test:e2e       # Playwright E2E tests
npm run lint           # Next.js + TypeScript linting
```

---

## What to avoid

- **`var`** — use `const` or `let`
- **Class components** — function components only
- **Barrel file default exports** — named exports only; keep `index.ts` minimal
- **SWR / React Query** — this project uses simple `fetch` + local state
- **`useEffect` for data fetching from external APIs** — use API routes and `fetch`
- **Hardcoded display strings** — all text goes through `getUiStrings(locale)`
- **Hardcoded color values** — use CSS variables from `globals.css`
- **Hardcoded secrets or API keys** — use environment variables
- **`it.skip` or `test.todo`** without a linked issue comment
- **`console.log` in committed code** — remove before committing
- **Premature abstraction** — don't create a generic utility for a pattern that appears once
- **Modifying `constants/`** without a domain reason — these encode the psychological model

---

## When in doubt

- Write the simplest code that solves the problem.
- When choosing between two approaches, pick the one that is easier to delete later.
- Raise uncertainty explicitly — add a `// TODO:` comment or ask.
