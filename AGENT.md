# Monorepo Agent Rules

This repository is a Turbo monorepo.

## Workspaces

- `web/` → Next.js application
- `studio/` → Sanity Studio

## Agent routing

- When editing files under `apps/web/**`, also follow `apps/web/AGENT.md`
- When editing files under `apps/studio/**`, also follow `apps/studio/AGENT.md`
- Always follow the rules in this file first, then workspace rules, then `AGENTS.md`

## General development rules

- Prefer the smallest change that solves the problem
- Do not introduce new dependencies without clear justification
- Do not modify lockfiles unless required
- Keep TypeScript strict — never introduce `any`
- Ensure all new files are tracked by git
- Respect HTML syntax and semantic structure
- Respect AA accessibility requirements by default
- Follow React and general frontend best practices
- Do not normalize or reshape data unnecessarily; validate with the user before doing so

## Monorepo boundaries

- Do not import across workspaces using relative paths outside the workspace root
- Shared types belong in shared locations (see workspace rules)
- Reusable logic belongs in a `/utils` folder using kebab-case filenames

## Turbo commands

- Dev Next app: `turbo run dev --filter=web`
- Dev Sanity Studio: `turbo run dev --filter=studio`
- Lint / typecheck / test / build:
  `turbo run lint typecheck test build`

## Testing

- When adding new components or logic, add appropriate unit tests
- Keep mocks in dedicated `mocks/` folders following atomic structure when relevant

## Code style

- Use interfaces over type aliases
- Use enums over union literal types when appropriate
- Extend interfaces using `Pick` or `Omit` when improving flexibility
