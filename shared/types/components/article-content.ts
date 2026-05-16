import type { PortableTextBlock } from '@portabletext/react'
import type { AuthorData } from '../settings'

export interface ArticleContentProps {
  content?: PortableTextBlock[]
  shareUrl?: string
  shareTitle?: string
  tags?: string[]
  author?: AuthorData
  dateLabel?: string
  readTimeLabel?: string
  editionNumber?: number
  showReaderCount?: boolean
  prevUrl?: string
  nextUrl?: string
}
