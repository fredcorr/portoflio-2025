import groq from 'groq'
import { basePageFields, imageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const articlePageFields = groq`
  ${basePageFields},
  _createdAt,
  _updatedAt,
  "author": *[_type == "settings"][0]{ firstName, secondName, jobTitle },
  seoDescription,
  heroImage {
    ${imageFields}
  },
  tags,
  articleContent[],
  articleComponents[] {
    _key,
    ${pageComponentFields}
  },
  "editionNumber": count(*[_type == "article" && _createdAt <= ^._createdAt]),
  "relatedArticles": *[
    _type == "article" && _id != ^._id
    && count(tags[@ in ^.tags]) > 0
  ] | order(_createdAt desc) [0...3] {
    title,
    slug,
    tags,
    _createdAt,
    heroImage {
      ${imageFields}
    },
    "editionNumber": count(*[_type == "article" && _createdAt <= ^._createdAt])
  }
`
