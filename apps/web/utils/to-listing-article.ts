import type {
  JournalsListingArticle,
  JournalsListingArticleRaw,
} from '@portfolio/types/components'
import { calculateReadTime } from '@/utils/calculate-read-time'

/**
 * Derives `readTime` (in minutes) from the article body using the shared
 * live util, then drops the body so it never ships to the client.
 */
export const toListingArticle = (
  article: JournalsListingArticleRaw
): JournalsListingArticle => {
  const { articleContent, ...rest } = article
  return {
    ...rest,
    readTime: calculateReadTime(articleContent)?.minutes,
  }
}

export default toListingArticle
