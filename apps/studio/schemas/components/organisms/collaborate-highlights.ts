import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuHandshake } from 'react-icons/lu'
import List from '@components/atoms/list'
import { createCardField } from '@components/molecules/card'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'

const highlightCard = createCardField({
  name: 'highlight',
  include: ['icon'],
  preview: ({ defaultPreview }) => ({
    select: defaultPreview.select,
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      return {
        ...base,
        media: LuHandshake,
      }
    },
  }),
})

const titleField = createTitleField({
  name: 'title',
})

const CollaborateHighlights = defineType({
  name: ComponentTypeName.CollaborateHighlights,
  title: 'Collaborate Highlights',
  type: 'object',
  fields: [
    titleField.field,
    List({
      name: 'highlights',
      title: 'Highlights',
      description: 'Key reasons to collaborate, shown as cards.',
      of: [highlightCard.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      highlights: 'highlights',
    },
    prepare({ title, highlights }) {
      const subtitle = formatItemCount(highlights, 'highlight')

      return {
        title: title || 'Collaborate Highlights',
        subtitle,
        media: LuHandshake,
      }
    },
  },
})

export default CollaborateHighlights
