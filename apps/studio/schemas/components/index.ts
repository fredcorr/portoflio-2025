import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import HomePageHero from './organisms/homepage-hero'
import ProjectListing from './organisms/project-listing'
import Testimonials from './organisms/testimonials'
import Cards from './organisms/cards'
import BlockText from './organisms/block-text'
import AboutPageHero from './organisms/about-page-hero'
import CollaborateHighlights from './organisms/collaborate-highlights'
import Process from './organisms/process'
import ImageGallery from './organisms/image-gallery'
import Stats from './organisms/stats'
import Faqs from './organisms/faqs'
import ToolSet from './organisms/tool-set'
import Form from './organisms/form'
import AnimatedStrapline from './organisms/animated-strapline'
import WorkIndex from './organisms/work-index'
import JournalsFeed from './organisms/journals-feed'
import JournalsListing from './organisms/journals-listing'

import { type ObjectDefinition } from 'sanity'
import List from './atoms/list'

/**
 * Single keyed registry of organism schemas. Typing it as
 * `Record<ComponentTypeName, ObjectDefinition>` forces an entry for every
 * component type — omit one and the Studio build fails to compile, instead of
 * silently shipping a component editors can author but the web can't render.
 */
const componentSchemas: Record<ComponentTypeName, ObjectDefinition> = {
  [ComponentTypeName.HomePageHero]: HomePageHero,
  [ComponentTypeName.ProjectListing]: ProjectListing,
  [ComponentTypeName.Testimonials]: Testimonials,
  [ComponentTypeName.Cards]: Cards,
  [ComponentTypeName.BlockText]: BlockText,
  [ComponentTypeName.AboutPageHero]: AboutPageHero,
  [ComponentTypeName.CollaborateHighlights]: CollaborateHighlights,
  [ComponentTypeName.Process]: Process,
  [ComponentTypeName.ImageGallery]: ImageGallery,
  [ComponentTypeName.Stats]: Stats,
  [ComponentTypeName.Faqs]: Faqs,
  [ComponentTypeName.ToolSet]: ToolSet,
  [ComponentTypeName.Form]: Form,
  [ComponentTypeName.AnimatedStrapline]: AnimatedStrapline,
  [ComponentTypeName.WorkIndex]: WorkIndex,
  [ComponentTypeName.JournalsFeed]: JournalsFeed,
  [ComponentTypeName.JournalsListing]: JournalsListing,
}

export const components: ObjectDefinition[] = Object.values(componentSchemas)

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
