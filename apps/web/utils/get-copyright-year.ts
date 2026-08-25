import { cacheLife } from 'next/cache'

/**
 * The current year, for the footer copyright line.
 *
 * Reading `new Date()` directly in a Client Component fails the Cache
 * Components prerender (`blocking-prerender-current-time-client`), and it is
 * synchronous IO, so `instant = false` does not defer it. Because `Footer`
 * lives in the root layout, that blocks every route.
 *
 * Resolving it in a cached Server Component keeps the footer inside the static
 * shell — wrapping it in `<Suspense>` instead would put a dynamic hole in the
 * root layout and drop every route from static to partial prerender, costing an
 * origin request site-wide for a copyright year.
 *
 * The lifetime is spelled out rather than using the stock `days` profile. A
 * route's effective `expire` is the minimum across every cache scope feeding
 * it, and `days` expires after a week — which would drag every page's expiry
 * down from a year to a week, since this runs in the root layout. `revalidate`
 * still refreshes daily, so the year self-corrects across a New Year boundary
 * without a deploy; `expire` only governs how long a completely untouched entry
 * stays usable, where a stale year is harmless.
 */
export default async function getCopyrightYear(): Promise<number> {
  'use cache'
  cacheLife({ stale: 300, revalidate: 86400, expire: 31536000 })
  return new Date().getFullYear()
}
