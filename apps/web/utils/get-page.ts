import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/base'
import { client, previewClient } from '@/sanity/client'
import type { CmsPages } from '@portfolio/types/pages'

/**
 * `@sanity/client` does not use the global `fetch` — it routes through
 * `get-it`, so Next's fetch Data Cache never sees these queries. Without an
 * explicit `use cache` there is no caching layer at all, and nothing fails
 * loudly to tell you.
 *
 * `sanity:content` is the tag that actually keeps this correct. The page query
 * dereferences documents that change independently of the page itself
 * (`articles[]->`, `projects[]->`, `navigationItems[]->`), so a webhook for an
 * edited project carries that project's `_id` and would never match
 * `sanity:page:${slug}`. The coarse tag is invalidated on any publish.
 */
async function fetchPublishedPage(slug: string) {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:content', 'sanity:page', `sanity:page:${slug}`)
  return client.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, { slug })
}

const getPage = cache(async (slug: string, isDraft: boolean) => {
  // Draft reads stay outside the cache scope deliberately — preview content
  // must never be served from, or written to, the shared cache.
  if (isDraft) {
    return previewClient.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, { slug })
  }

  return fetchPublishedPage(slug)
})

export default getPage
