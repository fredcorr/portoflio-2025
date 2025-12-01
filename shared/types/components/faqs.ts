import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface FaqItem {
  question?: string
  answer?: string
}

export interface FaqsComponent
  extends SanityComponentBase<ComponentTypeName.Faqs> {
  title?: ComponentHeading
  questions?: FaqItem[]
}
