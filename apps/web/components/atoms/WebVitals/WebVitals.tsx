'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { pushWebVitalToDataLayer } from '@/utils/report-web-vitals'

/**
 * Reports Core Web Vitals to the GTM dataLayer as a `web_vitals` custom event.
 * GA4 does not measure field vitals on its own, so without this the site has
 * visitors but no vitals. Rendered by `GtmProvider`, so it is inert when
 * `NEXT_PUBLIC_GTM_ID` is unset.
 */
export default function WebVitals() {
  useReportWebVitals(pushWebVitalToDataLayer)

  return null
}
