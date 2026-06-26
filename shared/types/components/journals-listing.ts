import type { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'
import type { SanityImage } from '../sanity'

export interface JournalsListingArticle {
  _id: string
  title: string
  slug: { current: string }
  tags?: string[]
  _createdAt: string
  editionNumber?: number
  readTime?: number
  cardImage?: SanityImage
}

export interface JournalsListingInitialData {
  articles: JournalsListingArticle[]
  total: number
  categories: string[]
  allTags: string[]
}

export interface JournalsListingComponent extends SanityComponentBase<ComponentTypeName.JournalsListing> {
  kicker?: string
  title?: ComponentHeading
  initialData?: JournalsListingInitialData
}
