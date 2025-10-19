import { groq } from 'next-sanity'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const cardsFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  items[] {
    _key,
    "title": cardItem_title,
    "subtitle": cardItem_subtitle
  }
`
