import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'
import String from './string'
import Reference from './reference'
import { PageTypeName } from '@portfolio/types/base'

export const Link = (base: CommonFieldProps) => {
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
        description: 'The url to the page you want to the take the user to',
      }),
      Reference(
        {
          name: 'internal_ref',
          title: 'Internal',
          description: 'The page refernce you want to combine with the hashtag',
        },
        [
          PageTypeName.ProjectPage,
          PageTypeName.AboutPage,
          PageTypeName.ContactPage,
        ]
      ),
    ],
  })
}

export default Link
