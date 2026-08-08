import { revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'
import { idTag, typeTag } from '@/utils/collect-cache-tags'

/**
 * Sanity webhook receiver. Invalidates cached content on publish.
 *
 * Configure in Sanity's API settings to POST here on create/update/delete,
 * with a projection that includes `_id`, `_type` and `slug`:
 *
 *   {"_id": _id, "_type": _type, "slug": slug.current}
 *
 * `_id` is required for precise invalidation — without it every publish falls
 * back to type-level tags, which is coarser than necessary.
 */

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
