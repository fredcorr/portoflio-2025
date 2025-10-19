import { groq } from 'next-sanity'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const aboutPageFields = groq`
  ${basePageFields},
  aboutComponents[] {
    _key,
    ${pageComponentFields}
  }
`
