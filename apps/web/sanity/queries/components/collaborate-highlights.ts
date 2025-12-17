import groq from 'groq'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const collaborateHighlightsFields = groq`
  ${baseComponentFields},
  "title": ${title},
  highlights[] {
    _key,
    "title": highlight_title,
    "subtitle": highlight_subtitle,
    "icon": highlight_icon
  }
`
