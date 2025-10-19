import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface FaqItem {
  question?: string
  answer?: string
}

export interface FaqsComponent
  extends SanityComponentBase<ComponentTypeName.Faqs> {
  title?: string
  questions?: FaqItem[]
}
