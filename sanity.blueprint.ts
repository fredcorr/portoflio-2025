import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

// Replace these with your actual project ID and dataset name,
// or set SANITY_PROJECT_ID and SANITY_DATASET environment variables.
const projectId = process.env.SANITY_PROJECT_ID ?? ''
const dataset = process.env.SANITY_DATASET ?? 'production'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'syndicate-devto',
      src: 'functions/syndicate-devto/index.ts',
      event: {
        on: ['create', 'update'],
        filter:
          '_type == "article" && (devtoSyndicate == true || defined(devtoArticleId))',
        projection:
          '{_id, title, slug, tags, articleContent, devtoSyndicate, devtoPublishedUrl, devtoArticleId}',
        resource: {
          type: 'dataset',
          id: `${projectId}.${dataset}`,
        },
      },
    }),
  ],
})
