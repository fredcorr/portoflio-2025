import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuTextSelect } from 'react-icons/lu'
import Block from '@components/atoms/block'
import { extractPlainText } from '@utils/extract-plain-text'
import Toggle from '@components/atoms/toggle'
import { createTitleField } from '@components/molecules/title'

const titleField = createTitleField({
  name: 'title',
})

const BlockText = defineType({
  name: ComponentTypeName.BlockText,
  title: 'Block Text',
  type: 'object',
  fields: [
    titleField.field,
    Block({
      name: 'body',
      title: 'Body',
      description: 'Rich text content for this block.',
    }),
    Toggle({
      name: 'splitLayout',
      title: 'Split layout',
      description:
        'Toggle to enable split layout. Headline and body will be displayed side by side.',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      body: 'body',
    },
    prepare({ title, body }) {
      const bodySummary = extractPlainText(body)

      return {
        title: title || 'Block Text',
        subtitle: bodySummary || 'Rich text body',
        media: LuTextSelect,
      }
    },
  },
})

export default BlockText
