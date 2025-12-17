'use client'

import React from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { FormFieldItem } from '@portfolio/types/components/form'
import { FormFieldType } from '@portfolio/types/components/form'
import InputField from '@/components/atoms/Input/Input'
import SelectField from '@/components/atoms/Select/Select'
import TextAreaField from '@/components/atoms/TextArea/TextArea'
import CheckboxField from '@/components/atoms/Checkbox/Checkbox'
import camelCase from '@/utils/camel-case'

export interface RenderFormFieldProps {
  field: FormFieldItem
  register: UseFormRegister<Record<string, unknown>>
  errors: FieldErrors<Record<string, unknown>>
}

export const RenderFormField = ({
  field,
  register,
  errors,
}: RenderFormFieldProps) => {
  const { label, placeholder, required, type, options } = field
  const labelKey = camelCase(label)
  const error = errors?.[labelKey]?.message as string | undefined

  switch (type) {
    case FormFieldType.Input:
      return (
        <InputField
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          type="text"
          {...register(labelKey)}
        />
      )
    case FormFieldType.Select:
      return (
        <SelectField
          label={label}
          required={required}
          options={
            options?.map(option => ({
              label: option.label,
              value: option.value,
            })) ?? []
          }
          error={error}
          {...register(labelKey)}
        />
      )
    case FormFieldType.Textarea:
      return (
        <TextAreaField
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          rows={5}
          {...register(labelKey)}
        />
      )
    case FormFieldType.Checkbox:
      return (
        <CheckboxField
          label={label}
          required={required}
          error={error}
          {...register(labelKey)}
        />
      )
    default:
      return null
  }
}

export default RenderFormField
