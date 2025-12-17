import groq from 'groq'
import { baseComponentFields } from '../fragments'

export const homepageHeroFields = groq`
  ${baseComponentFields},
  "title": title,
  "subtitle": subtitle,
  "getInTouchTitle": getInTouchTitle
`
