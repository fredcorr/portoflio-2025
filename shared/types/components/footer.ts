import type { SettingsData } from '../settings'

export interface FooterProps extends Pick<SettingsData, 'email' | 'socialLinks'> {
  className?: string
}
