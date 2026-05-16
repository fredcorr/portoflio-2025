import type { CmsPages } from '@portfolio/types/pages'
import type { SettingsData } from '@portfolio/types/settings'
import type { ArticlePageDocument } from '@portfolio/types/pages/article-page'
import type { ProjectPageDocument } from '@portfolio/types/pages/project-page'
import { PageTypeName } from '@portfolio/types/base'
import { getArticleSchema } from '@/utils/get-article-schema'
import { getProjectSchema } from '@/utils/get-project-schema'

export interface SchemaEntry {
  id: string
  schema: object
}

export const getPageSchemas = (
  siteUrl: string,
  page: CmsPages,
  settings?: SettingsData | null
): SchemaEntry[] => {
  const schemas: SchemaEntry[] = []

  if (page._type === PageTypeName.ArticlePage && settings) {
    const schema = getArticleSchema(
      siteUrl,
      page as ArticlePageDocument,
      settings
    )
    if (schema) {
      schemas.push({ id: 'article-ld-json', schema })
    }
  }

  if (page._type === PageTypeName.ProjectPage && settings) {
    const schema = getProjectSchema(
      siteUrl,
      page as ProjectPageDocument,
      settings
    )
    if (schema) {
      schemas.push({ id: 'project-ld-json', schema })
    }
  }

  return schemas
}
