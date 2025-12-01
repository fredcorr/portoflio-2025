import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface ProcessStep {
  title?: string
  subtitle?: string
}

export interface ProcessComponent
  extends SanityComponentBase<ComponentTypeName.Process> {
  title?: ComponentHeading
  subtitle?: string
  steps?: ProcessStep[]
}
