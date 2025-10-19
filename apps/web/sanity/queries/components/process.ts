import { groq } from 'next-sanity'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const processFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  steps[] {
    _key,
    "title": processStep_title,
    "subtitle": processStep_subtitle
  }
`
