import groq from 'groq'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const testimonialsFields = groq`
  ${baseComponentFields},
  "title": ${title},
  testimonials[] {
    _key,
    "title": testimonialCard_title,
    "subtitle": testimonialCard_subtitle,
    "author": testimonialCard_author{
      "name": name,
      "role": role
    }
  }
`
