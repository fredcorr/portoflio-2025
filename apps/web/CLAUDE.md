# Next.js App Agent Rules

This workspace is a Next.js application using the App Router (`app/`).

## Design-to-code workflow (read this before implementing any design)

When you are handed a design — a Figma URL/node, a "Claude Design"/Vercel import, a screenshot, or a written spec — **do not start writing JSX.** Drift starts here. Follow this order every time:

1. **Pull the real source.** If a Figma node/URL is referenced, read it with the Figma MCP (`get_design_context`, `get_variable_defs`, `get_screenshot`) before implementing. Don't reconstruct a design from memory or a thumbnail. Respect Figma variants and annotations tagged `development`.
2. **Map the design onto what already exists — before creating anything.** For every element in the design, find the existing token / atom / molecule it corresponds to (see inventories below). Reuse beats re-invent. Creating a new primitive is the exception, not the default, and only when it is genuinely reusable across the design system.
3. **Translate raw design values into tokens.** A design will give you hex colors, px sizes, and font names. Never paste those literally. Convert every one to its token (`bg-primary-400`, `text-heading-1`, `font-heading`, `text-accent-lavender`). If a value has no matching token, ask before introducing a new one — do not hardcode it.
4. **Implement using the established conventions** (organism → `ComponentLayout`, etc. — see Architecture in the root `CLAUDE.md`).

### Non-negotiables (the two most common corrections)

- **Tokens, never raw values.** No `#1f1e1e`, no `text-[64px]`, no `font-['Play']`. If you're typing a hex code or an arbitrary `[...]` Tailwind value for color/typography, stop — there is almost certainly a token for it. Tokens carry light/dark mode automatically; raw values break dark mode.
- **Reuse primitives, never re-invent.** Before writing a heading, image, icon, input, card, etc., check the inventory below and use the existing component. Do not create a parallel `<h2 className=...>` when `Heading` exists, a bare `<img>`/`next/image` when `Image` exists, or an inline SVG when `Icon` exists.

## Design tokens

**`app/globals.css` is the single source of truth for every color and type token. Read the `@theme` blocks there before styling — that file is the list, this doc does not copy it.**

How they map: a CSS token becomes a Tailwind utility by dropping the `--color-` / `--text-` / `--font-` prefix — e.g. `--color-primary-400` → `bg-primary-400` / `text-primary-400`, `--text-heading-1` → `text-heading-1`, `--font-heading` → `font-heading`. Colors have light/dark values applied at runtime, so using the token gives you dark mode for free; type tokens ship their own clamp + line-height, so don't re-specify font-size/leading by hand.

If a design needs a color or size that isn't defined in `globals.css`, surface it to the user — don't silently hardcode a raw hex/px value.

## Reusing components (discover, don't trust a list)

There is intentionally no hand-maintained component list here — it would drift. The source of truth is the code itself. Atomic structure is `atoms → molecules → organisms`.

Before building any UI, discover what already exists:

1. **What exists** → one folder per component in `components/atoms/`, `components/molecules/`, `components/organisms/`. List them.
2. **What it does / its props** → open the candidate component file. The props and implementation are the real API — read them before using a component, or before concluding none fits and creating a new one.
3. **Organisms specifically** are CMS-driven and have a canonical set: the `ComponentTypeName` enum in `shared/types/base.ts` (each value has a Sanity schema + a folder here). That enum, not a list, is the authoritative roster. Adding one is the cross-workspace checklist in the root `CLAUDE.md`.

Only create a new atom/molecule when nothing existing fits and it's genuinely reusable across the design system.

`cn` (`@/utils/cn`) is the className-merging helper — use it instead of manual template strings.

## Component architecture

- Use the shared component types defined under `shared/types/components`
- Reuse existing atoms before creating new ones
- Create new atoms or molecules only when they are reusable across the design system
- Follow the established atomic structure: atoms → molecules → organisms
- Every organism wraps its output in `ComponentLayout` (from `@/components/hoc/ComponentLayout`) for padding, the 12-column grid, and section ID generation

## App Router conventions

- Use `app/` routing conventions (segments, route groups, dynamic segments)
- Prefer Server Components by default
- Use Client Components only when required (stateful UI, effects, browser APIs, event-heavy interactivity)
- Keep server-only logic out of Client Components
- For data fetching:
  - Fetch in Server Components when possible
  - Prefer colocated fetch helpers in `lib/` or `services/` (if present) over ad-hoc fetches
- For route handlers:
  - Use `app/api/**/route.ts` and keep handlers small
  - Validate inputs and return typed responses
- Metadata:
  - Prefer `generateMetadata` for dynamic metadata
  - Keep metadata logic server-side
- Loading / error / not-found:
  - Use `loading.tsx`, `error.tsx`, `not-found.tsx` where appropriate
  - Avoid client-side fetching inside `not-found.tsx` unless explicitly required

## React / Next.js rules

- Always use default export for the main component
- Follow React best practices
- Ensure components respect Figma variants and annotations tagged `development`

## TypeScript rules

- Never use `any`
- Use interfaces rather than type aliases
- Use enums instead of union literal types where appropriate
- Extend interfaces using `Pick`/`Omit` where it improves flexibility
- When creating new shared types, check `studio/` to ensure reuse of existing schema-derived types

## Styling & accessibility

- Use TailwindCSS best practices
- Style with design tokens, not raw values — see "Design tokens" above. Arbitrary `[...]` values for color/spacing/type are a smell; reach for the token first
- Use `cn` (`@/utils/cn`) to compose conditional classes
- Respect semantic HTML
- Meet WCAG AA accessibility by default

## Logic & utilities

- Reusable logic must be extracted into `/utils`
- Utility filenames must use kebab-case
- Follow ESLint rules for conditional rendering in JSX

## Testing

- Run tests with `npm run test`. They use Node's built-in runner via `tsx`; component tests render through `react-dom/server`'s `renderToStaticMarkup`, so no DOM/jsdom is needed. The runner globs `**/*.test.ts` and `**/*.test.tsx`. The suite is green — keep it that way.
- `test-utils/ignore-assets.cjs` stubs CSS/asset imports (`import './x.css'`). The bundler handles those in the real app, but the Node test runner can't execute them, so any component that imports CSS (e.g. via `highlight.js` or `swiper`) would otherwise crash the runner.
- For **async Server Components that read from Sanity** (e.g. anything calling `getSettings()`), stub `client.fetch`, `await` the component to resolve its element, then `renderToStaticMarkup` it — see `components/organisms/HomePageHero/HomePageHero.test.tsx`.
- Write a unit test for each new component
- If mock data is required:
  - Store it under `mocks/`
  - Follow atomic folder structure: `atoms/`, `molecules/`, `organisms/`

## Data handling

- Avoid normalizing or restructuring data unless strictly necessary
- If normalization seems required, validate approach with the user before implementing
