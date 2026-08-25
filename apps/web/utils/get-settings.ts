import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/client'
import {
  chunkCacheTags,
  collectCacheTags,
  typeTag,
} from '@/utils/collect-cache-tags'
import { PageTypeName } from '@portfolio/types/base'
import { SETTINGS_QUERY } from '@/sanity/queries/settings'
import type { SettingsData } from '@portfolio/types/settings'

export interface SettingsQueryResult {
  settings?: SettingsData
  projectCount?: number
}

/**
 * Fetches global site settings from Sanity.
 *
 * `use cache` is what persists the result — Sanity queries bypass Next's fetch
 * Data Cache, so without it every render would hit the API.
 *
 * `sanity:settings` is kept as an explicit tag rather than relying on the
 * derived ones: the query dereferences `navigationItems[]->`, so a nav item
 * added or removed changes this result without changing any id already in it.
 *
 * The project type tag is declared for the same reason: `projectCount` is a
 * `count()` over every project, and a count carries no ids — publishing a new
 * project changes this number while leaving the payload otherwise identical.
 */
async function fetchSettings(): Promise<SettingsQueryResult> {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:settings', typeTag(PageTypeName.ProjectPage))

  const settings = await client.fetch<SettingsQueryResult>(SETTINGS_QUERY)

  for (const chunk of chunkCacheTags(collectCacheTags(settings))) {
    cacheTag(...chunk)
  }

  return settings
}

/**
 * Wrapped with React's cache() so multiple Server Components calling this
 * within the same request share a single round-trip.
 */
const getSettings = cache(fetchSettings)

export default getSettings
