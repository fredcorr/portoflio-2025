import PreviewBanner from '@/components/organisms/PreviewBanner/PreviewBanner'
import { RenderTemplate } from '@/components/hoc/RenderTemplate'
import { ALL_PAGES_QUERY } from '@/sanity/queries/base'
import { CmsPages } from '@portfolio/types/pages'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import Script from 'next/script'
import getPage from '@/utils/get-page'
import { getSiteUrl } from '@/utils/get-site-url'
import { buildPageUrl } from '@/utils/slug'
import { getPageHeroImage } from '@/utils/get-page-hero-image'
import { getBreadcrumbSchema } from '@/utils/get-breadcrumb-schema'

export const revalidate = 10

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

const getOpenGraphImage = (page: CmsPages) => {
  const image = page.seoImage ?? getPageHeroImage(page)
  const imageUrl = image?.asset?.url

  if (!imageUrl) {
    return undefined
  }

  return [
    {
      url: imageUrl,
      width: image.asset?.metadata?.dimensions?.width,
      height: image.asset?.metadata?.dimensions?.height,
      alt: image.alt ?? page.seoTitle ?? page.title ?? 'Portfolio',
    },
  ]
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

  const siteUrl = getSiteUrl()
  const breadcrumbSchema = getBreadcrumbSchema(
    siteUrl,
    page.slug?.current || slug
  )

  return (
    <>
      {breadcrumbSchema && (
        <Script
          id="breadcrumb-ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      <main className="container mx-auto">
        {isDraft && <PreviewBanner />}
        <RenderTemplate page={page} />
      </main>
    </>
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || '/'
  const draft = await draftMode()
  const isDraft = draft.isEnabled

  try {
    const page = await getPage(slug, isDraft)

    if (!page) {
      return {}
    }

    const title = page.seoTitle ?? page.title
    const description = page.seoDescription
    const siteUrl = getSiteUrl()
    const url = buildPageUrl(siteUrl, page.slug?.current || slug)
    const openGraphImages = getOpenGraphImage(page)

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        images: openGraphImages,
      },
      twitter: {
        card: openGraphImages ? 'summary_large_image' : 'summary',
        title,
        description,
        images: openGraphImages?.map(image => image.url),
      },
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return {}
  }
}
