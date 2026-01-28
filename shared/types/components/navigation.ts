import type { BasePageDocument } from '../pages/base'

export interface NavigationItem
  extends Pick<BasePageDocument, '_id' | 'title' | 'slug'> {}

export interface NavigationData {
  items: NavigationItem[]
  projectCount?: number
}
