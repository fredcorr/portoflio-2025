import PreviewBanner from '@/components/organisms/PreviewBanner/PreviewBanner'
import { RenderTemplate } from '@/components/hoc/RenderTemplate'
import { ALL_PAGES_QUERY } from '@/sanity/queries/base'
import { CmsPages } from '@portfolio/types/pages'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { draftMode } from 'next/headers'
import getPage from '@/utils/get-page'

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
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
    <main className="container mx-auto">
      {isDraft && <PreviewBanner />}
      <RenderTemplate page={page} />
    </main>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await client.fetch(ALL_PAGES_QUERY)

    return pages.map((page: CmsPages) => {
      return {
        slug: page.slug?.current === '/' ? [] : page.slug?.current.split('/'),
      }
    })
  } catch (error) {
    console.warn('Failed to fetch pages for static generation:', error)
    return []
  }
}
