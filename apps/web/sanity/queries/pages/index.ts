import { PageTypeName } from '@portfolio/types/base'
import groq from 'groq'
import { aboutPageFields } from './about-page'
import { contactPageFields } from './contact-page'
import { homePageFields } from './home-page'
import { pageTypeFields } from './page'
import { projectPageFields } from './project-page'
import { basePageFields } from '../fragments'

export {
  aboutPageFields,
  basePageFields,
  contactPageFields,
  homePageFields,
  pageTypeFields,
  projectPageFields,
}

export const pageDocumentFields = groq`
  ...select(
    _type == "${PageTypeName.HomePage}" => {
      ${homePageFields}
    },
    _type == "${PageTypeName.ProjectPage}" => {
      ${projectPageFields}
    },
    _type == "${PageTypeName.AboutPage}" => {
      ${aboutPageFields}
    },
    _type == "${PageTypeName.ContactPage}" => {
      ${contactPageFields}
    },
    _type == "${PageTypeName.Page}" => {
      ${pageTypeFields}
    },
    true => {
      ${basePageFields}
    }
  )
`
