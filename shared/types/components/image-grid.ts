import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'

export interface ImageGridComponent
  extends SanityComponentBase<ComponentTypeName.ImageGrid> {
  title?: string
  subtitle?: PortableTextValue
  images?: SanityImage[]
}
