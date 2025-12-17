import { groq } from 'next-sanity'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const blockTextFields = groq`
  ${baseComponentFields},
  "title": ${title},
  isHeadingLarge,
  body,
  splitLayout
`
