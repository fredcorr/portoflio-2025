import type { PortableTextMarkDefinition } from '@portabletext/types'
import type { SanitySlug } from '../sanity'

export interface LinkInternalReference {
  _ref?: string
  _id?: string
  title?: string
  slug?: SanitySlug
}

export interface LinkMark extends PortableTextMarkDefinition {
  href?: string
  openInNewTab?: boolean
  internalRef?: LinkInternalReference
}

export interface UrlPickerItem {
  _key?: string
  name?: string
  url?: string
  internal_ref?: LinkInternalReference
}
