import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuWrench } from 'react-icons/lu'
import List from '@components/atoms/list'
import { createCardField } from '@components/molecules/card'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const toolCard = createCardField({
  name: 'tool',
  include: ['image'],
  preview: ({ names, defaultPreview }) => ({
    select: {
      ...defaultPreview.select,
      media: names.image,
    },
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      const media = selection.media as unknown

      return {
        ...base,
        media: media || LuWrench,
      }
    },
  }),
})

const titleField = createTitleField({
  name: 'title',
})

const ToolSet = defineType({
  name: ComponentTypeName.ToolSet,
  title: 'Tool Set',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    List({
      name: 'tools',
      title: 'Tools',
      description: 'Collection of tools displayed as cards with imagery.',
      of: [toolCard.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      tools: 'tools',
    },
    prepare({ title, tools }) {
      const subtitle = formatItemCount(tools, 'tool')

      return {
        title: title || 'Tool Set',
        subtitle,
        media: LuWrench,
      }
    },
  },
})

export default ToolSet
