import { defineType } from 'sanity'
import { ComponentTypeName } from '@portfolio/types/base'
import { LuMessagesSquare } from 'react-icons/lu'
import List from '@components/atoms/list'
import { createCardField } from '@components/molecules/card'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const testimonialCard = createCardField({
  name: 'testimonialCard',
  include: ['author'],
  preview: ({ names, defaultPreview }) => ({
    select: {
      ...defaultPreview.select,
      author: `${names.author}.name`,
    },
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      const author = selection.author as string | undefined

      return {
        title: base.title || author || 'Testimonial',
        subtitle: base.subtitle || author || 'Card testimonial',
        media: LuMessagesSquare,
      }
    },
  }),
})

const Testimonial = defineType({
  name: ComponentTypeName.Testimonials,
  title: 'Testimonials',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    List({
      name: 'testimonials',
      title: 'Testimonials',
      description:
        'Cards shown in a grid layout. Each card supports optional imagery and author details.',
      of: [testimonialCard.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      testimonials: 'testimonials',
    },
    prepare({ title, testimonials }) {
      const subtitle = formatItemCount(testimonials, 'testimonial')

      return {
        title: title || 'Testimonials',
        subtitle,
        media: LuMessagesSquare,
      }
    },
  },
})

export default Testimonial
