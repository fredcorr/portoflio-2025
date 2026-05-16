import type { NavigationItem, LinkItem } from './components'

export interface SettingsData {
  firstName?: string
  secondName?: string
  jobTitle?: string
  email?: string
  navigationItems?: NavigationItem[]
  socialLinks?: LinkItem[]
  projectCount?: number
}
