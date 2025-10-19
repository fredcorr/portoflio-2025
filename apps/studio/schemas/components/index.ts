import { PageTypeName } from '@portfolio/types/base'
import HomePageHero from './organisms/homepage-hero'
import ProjectListing from './organisms/project-listing'
import Testimonials from './organisms/testimonials'
import Cards from './organisms/cards'
import BlockText from './organisms/block-text'
import AboutPageHero from './organisms/about-page-hero'
import CollaborateHighlights from './organisms/collaborate-highlights'
import Process from './organisms/process'
import ImageGallery from './organisms/image-gallery'
import ImageGrid from './organisms/image-grid'
import Stats from './organisms/stats'
import Faqs from './organisms/faqs'
import ToolSet from './organisms/tool-set'
import Form from './organisms/form'
import AnimatedStrapline from './organisms/animated-strapline'
import { type ObjectDefinition } from 'sanity'
import List from './atoms/list'

type ComponentCollection = ObjectDefinition[]

export const components: ComponentCollection = [
  HomePageHero,
  ProjectListing,
  Testimonials,
  Cards,
  BlockText,
  AboutPageHero,
  CollaborateHighlights,
  Process,
  ImageGallery,
  ImageGrid,
  Stats,
  Faqs,
  ToolSet,
  Form,
  AnimatedStrapline,
]

export const componentsByPageType = (pageType: PageTypeName) => {
  const componentArrayMembers = components.map(component => ({
    type: component.name,
  }))

  return List({
    name: `${pageType}Components`,
    title: 'Components',
    type: 'array',
    of: componentArrayMembers,
  })
}
