import { ComponentTypeName, PageTypeName } from '../base'

export * from './homePageHero'
export * from './projectListing'

export const baseComponents = Object.freeze<readonly ComponentTypeName[]>([
  ComponentTypeName.HomePageHero,
  ComponentTypeName.ProjectListing,
])

export const pageComponentsByType = Object.freeze(
  Object.values(PageTypeName).reduce(
    (acc, pageType) => {
      acc[pageType] = baseComponents
      return acc
    },
    {} as Record<PageTypeName, readonly ComponentTypeName[]>
  )
)
