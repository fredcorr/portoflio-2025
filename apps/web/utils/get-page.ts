import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/base'
import { client, previewClient } from '@/sanity/client'
import { chunkCacheTags, collectCacheTags } from '@/utils/collect-cache-tags'
import getIsDraft from '@/utils/get-is-draft'
import type { CmsPages } from '@portfolio/types/pages'

/**
 * `@sanity/client` does not use the global `fetch` — it routes through
 * `get-it`, so Next's fetch Data Cache never sees these queries. Without an
 * explicit `use cache` there is no caching layer at all, and nothing fails
 * loudly to tell you.
 *
 * Tags are derived from the result rather than the request, because the page
 * query dereferences documents that change independently of the page itself
 * (`articles[]->`, `projects[]->`, `navigationItems[]->`) and lists others by
 * type (`*[_type == "article"]`). A webhook for an edited project carries that
 * project's own id, which `sanity:page:${slug}` would never match.
 */
async function fetchPage(slug: string) {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:page', `sanity:page:${slug}`)

  // Selecting the client inside the cache scope is what keeps routes static.
  // Reading Draft Mode in the component instead put a dynamic hole in every
  // route. It is safe here because a draft request bypasses `use cache`
  // entirely — the scope re-executes and its result is discarded — so preview
  // content is never served from, or written to, the shared cache.
  const isDraft = await getIsDraft()
  const activeClient = isDraft ? previewClient : client

  const page = await activeClient.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, {
    slug,
  })

  // Tagging from the returned payload is what Next documents for data-derived
  // tags, and it is the only way to know which documents this page actually
  // dereferenced. Chunked because `cacheTag` drops anything past 128 per call.
  for (const chunk of chunkCacheTags(collectCacheTags(page))) {
    cacheTag(...chunk)
  }

  return page
}

const getPage = cache(fetchPage)

export default getPage
