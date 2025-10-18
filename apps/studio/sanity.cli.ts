import { resolve } from 'node:path'
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },

  vite: {
    resolve: {
      alias: {
        '@schemas': resolve(__dirname, 'schemas'),
        '@schemas/compositions': resolve(__dirname, 'schemas/compositions'),
        '@schemas/fieldsets': resolve(__dirname, 'schemas/fieldsets'),
        '@components/atoms': resolve(__dirname, 'schemas/components/atoms'),
        '@portfolio/types': resolve(__dirname, '../../shared/types'),
      },
    },
  },
  studioHost: process.env.SANITY_STUDIO_HOST || 'localhost',
})
