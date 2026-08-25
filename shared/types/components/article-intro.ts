import type { AuthorData } from '../settings'

export interface ArticleIntroProps {
  slug?: string
  title?: string
  dateLabel?: string
  readTimeLabel?: string
  tags?: string[]
  deck?: string
  editionNumber?: number
  author?: AuthorData
}
