import type { ReactNode } from 'react'
import { ComponentTypeName } from '@portfolio/types/base'
import type { PageComponent } from '@portfolio/types/pages'
import ProjectListing from '../organisms/ProjectListing/ProjectListing'
import WorkIndex from '../organisms/WorkIndex/WorkIndex'
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
  JournalsFeed,
  Process,
  Stats,
  ToolSet,
} from '@/components/organisms'

interface OrganismRenderContext {
  nextSectionId?: string
}

/** The exact props an organism receives: its own union member, plus the index. */
type ComponentOf<T extends ComponentTypeName> = Extract<
  PageComponent,
  { _type: T }
> & { componentIndex: number }

/**
 * The render registry. Typed as a mapped type over `ComponentTypeName`, so every
 * component type MUST have an entry — omit one and this file fails to compile, instead
 * of the component silently rendering as `null` at runtime. Each entry is typed to its
 * own component's props (no `any`), so the two non-uniform cases — `HomePageHero`
 * (needs `scrollTargetId`) and `Form` → `GetInTouch` (name mismatch) — are just
 * ordinary entries.
 */
type OrganismComponents = {
  [T in ComponentTypeName]: (
    component: ComponentOf<T>,
    context: OrganismRenderContext
  ) => ReactNode
}

const organismComponents: OrganismComponents = {
  [ComponentTypeName.HomePageHero]: (component, { nextSectionId }) => (
    <HomePageHero {...component} scrollTargetId={nextSectionId} />
  ),
  [ComponentTypeName.ProjectListing]: component => (
    <ProjectListing {...component} />
  ),
  [ComponentTypeName.Testimonials]: component => (
    <Testimonials {...component} />
  ),
  [ComponentTypeName.Cards]: component => <Cards {...component} />,
  [ComponentTypeName.BlockText]: component => <BlockText {...component} />,
  [ComponentTypeName.AboutPageHero]: component => (
    <AboutPageHero {...component} />
  ),
  [ComponentTypeName.CollaborateHighlights]: component => (
    <CollaborateHighlights {...component} />
  ),
  [ComponentTypeName.Process]: component => <Process {...component} />,
  [ComponentTypeName.ImageGallery]: component => (
    <ImageGallery {...component} />
  ),
  [ComponentTypeName.Stats]: component => <Stats {...component} />,
  [ComponentTypeName.Faqs]: component => <Faqs {...component} />,
  [ComponentTypeName.ToolSet]: component => <ToolSet {...component} />,
  [ComponentTypeName.Form]: component => <GetInTouch {...component} />,
  [ComponentTypeName.AnimatedStrapline]: component => (
    <AnimatedStrapline {...component} />
  ),
  [ComponentTypeName.WorkIndex]: component => <WorkIndex {...component} />,
  [ComponentTypeName.JournalsFeed]: component => (
    <JournalsFeed {...component} />
  ),
}

/**
 * Erased renderer signature used at the dispatch site. The mapped type above
 * guarantees `_type` and entry are aligned, so a single localized assertion bridges
 * the runtime `_type` to its entry — an assertion, not `any`.
 */
type OrganismRenderer = (
  component: PageComponent & { componentIndex: number },
  context: OrganismRenderContext
) => ReactNode

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

  // The registry is exhaustive over `ComponentTypeName` at compile time, but the CMS
  // can still emit a `_type` outside the enum (drafts, legacy, or content authored on
  // another branch). Fall back to rendering nothing, matching the previous switch's
  // `default: return null` rather than crashing the render.
  const render = organismComponents[component._type] as
    | OrganismRenderer
    | undefined

  if (!render) {
    return null
  }

  return render({ ...component, componentIndex }, { nextSectionId })
}
