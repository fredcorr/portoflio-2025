import { PageTypeName } from '../base'
import type { BasePageDocument, PageComponent } from './base'

export interface HomePageDocument extends BasePageDocument {
  _type: PageTypeName.HomePage
  homepageComponents?: PageComponent[]
}
