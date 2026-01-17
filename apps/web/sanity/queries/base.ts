import { pageDocumentFields, basePageFields } from './pages'
import { PageTypeName } from '@portfolio/types/base'
import groq from 'groq'

const PAGE_TYPES = [
  PageTypeName.HomePage,
  PageTypeName.ProjectPage,
  PageTypeName.AboutPage,
  PageTypeName.ContactPage,
  PageTypeName.Page,
] as const

const PAGE_TYPE_FILTER = PAGE_TYPES.map(type => `"${type}"`).join(', ')

export const ALL_PAGES_QUERY = groq`
*[_type in [${PAGE_TYPE_FILTER}]]{
  ${basePageFields}
  }
  `

export const SITEMAP_PAGES_QUERY = groq`
*[_type in [${PAGE_TYPE_FILTER}]]{
  slug,
  "updateDate": coalesce(_updatedAt, _createdAt)
}
`

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type in [${PAGE_TYPE_FILTER}] && slug.current == $slug ][0]{
    ${pageDocumentFields}
  }
`

export const HOMEPAGE_QUERY = groq`
  *[_type == "${PageTypeName.HomePage}"][0]{
    ${pageDocumentFields}
  }
`
