import type { CmsPages } from '@portfolio/types/pages'
import { getPageHeroImage } from '@/utils/get-page-hero-image'

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt: string
}

const DEFAULT_ALT = 'Portfolio'

/**
 * Resolves the Open Graph images for a page: the editor's `seoImage` when set,
 * otherwise the page's hero image.
 *
 * Returns undefined when a page has neither, which omits the og:image tags
 * rather than inventing one — a page with no image is a content gap to fill in
 * the Studio, not something to paper over at render time.
 */
export const getOpenGraphImage = (
  page: CmsPages
): OpenGraphImage[] | undefined => {
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
      alt: image.alt ?? page.seoTitle ?? page.title ?? DEFAULT_ALT,
    },
  ]
}

export default getOpenGraphImage
