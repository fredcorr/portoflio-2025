import Link from 'next/link'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { client, previewClient } from '@/sanity/client'
import { PAGE_BY_SLUG_QUERY, ALL_PAGES_QUERY } from '@/sanity/queries'

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

async function getPage(slug: string, isDraft: boolean) {
  const sanityClient = isDraft ? previewClient : client
  const page = await sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug })
  return page
}

export async function generateStaticParams() {
  // Skip static generation if Sanity credentials aren't configured
  if (
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder'
  ) {
    return []
  }

  try {
    const pages = await client.fetch(ALL_PAGES_QUERY)
    return pages.map((page: { slug: { current: string } }) => ({
      slug: page.slug.current === '/' ? [] : page.slug.current.split('/'),
    }))
  } catch (error) {
    console.warn('Failed to fetch pages for static generation:', error)
    return []
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || '/'
  const draft = await draftMode()
  const isDraft = draft.isEnabled

  const page = await getPage(slug, isDraft)

  if (!page) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {isDraft && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Draft Mode</p>
          <p>
            You are viewing draft content.{' '}
            <Link
              href="/api/disable-draft"
              className="underline hover:text-yellow-800"
            >
              Exit draft mode
            </Link>
          </p>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      {/* Add your page content rendering here */}
    </main>
  )
}
