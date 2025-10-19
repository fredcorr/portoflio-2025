import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface CollaborateHighlightItem {
  title?: string
  subtitle?: string
  icon?: string
}

export interface CollaborateHighlightsComponent
  extends SanityComponentBase<ComponentTypeName.CollaborateHighlights> {
  title?: string
  highlights?: CollaborateHighlightItem[]
}
