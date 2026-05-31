import type { DocumentLocationResolvers } from 'sanity/presentation'

const pageResolver = {
  select: {
    title: 'title',
    slug: 'slug.current',
  },
  resolve(doc: { title?: string; slug?: string } | null) {
    if (!doc?.slug) return null
    const href = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`
    return {
      locations: [{ title: doc.title ?? 'Page', href }],
    }
  },
}

export const locate: DocumentLocationResolvers = {
  homepage: pageResolver,
  project: pageResolver,
  about: pageResolver,
  contact: pageResolver,
  article: pageResolver,
  page: pageResolver,
}
