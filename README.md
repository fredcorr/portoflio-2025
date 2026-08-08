# Portfolio 2025

A high-performance monorepo portfolio project powered by Turborepo with Sanity CMS and Next.js.

## Project Structure

```
portfolio-2025/
├── apps/
│   ├── studio/       # Sanity Studio (CMS)
│   └── web/          # Web application (to be set up)
├── shared/
│   ├── config/       # Shared configuration files
│   │   ├── .prettierrc.json
│   │   └── .prettierignore
│   └── types/        # Shared TypeScript types
│       ├── index.ts
│       └── sanity.ts
└── package.json      # Root workspace configuration
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

This monorepo uses a hierarchical environment variable structure with shared and app-specific variables.

#### Structure
```
Portfolio-2025/
├── .env                          # Shared, environment-independent (gitignored)
├── .env.example
├── .env.develop                  # develop-only overrides (gitignored)
├── .env.develop.example
├── .env.prod                     # prod-only overrides (gitignored)
├── .env.prod.example
├── scripts/
│   └── with-env.mjs              # Picks a dataset and runs the command
└── apps/
    ├── web/
    │   ├── .env                  # Optional web-only overrides (gitignored)
    │   └── .env.example
    └── studio/
        ├── .env                  # Optional studio-only overrides (gitignored)
        └── .env.example
```

#### Initial Setup

**1. Create the root `.env` — shared values that don't change per environment:**
```bash
cp .env.example .env
```
```bash
# .env
SANITY_PROJECT_ID=your-actual-project-id
SANITY_API_READ_TOKEN=your-read-token
SANITY_STUDIO_PREVIEW_SECRET=your-secret-string
SANITY_STUDIO_HOST=your-studio.sanity.studio
```

**2. Create the per-dataset overrides — values that *do* change per environment:**
```bash
cp .env.develop.example .env.develop
cp .env.prod.example .env.prod
```

Both are gitignored. Keep them small: preview URLs, `SITE_URL`, `ALLOW_CRAWLERS`
— anything else belongs in the root `.env`.

#### How It Works

`scripts/with-env.mjs` is the single entry point for local runs. Given a
dataset name it:

1. loads the root `.env`, then layers `.env.<dataset>` on top;
2. forces `SANITY_DATASET` **and** `SANITY_STUDIO_DATASET` to that dataset;
3. derives `SANITY_STUDIO_PROJECT_ID` from `SANITY_PROJECT_ID` — Vite only
   exposes `SANITY_STUDIO_`-prefixed vars to the Studio bundle, which is why
   the same value has to exist under two names;
4. spawns the command with that environment.

Real environment variables always beat the files, so cloud builds — which
inject their own env and never call this script — are unaffected.

You therefore define the project ID once, and never type a dataset name into
an env file at all.

### 3. Run Development Server

```bash
# Start all apps against the develop dataset (the default)
npm run dev

# Start all apps against the prod dataset
npm run dev:prod

# Or start individual apps (develop)
npm run dev:web      # Web app only
npm run dev:studio   # Studio only
```

The Studio serves **both** datasets at once — `http://localhost:3333/develop`
and `/prod` — so `dev:prod` mainly changes which dataset the *web app* reads.

## Workspaces

This project uses npm workspaces with Turborepo to manage the monorepo:

- **apps/studio**: Sanity Studio with TypeScript support
- **apps/web**: Next.js web application with Tailwind CSS
- **shared/types**: Shared TypeScript types used across all apps
- **shared/config**: Shared configuration files (Prettier, etc.)

## Turborepo

This monorepo uses [Turborepo](https://turbo.build/repo) for:
- **Parallel execution**: Run tasks across multiple apps simultaneously
- **Smart caching**: Cache build outputs to speed up subsequent builds
- **Task orchestration**: Manage dependencies between tasks automatically

## Shared Configuration

### Prettier

The project uses a shared Prettier configuration located in `shared/config/.prettierrc.json`. All apps reference this configuration.

Format code:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

### TypeScript Types

Shared TypeScript types are maintained in `shared/types/` and can be imported using the `@portfolio/types` package name in any workspace.

## Development

### Run All Apps
- **Start all apps (develop)**: `npm run dev`
- **Start all apps (prod)**: `npm run dev:prod`
- **Build all apps locally**: `npm run build:local` / `npm run build:local:prod`

### Run Individual Apps
- **Start web app**: `npm run dev:web`
- **Start Sanity Studio**: `npm run dev:studio`
- **Build web app**: `npm run build:web`
- **Build Sanity Studio**: `npm run build:studio`

> `build`, `build:web` and `build:studio` do **not** load `.env` files — they
> expect env vars to already be present, as they are on Vercel. Use the
> `build:local*` variants when building on your machine.

### Code Quality
- **Lint all apps**: `npm run lint`
- **Format all files**: `npm run format`
- **Check formatting**: `npm run format:check`

### Turbo Commands
You can also use turbo directly for more control:
```bash
# Run with filtered packages
npx turbo run build --filter=web
npx turbo run dev --filter=studio

# Clear turbo cache
npx turbo clean

# View task graph
npx turbo run build --graph
```

## Environment Variables

### Adding New Variables

**Never add a variable to `turbo.json` → `globalEnv`.** It is deliberately
empty: a global entry busts *every* package's build cache, so rotating a
Studio secret would needlessly rebuild the web app. Add it to the `env` array
of the package that actually reads it.

```jsonc
// turbo.json
"web#build":    { "env": ["MY_NEW_WEB_VAR"] },    // only busts the web cache
"studio#build": { "env": ["MY_NEW_STUDIO_VAR"] }  // only busts the studio cache
```

1. Add the variable to root `.env` and `.env.example` (or to
   `.env.<dataset>.example` if its value differs per environment).
2. Add it to the correct `web#build` / `studio#build` `env` array.
3. Add it to the hosting provider for each environment that needs it.

`dev`, `lint`, `typecheck` and `test` tasks don't need entries — `dev` is
uncached and the others don't vary by env var.

### Variable Naming Conventions

- **Next.js (web app)**: all Sanity access is server-side, so use unprefixed
  names. `NEXT_PUBLIC_` is only for values that genuinely must reach the
  browser (currently the GTM ID, contact email and reCAPTCHA site key).
  ```typescript
  const projectId = process.env.SANITY_PROJECT_ID   // server-side only
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID      // shipped to the browser
  ```

- **Sanity Studio**: must use the `SANITY_STUDIO_` prefix — Vite strips
  anything else out of the bundle.
  ```typescript
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID
  ```

### Troubleshooting

**Variables not loading?**
1. Restart dev server (`npm run dev`)
2. Check variable names match exactly (case-sensitive)
3. Verify `.env` files exist in correct locations
4. Ensure no spaces around `=` in `.env` files

**Need different values per app?**
- Override shared variables in app-specific `.env` files
- App-specific values take precedence over root values

**Studio says "Missing SANITY_STUDIO_PROJECT_ID"?**
You started it without the wrapper (e.g. bare `turbo run dev`). Use
`npm run dev` / `npm run dev:studio`, or set `SANITY_STUDIO_PROJECT_ID`
yourself.

**Web build fails with `Unknown SANITY_DATASET "…"`?**
The dataset name is validated against the `SanityDataset` enum in
`shared/types/base.ts`. Fix the typo, or add the dataset to that enum if it is
genuinely new (see _Adding a dataset_ below).

## Environments & datasets

The Sanity project has two datasets. Schema and code are shared; only content
differs.

| | `develop` | `prod` |
| --- | --- | --- |
| Purpose | Working dataset — drafts, experiments, schema changes | Content behind the live site |
| Web (`SANITY_DATASET`) | Local dev, Vercel Preview + Development | Vercel Production |
| Studio | `/develop` workspace | `/prod` workspace |
| Sanity CLI | Default target | Requires an explicit `--dataset prod` |
| Safe to break? | Yes | No — export a backup first |

**Where dataset names live.** Exactly one place: the `SanityDataset` enum in
`shared/types/base.ts`. `apps/studio/sanity.config.ts` builds one workspace per
value, and `apps/web/sanity/client.ts` validates `SANITY_DATASET` against it.
The only duplicate is the `DATASETS` array in `scripts/with-env.mjs`, which is
plain ESM and cannot import a TypeScript enum — it carries a comment saying so.

**Studio workspaces.** `sanity.config.ts` exports an array of two workspaces
rather than a single config, so one deployed Studio serves both datasets and
you switch with the workspace picker. URLs are namespaced accordingly
(`/develop/structure`, `/prod/structure`); `/` redirects to `develop`.

**Sanity Functions.** `sanity.blueprint.ts` deploys project-wide, not
per-dataset. The `syndicate-devto` filter is therefore scoped with
`sanity::dataset() == "prod"` — without that, publishing the same article in
both datasets would post to Dev.to twice. Any new function needs the same
guard.

### Adding a dataset

1. Create it: `npx sanity dataset create <name>`
2. Add a value to `SanityDataset` in `shared/types/base.ts`
3. Add the name to `DATASETS` in `scripts/with-env.mjs`
4. Add a workspace to `apps/studio/sanity.config.ts`
5. Add `.env.<name>.example`, and the gitignore entry for `.env.<name>`
6. Add `dev:<name>` / `build:local:<name>` scripts to the root `package.json`

## Migrating between datasets

### What actually gets promoted

The schema lives in code (`apps/studio/schemas/`), not in the dataset — so
"promoting a schema to prod" means deploying the same Studio build and pointing
the web app at the other dataset. There is no schema to copy between datasets.

Two things *are* stored per dataset and do need promoting:

- **Content** — documents and assets.
- **The schema manifest** — the JSON description of your types that Sanity's
  schema-aware tooling (Presentation, agent actions, the MCP server) reads.
  Deployed with `sanity schema deploy`, per dataset.

### Order of operations

Run every step against `develop` first, verify, then repeat against `prod`.

1. **Change the schema.** Follow the cross-workspace checklist in `CLAUDE.md`:
   `ComponentTypeName` enum → Studio schema → `shared/types` → GROQ fragment →
   organism → `RenderOrganism` case.
2. **Verify on develop:** `npm run dev`, then
   `turbo run lint typecheck build`.
3. **Migrate develop's content** if the change is not backwards compatible
   (renamed or removed fields) — see _Content migrations_ below.
4. **Back up prod:** `npx sanity dataset export prod ./backup-<date>.tar.gz`
5. **Deploy the Studio:** `npm run build:studio && npx sanity deploy`
   (from `apps/studio`). One deploy covers both workspaces.
6. **Deploy the schema manifest to prod:**
   `npx sanity schema deploy --workspace prod --dataset prod`
7. **Run the same content migration against prod** (dry run first).
8. **Deploy the web app** with `SANITY_DATASET=prod`.
9. **Deploy functions** if `sanity.blueprint.ts` changed:
   `npx sanity blueprints deploy`

### Seeding prod from develop

`prod` starts empty. To copy develop's content into it the first time — run
from `apps/studio`:

```bash
npx sanity dataset export develop ./develop.tar.gz
npx sanity dataset import ./develop.tar.gz prod --replace
```

`--replace` overwrites documents with matching IDs. **Only use it for the
initial seed.** For subsequent top-ups use `--missing`, which adds documents
that don't exist in the target and leaves existing ones alone:

```bash
npx sanity dataset import ./develop.tar.gz prod --missing
```

Exports include assets by default; add `--no-assets` for a documents-only
export when you just want to compare shapes.

Verify afterwards:
```bash
npx sanity documents query 'count(*[!(_id in path("_.**"))])' --dataset prod
```

### Content migrations

For field renames, type changes or backfills — anything that transforms
existing documents — use the migration tooling rather than export/import:

```bash
npx sanity migration create rename-hero-field   # scaffolds under migrations/
npx sanity migration run rename-hero-field --dataset develop            # dry run
npx sanity migration run rename-hero-field --dataset develop --no-dry-run
npx sanity migration run rename-hero-field --dataset prod               # dry run
npx sanity migration run rename-hero-field --dataset prod --no-dry-run
```

`migration run` is a dry run unless you pass `--no-dry-run`. Read the dry-run
diff before committing to prod.

### Rules of thumb

- `develop` is the only dataset safe to experiment in.
- Never `import --replace` into prod after the initial seed — it will
  overwrite live content.
- Export prod before any destructive migration.
- The CLI defaults to `develop` (`apps/studio/sanity.cli.ts`), so a forgotten
  `--dataset` flag is harmless. Pass `--dataset prod` deliberately.

### CORS

Visual editing needs each site origin registered on the project:

```bash
npx sanity cors add https://your-domain.com --credentials
npx sanity cors list
```

### Making a dataset private

Both datasets are currently **public**, which means anyone who knows the
project ID can read published documents through the API. To close that:

```bash
npx sanity dataset visibility set prod private
```

Before you do, know what changes:

- `SANITY_API_READ_TOKEN` stops being optional. `apps/web/sanity/client.ts`
  currently only logs a warning when it is missing — change that to a `throw`,
  and make sure the token is set in **every** environment, including Vercel
  Preview, or those deployments will render empty.
- **Assets stay public.** Images and files served from `cdn.sanity.io` remain
  reachable by URL regardless of the dataset's ACL. A private dataset protects
  document data, not uploaded media.
- Anything else reading the dataset unauthenticated (external scripts,
  webhooks, third-party tools) breaks and needs a token.

## Deployment

### Build Commands

The project has different build commands for local vs cloud deployments:

**Local builds** (load `.env` + `.env.<dataset>` via `scripts/with-env.mjs`):
```bash
npm run build:local        # Builds all apps against the develop dataset
npm run build:local:prod   # Builds all apps against the prod dataset
```

**Cloud builds** (env vars injected by the provider — no wrapper script):
```bash
npm run build              # Builds all apps
npm run build:web          # Web app only
npm run build:studio       # Studio only
```

Because cloud builds bypass `scripts/with-env.mjs`, the provider must set the
`SANITY_STUDIO_*` names directly — they are not derived for you there.

### Deploying to Vercel

#### 1. Configure Project Settings

**For the Web App:**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && npx turbo run build --filter=web`
- **Output Directory**: `.next` (default)

**For Sanity Studio** (if deploying separately):
- **Framework Preset**: Other
- **Root Directory**: `apps/studio`
- **Build Command**: `cd ../.. && npx turbo run build --filter=studio`
- **Output Directory**: `dist`

#### 2. Environment Variables

Set these in Vercel's project settings → Environment Variables. **`SANITY_DATASET`
is what separates the environments — scope it per Vercel environment:**

| Variable | Production | Preview & Development |
| --- | --- | --- |
| `SANITY_DATASET` | `prod` | `develop` |
| `SITE_URL` | `https://your-domain.com` | preview URL |
| `ALLOW_CRAWLERS` | `true` | `false` |

Applied to all environments:

```bash
# Web app
SANITY_PROJECT_ID=your-project-id
SANITY_API_READ_TOKEN=your-read-token
SANITY_STUDIO_PREVIEW_SECRET=your-preview-secret
SANITY_STUDIO_URL=https://your-studio.sanity.studio

# Studio (must be set under the SANITY_STUDIO_ names — cloud builds do not
# run scripts/with-env.mjs, so nothing derives them from SANITY_*)
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_HOST=your-production-studio-url
SANITY_STUDIO_PREVIEW_URL=https://preview.your-domain.com
SANITY_STUDIO_PREVIEW_URL_PROD=https://your-domain.com
```

The Studio no longer needs `SANITY_STUDIO_DATASET` at build time — datasets are
declared per workspace in `sanity.config.ts`. It is still read by the Sanity
CLI as the default target for commands like `dataset export`.

**Important**: `SANITY_DATASET` is listed in `turbo.json` → `web#build.env`, so
changing it produces a different task hash. A dataset switch can never serve a
stale cached build.

### Deploying to Other Providers

**Netlify:**
- Build command: `cd ../.. && npx turbo run build --filter=web`
- Publish directory: `apps/web/.next`
- Set the same environment variables in Netlify's UI

**Cloudflare Pages:**
- Build command: `cd ../.. && npx turbo run build --filter=web`
- Build output directory: `apps/web/.next`
- Add environment variables in Pages settings

### Monorepo Considerations

- ✅ **Build from root**: Always run `cd ../..` before build commands to ensure proper workspace resolution
- ✅ **Install at root**: Cloud providers should run `npm install` at the repository root
- ✅ **Turborepo caching**: Vercel automatically detects and uses Turbo's remote caching
- ✅ **No .env needed**: Production builds use provider-injected environment variables

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
