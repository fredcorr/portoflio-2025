import groq from 'groq'
import { baseComponentFields } from '../fragments'

export const animatedStraplineFields = groq`
  ${baseComponentFields},
  "strapline": strapline
`
