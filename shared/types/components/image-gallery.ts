import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'

export interface ImageGalleryComponent
  extends SanityComponentBase<ComponentTypeName.ImageGallery> {
  title?: string
  subtitle?: PortableTextValue
  images?: SanityImage[]
}
