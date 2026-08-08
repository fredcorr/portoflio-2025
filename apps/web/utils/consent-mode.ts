export enum ConsentState {
  Granted = 'granted',
  Denied = 'denied',
}

/**
 * Consent Mode v2 defaults, applied before Google Tag Manager loads.
 *
 * Google treats the consent state as incomplete unless all four signals are
 * declared, which degrades GA4's behavioural modelling. The site collects no
 * advertising consent, so the `ad_*` signals are declared denied and are never
 * granted — only `analytics_storage` is driven by the cookie banner.
 *
 * `wait_for_update` holds tag firing briefly so a returning visitor's stored
 * consent (restored by the banner after hydration) is applied before the first
 * hit. Without it their opening pageview is always sent as denied.
 */
export const CONSENT_DEFAULTS = {
  ad_storage: ConsentState.Denied,
  ad_user_data: ConsentState.Denied,
  ad_personalization: ConsentState.Denied,
  analytics_storage: ConsentState.Denied,
  wait_for_update: 500,
} as const

/** Inline script that seeds the dataLayer and applies the defaults above. */
export const buildConsentDefaultScript = (): string =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',${JSON.stringify(CONSENT_DEFAULTS)})`

export const updateAnalyticsConsent = (granted: boolean): void => {
  if (typeof window === 'undefined') return

  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? ConsentState.Granted : ConsentState.Denied,
  })
}
