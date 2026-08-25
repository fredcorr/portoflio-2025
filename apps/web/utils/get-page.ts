import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/base'
import { client, previewClient } from '@/sanity/client'
import {
  chunkCacheTags,
  collectCacheTags,
  collectSetDependencyTags,
} from '@/utils/collect-cache-tags'
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
async function fetchPublishedPage(slug: string) {
  'use cache'
  cacheLife('cmsPage')
  cacheTag(`sanity:page:${slug}`)

  const page = await client.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, { slug })

  // Tagging from the returned payload is what Next documents for data-derived
  // tags, and it is the only way to know which documents this page actually
  // dereferenced. Chunked because `cacheTag` drops anything past 128 per call.
  //
  // The set-dependency tags are what the payload cannot express: a listing
  // component depends on its whole document set even when it returned an empty
  // array, and its `total` / `categories` aggregates are computed over
  // documents that never appear here at all.
  const tags = [...collectCacheTags(page), ...collectSetDependencyTags(page)]

  for (const chunk of chunkCacheTags(tags)) {
    cacheTag(...chunk)
  }

  return page
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
