import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const TextArea = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'text',
  })
}

export default TextArea
