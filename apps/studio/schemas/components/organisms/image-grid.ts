import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuLayoutGrid } from 'react-icons/lu'
import Block from '@components/atoms/block'
import List from '@components/atoms/list'
import Media from '@components/atoms/media'
import { extractPlainText } from '@utils/extract-plain-text'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'

const titleField = createTitleField({
  name: 'title',
})

const ImageGrid = defineType({
  name: ComponentTypeName.ImageGrid,
  title: 'Image Grid',
  type: 'object',
  fields: [
    titleField.field,
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Rich text description shown beneath the title.',
    }),
    List({
      name: 'images',
      title: 'Images',
      description: 'Images displayed within the grid.',
      of: [
        Media({
          name: 'image',
          title: 'Image',
          description: 'Image shown in the grid.',
        }),
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      subtitle: 'subtitle',
      images: 'images',
    },
    prepare({ title, subtitle, images }) {
      const subtitleText = extractPlainText(subtitle)
      const imageSummary = formatItemCount(images, 'image')
      const media = Array.isArray(images) && images[0] ? images[0] : LuLayoutGrid

      return {
        title: title || 'Image Grid',
        subtitle: subtitleText || imageSummary,
        media,
      }
    },
  },
})

export default ImageGrid
