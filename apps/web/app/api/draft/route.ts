import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { previewClient } from '@/sanity/client'
import { PageTypeName } from '@portfolio/types/base'
import { validatePreviewUrl } from '@sanity/preview-url-secret'

const PAGE_TYPES = [
  PageTypeName.HomePage,
  PageTypeName.ProjectPage,
  PageTypeName.AboutPage,
  PageTypeName.ContactPage,
  PageTypeName.ArticlePage,
  PageTypeName.Page,
] as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const draft = await draftMode()

  // Presentation Tool flow: validates against Sanity-stored one-time token
  if (searchParams.has('sanity-preview-secret')) {
    const { isValid, redirectTo = '/' } = await validatePreviewUrl(
      previewClient,
      request.url
    )

    if (!isValid) {
      return new Response('Invalid preview URL', { status: 401 })
    }

    draft.enable()
    redirect(redirectTo)
  }

  // Legacy flow: validates against env-var secret
  const secret = searchParams.get('secret')
  const rawSlug = searchParams.get('slug')
  const slug = rawSlug?.replace(/^\/+/, '') || null
  const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET

  if (!previewSecret || secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 })
  }

  if (slug) {
    const page = await previewClient.fetch(
      `*[_type in $types && slug.current == $slug][0]`,
      { slug, types: PAGE_TYPES }
    )

    if (!page) {
      return new Response('Invalid slug', { status: 401 })
    }
  }

  draft.enable()
  redirect(slug ? `/${slug}` : '/')
}
