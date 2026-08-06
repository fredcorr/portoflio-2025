/**
 * The subset of the `web-vitals` `Metric` shape this module consumes. Next
 * ships that type without a declaration file, so it is restated here rather
 * than imported as an implicit `any`.
 */
export interface WebVitalMetric {
  id: string
  name: string
  value: number
}

/** The metrics App Router's `useReportWebVitals` subscribes to. */
export enum WebVitalName {
  CLS = 'CLS',
  FCP = 'FCP',
  FID = 'FID',
  INP = 'INP',
  LCP = 'LCP',
  TTFB = 'TTFB',
}

export enum WebVitalRating {
  Good = 'good',
  NeedsImprovement = 'needs-improvement',
  Poor = 'poor',
}

interface WebVitalThreshold {
  good: number
  poor: number
}

/** https://web.dev/articles/defining-core-web-vitals-thresholds */
const THRESHOLDS: Record<WebVitalName, WebVitalThreshold> = {
  [WebVitalName.CLS]: { good: 0.1, poor: 0.25 },
  [WebVitalName.FCP]: { good: 1800, poor: 3000 },
  [WebVitalName.FID]: { good: 100, poor: 300 },
  [WebVitalName.INP]: { good: 200, poor: 500 },
  [WebVitalName.LCP]: { good: 2500, poor: 4000 },
  [WebVitalName.TTFB]: { good: 800, poor: 1800 },
}

export interface WebVitalEvent extends Record<string, unknown> {
  event: 'web_vitals'
  metric_id: string
  metric_name: WebVitalName
  /** Milliseconds, or CLS × 1000 — GA4 cannot aggregate fractional values. */
  metric_value: number
  metric_rating: WebVitalRating
}

const isWebVitalName = (name: string): name is WebVitalName =>
  Object.values(WebVitalName).includes(name as WebVitalName)

export const getWebVitalRating = (
  name: WebVitalName,
  value: number
): WebVitalRating => {
  const { good, poor } = THRESHOLDS[name]
  if (value <= good) return WebVitalRating.Good
  if (value <= poor) return WebVitalRating.NeedsImprovement
  return WebVitalRating.Poor
}

/**
 * Maps a reported metric onto the dataLayer payload, or returns `null` for
 * anything that is not a Core Web Vital.
 */
export const buildWebVitalEvent = (
  metric: WebVitalMetric
): WebVitalEvent | null => {
  if (!isWebVitalName(metric.name)) return null

  return {
    event: 'web_vitals',
    metric_id: metric.id,
    metric_name: metric.name,
    metric_value: Math.round(
      metric.name === WebVitalName.CLS ? metric.value * 1000 : metric.value
    ),
    metric_rating: getWebVitalRating(metric.name, metric.value),
  }
}

/**
 * Pushes a Core Web Vital onto the GTM dataLayer. Storage consent is handled
 * downstream by Consent Mode on the GA4 tag, so no gating is needed here.
 */
export const pushWebVitalToDataLayer = (metric: WebVitalMetric): void => {
  const event = buildWebVitalEvent(metric)
  if (!event || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(event)
}
