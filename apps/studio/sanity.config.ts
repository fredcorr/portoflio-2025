import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import structure from './structure'
import { SINGLETON_ACTIONS, SINGLETON_TYPES } from './constants'
import { lucideIconPicker } from 'sanity-plugin-lucide-icon-picker'

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
    structureTool({
      structure: (S, context) => structure(S, context),
    }),
    lucideIconPicker(),
    visionTool(),
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

  schema: {
    types: schemaTypes,
  },
})
