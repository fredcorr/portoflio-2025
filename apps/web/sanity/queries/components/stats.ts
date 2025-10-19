import { groq } from 'next-sanity'
import { baseComponentFields } from '../fragments'

export const statsFields = groq`
  ${baseComponentFields},
  items[] {
    _key,
    "title": statItem_title,
    "subtitle": statItem_subtitle
  }
`
