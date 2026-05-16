import groq from 'groq'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

const journalArticleFields = groq`
  _id,
  _type,
  title,
  slug,
  tags,
  _createdAt,
  "articleContent": articleContent[]
`

export const journalsFeedFields = groq`
  ${baseComponentFields},
  "title": ${title},
  kicker,
  ctaLabel,
  "ctaLink": ctaLink {
    name,
    url,
    "internal_ref": internal_ref->{ _id, title, slug }
  },
  "articles": articles[]->{ ${journalArticleFields} }
`
