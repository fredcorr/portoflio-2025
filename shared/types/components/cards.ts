import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface CardItem {
  title?: string
  subtitle?: string
}

export interface CardsComponent
  extends SanityComponentBase<ComponentTypeName.Cards> {
  title?: ComponentHeading
  subtitle?: unknown[]
  items?: CardItem[]
}
