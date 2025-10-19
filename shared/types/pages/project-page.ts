import { PageTypeName } from '../base'
import type { BasePageDocument, PageComponent } from './base'
import type { SanityImage } from '../sanity'

export interface ProjectPageDocument extends BasePageDocument {
  _type: PageTypeName.ProjectPage
  projectHero?: SanityImage
  projectComponents?: PageComponent[]
}
