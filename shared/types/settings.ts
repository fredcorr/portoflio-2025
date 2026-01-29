import type { NavigationItem, LinkItem } from './components'

export interface SettingsData {
  email?: string
  navigationItems?: NavigationItem[]
  socialLinks?: LinkItem[]
  projectCount?: number
}
