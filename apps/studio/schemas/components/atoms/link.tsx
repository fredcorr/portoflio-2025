import { defineField, defineType } from 'sanity'
import { PageTypeName } from '@portfolio/types/base'
import type { CommonFieldProps } from '@studio/types'
import String from './string'
import Reference from './reference'

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
        description: 'The url to the page you want to take the user to',
      }),
      Reference(
        {
          name: 'internal_ref',
          title: 'Internal',
          description: 'The page reference you want to combine with the hashtag',
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
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      title: 'External URL',
      description: 'Use this for links to external sites',
      validation: Rule =>
        Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open in new tab',
      initialValue: false,
    }),
    defineField({
      name: 'internalRef',
      type: 'reference',
      title: 'Internal page',
      description: 'Use this to link to a page within the site',
      to: [
        { type: PageTypeName.ProjectPage },
        { type: PageTypeName.AboutPage },
        { type: PageTypeName.ContactPage },
        { type: PageTypeName.Page },
        { type: PageTypeName.ArticlePage },
      ],
    }),
  ],
})

export default LinkAnnotation
