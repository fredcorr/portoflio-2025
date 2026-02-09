import groq from 'groq'
import { basePageFields, imageFields } from '../fragments'
import { pageComponentFields } from '../components'

export const articlePageFields = groq`
  ${basePageFields},
  _createdAt,
  _updatedAt,
  heroImage {
    ${imageFields}
  },
  tags,
  articleContent[],
  articleComponents[] {
    _key,
    ${pageComponentFields}
  }
`
