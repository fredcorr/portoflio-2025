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
  sectionId?: string
  nextSectionId?: string
}

export const RenderOrganism = ({
  component,
  sectionId,
  nextSectionId,
}: RenderOrganismProps) => {
  if (!component) {
    return null
  }

  const componentWithSection = sectionId
    ? { ...component, sectionId }
    : component

  switch (component._type) {
    case ComponentTypeName.HomePageHero:
      return (
        <HomePageHero
          {...componentWithSection}
          scrollTargetId={nextSectionId}
        />
      )
    case ComponentTypeName.ProjectListing:
      return <ProjectListing {...componentWithSection} />
    case ComponentTypeName.Testimonials:
      return <Testimonials {...componentWithSection} />
    case ComponentTypeName.Cards:
      return <Cards {...componentWithSection} />
    case ComponentTypeName.BlockText:
      return <BlockText {...componentWithSection} />
    case ComponentTypeName.AboutPageHero:
      return <AboutPageHero {...componentWithSection} />
    case ComponentTypeName.CollaborateHighlights:
      return <CollaborateHighlights {...componentWithSection} />
    case ComponentTypeName.Process:
      return <Process {...componentWithSection} />
    case ComponentTypeName.ImageGallery:
      return <ImageGallery {...componentWithSection} />
    case ComponentTypeName.Stats:
      return <Stats {...componentWithSection} />
    case ComponentTypeName.Faqs:
      return <Faqs {...componentWithSection} />
    case ComponentTypeName.ToolSet:
      return <ToolSet {...componentWithSection} />
    case ComponentTypeName.Form:
      return <GetInTouch {...componentWithSection} />
    case ComponentTypeName.AnimatedStrapline:
      return <AnimatedStrapline {...componentWithSection} />
    default:
      return null
  }
}
