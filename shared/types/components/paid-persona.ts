import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import { PortableTextBlock } from '@portabletext/types'
import type { ComponentHeading } from './title'

export interface PaidPersonaComponent
  extends SanityComponentBase<ComponentTypeName.PaidPersona> {
  title?: ComponentHeading
  tagline?: string
  body?: PortableTextBlock[]
  availability?: string
}
