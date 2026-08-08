import PreviewBanner from '@/components/organisms/PreviewBanner/PreviewBanner'
import { RenderTemplate } from '@/components/hoc/RenderTemplate'
import { ALL_PAGES_QUERY } from '@/sanity/queries/base'
import { CmsPages } from '@portfolio/types/pages'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import type { Metadata } from 'next'
import getPage from '@/utils/get-page'
import getIsDraft from '@/utils/get-is-draft'
import { getSiteUrl } from '@/utils/get-site-url'
import { buildPageUrl } from '@/utils/slug'
import { getPageHeroImage } from '@/utils/get-page-hero-image'
import { getBreadcrumbSchema } from '@/utils/get-breadcrumb-schema'
import { getPageSchemas } from '@/utils/get-page-schemas'
import getSettings from '@/utils/get-settings'
import JsonLdSchema from '@/components/atoms/JsonLdSchema/JsonLdSchema'

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

/**
 * The banner is its own cached component so the Draft Mode read stays inside a
 * cache scope. Reading it in `Page` would make the whole route dynamic.
 */
async function DraftPreviewBanner() {
  'use cache'
  const isDraft = await getIsDraft()

  return isDraft ? <PreviewBanner /> : null
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || '/'

  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  const siteUrl = getSiteUrl()
  const breadcrumbSchema = getBreadcrumbSchema(siteUrl, page, slug)

  const { settings } = await getSettings()
  const pageSchemas = getPageSchemas(siteUrl, page, settings)

  return (
    <>
      {breadcrumbSchema && (
        <JsonLdSchema id="breadcrumb-ld-json" schema={breadcrumbSchema} />
      )}
      {pageSchemas.map(({ id, schema }) => (
        <JsonLdSchema key={id} id={id} schema={schema} />
      ))}
      <DraftPreviewBanner />
      <RenderTemplate page={page} />
    </>
  )
}

// Deliberately unguarded. Cache Components requires at least one param, so the
// old `catch → return []` is no longer legal. Letting the error propagate is
// also the better behaviour: swallowing it produced a green build that deployed
// a site with zero prerendered pages, which is worse than a loud failure.
export async function generateStaticParams() {
  const pages = await client.fetch(ALL_PAGES_QUERY)

  return pages.map((page: CmsPages) => {
    return {
      slug: page.slug?.current === '/' ? [] : page.slug?.current.split('/'),
    }
  })
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || '/'
  const isDraft = await getIsDraft()

  try {
    const page = await getPage(slug)

    if (!page) {
      return {}
    }

    const title = page.seoTitle ?? page.title
    const description = page.seoDescription
    const siteUrl = getSiteUrl()
    const url = buildPageUrl(siteUrl, page.slug?.current || slug)
    const openGraphImages = getOpenGraphImage(page)
    const indexPage = process.env.ALLOW_CRAWLERS === 'true' && !isDraft

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      robots: {
        index: indexPage,
        follow: indexPage,
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
