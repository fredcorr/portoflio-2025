import { CommonFieldProps } from '@studio/types'
import { defineField, defineType } from 'sanity'
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
          PageTypeName.Page,
        ]
      ),
    ],
  })
}

export const LinkAnnotation = defineType({
  name: 'link',
  type: 'object',
  title: 'Internal Link',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Label',
      description: 'The label shown on the link',
    }),
    defineField({
      name: 'url',
      type: 'string',
      title: 'URL',
      description: 'The url to the page you want to take the user to',
    }),
    defineField({
      name: 'internal_ref',
      type: 'reference',
      title: 'Internal',
      description: 'The page reference you want to link to',
      to: [
        { type: PageTypeName.ProjectPage },
        { type: PageTypeName.AboutPage },
        { type: PageTypeName.ContactPage },
        { type: PageTypeName.Page },
      ],
    }),
  ],
})

export default Link
