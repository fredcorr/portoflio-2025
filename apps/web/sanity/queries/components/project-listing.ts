import { groq } from 'next-sanity'
import { baseComponentFields, imageFields, titleFields } from '../fragments'

const title = titleFields('title')

export const projectListingFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  projects[] {
    _key,
    "project": projectReference->{
      _id,
      _type,
      title,
      slug,
      "projectHero": projectHero{
        ${imageFields}
      },
      "seoImage": seoImage{
        ${imageFields}
      }
    }
  },
  "showCtaToProjects": showCtaToProjects,
  "splitLayout": splitLayout
`
