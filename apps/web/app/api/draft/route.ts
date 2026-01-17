import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { previewClient } from '@/sanity/client'
import { PageTypeName } from '@portfolio/types/base'

const PAGE_TYPES = [
  PageTypeName.HomePage,
  PageTypeName.ProjectPage,
  PageTypeName.AboutPage,
  PageTypeName.ContactPage,
  PageTypeName.Page,
] as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const rawSlug = searchParams.get('slug')
  const slug = rawSlug?.replace(/^\/+/, '') || null
  const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET

  // Check the secret and next parameters
  if (!previewSecret || secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 })
  }

  // Fetch the page to check if it exists
  if (slug) {
    const page = await previewClient.fetch(
      `*[_type in $types && slug.current == $slug][0]`,
      { slug, types: PAGE_TYPES }
    )

    if (!page) {
      return new Response('Invalid slug', { status: 401 })
    }
  }

  // Enable Draft Mode by setting the cookie
  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the fetched page
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(slug ? `/${slug}` : '/')
}
