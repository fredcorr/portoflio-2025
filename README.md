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
├── .env                          # Root: Shared variables (gitignored)
├── .env.example                  # Root: Template for shared variables
├── apps/
│   ├── web/
│   │   ├── .env                  # Web-specific variables (gitignored)
│   │   └── .env.example          # Web-specific template
│   └── studio/
│       ├── .env                  # Studio-specific variables (gitignored)
│       └── .env.example          # Studio-specific template
```

#### Initial Setup

**Create and configure root `.env` (single source of truth):**
```bash
# Copy the example
cp .env.example .env

# Edit with your Sanity credentials
# .env
SANITY_PROJECT_ID=your-actual-project-id
SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token
SANITY_PREVIEW_SECRET=your-secret-string
SANITY_STUDIO_HOST=your-studio.sanity.studio
```

**That's it!** No duplication needed. App-specific `.env` files are optional and only for overrides.

#### How It Works

**Root `.env` (Single Source of Truth)**
- Contains all shared configuration - **define each value only once**
- Automatically loaded and processed by custom scripts
- All variables are server-side only (no `NEXT_PUBLIC_` needed)

**How It Works**
- **Next.js**: Uses server actions, all Sanity access is server-side → uses `SANITY_PROJECT_ID`, `SANITY_DATASET` directly
- **Sanity Studio**: Auto-generates `SANITY_STUDIO_*` variables from base `SANITY_*` variables via wrapper script
- **Loading**: 
  - Web: `dotenv -e ../../.env` loads root vars
  - Studio: `generate-studio-env.js` loads root vars and creates `SANITY_STUDIO_*` versions automatically
- **Server-side only**: All variables stay on the server, never exposed to browser

**Zero Duplication Achievement**
- Define `SANITY_PROJECT_ID=abc123` **once** in root `.env`
- `SANITY_STUDIO_PROJECT_ID` is auto-generated from `SANITY_PROJECT_ID` 
- `SANITY_STUDIO_DATASET` is auto-generated from `SANITY_DATASET`
- No manual copying of values needed
- No app-specific `.env` files needed

**App-Specific `.env` Files (Optional)**
Only create `apps/{app}/.env` if you need:
- Local overrides (e.g., different dataset for testing)
- App-specific variables (will be loaded automatically alongside root .env)

### 3. Run Development Server

```bash
# Start all apps
npm run dev

# Or start individual apps
npm run dev:web      # Web app only
npm run dev:studio   # Studio only
```

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
- **Start all apps**: `npm run dev`
- **Build all apps**: `npm run build`

### Run Individual Apps
- **Start web app**: `npm run dev:web`
- **Start Sanity Studio**: `npm run dev:studio`
- **Build web app**: `npm run build:web`
- **Build Sanity Studio**: `npm run build:studio`

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

#### For Shared Variables (Used by Multiple Apps)
1. Add to root `.env` and `.env.example`
2. Add to `turbo.json` → `globalEnv` array
3. Reference in app-specific `.env` files if needed

Example:
```bash
# Root .env
NEW_SHARED_VAR=value

# turbo.json
{
  "globalEnv": [
    "SANITY_PROJECT_ID",
    "NEW_SHARED_VAR"  // Add here
  ]
}
```

#### For App-Specific Variables
1. Add to `apps/{app}/.env` and `.env.example`
2. No need to modify `turbo.json` unless it affects caching

### Variable Naming Conventions

- **Next.js (web app)**: Use `NEXT_PUBLIC_` prefix for client-side variables
  ```typescript
  // Available in browser
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  
  // Server-side only (no NEXT_PUBLIC_ prefix)
  const apiToken = process.env.SANITY_API_READ_TOKEN
  ```

- **Sanity Studio**: Use `SANITY_STUDIO_` prefix for configuration
  ```typescript
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID
  ```

### Multiple Environments

For different environments, use additional env files:
- `.env.local` - Local overrides (gitignored, highest priority)
- `.env.development` - Development environment
- `.env.production` - Production environment

### Troubleshooting

**Variables not loading?**
1. Restart dev server (`npm run dev`)
2. Check variable names match exactly (case-sensitive)
3. Verify `.env` files exist in correct locations
4. Ensure no spaces around `=` in `.env` files

**Need different values per app?**
- Override shared variables in app-specific `.env` files
- App-specific values take precedence over root values

## Deployment

### Build Commands

The project has different build commands for local vs cloud deployments:

**Local builds** (with `.env` file):
```bash
npm run build:local        # Builds all apps using root .env
npm run build:web --local  # Web app only
npm run build:studio --local  # Studio only
```

**Production builds** (cloud providers):
```bash
npm run build              # Builds all apps using injected env vars
npm run build:web          # Web app only
npm run build:studio       # Studio only
```

### Deploying to Vercel

#### 1. Configure Project Settings

**For the Web App:**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && npm run build --filter=web`
- **Output Directory**: `.next` (default)

**For Sanity Studio** (if deploying separately):
- **Framework Preset**: Other
- **Root Directory**: `apps/studio`
- **Build Command**: `cd ../.. && npm run build --filter=studio`
- **Output Directory**: `dist`

#### 2. Environment Variables

Add these in Vercel's project settings → Environment Variables:

```bash
# Required for both apps
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production

# Required for web app only
SANITY_API_READ_TOKEN=your-read-token
SANITY_PREVIEW_SECRET=your-preview-secret

# Required for studio only
SANITY_STUDIO_HOST=your-production-studio-url
```

**Important**: Environment variables are injected by the cloud provider, so the `dotenv -e ../../.env` loading is bypassed in production builds.

### Deploying to Other Providers

**Netlify:**
- Build command: `cd ../.. && npm run build --filter=web`
- Publish directory: `apps/web/.next`
- Set the same environment variables in Netlify's UI

**Cloudflare Pages:**
- Build command: `cd ../.. && npm run build --filter=web`
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
