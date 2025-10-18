import { CommonFieldProps } from '@studio/types'
import type { ArrayRule } from '@sanity/types'
import { defineField } from 'sanity'

type ArrayFieldProps = CommonFieldProps & {
  of: any[]
  validation?: (rule: ArrayRule<unknown>) => ArrayRule<unknown>
  options?: Record<string, unknown>
  type?: 'array'
}

const List = (base: ArrayFieldProps, max?: number) => {
  const { validation, type, options, ...rest } = base

  const shouldApplyValidation =
    Boolean(validation) || typeof max === 'number'

  const applyValidation = shouldApplyValidation
    ? (rule: ArrayRule<unknown>) => {
        const configured = validation ? validation(rule) : rule
        return typeof max === 'number' ? configured.max(max) : configured
      }
    : undefined

  return defineField({
    ...rest,
    type: type ?? 'array',
    of: base.of,
    options: {
      insertMenu: {
        showIcons: true,
        filter: 'auto',
        views: [{ name: 'list' }, { name: 'grid' }],
      },
      ...(options ?? {}),
    },
    ...(applyValidation ? { validation: applyValidation } : {}),
  })
}

export default List
