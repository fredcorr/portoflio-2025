import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { SITEMAP_PAGES_QUERY } from '@/sanity/queries/base'
import { getSiteUrl } from '@/utils/get-site-url'
import { buildPageUrl } from '@/utils/slug'

export const revalidate = 60 * 60 * 24 * 7

type SitemapPage = { slug?: { current?: string }; updateDate?: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  try {
    const pages = await client.fetch<SitemapPage[]>(SITEMAP_PAGES_QUERY)

    return pages
      .filter(page => page.slug?.current)
      .map(page => {
        const slug = page.slug?.current ?? '/'

        return {
          url: buildPageUrl(siteUrl, slug),
          lastModified: page.updateDate,
        }
      })
  } catch (error) {
    console.error('Failed to build sitemap:', error)
    return []
  }
}
