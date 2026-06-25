import { documentEventHandler } from '@sanity/functions'
import { createClient } from '@sanity/client'
import { portableTextToMarkdown } from '../../shared/utils/portable-text-to-markdown'
import { throwOnHttpError } from '../../shared/utils/throw-on-http-error'
import type { PortableTextValue } from '../../shared/utils/portable-text-to-markdown'

const API_VERSION = '2024-01-01'
const DEVTO_API = 'https://dev.to/api'

interface ArticleDocument {
  _id: string
  title?: string
  slug?: { current?: string }
  tags?: string[]
  articleContent?: PortableTextValue
  devtoSyndicate?: boolean
  devtoPublishedUrl?: string
  devtoArticleId?: string
}

const getDevtoKey = (): string => {
  const key = process.env.DEVTO_KEY
  if (!key) throw new Error('Missing DEVTO_KEY environment variable.')
  return key
}

export default documentEventHandler(async (event, context) => {
  const doc = event.data as ArticleDocument

  const wantsSyndicated = doc.devtoSyndicate === true
  const alreadySyndicated = Boolean(doc.devtoArticleId)

  // No-op: steady state — prevents infinite loop after patch
  if (wantsSyndicated && alreadySyndicated) return
  if (!wantsSyndicated && !alreadySyndicated) return

  const client = createClient({
    ...context.clientOptions,
    apiVersion: API_VERSION,
  })

  if (wantsSyndicated) {
    const key = getDevtoKey()
    const markdown = portableTextToMarkdown(doc.articleContent)
    const canonicalPath = doc.slug?.current
      ? `https://fredcorr.com/journals/${doc.slug.current}`
      : undefined

    const response = await fetch(`${DEVTO_API}/articles`, {
      method: 'POST',
      headers: {
        'api-key': key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        article: {
          title: doc.title ?? 'Untitled',
          body_markdown: markdown,
          published: true,
          tags: (doc.tags ?? []).slice(0, 4),
          canonical_url: canonicalPath,
        },
      }),
    })

    await throwOnHttpError(response, 'Dev.to')
    const result = await response.json()

    await client
      .patch(doc._id)
      .set({
        devtoPublishedUrl: result.url,
        devtoArticleId: String(result.id),
      })
      .commit({ dryRun: context.local })

    return
  }

  // devtoSyndicate is off but article was previously synced → unpublish
  const key = getDevtoKey()
  const response = await fetch(`${DEVTO_API}/articles/${doc.devtoArticleId}`, {
    method: 'PUT',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ article: { published: false } }),
  })

  await throwOnHttpError(response, 'Dev.to')

  await client
    .patch(doc._id)
    .unset(['devtoPublishedUrl', 'devtoArticleId'])
    .commit({ dryRun: context.local })
})
