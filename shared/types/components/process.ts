import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface ProcessStep {
  title?: string
  subtitle?: string
}

export interface ProcessComponent
  extends SanityComponentBase<ComponentTypeName.Process> {
  title?: string
  subtitle?: string
  steps?: ProcessStep[]
}
