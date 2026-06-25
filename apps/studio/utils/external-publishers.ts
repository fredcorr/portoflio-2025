// Client for syndicating an article to Dev.to.
//
// Medium retired its publishing API, so Medium is handled in the UI as a
// "copy Markdown and paste it into the editor" flow instead of an API call.
//
// The Dev.to key is read from a SANITY_STUDIO_* env var, which is bundled into
// the Studio client. These helpers therefore run in the browser; if the Dev.to
// API rejects cross-origin requests, route them through a Studio-side proxy
// instead (see the implementation plan).

const DEVTO_API = 'https://dev.to/api'

export interface ArticlePayload {
  title: string
  markdown: string
  tags: string[]
  canonicalUrl?: string
}

export interface PublishResult {
  url: string
  id?: string
}

export class ExternalPublishError extends Error {
  constructor(
    public readonly platform: 'devto',
    message: string
  ) {
    super(message)
    this.name = 'ExternalPublishError'
  }
}

const getDevtoKey = (): string => {
  const key = process.env.SANITY_STUDIO_DEVTO_KEY
  if (!key) {
    throw new ExternalPublishError(
      'devto',
      'Missing SANITY_STUDIO_DEVTO_KEY environment variable.'
    )
  }
  return key
}

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json()
    return (
      body?.errors?.error ||
      body?.error ||
      body?.message ||
      `Request failed with status ${response.status}.`
    )
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

export const publishToDevto = async (
  payload: ArticlePayload
): Promise<PublishResult> => {
  const key = getDevtoKey()

  const response = await fetch(`${DEVTO_API}/articles`, {
    method: 'POST',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      article: {
        title: payload.title,
        body_markdown: payload.markdown,
        published: true,
        tags: payload.tags.slice(0, 4),
        canonical_url: payload.canonicalUrl,
      },
    }),
  })

  if (!response.ok) {
    throw new ExternalPublishError('devto', await readError(response))
  }

  const result = await response.json()
  const url = result?.url
  const id = result?.id
  if (!url || id === undefined) {
    throw new ExternalPublishError(
      'devto',
      'Dev.to response did not include id/URL.'
    )
  }

  return { url, id: String(id) }
}

export const unpublishFromDevto = async (articleId: string): Promise<void> => {
  const key = getDevtoKey()

  const response = await fetch(`${DEVTO_API}/articles/${articleId}`, {
    method: 'PUT',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ article: { published: false } }),
  })

  if (!response.ok) {
    throw new ExternalPublishError('devto', await readError(response))
  }
}
