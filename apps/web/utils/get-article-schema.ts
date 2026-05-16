import type { ArticlePageDocument } from '@portfolio/types/pages/article-page'
import type { SettingsData } from '@portfolio/types/settings'
import type { ArticleSchema } from '@/types/json-schema'
import { buildPageUrl } from '@/utils/slug'

export const getArticleSchema = (
  siteUrl: string,
  article: ArticlePageDocument,
  settings: SettingsData
): ArticleSchema | null => {
  const headline = article.seoTitle ?? article.title

  if (!headline || !article.slug?.current) {
    return null
  }

  const url = buildPageUrl(siteUrl, article.slug.current)
  const authorName = [settings.firstName, settings.secondName]
    .filter(Boolean)
    .join(' ')

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: headline.slice(0, 110),
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
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
