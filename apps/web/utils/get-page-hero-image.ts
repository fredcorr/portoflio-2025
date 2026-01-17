import { PageTypeName } from '@portfolio/types/base'
import type { CmsPages } from '@portfolio/types/pages'
import type { SanityImage } from '@portfolio/types/sanity'

export const getPageHeroImage = (page: CmsPages): SanityImage | undefined => {
  if (page._type === PageTypeName.ProjectPage && page.projectHero) {
    return page.projectHero
  }

  return undefined
}
