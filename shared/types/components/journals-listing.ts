import type { PortableTextBlock } from '@portabletext/types'
import type { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'
import type { SanityImage } from '../sanity'

/** Card-ready article shape consumed by the client. `readTime` is derived from the body. */
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

/** Raw article as returned by GROQ — carries the body so read time can be derived server-side. */
export interface JournalsListingArticleRaw
  extends Omit<JournalsListingArticle, 'readTime'> {
  articleContent?: PortableTextBlock[]
}

/** Card-ready listing payload — sent to the client HOC and returned by the API route. */
export interface JournalsListingData {
  articles: JournalsListingArticle[]
  total: number
  /** Server-derived page count, so the client never recomputes it from `total`. */
  totalPages: number
  categories: string[]
  allTags: string[]
}

/**
 * Raw listing payload as returned by the page-level GROQ query. `totalPages` is
 * derived server-side in the organism (GROQ has no `ceil`), so it is omitted here.
 */
export interface JournalsListingInitialData
  extends Omit<JournalsListingData, 'articles' | 'totalPages'> {
  articles: JournalsListingArticleRaw[]
}

export interface JournalsListingComponent extends SanityComponentBase<ComponentTypeName.JournalsListing> {
  kicker?: string
  title?: ComponentHeading
  initialData?: JournalsListingInitialData
}
