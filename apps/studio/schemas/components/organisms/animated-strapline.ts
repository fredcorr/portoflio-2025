import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import String from '@components/atoms/string'
import { LuType } from 'react-icons/lu'
import { componentFields } from '@schemas/compositions'

const AnimatedStrapline = defineType({
  name: ComponentTypeName.AnimatedStrapline,
  title: 'Animated Strapline',
  type: 'object',
  fields: [
    ...componentFields.all,
    String({
      name: 'strapline',
      title: 'Strapline',
      description: 'Text displayed with animation in the strapline.',
    }),
  ],
  preview: {
    select: {
      strapline: 'strapline',
    },
    prepare({ strapline }) {
      return {
        title: strapline || 'Animated strapline',
        media: LuType,
      }
    },
  },
})

export default AnimatedStrapline
