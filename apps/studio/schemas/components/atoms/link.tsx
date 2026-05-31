import { defineField, defineType } from 'sanity'
import { PageTypeName } from '@portfolio/types/base'

const LinkAnnotation = defineType({
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      title: 'External URL',
      validation: Rule => Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
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
