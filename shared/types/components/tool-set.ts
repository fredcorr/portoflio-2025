import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { SanityComponentBase } from './base-component'

export interface ToolSetItem {
  title?: string
  subtitle?: string
  image?: SanityImage
}

export interface ToolSetComponent
  extends SanityComponentBase<ComponentTypeName.ToolSet> {
  title?: string
  tools?: ToolSetItem[]
}
