'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import { updateAnalyticsConsent } from '@/utils/consent-mode'

export default function CookieBanner() {
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [{ name: /^(_ga|_gid|_gat)/ }],
          },
        },
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'This site uses cookies to understand how you use it. You can choose which categories to allow.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Essential cookies',
                  description:
                    'Required for the site to function. These cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics cookies',
                  description:
                    'Help us understand how visitors interact with the site so we can improve it. No personal data is collected.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
      guiOptions: {
        consentModal: {
          layout: 'bar',
          position: 'bottom',
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: false,
          flipButtons: false,
        },
      },
      onConsent: () => {
        updateAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
      },
      onChange: () => {
        updateAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
      },
    })
  }, [])

  return null
}
