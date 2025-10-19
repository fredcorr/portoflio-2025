import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuPanelsTopLeft } from 'react-icons/lu'
import Block from '@components/atoms/block'
import List from '@components/atoms/list'
import { extractPlainText } from '@utils/extract-plain-text'
import { formatItemCount } from '@utils/format-item-count'
import { createCardField } from '@components/molecules/card'
import { createTitleField } from '@components/molecules/title'

const titleField = createTitleField({
  name: 'title',
})

const cardField = createCardField({
  name: 'cardItem',
  preview: ({ defaultPreview }) => ({
    select: defaultPreview.select,
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      return {
        ...base,
        media: LuPanelsTopLeft,
      }
    },
  }),
})

const Cards = defineType({
  name: ComponentTypeName.Cards,
  title: 'Cards',
  type: 'object',
  fields: [
    titleField.field,
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Rich text supporting copy shown beneath the title.',
    }),
    List({
      name: 'items',
      title: 'Cards',
      description: 'Collection of cards rendered in a responsive grid.',
      of: [cardField.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      subtitle: 'subtitle',
      items: 'items',
    },
    prepare({ title, subtitle, items }) {
      const subtitleText = extractPlainText(subtitle)
      const itemSummary = formatItemCount(items, 'card')

      return {
        title: title || 'Cards',
        subtitle: subtitleText || itemSummary,
        media: LuPanelsTopLeft,
      }
    },
  },
})

export default Cards
