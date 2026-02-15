import { ComponentTypeName } from '@portfolio/types/base'
import type { PageComponent } from '@portfolio/types/pages'
import { getComponentSectionId } from '@/utils/get-component-section-id'
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
  nextComponent?: PageComponent
}

export const RenderOrganism = ({
  component,
  componentIndex,
  nextComponent,
}: RenderOrganismProps) => {
  if (!component) {
    return null
  }

  const sectionId = getComponentSectionId(component, componentIndex)
  const componentWithSection = { ...component, sectionId }

  switch (component._type) {
    case ComponentTypeName.HomePageHero: {
      const nextSectionId = nextComponent
        ? getComponentSectionId(nextComponent, componentIndex + 1)
        : undefined

      return (
        <HomePageHero
          {...componentWithSection}
          scrollTargetId={nextSectionId}
        />
      )
    }
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
