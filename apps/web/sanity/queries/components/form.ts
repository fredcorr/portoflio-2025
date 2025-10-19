import { groq } from 'next-sanity'
import { baseComponentFields, messageFields, titleFields } from '../fragments'

const title = titleFields('title')
const successMessage = messageFields('success')
const errorMessage = messageFields('error')

export const formFields = groq`
  ${baseComponentFields},
  "title": ${title},
  "subtitle": subtitle,
  formFields[] {
    _key,
    "label": formField_label,
    "placeholder": formField_placeholder,
    "type": formField_type,
    "errorMessage": formField_errorMessage,
    "required": formField_required,
    "validation": formField_validation{
      "type": type,
      "pattern": pattern
    }
  },
  "success": ${successMessage},
  "error": ${errorMessage}
`
