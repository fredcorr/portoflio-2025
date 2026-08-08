import slugToBreadcrumbs, { buildPageUrl } from '@/utils/slug'
import type { BreadcrumbListSchema } from '@/types/json-schema'

export interface BreadcrumbPage {
  slug?: { current?: string }
  title?: string
  seoTitle?: string
}

/**
 * The label a page contributes as its own breadcrumb crumb. Templates render
 * the visible crumb from the same helper so the markup and the structured
 * data can never drift apart.
 */
export const getBreadcrumbLabel = (page: BreadcrumbPage): string | undefined =>
  page.seoTitle || page.title

export const getBreadcrumbSchema = (
  siteUrl: string,
  page: BreadcrumbPage,
  fallbackSlug?: string
): BreadcrumbListSchema | null => {
  const slug = page.slug?.current || fallbackSlug
  const items = slugToBreadcrumbs(slug, getBreadcrumbLabel(page)).filter(
    item => item.label.trim().length > 0
  )

  if (items.length === 0) {
    return null
  }

  const pageUrl = buildPageUrl(siteUrl, slug ?? undefined)
  const listItems = [
    { name: 'Home', item: siteUrl },
    ...items.map(item => ({
      name: item.label,
      item: item.href ? buildPageUrl(siteUrl, item.href) : pageUrl,
    })),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}
