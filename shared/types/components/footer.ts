import type { SettingsData } from '../settings'

export interface FooterProps
  extends Pick<
    SettingsData,
    'email' | 'socialLinks' | 'navigationItems' | 'openForProjects' | 'availabilityText'
  > {
  className?: string
}
