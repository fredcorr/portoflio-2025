# Sanity Functions

This directory contains server-side Sanity Functions (Blueprints) that run on Sanity's infrastructure.

## `syndicate-devto`

Automatically syndicates articles to Dev.to when the **"Publish to Dev.to"** toggle is turned on and the article is published. Toggling it off and publishing will unpublish the article on Dev.to.

### Prerequisites

- Node 24+
- `@sanity/blueprints` CLI (installed via root `package.json`)
- A Dev.to API key (generated in Dev.to settings → API Keys)

### Setup

1. **Deploy the blueprint** (must come before setting env vars):

   ```bash
   # Preview first (read-only, provisions nothing)
   npx sanity blueprints plan

   # Apply
   npx sanity blueprints deploy
   ```

   The function is scoped to its own project's datasets automatically — no project ID or dataset configuration is required. To limit it to a single dataset, add `&& sanity::dataset() == "<name>"` to the filter in `sanity.blueprint.ts`.

2. **Set the Dev.to API key as a function environment variable:**

   ```bash
   npx sanity functions env add syndicate-devto DEVTO_KEY <your-devto-api-key>
   ```

   > The syntax is `sanity functions env <add|list|remove> <function-name> <key> <value>`.
   > This only works after the blueprint is deployed (step 1), since the function must exist first.

### Viewing logs

```bash
npx sanity functions logs syndicate-devto
```

### How it works

The function is triggered on `create` and `update` events for `article` documents where `devtoSyndicate == true || defined(devtoArticleId)`. It reconciles the desired state:

| State | Action |
|---|---|
| `devtoSyndicate: true` + no `devtoArticleId` | POST to Dev.to, save URL + ID back to the document |
| `devtoSyndicate: false/unset` + `devtoArticleId` present | PUT to Dev.to to unpublish, unset URL + ID fields |
| Any other state | No-op (prevents infinite loop) |

The patch-back triggers another `update` event, but the reconcile logic is a no-op at that point, so it terminates cleanly.
