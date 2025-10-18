import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const Media = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'image',
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
      }),
    ],
  })
}

export default Media
