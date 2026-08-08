import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { SITEMAP_PAGES_QUERY } from '@/sanity/queries/base'
import { getSiteUrl } from '@/utils/get-site-url'
import { buildPageUrl } from '@/utils/slug'
import { chunkCacheTags, collectCacheTags } from '@/utils/collect-cache-tags'
import { cacheLife, cacheTag } from 'next/cache'

type SitemapPage = { slug?: { current?: string }; updateDate?: string }

// Replaces `export const revalidate = 604800`, which Cache Components rejects.
// Without this the route would prerender once at build and never refresh.
// `sanity:sitemap` stays explicit: this listing changes when a page is created
// or deleted, which is exactly the case no id already in the result can catch.
async function fetchSitemapPages(): Promise<SitemapPage[]> {
  'use cache'
  cacheLife('cmsIndex')
  cacheTag('sanity:sitemap')

  const pages = await client.fetch<SitemapPage[]>(SITEMAP_PAGES_QUERY)

  for (const chunk of chunkCacheTags(collectCacheTags(pages))) {
    cacheTag(...chunk)
  }

  return pages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  try {
    const pages = await fetchSitemapPages()

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
