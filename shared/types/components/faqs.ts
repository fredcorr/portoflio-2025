import type { PortableTextBlock } from '@portabletext/react'

import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface FaqItem {
  _key?: string
  question?: string
  answer?: PortableTextBlock[]
}

export interface FaqsComponent extends SanityComponentBase<ComponentTypeName.Faqs> {
  title?: ComponentHeading
  questions?: FaqItem[]
}
