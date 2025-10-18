import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const File = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'file',
  })
}

export default File
