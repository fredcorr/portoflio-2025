import { ComponentTypeName } from '@portfolio/types/base'
import type { PageComponent } from '@portfolio/types/pages'
import ProjectListing from '../organisms/ProjectListing/ProjectListing'
import Cards from '../organisms/Cards/Cards'
import {
  AboutPageHero,
  AnimatedStrapline,
  BlockText,
  CollaborateHighlights,
  Faqs,
  Form,
  HomePageHero,
  ImageGallery,
  ImageGrid,
  Process,
  Stats,
  Testimonials,
  ToolSet,
} from '@/components/organisms'

interface RenderOrganismProps {
  component?: PageComponent | null
}

export const RenderOrganism = ({ component }: RenderOrganismProps) => {
  if (!component) {
    return null
  }

  switch (component._type) {
    case ComponentTypeName.HomePageHero:
      return <HomePageHero {...component} />
    case ComponentTypeName.ProjectListing:
      return <ProjectListing {...component} />
    case ComponentTypeName.Testimonials:
      return <Testimonials {...component} />
    case ComponentTypeName.Cards:
      return <Cards {...component} />
    case ComponentTypeName.BlockText:
      return <BlockText {...component} />
    case ComponentTypeName.AboutPageHero:
      return <AboutPageHero {...component} />
    case ComponentTypeName.CollaborateHighlights:
      return <CollaborateHighlights {...component} />
    case ComponentTypeName.Process:
      return <Process {...component} />
    case ComponentTypeName.ImageGallery:
      return <ImageGallery {...component} />
    case ComponentTypeName.ImageGrid:
      return <ImageGrid {...component} />
    case ComponentTypeName.Stats:
      return <Stats {...component} />
    case ComponentTypeName.Faqs:
      return <Faqs {...component} />
    case ComponentTypeName.ToolSet:
      return <ToolSet {...component} />
    case ComponentTypeName.Form:
      return <Form {...component} />
    case ComponentTypeName.AnimatedStrapline:
      return <AnimatedStrapline {...component} />
    default:
      return null
  }
}
