import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/base'
import { client, previewClient } from '@/sanity/client'
import type { CmsPages } from '@portfolio/types/pages'

const getPage = async (slug: string, isDraft: boolean) => {
  const sanityClient = isDraft ? previewClient : client
  const page = await sanityClient.fetch<CmsPages | null>(PAGE_BY_SLUG_QUERY, {
    slug,
  })
  return page
}

export default getPage
