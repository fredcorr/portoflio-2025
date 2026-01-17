import type { BreadcrumbItem } from '@portfolio/types/components'

interface FormatSlugSegmentTitleOptions {
  delimiter?: RegExp
}

const formatSlugSegmentTitle = (
  segment: string,
  options: FormatSlugSegmentTitleOptions = {}
): string => {
  const delimiter = options.delimiter ?? /[-_]+/g
  const decoded = (() => {
    try {
      return decodeURIComponent(segment)
    } catch {
      return segment
    }
  })()

  const normalized = decoded.replace(delimiter, ' ').trim().toLowerCase()

  if (!normalized) {
    return ''
  }

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const slugToBreadcrumbs = (slug?: string | null): BreadcrumbItem[] => {
  const normalized = slug
    ?.split('?')[0]
    ?.replace(/^\/+|\/+$/g, '')
    .trim()

  if (!normalized) {
    return []
  }

  const segments = normalized.split('/').filter(Boolean)

  if (segments.length === 0) {
    return []
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const label = formatSlugSegmentTitle(segment)

    const item: BreadcrumbItem = {
      label,
    }

    !isLast && (item.href = href)
    isLast && (item.isCurrent = true)

    return item
  })
}

export const buildPageUrl = (siteUrl: string, slug?: string) => {
  if (!slug || slug === '/') {
    return siteUrl
  }

  const normalizedSlug = slug.replace(/^\/+/, '')
  return `${siteUrl}/${normalizedSlug}`
}

export default slugToBreadcrumbs
