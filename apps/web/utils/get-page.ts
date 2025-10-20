import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/base'
import { client, previewClient } from '@/sanity/client'

const getPage = async (slug: string, isDraft: boolean) => {
  const sanityClient = isDraft ? previewClient : client
  const page = await sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug })
  return page
}

export default getPage
