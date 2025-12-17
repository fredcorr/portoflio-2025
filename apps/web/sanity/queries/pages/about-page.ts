import groq from 'groq'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const aboutPageFields = groq`
  ${basePageFields},
  pageComponents[] {
    _key,
    ${pageComponentFields}
  }
`
