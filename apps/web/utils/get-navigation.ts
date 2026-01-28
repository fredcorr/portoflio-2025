import { client } from '@/sanity/client'
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation'
import type { NavigationData } from '@portfolio/types/components'

const getNavigation = async () => {
  const navigation = await client.fetch<NavigationData>(NAVIGATION_QUERY)
  return navigation
}

export default getNavigation
