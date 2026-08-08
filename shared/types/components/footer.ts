import type { SettingsData } from '../settings'

export interface FooterProps
  extends Pick<
    SettingsData,
    'email' | 'socialLinks' | 'navigationItems' | 'openForProjects' | 'availabilityText'
  > {
  /** Current year for the copyright line, resolved on the server. */
  year: number
  className?: string
}
