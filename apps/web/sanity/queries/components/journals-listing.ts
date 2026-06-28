import groq from 'groq'
import {
  baseComponentFields,
  imageFields,
  titleFields,
  PUBLISHED_FILTER,
} from '../fragments'

const title = titleFields('title')

const PAGE_SIZE = 6

export const journalArticleFields = groq`
  _id,
  title,
  slug,
  tags,
  _createdAt,
  "articleContent": articleContent[],
  "editionNumber": coalesce(editionNumber, count(*[_type == "article" && _createdAt <= ^._createdAt])),
  "cardImage": coalesce(heroImage, seoImage) {
    ${imageFields}
  }
`

const articleBase = groq`_type == "article" && defined(slug.current) && ${PUBLISHED_FILTER}`

export const journalsListingFields = groq`
  ${baseComponentFields},
  "title": ${title},
  kicker,
  "initialData": {
    "articles": *[${articleBase}] | order(_createdAt desc) [0...${PAGE_SIZE}] {
      ${journalArticleFields}
    },
    "total": count(*[${articleBase}]),
    "categories": array::unique(*[${articleBase}].tags[]),
    "allTags": *[${articleBase}][].tags[]
  }
`
