import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuImages } from 'react-icons/lu'
import Block from '@components/atoms/block'
import List from '@components/atoms/list'
import Media from '@components/atoms/media'
import { extractPlainText } from '@utils/extract-plain-text'
import { formatItemCount } from '@utils/format-item-count'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const ImageGallery = defineType({
  name: ComponentTypeName.ImageGallery,
  title: 'Image Gallery',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Rich text description shown beneath the title.',
    }),
    List({
      name: 'images',
      title: 'Images',
      description: 'Images displayed within the gallery.',
      of: [
        Media({
          name: 'image',
          title: 'Image',
          description: 'Image shown in the gallery.',
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

      return {
        title: title || 'Image Gallery',
        subtitle: subtitleText || imageSummary,
        media: LuImages,
      }
    },
  },
})

export default ImageGallery
