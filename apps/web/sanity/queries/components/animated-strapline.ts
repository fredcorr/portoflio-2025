import { groq } from 'next-sanity'
import { baseComponentFields } from '../fragments'

export const animatedStraplineFields = groq`
  ${baseComponentFields},
  "strapline": strapline
`
