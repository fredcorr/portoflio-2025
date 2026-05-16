import type { CmsPages } from '@portfolio/types/pages'
import type { SettingsData } from '@portfolio/types/settings'
import type { ArticlePageDocument } from '@portfolio/types/pages/article-page'
import type { ProjectPageDocument } from '@portfolio/types/pages/project-page'
import type { ArticleSchema, CreativeWorkSchema } from '@/types/json-schema'
import { PageTypeName } from '@portfolio/types/base'
import { buildPageUrl } from '@/utils/slug'

export interface SchemaEntry {
  id: string
  schema: object
}

const buildAuthorName = (settings: SettingsData) =>
  [settings.firstName, settings.secondName].filter(Boolean).join(' ')

const buildArticleSchema = (
  siteUrl: string,
  article: ArticlePageDocument,
  settings: SettingsData
): ArticleSchema | null => {
  const headline = article.seoTitle ?? article.title
  if (!headline || !article.slug?.current) return null

  const url = buildPageUrl(siteUrl, article.slug.current)
  const authorName = buildAuthorName(settings)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: headline.slice(0, 110),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: article._createdAt,
    dateModified: article._updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(settings.jobTitle ? { jobTitle: settings.jobTitle } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: authorName,
      ...(article.seoImage?.asset?.url
        ? { logo: { '@type': 'ImageObject', url: article.seoImage.asset.url } }
        : {}),
    },
    ...(article.heroImage?.asset?.url ?? article.seoImage?.asset?.url
      ? { image: article.heroImage?.asset?.url ?? article.seoImage?.asset?.url }
      : {}),
    ...(article.seoDescription ? { description: article.seoDescription } : {}),
    ...(article.tags?.length ? { keywords: article.tags.join(', ') } : {}),
  }
}

const buildProjectSchema = (
  siteUrl: string,
  project: ProjectPageDocument,
  settings: SettingsData
): CreativeWorkSchema | null => {
  const name = project.seoTitle ?? project.title
  if (!name || !project.slug?.current) return null

  const url = buildPageUrl(siteUrl, project.slug.current)
  const authorName = buildAuthorName(settings)

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    dateModified: project._updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(settings.jobTitle ? { jobTitle: settings.jobTitle } : {}),
    },
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.projectHero?.asset?.url ?? project.seoImage?.asset?.url
      ? {
          image:
            project.projectHero?.asset?.url ?? project.seoImage?.asset?.url,
        }
      : {}),
    ...(project.seoDescription ? { description: project.seoDescription } : {}),
    ...(project.projectTags?.length
      ? {
          keywords: project.projectTags
            .map(tag => tag.name?.current)
            .filter(Boolean)
            .join(', '),
        }
      : {}),
  }
}

export const getPageSchemas = (
  siteUrl: string,
  page: CmsPages,
  settings?: SettingsData | null
): SchemaEntry[] => {
  const schemas: SchemaEntry[] = []

  if (!settings) return schemas

  switch (page._type) {
    case PageTypeName.ArticlePage: {
      const schema = buildArticleSchema(
        siteUrl,
        page as ArticlePageDocument,
        settings
      )
      if (schema) schemas.push({ id: 'article-ld-json', schema })
      break
    }
    case PageTypeName.ProjectPage: {
      const schema = buildProjectSchema(
        siteUrl,
        page as ProjectPageDocument,
        settings
      )
      if (schema) schemas.push({ id: 'project-ld-json', schema })
      break
    }
  }

  return schemas
}
