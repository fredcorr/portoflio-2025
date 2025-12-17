import { groq } from 'next-sanity'
import { baseComponentFields, imageFields, titleFields } from '../fragments'

const title = titleFields('title')

const projectFields = groq`
  _id,
  _type,
  title,
  _key,
  slug,
  seoDescription,
  clientName,
  projectTags,
  "projectHero": projectHero{
    ${imageFields}
  },
  "seoImage": seoImage{
    ${imageFields}
  }
`

export const projectListingFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  "projects": select(
    count(projects[]->slug.current) > 0 => projects[]->{ ${projectFields} },
    *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]
      | order(coalesce(_updatedAt, _createdAt) desc)[0...6]{
        ${projectFields}
      }
  ),
  "showCtaToProjects": showCtaToProjects,
  "splitLayout": splitLayout
`
