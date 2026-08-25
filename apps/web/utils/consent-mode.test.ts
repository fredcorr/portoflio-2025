import { describe, it, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildConsentDefaultScript,
  CONSENT_DEFAULTS,
  ConsentState,
  updateAnalyticsConsent,
} from './consent-mode'

interface GtagCall {
  args: unknown[]
}

const withStubbedGtag = (run: (calls: GtagCall[]) => void): void => {
  const calls: GtagCall[] = []
  Object.defineProperty(globalThis, 'window', {
    value: { gtag: (...args: unknown[]) => calls.push({ args }) },
    configurable: true,
    writable: true,
  })
  run(calls)
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window')
})

describe('CONSENT_DEFAULTS', () => {
  it('declares all four Consent Mode v2 signals', () => {
    for (const signal of [
      'ad_storage',
      'ad_user_data',
      'ad_personalization',
      'analytics_storage',
    ]) {
      assert.equal(
        Object.hasOwn(CONSENT_DEFAULTS, signal),
        true,
        `missing signal: ${signal}`
      )
    }
  })

  it('denies every storage signal until the visitor opts in', () => {
    assert.equal(CONSENT_DEFAULTS.ad_storage, ConsentState.Denied)
    assert.equal(CONSENT_DEFAULTS.ad_user_data, ConsentState.Denied)
    assert.equal(CONSENT_DEFAULTS.ad_personalization, ConsentState.Denied)
    assert.equal(CONSENT_DEFAULTS.analytics_storage, ConsentState.Denied)
  })

  it('waits for a consent update so returning visitors are not sent as denied', () => {
    assert.equal(typeof CONSENT_DEFAULTS.wait_for_update, 'number')
    assert.ok(CONSENT_DEFAULTS.wait_for_update > 0)
  })
})

describe('buildConsentDefaultScript', () => {
  it('seeds the dataLayer before applying defaults', () => {
    const script = buildConsentDefaultScript()
    assert.ok(script.indexOf('window.dataLayer=window.dataLayer||[]') === 0)
    assert.match(script, /gtag\('consent','default',\{/)
  })

  it('serialises every default into the inline script', () => {
    const script = buildConsentDefaultScript()
    for (const [key, value] of Object.entries(CONSENT_DEFAULTS)) {
      assert.match(script, new RegExp(`"${key}":${JSON.stringify(value)}`))
    }
  })
})

describe('updateAnalyticsConsent', () => {
  it('grants analytics storage when the category is accepted', () => {
    withStubbedGtag(calls => {
      updateAnalyticsConsent(true)
      assert.deepEqual(calls[0]?.args, [
        'consent',
        'update',
        { analytics_storage: ConsentState.Granted },
      ])
    })
  })

  it('denies analytics storage when the category is rejected', () => {
    withStubbedGtag(calls => {
      updateAnalyticsConsent(false)
      assert.deepEqual(calls[0]?.args, [
        'consent',
        'update',
        { analytics_storage: ConsentState.Denied },
      ])
    })
  })

  it('is a no-op on the server', () => {
    assert.doesNotThrow(() => updateAnalyticsConsent(true))
  })
})
