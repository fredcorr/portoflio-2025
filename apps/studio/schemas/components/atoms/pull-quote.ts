import { defineField, defineType } from 'sanity'

const PullQuote = defineType({
  name: 'pullQuote',
  type: 'object',
  title: 'Pull Quote',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Quote',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      type: 'string',
      title: 'Attribution',
      description: 'Optional. Who or what is being quoted.',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      attribution: 'attribution',
    },
    prepare({
      text,
      attribution,
    }: {
      text?: string
      attribution?: string
    }) {
      return {
        title: text ? `"${text.slice(0, 80)}"` : 'Pull Quote',
        subtitle: attribution,
      }
    },
  },
})

export default PullQuote
