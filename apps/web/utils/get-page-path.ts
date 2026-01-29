import type { SanitySlug } from '@portfolio/types/sanity'

export interface GetPagePathOptions {
  slug?: string | null
  fallback?: string
}

const getPagePath = ({ slug, fallback = '/' }: GetPagePathOptions) => {
  const current = slug?.trim()

  if (!current || current === '/') {
    return fallback
  }

  const normalized = current.replace(/^\/+/, '')
  return `/${normalized}`
}

export default getPagePath
