import { ComponentTypeName } from '../base'

export interface ProjectListingComponent {
  _type: ComponentTypeName.ProjectListing
  title?: string
  subtitle?: unknown[]
  projects?: Array<{
    _type: 'reference'
    _ref: string
    _key?: string
  }>
}
