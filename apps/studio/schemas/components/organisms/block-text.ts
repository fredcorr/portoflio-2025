import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuTextSelect } from 'react-icons/lu'
import Block from '@components/atoms/block'
import { extractPlainText } from '@utils/extract-plain-text'
import Toggle from '@components/atoms/toggle'
import { createTitleField } from '@components/molecules/title'
import { componentAnchorField } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const BlockText = defineType({
  name: ComponentTypeName.BlockText,
  title: 'Block Text',
  type: 'object',
  fields: [
    componentAnchorField,
    titleField.field,
    Block({
      name: 'body',
      title: 'Body',
      description: 'Rich text content for this block.',
    }),
    Toggle({
      name: 'isHeadingLarge',
      title: 'Large heading',
      description:
        'Toggle to enable the large heading style (Figma Variant2/Variant3).',
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
