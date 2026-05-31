import { defineField } from 'sanity'
import type { CommonFieldProps } from '@studio/types'
import String from './string'
import Reference from './reference'
import { PageTypeName } from '@portfolio/types/base'

export const UrlPicker = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'object',
    fields: [
      String({
        name: 'name',
        title: 'Label',
        description: 'The label shown on the button',
      }),
      String({
        name: 'url',
        title: 'URL',
        description: 'The url to the page you want to take the user to',
      }),
      Reference(
        {
          name: 'internal_ref',
          title: 'Internal',
          description: 'The page reference you want to link to',
        },
        [
          PageTypeName.ProjectPage,
          PageTypeName.AboutPage,
          PageTypeName.ContactPage,
          PageTypeName.Page,
        ]
      ),
    ],
  })
}

export default UrlPicker
