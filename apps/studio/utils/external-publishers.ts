// Clients for syndicating an article to Medium and Dev.to.
//
// Auth tokens are read from SANITY_STUDIO_* env vars, which are bundled into
// the Studio client. These helpers therefore run in the browser; if the
// platform APIs reject cross-origin requests, route them through a Studio-side
// proxy instead (see the implementation plan).

const MEDIUM_API = 'https://api.medium.com/v1'
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
    public readonly platform: 'medium' | 'devto',
    message: string
  ) {
    super(message)
    this.name = 'ExternalPublishError'
  }
}

const getMediumToken = (): string => {
  const token = process.env.SANITY_STUDIO_MEDIUM_TOKEN
  if (!token) {
    throw new ExternalPublishError(
      'medium',
      'Missing SANITY_STUDIO_MEDIUM_TOKEN environment variable.'
    )
  }
  return token
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

export const publishToMedium = async (
  payload: ArticlePayload
): Promise<PublishResult> => {
  const token = getMediumToken()
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // The Medium post endpoint is scoped to a user id, fetched from /me.
  const meResponse = await fetch(`${MEDIUM_API}/me`, { headers })
  if (!meResponse.ok) {
    throw new ExternalPublishError('medium', await readError(meResponse))
  }
  const me = await meResponse.json()
  const userId = me?.data?.id
  if (!userId) {
    throw new ExternalPublishError(
      'medium',
      'Could not resolve Medium user id.'
    )
  }

  const response = await fetch(`${MEDIUM_API}/users/${userId}/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: payload.title,
      contentFormat: 'markdown',
      content: payload.markdown,
      tags: payload.tags.slice(0, 5),
      canonicalUrl: payload.canonicalUrl,
      publishStatus: 'public',
    }),
  })

  if (!response.ok) {
    throw new ExternalPublishError('medium', await readError(response))
  }

  const result = await response.json()
  const url = result?.data?.url
  if (!url) {
    throw new ExternalPublishError(
      'medium',
      'Medium response did not include a URL.'
    )
  }

  return { url, id: result?.data?.id }
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
