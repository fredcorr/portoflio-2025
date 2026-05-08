import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import { LuList } from 'react-icons/lu'
import { defineType } from 'sanity'
import StringField from '@components/atoms/string'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({ name: 'title' })

const WorkIndex = defineType({
  name: ComponentTypeName.WorkIndex,
  title: 'Work Index',
  type: 'object',
  fields: [
    ...componentFields.all,
    StringField({
      name: 'label',
      title: 'Label',
      description: 'Small all-caps label on the left (e.g. "The Work").',
    }),
    StringField({
      name: 'categoryLabel',
      title: 'Category Label',
      description: 'Small all-caps label on the right (e.g. "Development").',
    }),
    titleField.field,
    StringField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Short tagline shown to the right of the heading.',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
    },
    prepare({ title }) {
      return {
        title: title || 'Work Index',
        media: LuList,
      }
    },
  },
})

export default WorkIndex
