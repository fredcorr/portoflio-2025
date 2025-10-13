import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { previewClient } from '@/sanity/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check the secret and next parameters
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Fetch the page to check if it exists
  if (slug) {
    const page = await previewClient.fetch(
      `*[_type == "page" && slug.current == $slug][0]`,
      { slug }
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
