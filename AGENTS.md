# Repository Guidelines

## Project Structure & Module Organization
- Monorepo uses npm workspaces + Turborepo; run commands from the repo root.
- `apps/web`: Next.js 15 (app router) with Tailwind; routes under `app/`, UI in `components/` (atoms/molecules/organisms) with co-located tests.
- `apps/studio`: Sanity Studio; schemas and desk config live here.
- `shared/types`: Canonical TypeScript models exposed via the `@portfolio/types` path alias. `shared/config/.prettierrc.json` holds shared formatting defaults.
- Environment templates: `.env.example` at root; optional `apps/*/.env.example` when an app needs overrides.

## Build, Test, and Development Commands
- `npm run dev` | `npm run dev:web` | `npm run dev:studio` — start all or filtered dev servers through Turbo.
- `npm run build` | `npm run build:web` | `npm run build:studio` — production builds; run from root so workspace resolution works.
- `npm run lint` — Next.js + ESLint across workspaces; `npm run format` / `npm run format:check` for Prettier.
- Tests use Node’s `node:test`; run locally with a TS-capable runner, e.g. `npx tsx --test "apps/web/**/*.{test.ts,test.tsx}"` (install `tsx` if missing) so JSX/TS transpiles cleanly.

## Coding Style & Naming Conventions
- Prettier (see `shared/config/.prettierrc.json`): 2-space indent, single quotes, no semicolons, 80-char width, trailing commas on ES5 targets.
- TypeScript is strict; favor shared types, keep `@portfolio/types` imports for schema-driven props.
- Components/files use PascalCase; hooks/utilities use camelCase; tests mirror the component name (`ComponentName.test.tsx`) next to the source.
- Environment rules: root `.env` is the source of truth; update `.env.example` and `turbo.json` `globalEnv` when adding shared vars; only prefix with `NEXT_PUBLIC_` when browser exposure is required.

## Testing Guidelines
- Fast SSR/unit checks live beside components using `node:test` + `react-dom/server`; keep assertions focused on rendered contracts and fallbacks (e.g., default emails).
- Keep tests deterministic: stub env-dependent branches and avoid network/filesystem access.
- If you add new suites, keep them small and colocated; add any new commands to package scripts once stable.

## Commit & Pull Request Guidelines
- Match the existing log style: `feat: …`, `fix: …`, `chore: …`; short, imperative subjects.
- PRs should include a clear summary, linked issues/tasks, commands run (lint/format/tests), and any environment or content-migration notes.
- Add screenshots/gifs for UI changes in `apps/web`; call out Sanity schema impacts in `apps/studio`.
- Do not commit secrets; rely on `.env.example` and describe required keys in the PR.
