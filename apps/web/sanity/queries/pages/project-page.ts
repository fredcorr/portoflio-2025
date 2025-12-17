import groq from 'groq'
import { basePageFields, imageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const projectPageFields = groq`
  ${basePageFields},
  projectHero {
    ${imageFields}
  },
  projectComponents[] {
    _key,
    ${pageComponentFields}
  }
`
