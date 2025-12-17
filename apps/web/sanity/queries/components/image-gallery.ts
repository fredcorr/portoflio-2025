import groq from 'groq'
import { baseComponentFields, titleFields, imageFields } from '../fragments'

const title = titleFields('title')

export const imageGalleryFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  images[] {
    ${imageFields}
  }
`
