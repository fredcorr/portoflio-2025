import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface ToolSetItem {
  _key?: string
  title?: string
  subtitle?: string
  image?: SanityImage
}

export interface ToolSetComponent extends SanityComponentBase<ComponentTypeName.ToolSet> {
  title?: ComponentHeading
  tools?: ToolSetItem[]
}
