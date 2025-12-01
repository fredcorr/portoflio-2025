// Sanity schema types

import type { SanityDocument } from '@sanity/client'

export interface BaseDocument extends SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

export interface SanityImageDimensions {
  width?: number
  height?: number
}

export interface SanityImageMetadata {
  lqip?: string
  dimensions?: SanityImageDimensions
}

export interface SanityReferenceAsset {
  _ref?: string
  _type?: 'reference'
  url?: string
  metadata?: SanityImageMetadata
}

export interface SanityImage {
  _type: 'image'
  asset: SanityReferenceAsset
  alt?: string
  caption?: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}
