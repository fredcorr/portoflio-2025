import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirect_to = searchParams.get('redirect') || '/'

  // Disable Draft Mode
  const draft = await draftMode()
  draft.disable()

  redirect(redirect_to)
}
