import { draftMode } from 'next/headers'

/**
 * Reads Draft Mode from inside a `use cache` scope.
 *
 * `draftMode()` is a dynamic API. Read directly in a Server Component it puts a
 * dynamic hole in that route, which is what demoted every page from `●` (fully
 * prerendered) to `◐` (partial prerender) — a static shell from the CDN, but
 * origin compute on every request. Because the read sat in both the root layout
 * and the catch-all page, it applied site-wide.
 *
 * Reading `isEnabled` inside a cached scope is the documented pattern. It works
 * because Draft Mode bypasses the cache wholesale: on a draft request every
 * `use cache` scope re-executes and its result is discarded, so this returns
 * `true` and nothing preview-related is ever written to the shared cache. On a
 * published request it prerenders as `false` and the route stays static.
 */
const getIsDraft = async (): Promise<boolean> => {
  'use cache'
  const { isEnabled } = await draftMode()
  return isEnabled
}

export default getIsDraft
