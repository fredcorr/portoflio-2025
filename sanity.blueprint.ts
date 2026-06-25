import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

// No explicit `resource` block: the function runs against its own project's
// datasets by default, which avoids hardcoding a project ID (a mismatch there
// breaks the event rule). If you later need to scope to a single dataset, add
// `&& sanity::dataset() == "<name>"` to the filter rather than a resource block.
export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'syndicate-devto',
      src: './functions/syndicate-devto',
      event: {
        on: ['create', 'update'],
        filter:
          '_type == "article" && (devtoSyndicate == true || defined(devtoArticleId))',
        projection:
          '{_id, title, slug, tags, articleContent, devtoSyndicate, devtoPublishedUrl, devtoArticleId}',
      },
    }),
  ],
})
