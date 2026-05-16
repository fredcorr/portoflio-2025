import type { SanityImage, SanitySlug } from '../sanity'

export interface RelatedArticle {
  title?: string
  slug?: SanitySlug
  tags?: string[]
  _createdAt?: string
  heroImage?: SanityImage
  editionNumber?: number
}

export interface ArticleRelatedProps {
  relatedArticles?: RelatedArticle[]
}
