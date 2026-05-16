import { client } from '@/sanity/client'
import { LLMS_QUERY } from '@/sanity/queries/llms'
import { getSiteUrl } from '@/utils/get-site-url'
import { buildPageUrl } from '@/utils/slug'
import { PageTypeName } from '@portfolio/types/base'
import { NextResponse } from 'next/server'

export const revalidate = 604800

interface LlmsPage {
  _type: string
  title?: string
  slug?: { current?: string }
  seoDescription?: string
}

interface LlmsData {
  pages: LlmsPage[]
  settings?: { email?: string }
}

export async function GET(): Promise<NextResponse> {
  const siteUrl = getSiteUrl()

  let data: LlmsData = { pages: [] }

  try {
    data = await client.fetch<LlmsData>(LLMS_QUERY)
  } catch (error) {
    console.error('Failed to generate llms.txt:', error)
  }

  const { pages, settings } = data
  const sections: string[] = []

  sections.push(`# Federico Corradi — Portfolio`)
  sections.push(
    `\n> Designer and developer. This site showcases selected work, process, and thinking.`
  )

  if (settings?.email) {
    sections.push(`\nContact: ${settings.email}`)
  }

  const regularPages = pages.filter(p => p._type !== PageTypeName.ProjectPage)
  if (regularPages.length > 0) {
    sections.push(`\n## Pages`)
    for (const page of regularPages) {
      const slug = page.slug?.current ?? '/'
      const url = buildPageUrl(siteUrl, slug)
      const description = page.seoDescription ? `: ${page.seoDescription}` : ''
      sections.push(`- [${page.title ?? slug}](${url})${description}`)
    }
  }

  const projects = pages.filter(p => p._type === PageTypeName.ProjectPage)
  if (projects.length > 0) {
    sections.push(`\n## Projects`)
    for (const project of projects) {
      const slug = project.slug?.current ?? '/'
      const url = buildPageUrl(siteUrl, slug)
      const description = project.seoDescription
        ? `: ${project.seoDescription}`
        : ''
      sections.push(`- [${project.title ?? slug}](${url})${description}`)
    }
  }

  const body = sections.join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
    },
  })
}
