import type { MetadataRoute } from 'next'
import { log } from 'node:console'

export default function robots(): MetadataRoute.Robots {
  const allowCrawlersEnv = process.env.ALLOW_CRAWLERS
  const allowCrawlers =
    allowCrawlersEnv !== undefined
      ? allowCrawlersEnv.toLowerCase() === 'true'
      : process.env.NODE_ENV === 'production'

  log(`Robots.txt - allowCrawlersEnv: ${allowCrawlersEnv}`)

  return {
    rules: allowCrawlers
      ? {
          userAgent: '*',
          allow: '/',
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
  }
}
