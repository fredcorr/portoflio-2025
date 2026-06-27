export const runtime = 'edge'

import { NextRequest } from 'next/server'
import { createClient } from '@sanity/client'
import { journalArticleFields } from '@/sanity/queries/components/journals-listing'
import { toListingArticle } from '@/utils/to-listing-article'
import type { JournalsListingArticleRaw } from '@portfolio/types/components'

const PAGE_SIZE = 6

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const categoriesParam = searchParams.get('categories')
  const categories = categoriesParam
    ? categoriesParam.split(',').filter(Boolean)
    : []
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

  const categoryClause =
    categories.length > 0 ? ` && count(tags[@ in $categories]) > 0` : ''
  const baseFilter = `_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))${categoryClause}`
  const params = categories.length > 0 ? { categories } : {}

  try {
    const { articles, total } = await sanity.fetch<{
      articles: JournalsListingArticleRaw[]
      total: number
    }>(
      `{
        "articles": *[${baseFilter}] | order(_createdAt desc) [$offset...$end] { ${journalArticleFields} },
        "total": count(*[${baseFilter}])
      }`,
      { offset, end: offset + PAGE_SIZE, ...params }
    )

    return Response.json({ articles: articles.map(toListingArticle), total })
  } catch {
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}
