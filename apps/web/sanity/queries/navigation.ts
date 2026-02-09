import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'
import groq from 'groq'

const PUBLISHED_FILTER = '!(_id in path("drafts.**"))'

export const NAVIGATION_QUERY = groq`
  {
    "items": *[_type == "${GlobalItemsType.Settings}"][0].navigationItems[]->[
      showInNavigation == true &&
      defined(slug.current) &&
      ${PUBLISHED_FILTER}
    ]{
      _id,
      title,
      slug
    },
    "projectCount": count(*[_type == "${PageTypeName.ProjectPage}" && defined(slug.current) && ${PUBLISHED_FILTER}])
  }
`
