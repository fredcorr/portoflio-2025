import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/client'
import { chunkCacheTags, collectCacheTags } from '@/utils/collect-cache-tags'
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation'
import type { NavigationData } from '@portfolio/types/components'

/**
 * `sanity:settings` is load-bearing here and cannot be derived. The query
 * projects `navigationItems[]->` *without* the settings document that holds
 * them, so a publish on settings carries an id this entry never cached —
 * reordering the nav would otherwise never invalidate it.
 */
const getNavigation = async () => {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:settings')

  const navigation = await client.fetch<NavigationData>(NAVIGATION_QUERY)

  for (const chunk of chunkCacheTags(collectCacheTags(navigation))) {
    cacheTag(...chunk)
  }

  return navigation
}

export default getNavigation
