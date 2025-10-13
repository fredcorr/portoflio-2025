# Portfolio Studio

This is the Sanity Studio for the Portfolio project, configured with TypeScript support.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Sanity project credentials:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies (from the project root):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3333](http://localhost:3333) in your browser

## TypeScript Configuration

This project uses shared types from `@portfolio/types` located in `shared/types/` at the root of the monorepo. The TypeScript configuration includes path mapping to access these shared types.

## Prettier Configuration

This project uses a shared Prettier configuration located in `shared/config/.prettierrc.json`.

## Project Structure

```
apps/studio/
├── schemas/           # Sanity schema definitions
│   ├── index.ts      # Schema exports
│   └── project.ts    # Example project schema
├── sanity.config.ts  # Sanity studio configuration
├── sanity.cli.ts     # Sanity CLI configuration
└── tsconfig.json     # TypeScript configuration
```

## Learn More

- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
