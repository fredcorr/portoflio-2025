import { RenderTemplate } from '@/components/hoc/RenderTemplate'
import { client, previewClient } from '@/sanity/client'
import { PageTypeName } from '@portfolio/types/base'
import { notFound } from 'next/navigation'
import { PAGE_BY_SLUG_QUERY, ALL_PAGES_QUERY } from '@/sanity/queries/base'

import { draftMode } from 'next/headers'
import Link from 'next/link'

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
      {/* <RenderTemplate page={page} /> */}
    </main>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await client.fetch(ALL_PAGES_QUERY)

    return pages
      .map((page: { _type: string; slug?: { current?: string | null } }) => {
        if (page._type === PageTypeName.HomePage) {
          return { slug: [] as string[] }
        }

        const current = page.slug?.current
        if (!current) {
          return null
        }

        return {
          slug: current === '/' ? [] : current.split('/'),
        }
      })
      .filter(
        (value: { slug: string[] } | null): value is { slug: string[] } =>
          value !== null
      )
  } catch (error) {
    console.warn('Failed to fetch pages for static generation:', error)
    return []
  }
}
