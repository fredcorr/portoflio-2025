import { groq } from 'next-sanity'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const pageTypeFields = groq`
  ${basePageFields},
  pageComponents[] {
    _key,
    ${pageComponentFields}
  }
`
