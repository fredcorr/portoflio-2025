import { groq } from 'next-sanity'
import { baseComponentFields, imageFields, titleFields } from '../fragments'

const title = titleFields('title')

export const aboutPageHeroFields = groq`
  ${baseComponentFields},
  "title": ${title},
  image {
    ${imageFields}
  },
  "body": body,
  "showCta": showCta
`
