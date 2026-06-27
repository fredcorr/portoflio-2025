import { ComponentTypeName } from '@portfolio/types/base'
import groq from 'groq'
import { aboutPageHeroFields } from './about-page-hero'
import { animatedStraplineFields } from './animated-strapline'
import { blockTextFields } from './block-text'
import { cardsFields } from './cards'
import { collaborateHighlightsFields } from './collaborate-highlights'
import { formFields } from './form'
import { faqsFields } from './faqs'
import { homepageHeroFields } from './homepage-hero'
import { imageGalleryFields } from './image-gallery'
import { processFields } from './process'
import { projectListingFields } from './project-listing'
import { statsFields } from './stats'
import { testimonialsFields } from './testimonials'
import { toolSetFields } from './tool-set'
import { workIndexFields } from './work-index'
import { journalsFeedFields } from './journals-feed'
import { journalsListingFields } from './journals-listing'

/**
 * Single keyed registry of organism GROQ fragments. Typing it as
 * `Record<ComponentTypeName, string>` forces a fragment for every component type —
 * omit one and this file fails to compile. `pageComponentFields` is generated from
 * it, so the query and the enum cannot drift apart. Plain strings only: no React is
 * pulled into the query layer's import graph.
 */
export const organismFragments: Record<ComponentTypeName, string> = {
  [ComponentTypeName.HomePageHero]: homepageHeroFields,
  [ComponentTypeName.ProjectListing]: projectListingFields,
  [ComponentTypeName.Testimonials]: testimonialsFields,
  [ComponentTypeName.Cards]: cardsFields,
  [ComponentTypeName.BlockText]: blockTextFields,
  [ComponentTypeName.AboutPageHero]: aboutPageHeroFields,
  [ComponentTypeName.CollaborateHighlights]: collaborateHighlightsFields,
  [ComponentTypeName.Process]: processFields,
  [ComponentTypeName.ImageGallery]: imageGalleryFields,
  [ComponentTypeName.Stats]: statsFields,
  [ComponentTypeName.Faqs]: faqsFields,
  [ComponentTypeName.ToolSet]: toolSetFields,
  [ComponentTypeName.Form]: formFields,
  [ComponentTypeName.AnimatedStrapline]: animatedStraplineFields,
  [ComponentTypeName.WorkIndex]: workIndexFields,
  [ComponentTypeName.JournalsFeed]: journalsFeedFields,
  [ComponentTypeName.JournalsListing]: journalsListingFields,
}

const componentSelectBranches = Object.entries(organismFragments)
  .map(
    ([type, fragment]) => `_type == "${type}" => {\n      ${fragment}\n    }`
  )
  .join(',\n    ')

export const pageComponentFields = groq`
  ...select(
    ${componentSelectBranches},
    true => {
      _type
    }
  )
`
