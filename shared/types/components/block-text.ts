import type { PortableTextBlock } from '@portabletext/react'

import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface BlockTextComponent extends SanityComponentBase<ComponentTypeName.BlockText> {
  title?: ComponentHeading
  isHeadingLarge?: boolean
  body?: PortableTextBlock[]
  splitLayout?: boolean
}
