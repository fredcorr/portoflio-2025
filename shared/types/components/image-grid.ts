import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface ImageGridComponent
  extends SanityComponentBase<ComponentTypeName.ImageGrid> {
  title?: ComponentHeading
  subtitle?: PortableTextValue
  images?: SanityImage[]
}
