import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuWorkflow } from 'react-icons/lu'
import String from '@components/atoms/string'
import List from '@components/atoms/list'
import { createCardField } from '@components/molecules/card'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const processStep = createCardField({
  name: 'processStep',
  preview: ({ defaultPreview }) => ({
    select: defaultPreview.select,
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      return {
        ...base,
        media: LuWorkflow,
      }
    },
  }),
})

const titleField = createTitleField({
  name: 'title',
})

const Process = defineType({
  name: ComponentTypeName.Process,
  title: 'Process',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    String({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Short description displayed beneath the title.',
    }),
    List({
      name: 'steps',
      title: 'Process steps',
      description: 'Sequential steps in the process, each represented as a card.',
      of: [processStep.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      steps: 'steps',
    },
    prepare({ title, steps }) {
      const subtitle = formatItemCount(steps, 'step')

      return {
        title: title || 'Process',
        subtitle,
        media: LuWorkflow,
      }
    },
  },
})

export default Process
