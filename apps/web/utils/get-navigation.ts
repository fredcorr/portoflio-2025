import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/client'
import {
  chunkCacheTags,
  collectCacheTags,
  countTag,
} from '@/utils/collect-cache-tags'
import { PageTypeName } from '@portfolio/types/base'
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation'
import type { NavigationData } from '@portfolio/types/components'

/**
 * `sanity:settings` is load-bearing here and cannot be derived. The query
 * projects `navigationItems[]->` *without* the settings document that holds
 * them, so a publish on settings carries an id this entry never cached —
 * reordering the nav would otherwise never invalidate it.
 *
 * The count tag covers `projectCount`, a `count()` over every project. Counts
 * carry no ids, so nothing in the payload changes when one is added — and the
 * narrower count tag is right here because the nav reads only the total, which
 * moves when a project enters or leaves the set and never when one is edited.
 */
const getNavigation = async () => {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:settings', countTag(PageTypeName.ProjectPage))

  const navigation = await client.fetch<NavigationData>(NAVIGATION_QUERY)

  for (const chunk of chunkCacheTags(collectCacheTags(navigation))) {
    cacheTag(...chunk)
  }

  return navigation
}

export default getNavigation
