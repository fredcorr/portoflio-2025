import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries/settings'
import type { SettingsData } from '@portfolio/types/settings'

export interface SettingsQueryResult {
  settings?: SettingsData
  projectCount?: number
}

const getSettings = async () => {
  const data = await client.fetch<SettingsQueryResult>(SETTINGS_QUERY)
  return data
}

export default getSettings
