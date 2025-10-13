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

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Sanity Studio:
   - Navigate to `apps/studio`
   - Copy `.env.example` to `.env`
   - Add your Sanity project ID and dataset
   - See [apps/studio/README.md](apps/studio/README.md) for more details

3. Run the development server:
   ```bash
   npm run dev:studio
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

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
