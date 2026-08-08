import { revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'

/**
 * Sanity webhook receiver. Invalidates cached content on publish.
 *
 * Configure in Sanity's API settings to POST here on create/update/delete,
 * with a projection that includes `_type` and `slug`:
 *
 *   {"_type": _type, "slug": slug.current}
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

  // The coarse tag is what makes this correct. Page queries dereference
  // documents that change independently of the page displaying them —
  // `articles[]->`, `projects[]->`, `projectTags[]->`, `navigationItems[]->` —
  // so a webhook for an edited project carries that project's own type and
  // slug, and would never match the slug of the page listing it. Invalidating
  // `sanity:content` on any publish closes that whole class of miss without
  // trying to model the reference graph.
  //
  // Regeneration is lazy: revalidateTag only marks entries stale, and fresh
  // data is fetched when a page using the tag is next visited. So this does not
  // trigger a burst of rebuilds.
  tags.add('sanity:content')

  if (payload._type && PAGE_TYPES.includes(payload._type)) {
    // Listing surfaces change whenever any page-like document does.
    tags.add('sanity:sitemap')
    tags.add('sanity:llms')

    if (payload.slug) {
      tags.add(`sanity:page:${payload.slug}`)
    }
  }

  if (payload._type === GlobalItemsType.Settings) {
    tags.add('sanity:settings')
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
