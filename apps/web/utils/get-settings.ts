import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/client'
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
 * Data Cache, so without it every render would hit the API. The settings query
 * dereferences `navigationItems[]->`, which are separate documents, hence the
 * coarse `sanity:content` tag alongside the specific one.
 */
async function fetchSettings(): Promise<SettingsQueryResult> {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:content', 'sanity:settings')
  return client.fetch<SettingsQueryResult>(SETTINGS_QUERY)
}

/**
 * Wrapped with React's cache() so multiple Server Components calling this
 * within the same request share a single round-trip.
 */
const getSettings = cache(fetchSettings)

export default getSettings
