import { ComponentTypeName } from '../base'
import type { SanityImage } from '../sanity'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export interface AboutPageHeroComponent
  extends SanityComponentBase<ComponentTypeName.AboutPageHero> {
  title?: ComponentHeading
  image?: SanityImage
  body?: PortableTextValue
  showCta?: boolean
}
