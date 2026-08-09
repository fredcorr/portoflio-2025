import assert from 'node:assert/strict'
import test from 'node:test'

import { PageTypeName } from '@portfolio/types/base'
import type { ArticlePageDocument, PageDocument } from '@portfolio/types/pages'
import type { SanityImage } from '@portfolio/types/sanity'

import { getOpenGraphImage } from './get-open-graph-image'

const baseDocumentFields = {
  _id: 'page-1',
  _createdAt: '2026-01-01T00:00:00Z',
  _updatedAt: '2026-01-01T00:00:00Z',
  _rev: 'rev-1',
}

const makePage = (overrides: Partial<PageDocument> = {}): PageDocument => ({
  ...baseDocumentFields,
  _type: PageTypeName.Page,
  title: 'About',
  ...overrides,
})

const makeArticle = (
  overrides: Partial<ArticlePageDocument> = {}
): ArticlePageDocument => ({
  ...baseDocumentFields,
  _type: PageTypeName.ArticlePage,
  title: 'An article',
  ...overrides,
})

const makeImage = (
  url: string,
  overrides: Partial<SanityImage> = {}
): SanityImage => ({
  _type: 'image',
  asset: {
    url,
    metadata: { dimensions: { width: 1600, height: 900 } },
  },
  ...overrides,
})

const SEO_IMAGE_URL = 'https://cdn.sanity.io/images/abc/production/seo.jpg'
const HERO_IMAGE_URL = 'https://cdn.sanity.io/images/abc/production/hero.jpg'

test('uses the seoImage and carries its real dimensions', () => {
  const images = getOpenGraphImage(
    makePage({
      seoImage: makeImage(SEO_IMAGE_URL, { alt: 'A chosen image' }),
    })
  )

  assert.deepEqual(images, [
    {
      url: SEO_IMAGE_URL,
      width: 1600,
      height: 900,
      alt: 'A chosen image',
    },
  ])
})

test('falls back to the hero image when no seoImage is set', () => {
  const images = getOpenGraphImage(
    makeArticle({ heroImage: makeImage(HERO_IMAGE_URL) })
  )

  assert.equal(images?.[0].url, HERO_IMAGE_URL)
})

test('prefers seoImage over the hero image when both exist', () => {
  const images = getOpenGraphImage(
    makeArticle({
      seoImage: makeImage(SEO_IMAGE_URL),
      heroImage: makeImage(HERO_IMAGE_URL),
    })
  )

  assert.equal(images?.[0].url, SEO_IMAGE_URL)
})

test('returns undefined when the page has no image at all', () => {
  assert.equal(getOpenGraphImage(makePage()), undefined)
})

test('ignores a hero image on a page type that has no hero', () => {
  // getPageHeroImage only resolves heroes for project and article pages, so a
  // plain page must not pick one up even if the field is present.
  const images = getOpenGraphImage(
    makePage({ heroImage: makeImage(HERO_IMAGE_URL) } as Partial<PageDocument>)
  )

  assert.equal(images, undefined)
})

test('falls back through seoTitle then title for alt text', () => {
  const withSeoTitle = getOpenGraphImage(
    makePage({
      seoTitle: 'SEO title',
      title: 'Plain title',
      seoImage: makeImage(SEO_IMAGE_URL),
    })
  )
  assert.equal(withSeoTitle?.[0].alt, 'SEO title')

  const withTitleOnly = getOpenGraphImage(
    makePage({ title: 'Plain title', seoImage: makeImage(SEO_IMAGE_URL) })
  )
  assert.equal(withTitleOnly?.[0].alt, 'Plain title')

  const withNeither = getOpenGraphImage(
    makePage({ title: undefined, seoImage: makeImage(SEO_IMAGE_URL) })
  )
  assert.equal(withNeither?.[0].alt, 'Portfolio')
})

test('tolerates an image whose asset has no dimension metadata', () => {
  const images = getOpenGraphImage(
    makePage({
      seoImage: { _type: 'image', asset: { url: SEO_IMAGE_URL } },
    })
  )

  assert.equal(images?.[0].width, undefined)
  assert.equal(images?.[0].height, undefined)
})
