import type { PortableTextBlock } from '@portabletext/react'
import { PageTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { BasePageDocument, PageComponent } from './base'
import type { RelatedArticle } from '../components/article-related'

export interface ArticlePageDocument extends BasePageDocument {
  _type: PageTypeName.ArticlePage
  heroImage?: SanityImage
  tags?: string[]
  articleContent?: PortableTextBlock[]
  articleComponents?: PageComponent[]
  editionNumber?: number
  relatedArticles?: RelatedArticle[]
}
