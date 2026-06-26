export const runtime = 'edge'

import { NextRequest } from 'next/server'
import { createClient } from '@sanity/client'

const PAGE_SIZE = 6

const articleFields = `
  _id,
  title,
  slug,
  tags,
  _createdAt,
  readTime,
  "editionNumber": count(*[_type == "article" && _createdAt <= ^._createdAt]),
  "cardImage": coalesce(heroImage, seoImage) {
    ...,
    asset->{ _id, url, metadata{ lqip, dimensions{ height, width } } }
  }
`

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET

  if (!projectId || !dataset) {
    return Response.json({ error: 'Configuration error' }, { status: 500 })
  }

  const sanity = createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    useCdn: true,
    perspective: 'published',
    token: process.env.SANITY_API_READ_TOKEN,
  })

  const categoryClause = category ? ` && $category in tags` : ''
  const baseFilter = `_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))${categoryClause}`

  try {
    const [articles, total] = await Promise.all([
      sanity.fetch(
        `*[${baseFilter}] | order(_createdAt desc) [$offset...$end] { ${articleFields} }`,
        { offset, end: offset + PAGE_SIZE, ...(category && { category }) }
      ),
      sanity.fetch(
        `count(*[${baseFilter}])`,
        category ? { category } : {}
      ),
    ])

    return Response.json({ articles, total })
  } catch {
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}
