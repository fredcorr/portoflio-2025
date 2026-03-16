import groq from 'groq'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const aboutPageHeroFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "body": body,
  "bodySecondary": bodySecondary,
  "location": location,
  "timezone": timezone,
  "languages": languages,
  "resumeUrl": resume.asset->url,
  "showCta": showCta
`
