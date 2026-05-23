import { defineField, defineType } from 'sanity'

const ExternalLink = defineType({
  name: 'externalLink',
  type: 'object',
  title: 'External Link',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      title: 'URL',
      validation: Rule =>
        Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open in new tab',
      initialValue: true,
    }),
  ],
})

export default ExternalLink
