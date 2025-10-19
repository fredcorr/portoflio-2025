import { PageTypeName } from '../base'
import type { BasePageDocument, PageComponent } from './base'

export interface PageDocument extends BasePageDocument {
  _type: PageTypeName.Page
  pageComponents?: PageComponent[]
}
