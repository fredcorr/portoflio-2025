import type { SanitySlug } from '../sanity'

export interface LinkInternalReference {
  _id?: string
  title?: string
  slug?: SanitySlug
}

export interface LinkItem {
  _key?: string
  name?: string
  url?: string
  internal_ref?: LinkInternalReference
}
