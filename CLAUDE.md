# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspaces

- `apps/web/` → Next.js 16 application (App Router)
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

# Build
npm run build          # all workspaces
npm run build:web
npm run build:studio

# Tests (shared/utils uses Node's built-in test runner)
node --test shared/utils/makeID.test.ts          # single test file
npx tsx --test shared/utils/someFile.test.ts     # if file uses TypeScript features
```

> Turbo equivalents: `turbo run lint typecheck test build` — use these when running the full suite.

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
2. The slug resolves via `getPage()` which dispatches the right GROQ query based on slug
3. `RenderTemplate` HOC inspects `page._type` and renders the matching template component
4. ISR is set to `revalidate = 10` seconds; draft mode bypasses the cache

### GROQ query organization

Queries live in `apps/web/sanity/queries/`:
- `base.ts` — `ALL_PAGES_QUERY` and top-level fetches
- `fragments.ts` — reusable field selections (e.g. `imageFields`, `basePageFields`)
- `pages/` — one file per page type
- `components/` — component-level fragments

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
