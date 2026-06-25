# Sanity Functions

This directory contains server-side Sanity Functions (Blueprints) that run on Sanity's infrastructure.

## `syndicate-devto`

Automatically syndicates articles to Dev.to when the **"Publish to Dev.to"** toggle is turned on and the article is published. Toggling it off and publishing will unpublish the article on Dev.to.

### Prerequisites

- Node 24+
- A Dev.to API key (generated in Dev.to settings → API Keys)

> **Run every command below from the repo root** (next to `sanity.blueprint.ts`
> and `package-lock.json`) — never from inside `apps/studio`.

**Dependencies are project-level.** `@sanity/client` and `@sanity/functions` are
declared in the **root** `package.json` (this is an npm workspace, so the
function resolves them from the root install). Do **not** add a per-function
`package.json` — mixing function-level and project-level deps breaks the deploy.

### Setup

1. **Deploy the blueprint** (must come before setting env vars):

   ```bash
   # Preview first (read-only, provisions nothing)
   npx sanity blueprints plan

   # Apply
   npx sanity blueprints deploy
   ```

   Project/dataset are resolved from the `.sanity/` stack config created by
   `blueprints init` — no env setup needed for deploy. The function is scoped to
   its own project's datasets automatically; to limit it to one dataset, add
   `&& sanity::dataset() == "<name>"` to the filter in `sanity.blueprint.ts`.

2. **Set the Dev.to API key as a function environment variable:**

   ```bash
   npx sanity functions env add syndicate-devto DEVTO_KEY <your-devto-api-key>
   ```

   > The syntax is `sanity functions env <add|list|remove> <function-name> <key> <value>`.
   > This only works after the blueprint is deployed (step 1), since the function must exist first.

### Local testing

`functions test` is the only command that needs the project/dataset, so pass them
as flags (we deliberately keep no root CLI config). Local runs are
**side-effect-free**: the function logs what it *would* do and skips the real
Dev.to call and the document patch.

```bash
npx sanity functions test syndicate-devto --event update \
  --project-id 4u0p3u30 --dataset develop \
  --data-before '{"_id":"a","_type":"article","devtoSyndicate":false}' \
  --data-after  '{"_id":"a","_type":"article","title":"T","devtoSyndicate":true,"articleContent":[]}'
```

### Viewing logs

```bash
npx sanity functions logs syndicate-devto --watch
```

### How it works

The function is triggered on `create` and `update` events for `article` documents where `devtoSyndicate == true || defined(devtoArticleId)`. It reconciles the desired state:

| State | Action |
|---|---|
| `devtoSyndicate: true` + no `devtoArticleId` | POST to Dev.to, save URL + ID back to the document |
| `devtoSyndicate: false/unset` + `devtoArticleId` present | PUT to Dev.to to unpublish, unset URL + ID fields |
| Any other state | No-op (prevents infinite loop) |

The patch-back triggers another `update` event, but the reconcile logic is a no-op at that point, so it terminates cleanly.
