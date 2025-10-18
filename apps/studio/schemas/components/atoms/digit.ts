import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'

const Digit = (base: CommonFieldProps) => {
  return defineField({
    ...base,
    type: 'number',
  })
}

export default Digit
