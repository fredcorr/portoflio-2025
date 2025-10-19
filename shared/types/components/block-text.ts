import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface BlockTextComponent
  extends SanityComponentBase<ComponentTypeName.BlockText> {
  title?: string
  body?: unknown[]
}
