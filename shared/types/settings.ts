import type { NavigationItem, LinkItem } from './components'

export interface AuthorData {
  firstName?: string
  secondName?: string
  jobTitle?: string
}

export interface SettingsData extends AuthorData {
  email?: string
  navigationItems?: NavigationItem[]
  socialLinks?: LinkItem[]
  projectCount?: number
}
