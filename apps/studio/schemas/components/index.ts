import { PageTypeName } from '@portfolio/types/base'
import HomePageHero from './organisms/homepage-hero'
import ProjectListing from './organisms/project-listing'
import { type ObjectDefinition } from 'sanity'
import List from './atoms/list'

type ComponentCollection = ObjectDefinition[]

export const components: ComponentCollection = [HomePageHero, ProjectListing]

export const componentsByPageType = (pageType: PageTypeName) => {
  return List({
    name: `${pageType}Components`,
    title: 'Components',
    type: 'array',
    of: components,
  })
}
