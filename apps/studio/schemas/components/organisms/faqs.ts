import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuMessagesSquare } from 'react-icons/lu'
import List from '@components/atoms/list'
import { formatItemCount } from '@utils/format-item-count'
import { createFaqField } from '@components/molecules/faq'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const faqField = createFaqField({
  name: 'faq',
  preview: ({ defaultPreview }) => ({
    select: defaultPreview.select,
    prepare(selection) {
      const base = defaultPreview.prepare(selection)
      return {
        ...base,
        subtitle: base.subtitle || 'Answer summary',
        media: LuMessagesSquare,
      }
    },
  }),
})

const titleField = createTitleField({
  name: 'title',
})

const Faqs = defineType({
  name: ComponentTypeName.Faqs,
  title: 'FAQs',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    List({
      name: 'questions',
      title: 'Questions',
      description: 'Frequently asked questions and their answers.',
      of: [faqField.field],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      questions: 'questions',
    },
    prepare({ title, questions }) {
      const subtitle = formatItemCount(questions, 'question')

      return {
        title: title || 'FAQs',
        subtitle,
        media: LuMessagesSquare,
      }
    },
  },
})

export default Faqs
