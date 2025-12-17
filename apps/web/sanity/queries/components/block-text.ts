import groq from 'groq'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const blockTextFields = groq`
  ${baseComponentFields},
  "title": ${title},
  isHeadingLarge,
  body,
  splitLayout
`
