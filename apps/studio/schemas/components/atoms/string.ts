import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const String = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'string',
  })
}

export default String
