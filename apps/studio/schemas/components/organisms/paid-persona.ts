import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuBriefcase } from 'react-icons/lu'
import Block from '@components/atoms/block'
import String from '@components/atoms/string'
import { extractPlainText } from '@utils/extract-plain-text'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const PaidPersona = defineType({
  name: ComponentTypeName.PaidPersona,
  title: 'Paid Persona',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    String({
      name: 'tagline',
      title: 'Tagline',
      description: 'A short professional descriptor shown beneath the heading.',
    }),
    Block({
      name: 'body',
      title: 'Body',
      description: 'Rich text describing the paid / freelance persona.',
    }),
    String({
      name: 'availability',
      title: 'Availability',
      description: 'Current availability status, e.g. "Open to new projects".',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      body: 'body',
      availability: 'availability',
    },
    prepare({ title, body, availability }) {
      const bodySummary = extractPlainText(body)

      return {
        title: title || 'Paid Persona',
        subtitle: availability || bodySummary || 'Paid persona section',
        media: LuBriefcase,
      }
    },
  },
})

export default PaidPersona
