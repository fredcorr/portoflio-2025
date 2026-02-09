import type { SanityImage } from '../sanity'

export interface ArticleIntroProps {
  title?: string
  dateLabel?: string
  readTimeLabel?: string
  tags?: string[]
  heroImage?: SanityImage
}
