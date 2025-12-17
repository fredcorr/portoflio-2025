import type { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'
import type { StringRule } from 'sanity'

export interface StringFieldProps extends CommonFieldProps {
  validation?: (rule: StringRule) => StringRule | StringRule[]
}

const stringField = (base: StringFieldProps) => {
  return defineField({
    ...base,
    type: 'string',
    validation: base.validation,
  })
}

export default stringField
