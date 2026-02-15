import { ComponentTypeName } from '@portfolio/types/base'
import type { PageComponent } from '@portfolio/types/pages'
import ProjectListing from '../organisms/ProjectListing/ProjectListing'
import Cards from '../organisms/Cards/Cards'
import Testimonials from '../organisms/Testimonials/Testimonials'
import {
  AboutPageHero,
  AnimatedStrapline,
  BlockText,
  CollaborateHighlights,
  Faqs,
  GetInTouch,
  HomePageHero,
  ImageGallery,
  Process,
  Stats,
  ToolSet,
} from '@/components/organisms'

interface RenderOrganismProps {
  component?: PageComponent | null
  componentIndex: number
  nextSectionId?: string
}

export const RenderOrganism = ({
  component,
  componentIndex,
  nextSectionId,
}: RenderOrganismProps) => {
  if (!component) {
    return null
  }

  const componentWithContext = {
    ...component,
    componentIndex,
  }

  switch (component._type) {
    case ComponentTypeName.HomePageHero:
      return (
        <HomePageHero
          {...componentWithContext}
          scrollTargetId={nextSectionId}
        />
      )
    case ComponentTypeName.ProjectListing:
      return <ProjectListing {...componentWithContext} />
    case ComponentTypeName.Testimonials:
      return <Testimonials {...componentWithContext} />
    case ComponentTypeName.Cards:
      return <Cards {...componentWithContext} />
    case ComponentTypeName.BlockText:
      return <BlockText {...componentWithContext} />
    case ComponentTypeName.AboutPageHero:
      return <AboutPageHero {...componentWithContext} />
    case ComponentTypeName.CollaborateHighlights:
      return <CollaborateHighlights {...componentWithContext} />
    case ComponentTypeName.Process:
      return <Process {...componentWithContext} />
    case ComponentTypeName.ImageGallery:
      return <ImageGallery {...componentWithContext} />
    case ComponentTypeName.Stats:
      return <Stats {...componentWithContext} />
    case ComponentTypeName.Faqs:
      return <Faqs {...componentWithContext} />
    case ComponentTypeName.ToolSet:
      return <ToolSet {...componentWithContext} />
    case ComponentTypeName.Form:
      return <GetInTouch {...componentWithContext} />
    case ComponentTypeName.AnimatedStrapline:
      return <AnimatedStrapline {...componentWithContext} />
    default:
      return null
  }
}
