# Next.js App Agent Rules

This workspace is a Next.js application using the App Router (`app/`).

## Component architecture

- Use the shared component types defined under `shared/types/components`
- Reuse existing atoms before creating new ones
- Create new atoms or molecules only when they are reusable across the design system
- Follow the established atomic structure: atoms → molecules → organisms

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
- Respect semantic HTML
- Meet WCAG AA accessibility by default

## Logic & utilities

- Reusable logic must be extracted into `/utils`
- Utility filenames must use kebab-case
- Follow ESLint rules for conditional rendering in JSX

## Testing

- Write a unit test for each new component
- If mock data is required:
  - Store it under `mocks/`
  - Follow atomic folder structure: `atoms/`, `molecules/`, `organisms/`

## Data handling

- Avoid normalizing or restructuring data unless strictly necessary
- If normalization seems required, validate approach with the user before implementing
