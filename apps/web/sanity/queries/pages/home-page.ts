import { groq } from 'next-sanity'
import { basePageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const homePageFields = groq`
  ${basePageFields},
  homepageComponents[] {
    _key,
    ${pageComponentFields}
  }
`
