# Sanity Functions

This directory contains server-side Sanity Functions (Blueprints) that run on Sanity's infrastructure.

## `syndicate-devto`

Automatically syndicates articles to Dev.to when the **"Publish to Dev.to"** toggle is turned on and the article is published. Toggling it off and publishing will unpublish the article on Dev.to.

### Prerequisites

- Node 24+
- `@sanity/blueprints` CLI (installed via root `package.json`)
- A Dev.to API key (generated in Dev.to settings → API Keys)

### Setup

1. **Set the Dev.to API key as a function environment variable:**

   ```bash
   npx sanity functions env set DEVTO_KEY <your-devto-api-key>
   ```

2. **Configure the blueprint** — edit `sanity.blueprint.ts` at the repo root and set your `projectId` and `dataset`, or set these environment variables before deploying:

   ```bash
   export SANITY_PROJECT_ID=your-project-id
   export SANITY_DATASET=production
   ```

3. **Deploy the blueprint:**

   ```bash
   npx sanity blueprints deploy
   ```

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
