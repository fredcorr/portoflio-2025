# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspaces

- `apps/web/` → Next.js application (App Router)
- `apps/studio/` → Sanity Studio v4
- `shared/types/` → Shared TypeScript types (`@portfolio/types`)
- `shared/utils/` → Shared utilities

When editing files under `apps/web/**`, also follow `apps/web/CLAUDE.md`. When editing files under `apps/studio/**`, also follow `apps/studio/CLAUDE.md`.

## Commands

```bash
# Dev servers
npm run dev            # both apps with TUI
npm run dev:web        # Next.js only
npm run dev:studio     # Sanity Studio only

# Quality
npm run lint           # ESLint across all workspaces
npm run format         # Prettier write
npm run format:check   # Prettier check (CI)

# Type checking
turbo run typecheck

# Build
npm run build          # all workspaces
npm run build:web
npm run build:studio

# Tests (shared/utils uses Node's built-in test runner)
node --test shared/utils/makeID.test.ts          # single test file
npx tsx --test shared/utils/someFile.test.ts     # if file uses TypeScript features
```

> Full suite: `turbo run lint typecheck test build`

## Architecture

### Data flow: schema → types → frontend

The Studio schema is the single source of truth. Changes propagate in one direction:

1. **`apps/studio/schemas/`** — defines document and component schemas
2. **`shared/types/`** — TypeScript interfaces that mirror the schema shape, published as `@portfolio/types`
3. **`apps/web/`** — imports from `@portfolio/types` for all CMS-derived data

When a Studio schema changes, update `shared/types/` accordingly. The web app must never define parallel types for CMS shapes.

### Page rendering pipeline

All pages are served through a single catch-all route `apps/web/app/[[...slug]]/page.tsx`:

1. `generateStaticParams()` pre-fetches all page slugs via `ALL_PAGES_QUERY`
2. The slug resolves via `getPage()` which dispatches `PAGE_BY_SLUG_QUERY` using either `client` or `previewClient`
3. `RenderTemplate` inspects `page._type` and renders the matching template component
4. Each template iterates its component array and renders each via `RenderOrganism`, which switches on `component._type`
5. ISR is set to `revalidate = 10` seconds; draft mode bypasses the cache

### Templates vs. organisms

- **Templates** (`apps/web/components/templates/`) — full-page wrappers, one per `PageTypeName`. They receive the whole page document and iterate over the components array.
- **Organisms** (`apps/web/components/organisms/`) — individual CMS-driven sections within a page. Each maps to a `ComponentTypeName`. Every organism must wrap its output in `ComponentLayout` (from `@/components/hoc/ComponentLayout`) to get consistent padding, the 12-column grid, and section ID generation.

### Adding a new organism (cross-cutting checklist)

Adding a component type touches files in every workspace in this order:

1. **`shared/types/base.ts`** — add a value to `ComponentTypeName` enum
2. **`apps/studio/schemas/components/organisms/<name>.ts`** — define the schema; always spread `...componentFields.all` to include the `sectionId` field
3. **`apps/studio/schemas/index.ts`** — import and add to `schemaTypes`
4. **`shared/types/components/<name>.ts`** — define the TypeScript interface; export from `shared/types/components/index.ts`
5. **`apps/web/sanity/queries/components/<name>.ts`** — write the GROQ fragment; compose from `fragments.ts`
6. **`apps/web/components/organisms/<Name>/<Name>.tsx`** — implement the React component using `ComponentLayout`
7. **`apps/web/components/hoc/RenderOrganism.tsx`** — add a `case ComponentTypeName.<Name>:` branch

### GROQ query organization

Queries live in `apps/web/sanity/queries/`:
- `base.ts` — `ALL_PAGES_QUERY`, `PAGE_BY_SLUG_QUERY`, and top-level fetches
- `fragments.ts` — reusable field selections (e.g. `imageFields`, `basePageFields`)
- `pages/` — one file per page type
- `components/` — one file per component type

Always compose from fragments. Never select fields you don't use.

### Draft mode / visual editing

Two Sanity clients are defined in `apps/web/sanity/client.ts`:
- **`client`** — CDN-enabled, `perspective: 'published'`, used for all static/ISR rendering
- **`previewClient`** — no CDN, `perspective: 'drafts'`, stega encoding enabled, token-authenticated

Draft mode is activated via `/api/draft`. When `draftMode().isEnabled`, `getPage()` switches to `previewClient` and the `PreviewBanner` component is rendered above the page.

### Shared types import paths

```ts
import type { BaseDocument } from '@portfolio/types/base'
import type { SanityImage } from '@portfolio/types/sanity'
import type { CmsPages } from '@portfolio/types/pages'
import type { CardComponent } from '@portfolio/types/components/card'
```

The package is a pure TypeScript source package (no build step); `main` and `types` both point to `.ts` files resolved at compile time.

### Studio schema compositions

Reusable field groups live in `apps/studio/schemas/compositions/`:
- `component-fields.ts` — exports `componentFields.all`, which adds the `sectionId` anchor field. Spread into every organism schema.
- `seoFields.ts` — SEO meta fields shared across page schemas.
- `base-document-fields.ts` — fields common to all document types.

### Studio dashboard

Dashboard widgets live in `apps/studio/dashboard/` and are registered in `apps/studio/dashboard/index.ts`. The dashboard tool must remain the first plugin in the Studio config so Studio loads with operational context. Keep widgets lightweight — fetch only what they need.

## General rules

- Prefer the smallest change that solves the problem
- Never introduce `any` — TypeScript strict mode is enforced
- Do not import across workspaces using relative paths outside the workspace root
- Do not modify lockfiles unless required
- Do not normalize or reshape CMS data without validating with the user first
- Reusable logic belongs in a `/utils` folder using kebab-case filenames
- Use interfaces over type aliases; enums over union literal types
- Extend interfaces with `Pick` / `Omit` when improving flexibility
- Respect semantic HTML and WCAG AA accessibility by default
