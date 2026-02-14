'use client'

import React from 'react'
import type { SettingsData } from '@portfolio/types/settings'

export interface SettingsProviderProps {
  initialSettings?: SettingsData
  children: React.ReactNode
}

export interface SettingsContextValue {
  settings: SettingsData
}

const DEFAULT_SETTINGS: SettingsData = {
  email: '',
  navigationItems: [],
  socialLinks: [],
}

const SettingsContext = React.createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
})

const SettingsProvider = ({
  initialSettings,
  children,
}: SettingsProviderProps) => {
  const [settings] = React.useState<SettingsData>(
    () => initialSettings ?? DEFAULT_SETTINGS
  )

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  )
}

const useSettings = () => React.useContext(SettingsContext)

export { SettingsProvider, useSettings }
export default SettingsProvider
