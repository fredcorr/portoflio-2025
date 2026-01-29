import groq from 'groq'
import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'

const PUBLISHED_FILTER = '!(_id in path("drafts.**"))'

export const SETTINGS_QUERY = groq`
  {
    "settings": *[_type == "${GlobalItemsType.Settings}"][0]{
      email,
      "navigationItems": (navigationItems[]->{
        _id,
        title,
        slug
      })[
        defined(slug.current) &&
        ${PUBLISHED_FILTER}
      ]{
        _id,
        title,
        slug
      },
      socialLinks[]{
        name,
        url,
        "internal_ref": internal_ref->{
          _id,
          title,
          slug
        }
      }
    },
    "projectCount": count(*[
      _type == "${PageTypeName.ProjectPage}" &&
      defined(slug.current) &&
      ${PUBLISHED_FILTER}
    ])
  }
`
