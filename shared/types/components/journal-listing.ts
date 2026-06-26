import type { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'
import type { SanityImage } from '../sanity'

export interface JournalListingArticle {
  _id: string
  title: string
  slug: { current: string }
  tags?: string[]
  _createdAt: string
  editionNumber?: number
  readTime?: number
  cardImage?: SanityImage
}

export interface JournalListingInitialData {
  articles: JournalListingArticle[]
  total: number
  categories: string[]
  allTags: string[]
}

export interface JournalListingComponent extends SanityComponentBase<ComponentTypeName.JournalListing> {
  kicker?: string
  title?: ComponentHeading
  initialData?: JournalListingInitialData
}
