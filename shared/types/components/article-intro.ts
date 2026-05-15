import type { AuthorData } from '../settings'

export interface ArticleIntroProps {
  title?: string
  dateLabel?: string
  readTimeLabel?: string
  tags?: string[]
  deck?: string
  editionNumber?: number
  author?: AuthorData
}
