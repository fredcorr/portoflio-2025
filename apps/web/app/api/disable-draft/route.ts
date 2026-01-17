import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawSlug = searchParams.get('slug')
  const slug = rawSlug?.replace(/^\/+/, '') || ''

  const draft = await draftMode()
  draft.disable()

  redirect(slug ? `/${slug}` : '/')
}
