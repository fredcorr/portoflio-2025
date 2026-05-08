import { defineConfig } from 'sanity'
import { dashboardTool } from '@sanity/dashboard'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { lucideIconPicker } from '@fredcorr/sanity-plugin-lucide-icon-picker'
import { media, mediaAssetSource } from 'sanity-plugin-media'
import structure from './structure'
import { SINGLETON_ACTIONS, SINGLETON_TYPES } from './constants'
import { dashboardWidgets } from './dashboard'

if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID environment variable')
}

if (!process.env.SANITY_STUDIO_DATASET) {
  throw new Error('Missing SANITY_STUDIO_DATASET environment variable')
}

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,

  plugins: [
    dashboardTool({
      widgets: dashboardWidgets,
    }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    structureTool({
      structure: (S, context) => structure(S, context),
    }),
    lucideIconPicker(),
    visionTool(),
    media(),
  ],

  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          template => !SINGLETON_TYPES.has(template.templateId || '')
        )
      }
      return prev
    },
    actions: (prev, context) => {
      if (context.schemaType && SINGLETON_TYPES.has(context.schemaType)) {
        return prev.filter(
          actionItem =>
            actionItem.action && SINGLETON_ACTIONS.has(actionItem.action)
        )
      }
      return prev
    },
  },

  form: {
    image: {
      assetSources: (previousAssetSources) =>
        [...previousAssetSources, mediaAssetSource],
    },
  },

  schema: {
    types: schemaTypes,
  },
})
