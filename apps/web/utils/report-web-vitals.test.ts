import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildWebVitalEvent,
  getWebVitalRating,
  WebVitalName,
  WebVitalRating,
  type WebVitalMetric,
} from './report-web-vitals'

const vital = (name: string, value: number): WebVitalMetric => ({
  id: `v1-${name}`,
  name,
  value,
})

describe('getWebVitalRating', () => {
  it('rates a value on the good boundary as good', () => {
    assert.equal(getWebVitalRating(WebVitalName.LCP, 2500), WebVitalRating.Good)
  })

  it('rates a value between the thresholds as needs-improvement', () => {
    assert.equal(
      getWebVitalRating(WebVitalName.LCP, 3200),
      WebVitalRating.NeedsImprovement
    )
  })

  it('rates a value past the poor threshold as poor', () => {
    assert.equal(getWebVitalRating(WebVitalName.LCP, 4001), WebVitalRating.Poor)
  })

  it('uses per-metric thresholds', () => {
    assert.equal(getWebVitalRating(WebVitalName.CLS, 0.1), WebVitalRating.Good)
    assert.equal(getWebVitalRating(WebVitalName.CLS, 0.3), WebVitalRating.Poor)
  })
})

describe('buildWebVitalEvent', () => {
  it('builds a dataLayer event for a Core Web Vital', () => {
    assert.deepEqual(buildWebVitalEvent(vital('LCP', 2531.4)), {
      event: 'web_vitals',
      metric_id: 'v1-LCP',
      metric_name: WebVitalName.LCP,
      metric_value: 2531,
      metric_rating: WebVitalRating.NeedsImprovement,
    })
  })

  it('scales CLS by 1000 so GA4 can aggregate it', () => {
    const event = buildWebVitalEvent(vital('CLS', 0.0512))
    assert.equal(event?.metric_value, 51)
  })

  it('ignores metrics that are not Core Web Vitals', () => {
    assert.equal(buildWebVitalEvent(vital('Next.js-hydration', 120)), null)
  })
})
