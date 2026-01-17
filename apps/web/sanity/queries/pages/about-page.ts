import groq from 'groq'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const aboutPageFields = groq`
  ${basePageFields},
  aboutComponents[] {
    _key,
    ${pageComponentFields}
  }
`
