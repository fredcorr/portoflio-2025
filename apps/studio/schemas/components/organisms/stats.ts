import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuChartBar } from 'react-icons/lu'
import List from '@components/atoms/list'
import { createCardField } from '@components/molecules/card'
import { formatItemCount } from '@utils/format-item-count'

const statCard = createCardField({
  name: 'statItem',
  preview: ({ defaultPreview }) => ({
    select: defaultPreview.select,
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      return {
        ...base,
        media: LuChartBar,
      }
    },
  }),
})

const Stats = defineType({
  name: ComponentTypeName.Stats,
  title: 'Stats',
  type: 'object',
  fields: [
    List({
      name: 'items',
      title: 'Stats items',
      description: 'List of statistics displayed as cards.',
      of: [statCard.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const subtitle = formatItemCount(items, 'stat')

      return {
        title: 'Stats',
        subtitle,
        media: LuChartBar,
      }
    },
  },
})

export default Stats
