import { groq } from 'next-sanity'
import { baseComponentFields } from '../fragments'

export const homepageHeroFields = groq`
  ${baseComponentFields},
  "title": title,
  "subtitle": subtitle,
  "getInTouchTitle": getInTouchTitle
`
