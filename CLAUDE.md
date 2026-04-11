# CLAUDE.md

This file guides Claude's behavior when working in this codebase. Follow these rules precisely and consistently.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Language:** TypeScript (strict mode)
- **Testing:** Vitest (unit), Playwright (end-to-end / frontend)

---

## Code Quality Principles

### Keep it boring

Write code that any mid-level developer can read and understand in 30 seconds. Avoid:

- Clever one-liners that sacrifice clarity
- Deep nesting or complex chaining
- Obscure language features or patterns not yet widely adopted
- Abstract factory / decorator / metaprogramming patterns unless the problem genuinely demands it

Prefer **explicit over implicit**. If something needs a comment to be understood, simplify the code first — comment second.

### TypeScript

- Always use strict TypeScript. Never use `any`. Use `unknown` and narrow it.
- Define types and interfaces in a colocated `types.ts` or inline when trivial.
- Prefer `type` for unions/intersections, `interface` for object shapes.
- Do not use `as` casts unless absolutely necessary, and always add a comment explaining why.
- Avoid enums — use `const` objects with `as const` instead.

```ts
// Bad
const role: any = getRole();

// Good
const role = getRole() as unknown;
if (role !== 'admin' && role !== 'user') throw new Error('Invalid role');
```

### Functions and components

- One responsibility per function or component. If a function does two things, split it.
- Keep functions under ~40 lines. If longer, extract helpers.
- Name functions and variables by **what they do or represent**, not how they work.
- Avoid boolean parameters — use option objects or separate functions instead.

```ts
// Bad
renderButton(true, false, 'Submit');

// Good
renderButton({ label: 'Submit', isLoading: false, isDisabled: true });
```

### File and folder structure

Follow Next.js App Router conventions:

```
app/
  (routes)/
    page.tsx
    layout.tsx
  api/
    route.ts
components/
  [feature]/   ← feature-specific components
lib/
  utils.ts
  [domain].ts
hooks/
  use-[name].ts
types/
  index.ts
```

- One component per file. Filename matches the component name in kebab-case.
- Colocate tests next to the file they test: `button.test.ts` lives next to `button.ts`.

---

## Styling

- Use **Tailwind CSS v4** utility classes. Do not write custom CSS unless there is no Tailwind equivalent.
- Do not use `style={{}}` inline styles except for dynamic values that cannot be expressed as Tailwind classes (e.g. computed pixel values from JS).
- Responsive design: mobile-first. Use `sm:`, `md:`, `lg:` breakpoints intentionally.
- Keep class lists readable — break long `className` strings across lines using a `cn()` helper:

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

- Test files live next to the source file: `foo.test.ts` alongside `foo.ts`.
- Test **behaviour**, not implementation. Do not test internal state or private methods.
- Each test should have a single, clear assertion focus.
- Use descriptive test names: `it('returns null when user is not authenticated')`.
- Mock external dependencies (API calls, DB, third-party SDKs) — never make real network calls in unit tests.
- Aim for 80%+ coverage on `lib/` and `hooks/`. Components need at least happy-path + error-state coverage.

```ts
// Good test structure
describe('formatCurrency', () => {
  it('formats positive numbers with EUR symbol', () => {
    expect(formatCurrency(1234.5, 'EUR')).toBe('€1,234.50');
  });

  it('returns "—" for null or undefined input', () => {
    expect(formatCurrency(null, 'EUR')).toBe('—');
  });
});
```

### Frontend / E2E tests (Playwright)

- E2E tests live in `e2e/` at the project root.
- Test **user journeys**, not individual components. Think: "What would a user actually do?"
- Use `data-testid` attributes for selectors. Never select by class or style.
- Avoid brittle waits — use `waitForSelector`, `waitForResponse`, or Playwright's built-in auto-waiting.
- Each test file maps to a user journey or page: `e2e/auth/login.spec.ts`, `e2e/dashboard/overview.spec.ts`.
- Tests must be idempotent — they should pass whether run once or ten times in a row.

```ts
// Good Playwright test
test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill('user@example.com');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByTestId('welcome-message')).toBeVisible();
});
```

### When to write what

| Scenario | Test type |
|---|---|
| Pure utility function | Unit (Vitest) |
| React hook logic | Unit (Vitest + React Testing Library) |
| Component rendering / states | Unit (Vitest + React Testing Library) |
| Full user journey (login, form submit, navigation) | E2E (Playwright) |
| API route | Unit (Vitest, mock DB/external calls) |

---

## What to avoid

These patterns are banned — do not introduce them, do not suggest them:

- **`var`** — use `const` or `let`
- **Class components** — use function components only
- **`defaultExport` from barrel files** — use named exports, keep barrel files (`index.ts`) minimal
- **`useEffect` for data fetching** — use React Server Components, Server Actions, or SWR/React Query
- **Hardcoded secrets or API keys** — always use environment variables
- **Skipping tests** — never use `it.skip` or `test.todo` without a linked issue in the comment
- **`console.log` in committed code** — use a proper logger or remove before committing
- **Premature abstraction** — don't create a generic utility for a pattern that only appears once

---

## When in doubt

- Write the simplest code that solves the problem.
- If you are unsure between two approaches, pick the one that is easier to delete later.
- Raise uncertainty explicitly rather than guessing silently — add a `// TODO:` comment or ask.