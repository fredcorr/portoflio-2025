import groq from 'groq'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const contactPageFields = groq`
  ${basePageFields},
  contactComponents[] {
    _key,
    ${pageComponentFields}
  }
`
