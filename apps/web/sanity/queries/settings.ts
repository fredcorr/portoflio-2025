import groq from 'groq'
import { GlobalItemsType, PageTypeName } from '@portfolio/types/base'
import { PUBLISHED_FILTER } from './fragments'

export const SETTINGS_QUERY = groq`
  {
    "settings": *[_type == "${GlobalItemsType.Settings}"][0]{
      firstName,
      secondName,
      jobTitle,
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
