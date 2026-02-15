import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuClipboardCheck } from 'react-icons/lu'
import Block from '@components/atoms/block'
import List from '@components/atoms/list'
import { createTitleField } from '@components/molecules/title'
import { createFormField } from '@components/molecules/form-field'
import { createMessageField } from '@components/molecules/message'
import { extractPlainText } from '@utils/extract-plain-text'
import { formatItemCount } from '@utils/format-item-count'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const formField = createFormField({
  name: 'formField',
})

const successMessageField = createMessageField({
  name: 'success',
  title: 'Success message',
})

const errorMessageField = createMessageField({
  name: 'error',
  title: 'Error message',
})

const Form = defineType({
  name: ComponentTypeName.Form,
  title: 'Form',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Rich text description displayed beneath the title.',
    }),
    List({
      name: 'formFields',
      title: 'Form fields',
      description: 'Fields presented to the user within the form.',
      of: [formField.field],
    }),
    successMessageField.field,
    errorMessageField.field,
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      subtitle: 'subtitle',
      fields: 'formFields',
    },
    prepare({ title, subtitle, fields }) {
      const subtitleText = extractPlainText(subtitle)
      const fieldsSummary = formatItemCount(fields, 'field')

      return {
        title: title || 'Form',
        subtitle: subtitleText || fieldsSummary,
        media: LuClipboardCheck,
      }
    },
  },
})

export default Form
