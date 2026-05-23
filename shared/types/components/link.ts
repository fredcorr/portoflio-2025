import type { PortableTextMarkDefinition } from '@portabletext/types'
import type { SanitySlug } from '../sanity'

export interface ExternalLinkMark extends PortableTextMarkDefinition {
  href: string
  openInNewTab?: boolean
}

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
