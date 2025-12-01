import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface CollaborateHighlightItem {
  title?: string
  subtitle?: string
  icon?: string
}

export interface CollaborateHighlightsComponent
  extends SanityComponentBase<ComponentTypeName.CollaborateHighlights> {
  title?: ComponentHeading
  highlights?: CollaborateHighlightItem[]
}
