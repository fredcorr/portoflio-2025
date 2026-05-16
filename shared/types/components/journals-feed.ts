import { ComponentTypeName } from '../base'
import type { ArticlePageDocument } from '../pages'
import type { PortableTextBlock } from '@portabletext/react'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'
import type { LinkItem } from './link'

export interface JournalsFeedArticle extends Pick<
  ArticlePageDocument,
  '_id' | '_type' | 'title' | 'slug' | 'tags' | '_createdAt'
> {
  articleContent?: PortableTextBlock[]
}

export interface JournalsFeedComponent extends SanityComponentBase<ComponentTypeName.JournalsFeed> {
  kicker?: string
  title?: ComponentHeading
  ctaLabel?: string
  ctaLink?: LinkItem
  articles?: JournalsFeedArticle[]
}
