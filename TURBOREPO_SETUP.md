# Turborepo Setup

This document describes the Turborepo configuration for this monorepo.

## What's Been Configured

### 1. Turborepo Installation
- Added `turbo@^2.3.3` as a dev dependency
- Added `packageManager` field to package.json for Corepack support

### 2. Configuration Files

#### `turbo.json`
Defines task pipelines and caching strategies:
- **build**: Cached task with dependency on upstream builds
- **dev**: Uncached persistent task for development
- **lint**: Parallel linting across packages
- **format**: Code formatting tasks

#### Root `package.json`
Updated scripts to use Turborepo:
- `npm run dev` - Run all apps in parallel
- `npm run build` - Build all packages
- `npm run dev:web` - Run only web app
- `npm run dev:studio` - Run only studio
- Filter-based commands for granular control

### 3. Workspace Configuration
Three workspaces detected:
- **web**: Next.js application
- **studio**: Sanity Studio CMS
- **@portfolio/types**: Shared TypeScript types

## Key Features

### Parallel Execution
Run multiple tasks simultaneously across workspaces:
```bash
npm run dev  # Runs both studio and web in parallel
```

### Smart Caching
Build outputs are cached. Subsequent builds skip unchanged packages:
```bash
npm run build  # First run builds everything
npm run build  # Second run uses cache for unchanged packages
```

### Task Dependencies
Tasks automatically respect dependencies:
- `@portfolio/types` builds before `web` and `studio`
- Ensures type definitions are available before dependent apps build

### Filtering
Run tasks for specific packages:
```bash
npm run dev:web      # Only web app
npm run build:studio # Only studio
```

## Advanced Usage

### Direct Turbo Commands
```bash
# Run with detailed output
npx turbo run build --verbose

# View task dependency graph
npx turbo run build --graph

# Clear cache
npx turbo clean

# Force execution without cache
npx turbo run build --force

# Run in specific workspaces
npx turbo run build --filter=web --filter=studio
```

### Task Parallelism
By default, Turbo runs tasks in parallel when possible. For CPU-intensive tasks, limit parallelism:
```bash
npx turbo run build --concurrency=2
```

### Remote Caching
For team environments, configure remote caching:
```bash
npx turbo login
npx turbo link
```

## Troubleshooting

### Cache Issues
If you suspect stale cache:
```bash
npx turbo clean
npm run build
```

### Task Not Running
Ensure the task exists in the package's `package.json`:
```json
{
  "scripts": {
    "build": "..."
  }
}
```

### Missing packageManager Warning
The `packageManager` field in root `package.json` should match your npm version:
```bash
npm --version  # Check your version
```

## Performance Benefits

1. **Faster builds**: Only rebuilds changed packages
2. **Parallel execution**: Maximizes CPU utilization
3. **Incremental development**: Changes propagate efficiently
4. **CI optimization**: Significant speed improvements in CI/CD pipelines

## Next Steps

- Consider setting up [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) for team collaboration
- Explore [Environment Variables](https://turbo.build/repo/docs/handbook/environment-variables) configuration
- Configure [Task Inputs](https://turbo.build/repo/docs/core-concepts/caching#configuring-cache-inputs) for fine-grained caching control
