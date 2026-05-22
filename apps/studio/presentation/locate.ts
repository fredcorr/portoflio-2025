import { defineLocations } from 'sanity/presentation'
import type { DocumentLocationResolverContext } from 'sanity/presentation'

export function locate(
  doc: { _type: string; title?: string; slug?: { current?: string } },
  _context: DocumentLocationResolverContext
) {
  const slug = doc.slug?.current
  if (!slug) return defineLocations({ locations: [] })

  const href = slug.startsWith('/') ? slug : `/${slug}`

  return defineLocations({
    locations: [{ title: doc.title ?? doc._type, href }],
  })
}
