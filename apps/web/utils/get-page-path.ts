import type { SanitySlug } from '@portfolio/types/sanity'

export interface GetPagePathOptions {
  slug?: SanitySlug | null
  fallback?: string
}

const getPagePath = ({ slug, fallback = '/' }: GetPagePathOptions) => {
  const current = slug?.current?.trim()

  if (!current || current === '/') {
    return fallback
  }

  const normalized = current.replace(/^\/+/, '')
  return `/${normalized}`
}

export default getPagePath
