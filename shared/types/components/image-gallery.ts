import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface ImageGalleryComponent
  extends SanityComponentBase<ComponentTypeName.ImageGallery> {
  title?: ComponentHeading
  subtitle?: PortableTextValue
  images?: SanityImage[]
}
