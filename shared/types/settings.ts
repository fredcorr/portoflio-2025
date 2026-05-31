import type { NavigationItem, UrlPickerItem } from './components'

export interface AuthorData {
  firstName?: string
  secondName?: string
  jobTitle?: string
}

export interface SettingsData extends AuthorData {
  email?: string
  navigationItems?: NavigationItem[]
  socialLinks?: UrlPickerItem[]
  projectCount?: number
  openForProjects?: boolean
  availabilityText?: string
}
