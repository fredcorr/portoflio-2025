import type { MetadataRoute } from 'next'
import type { BasePageDocument } from '@portfolio/types/pages'
import { client } from '@/sanity/client'
import { SITEMAP_PAGES_QUERY } from '@/sanity/queries/base'

export const revalidate = 60 * 60 * 24 * 7

type SitemapPage = Pick<BasePageDocument, 'slug'> & { updateDate?: string }

const getSiteUrl = () => {
  const envUrl = process.env.SITE_URL
  if (envUrl) {
    return envUrl.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  try {
    const pages = await client.fetch<SitemapPage[]>(SITEMAP_PAGES_QUERY)

    return pages
      .filter(page => page.slug?.current)
      .map(page => {
        const slug = page.slug?.current ?? '/'
        const url =
          slug === '/' ? siteUrl : `${siteUrl}/${slug.replace(/^\//, '')}`

        return {
          url,
          lastModified: page.updateDate,
        }
      })
  } catch (error) {
    console.error('Failed to build sitemap:', error)
    return []
  }
}
