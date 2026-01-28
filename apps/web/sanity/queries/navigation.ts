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
const PUBLISHED_FILTER = '!(_id in path("drafts.**"))'

export const NAVIGATION_QUERY = groq`
  {
    "items": *[_type in [${PAGE_TYPE_FILTER}] && showInNavigation == true && defined(slug.current) && ${PUBLISHED_FILTER}] | order(title asc){
      _id,
      title,
      slug
    },
    "projectCount": count(*[_type == "${PageTypeName.ProjectPage}" && defined(slug.current) && ${PUBLISHED_FILTER}])
  }
`
