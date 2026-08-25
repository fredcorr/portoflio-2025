import { revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'
import { countTag, idTag, typeTag } from '@/utils/collect-cache-tags'

/**
 * Sanity webhook receiver. Invalidates cached content on publish.
 *
 * Configure one webhook **per dataset** in Sanity's API settings, each pointing
 * at the deployment that serves that dataset, triggering on create, update and
 * delete. Set its `dataset` field explicitly — the field accepts `*`, meaning
 * every dataset in the project, which would send develop's publishes to
 * production.
 *
 * Projection:
 *
 *   {
 *     "_id": coalesce(_id, before()._id),
 *     "_type": coalesce(_type, before()._type),
 *     "slug": coalesce(slug.current, before().slug.current)
 *   }
 *
 * A bare `_id` is not enough. The payload is the document *after* the change,
 * and after a delete there is no document — so `before()` is the only way to
 * learn which document went away. Deletes are precisely when accurate tags
 * matter most: an unpublished article has to leave the listings and the
 * sitemap, and nothing else will tell them.
 *
 * `_id` drives precise invalidation; without it a publish falls back to
 * type-level tags, which is coarser than necessary.
 */

/**
 * Sent on every delivery, so they are readable even when the projection
 * resolves to nothing — which is the normal case for a delete.
 */
const DATASET_HEADER = 'sanity-dataset'
const OPERATION_HEADER = 'sanity-operation'

/**
 * The one operation that cannot change the size of a set. Anything else —
 * including a header we do not recognise — fires the count tag, so an
 * unexpected value over-invalidates rather than silently freezing a total.
 */
const NON_SET_CHANGING_OPERATION = 'update'

const PAGE_TYPES: string[] = [
  PageTypeName.HomePage,
  PageTypeName.ProjectPage,
  PageTypeName.AboutPage,
  PageTypeName.ContactPage,
  PageTypeName.ArticlePage,
  PageTypeName.Page,
]

interface WebhookPayload {
  _id?: string
  _type?: string
  slug?: string
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return Response.json(
      { error: 'Revalidation secret not configured.' },
      { status: 500 }
    )
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  if (!signature) {
    return Response.json({ error: 'Missing signature.' }, { status: 401 })
  }

  // The raw body string is what the signature is computed over, so read it as
  // text and parse afterwards rather than using request.json().
  const body = await request.text()

  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  // Each deployment reads exactly one dataset, so an event from any other one
  // describes content this cache does not hold. Distinct secrets per
  // environment should already prevent it, but a webhook whose `dataset` is
  // left as `*` fires for every dataset in the project — and because `prod` is
  // cloned from `develop`, document ids match across them, so those events
  // would land on real id tags and evict live entries.
  //
  // Nothing would be served wrong: each deployment refetches from its own
  // dataset. The cost is cache thrash, and it is silent, which is why this
  // answers loudly rather than ignoring the event. Sanity treats 4xx as
  // undeliverable and stops retrying, and the response body surfaces in the
  // webhook attempts log.
  const eventDataset = request.headers.get(DATASET_HEADER)

  if (eventDataset !== process.env.SANITY_DATASET) {
    return Response.json(
      {
        error: `Dataset mismatch: event for "${eventDataset}", this deployment serves "${process.env.SANITY_DATASET}".`,
      },
      { status: 400 }
    )
  }

  let payload: WebhookPayload

  try {
    payload = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const tags = new Set<string>()

  // Two complementary tags, because neither covers the other's case.
  //
  // The id tag is exact: it hits precisely the cache entries that dereferenced
  // this document, so fixing a typo in one article leaves every unrelated page
  // cached.
  //
  // The type tag is what handles *creates and deletes*. A newly published
  // article has an id that was never in any cache entry, so no id tag can
  // match it — only a listing that recorded "this entry depends on articles
  // collectively" will be invalidated.
  //
  // Regeneration is lazy: revalidateTag only marks entries stale, and fresh
  // data is fetched when a page using the tag is next visited. So this does not
  // trigger a burst of rebuilds.
  if (payload._id) {
    tags.add(idTag(payload._id))
  }

  if (payload._type) {
    tags.add(typeTag(payload._type))
  }

  // The count tag is the type tag's narrower sibling, for entries whose only
  // set dependency is a `count()`. A total moves when a document enters or
  // leaves the set and never when one is edited, so withholding this on an
  // update keeps a copy edit on some project from evicting the site settings
  // and navigation — entries every page depends on.
  //
  // Deliberately not `=== 'create' || === 'delete'`: an unreadable or
  // unexpected operation should over-invalidate, not freeze a total.
  if (
    payload._type &&
    request.headers.get(OPERATION_HEADER) !== NON_SET_CHANGING_OPERATION
  ) {
    tags.add(countTag(payload._type))
  }

  if (payload._type && PAGE_TYPES.includes(payload._type)) {
    // Listing surfaces change whenever any page-like document does, including
    // on create and delete, which no id in the existing result can signal.
    tags.add('sanity:sitemap')
    tags.add('sanity:llms')

    if (payload.slug) {
      tags.add(`sanity:page:${payload.slug}`)
    }
  }

  if (payload._type === GlobalItemsType.Settings) {
    tags.add('sanity:settings')
  }

  // A payload carrying neither an id nor a type tells us nothing about what to
  // invalidate. Falling back to the coarse tag over-invalidates, which is the
  // safe direction — serving stale content is the worse failure.
  if (tags.size === 0) {
    tags.add('sanity:content')
  }

  // 'max' gives stale-while-revalidate: the next visitor is served the cached
  // copy immediately while fresh data loads in the background. The deprecated
  // single-argument form expires the entry outright, making that visitor wait
  // on a live Sanity round-trip — do not use it here.
  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return Response.json({ revalidated: true, tags: [...tags] })
}
