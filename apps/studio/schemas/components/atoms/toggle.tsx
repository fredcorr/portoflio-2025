import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const Toggle = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'boolean',
  })
}

export default Toggle
