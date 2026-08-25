import { defineConfig, type WorkspaceOptions } from 'sanity'
import { dashboardTool } from '@sanity/dashboard'
import { presentationTool } from 'sanity/presentation'
import { locate } from './presentation/locate'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'
import { lucideIconPicker } from '@fredcorr/sanity-plugin-lucide-icon-picker'
import { media } from 'sanity-plugin-media'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import structure from './structure'
import { SINGLETON_ACTIONS, SINGLETON_TYPES } from './constants'
import { dashboardWidgets } from './dashboard'
import { SanityDataset } from '@portfolio/types/base'

if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID environment variable')
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID

const stripTrailingSlash = (url: string) => url.replace(/\/$/, '')

const developPreviewUrl = stripTrailingSlash(
  process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
)

// Prod previews point at the live site. Falls back to the develop preview URL
// so a local Studio without the extra var still loads.
const prodPreviewUrl = stripTrailingSlash(
  process.env.SANITY_STUDIO_PREVIEW_URL_PROD ||
    process.env.SANITY_STUDIO_PREVIEW_URL ||
    'http://localhost:3000'
)

interface StudioWorkspaceOptions {
  name: string
  title: string
  basePath: string
  dataset: SanityDataset
  previewUrl: string
}

/**
 * Both workspaces share every plugin, schema and document rule — only the
 * dataset and the preview target differ.
 */
const createWorkspace = ({
  name,
  title,
  basePath,
  dataset,
  previewUrl,
}: StudioWorkspaceOptions): WorkspaceOptions => ({
  name,
  title,
  basePath,

  projectId,
  dataset,

  plugins: [
    // The dashboard must stay first so Studio opens with operational context.
    dashboardTool({
      widgets: dashboardWidgets,
    }),
    presentationTool({
      resolve: { locations: locate },
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          // Absolute, and built from this workspace's own previewUrl. The
          // Studio and the site are separate origins, so a relative path would
          // resolve against the Studio; a URL fixed to one workspace's site
          // would enable draft mode on the wrong deployment, which reads the
          // wrong dataset.
          enable: `${previewUrl}/api/draft`,
        },
      },
    }),
    structureTool({
      structure: (S, context) => structure(S, context),
    }),
    lucideIconPicker(),
    media(),
    unsplashImageAsset(),
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

export default defineConfig([
  createWorkspace({
    name: SanityDataset.Develop,
    title: 'Portfolio Studio — Develop',
    basePath: '/develop',
    dataset: SanityDataset.Develop,
    previewUrl: developPreviewUrl,
  }),
  createWorkspace({
    name: SanityDataset.Prod,
    title: 'Portfolio Studio — Production',
    basePath: '/prod',
    dataset: SanityDataset.Prod,
    previewUrl: prodPreviewUrl,
  }),
])
