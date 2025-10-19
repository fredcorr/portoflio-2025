import { ComponentTypeName } from '@portfolio/types/base'
import { groq } from 'next-sanity'
import { aboutPageHeroFields } from './about-page-hero'
import { animatedStraplineFields } from './animated-strapline'
import { blockTextFields } from './block-text'
import { cardsFields } from './cards'
import { collaborateHighlightsFields } from './collaborate-highlights'
import { formFields } from './form'
import { faqsFields } from './faqs'
import { homepageHeroFields } from './homepage-hero'
import { imageGalleryFields } from './image-gallery'
import { imageGridFields } from './image-grid'
import { processFields } from './process'
import { projectListingFields } from './project-listing'
import { statsFields } from './stats'
import { testimonialsFields } from './testimonials'
import { toolSetFields } from './tool-set'

export {
  homepageHeroFields,
  aboutPageHeroFields,
  animatedStraplineFields,
  blockTextFields,
  cardsFields,
  collaborateHighlightsFields,
  formFields,
  faqsFields,
  imageGalleryFields,
  imageGridFields,
  processFields,
  projectListingFields,
  statsFields,
  testimonialsFields,
  toolSetFields,
}

export const pageComponentFields = groq`
  ...select(
    _type == "${ComponentTypeName.HomePageHero}" => {
      ${homepageHeroFields}
    },
    _type == "${ComponentTypeName.ProjectListing}" => {
      ${projectListingFields}
    },
    _type == "${ComponentTypeName.Testimonials}" => {
      ${testimonialsFields}
    },
    _type == "${ComponentTypeName.Cards}" => {
      ${cardsFields}
    },
    _type == "${ComponentTypeName.BlockText}" => {
      ${blockTextFields}
    },
    _type == "${ComponentTypeName.AboutPageHero}" => {
      ${aboutPageHeroFields}
    },
    _type == "${ComponentTypeName.CollaborateHighlights}" => {
      ${collaborateHighlightsFields}
    },
    _type == "${ComponentTypeName.Process}" => {
      ${processFields}
    },
    _type == "${ComponentTypeName.ImageGallery}" => {
      ${imageGalleryFields}
    },
    _type == "${ComponentTypeName.ImageGrid}" => {
      ${imageGridFields}
    },
    _type == "${ComponentTypeName.Stats}" => {
      ${statsFields}
    },
    _type == "${ComponentTypeName.Faqs}" => {
      ${faqsFields}
    },
    _type == "${ComponentTypeName.ToolSet}" => {
      ${toolSetFields}
    },
    _type == "${ComponentTypeName.Form}" => {
      ${formFields}
    },
    _type == "${ComponentTypeName.AnimatedStrapline}" => {
      ${animatedStraplineFields}
    },
    true => {
      _type
    }
  )
`
