import { resolve } from 'node:path'
import { defineCliConfig } from 'sanity/cli'

if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID environment variable')
}

if (!process.env.SANITY_STUDIO_DATASET) {
  throw new Error('Missing SANITY_STUDIO_DATASET environment variable')
}

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },

  vite: {
    resolve: {
      alias: [
        { find: '@schemas', replacement: resolve(__dirname, 'schemas') },
        {
          find: '@components/atoms',
          replacement: resolve(__dirname, 'schemas/components/atoms'),
        },
        {
          find: '@components/molecules',
          replacement: resolve(__dirname, 'schemas/components/molecules'),
        },
        {
          find: '@components/organisms',
          replacement: resolve(__dirname, 'schemas/components/organisms'),
        },
        {
          find: '@components/settings',
          replacement: resolve(__dirname, 'schemas/components/settings'),
        },
        {
          find: '@portfolio/types',
          replacement: resolve(__dirname, '../../shared/types'),
        },
        { find: '@studio/types', replacement: resolve(__dirname, 'types') },
        { find: '@utils', replacement: resolve(__dirname, 'utils') },
        { find: '@structure', replacement: resolve(__dirname, 'structure') },
      ],
    },
  },
  studioHost: process.env.SANITY_STUDIO_HOST || 'localhost',
})
