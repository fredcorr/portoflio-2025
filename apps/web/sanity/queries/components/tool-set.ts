import { groq } from 'next-sanity'
import { baseComponentFields, titleFields, imageFields } from '../fragments'

const title = titleFields('title')

export const toolSetFields = groq`
  ${baseComponentFields},
  "title": ${title},
  tools[] {
    _key,
    "title": tool_title,
    "subtitle": tool_subtitle,
    "image": tool_image{
      ${imageFields}
    }
  }
`
