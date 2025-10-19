import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface StatsItem {
  title?: string
  subtitle?: string
}

export interface StatsComponent
  extends SanityComponentBase<ComponentTypeName.Stats> {
  items?: StatsItem[]
}
