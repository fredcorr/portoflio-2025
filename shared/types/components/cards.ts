import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface CardItem {
  title?: string
  subtitle?: string
}

export interface CardsComponent
  extends SanityComponentBase<ComponentTypeName.Cards> {
  title?: string
  subtitle?: unknown[]
  items?: CardItem[]
}
