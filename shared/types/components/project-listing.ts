import { ComponentTypeName } from '../base'
import type { SanityComponentBase } from './base-component'

export interface ProjectListingComponent
  extends SanityComponentBase<ComponentTypeName.ProjectListing> {
  title?: string
  subtitle?: unknown[]
  projects?: Array<{
    _type: 'reference'
    _ref: string
    _key?: string
  }>
}
