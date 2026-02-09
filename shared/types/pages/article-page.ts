import type { PortableTextBlock } from '@portabletext/react'
import { PageTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { BasePageDocument, PageComponent } from './base'

export interface ArticlePageDocument extends BasePageDocument {
  _type: PageTypeName.ArticlePage
  heroImage?: SanityImage
  tags?: string[]
  articleContent?: PortableTextBlock[]
  articleComponents?: PageComponent[]
}
