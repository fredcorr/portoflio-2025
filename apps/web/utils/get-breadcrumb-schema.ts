import slugToBreadcrumbs, { buildPageUrl } from '@/utils/slug'

type BreadcrumbListSchema = {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export const getBreadcrumbSchema = (
  siteUrl: string,
  slug?: string | null
): BreadcrumbListSchema | null => {
  const items = slugToBreadcrumbs(slug).filter(
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
