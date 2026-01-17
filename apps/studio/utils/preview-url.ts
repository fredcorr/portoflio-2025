import type { SanityDocument } from 'sanity'
import { PageTypeName } from '@portfolio/types/base'

type PreviewDocument = Partial<SanityDocument> & {
  slug?: {
    current?: string
  }
}

const normalizeSlug = (slug?: string | null) => {
  const normalized = slug?.replace(/^\/+/, '').trim()
  return normalized || undefined
}

const getPreviewBaseUrl = () => {
  const baseUrl =
    process.env.SANITY_STUDIO_PREVIEW_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'

  return baseUrl.replace(/\/$/, '')
}

export const resolvePreviewSlug = (document?: PreviewDocument) => {
  if (!document) {
    return undefined
  }

  if (document._type === PageTypeName.HomePage) {
    return undefined
  }

  return normalizeSlug(document.slug?.current)
}

export const getPreviewUrl = (document?: PreviewDocument) => {
  const secret = process.env.SANITY_STUDIO_PREVIEW_SECRET

  if (!secret) {
    return null
  }

  const url = new URL('/api/draft', getPreviewBaseUrl())
  url.searchParams.set('secret', secret)

  const slug = resolvePreviewSlug(document)
  if (slug) {
    url.searchParams.set('slug', slug)
  }

  return url.toString()
}
