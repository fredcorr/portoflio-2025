import { cacheLife, cacheTag } from 'next/cache'
import { client } from '@/sanity/client'
import { NAVIGATION_QUERY } from '@/sanity/queries/navigation'
import type { NavigationData } from '@portfolio/types/components'

const getNavigation = async () => {
  'use cache'
  cacheLife('cmsPage')
  cacheTag('sanity:content', 'sanity:settings')
  const navigation = await client.fetch<NavigationData>(NAVIGATION_QUERY)
  return navigation
}

export default getNavigation
