import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface HomePageHeroComponent
  extends SanityComponentBase<ComponentTypeName.HomePageHero> {
  title?: string
  subtitle?: string
  getInTouchTitle?: string
}
