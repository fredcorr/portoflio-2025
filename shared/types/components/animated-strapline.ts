import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface AnimatedStraplineComponent
  extends SanityComponentBase<ComponentTypeName.AnimatedStrapline> {
  strapline?: string
}
