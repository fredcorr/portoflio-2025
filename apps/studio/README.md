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

## Dashboard

The Studio now boots into the Dashboard tool powered by `@sanity/dashboard`. Widgets live under `apps/studio/dashboard/`:

- **Content QA** document lists flag pages missing slugs/heroes.
- **Project Stats** summarize published vs. draft content.
- **Quick Links / Structure shortcuts** provide one-click access to the Desk and external resources.

### Environment Variables

The dashboard widgets use the same Sanity credentials already required for the Studio. No additional variables are necessary, though you can set `SANITY_STUDIO_REPO_URL`, `SANITY_STUDIO_MANAGE_URL`, or `SANITY_STUDIO_PLAYBOOK_URL` to customize the Quick Links widget.

### Local Development

1. Start the Studio:
   ```bash
   npm run dev:studio
   ```
2. Open [http://localhost:3333/dashboard](http://localhost:3333/dashboard) to view the widgets. The Desk tool remains available at `/desk`.

## Learn More

- [Sanity Documentation](https://www.sanity.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
