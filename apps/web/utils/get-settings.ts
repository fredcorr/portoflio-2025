import { cache } from 'react'
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries/settings'
import type { SettingsData } from '@portfolio/types/settings'

export interface SettingsQueryResult {
  settings?: SettingsData
  projectCount?: number
}

/**
 * Fetches global site settings from Sanity.
 * Wrapped with React's cache() so multiple Server Components calling this
 * within the same request share a single Sanity round-trip.
 */
const getSettings = cache(async () => {
  const data = await client.fetch<SettingsQueryResult>(SETTINGS_QUERY)
  return data
})

export default getSettings
