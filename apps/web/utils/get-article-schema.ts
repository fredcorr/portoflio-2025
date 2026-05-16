import type { ArticlePageDocument } from '@portfolio/types/pages/article-page'
import type { SettingsData } from '@portfolio/types/settings'
import { buildPageUrl } from '@/utils/slug'

type PersonSchema = {
  '@type': 'Person'
  name: string
  jobTitle?: string
}

type ImageObjectSchema = {
  '@type': 'ImageObject'
  url: string
}

type ArticleSchema = {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  url: string
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  datePublished: string
  dateModified: string
  author: PersonSchema
  publisher: {
    '@type': 'Organization'
    name: string
    logo?: ImageObjectSchema
  }
  image?: string
  description?: string
  keywords?: string
}

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

  const author: PersonSchema = {
    '@type': 'Person',
    name: authorName,
    ...(settings.jobTitle ? { jobTitle: settings.jobTitle } : {}),
  }

  const publisherLogoUrl = article.seoImage?.asset?.url

  const schema: ArticleSchema = {
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
    author,
    publisher: {
      '@type': 'Organization',
      name: authorName,
      ...(publisherLogoUrl
        ? { logo: { '@type': 'ImageObject', url: publisherLogoUrl } }
        : {}),
    },
  }

  const imageUrl =
    article.heroImage?.asset?.url ?? article.seoImage?.asset?.url
  if (imageUrl) {
    schema.image = imageUrl
  }

  if (article.seoDescription) {
    schema.description = article.seoDescription
  }

  if (article.tags?.length) {
    schema.keywords = article.tags.join(', ')
  }

  return schema
}
