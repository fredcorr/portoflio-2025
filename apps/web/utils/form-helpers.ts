import * as yup from 'yup'
import type { FormFieldItem } from '@portfolio/types/components/form'
import {
  FormFieldType,
  FormValidationType,
} from '@portfolio/types/components/form'
import camelCase from 'lodash/camelCase'

export const buildInitialValues = (
  fields?: FormFieldItem[]
): Record<string, string | boolean> => {
  if (!fields || fields.length === 0) return {}

  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    const key = camelCase(field.label)
    const isCheckbox = field.type === FormFieldType.Checkbox
    acc[key] = isCheckbox ? false : ''
    return acc
  }, {})
}

const getErrorMessage = (field: FormFieldItem, fallback: string) =>
  field.errorMessage?.trim() || fallback

export const buildValidationSchema = (fields?: FormFieldItem[]) => {
  if (!fields || fields.length === 0) return yup.object().shape({})

  const shape = fields.reduce<Record<string, yup.AnySchema>>((acc, field) => {
    const key = camelCase(field.label)

    if (field.type === FormFieldType.Checkbox) {
      let checkboxSchema: yup.BooleanSchema<boolean | undefined> = yup.boolean()

      if (field.required) {
        checkboxSchema = checkboxSchema.oneOf(
          [true],
          getErrorMessage(field, 'This field is required')
        )
      }

      acc[key] = checkboxSchema
      return acc
    }

    let validator: yup.StringSchema<string | undefined> = yup.string().trim()

    if (field.validation?.type === FormValidationType.Email) {
      validator = validator.email(
        getErrorMessage(field, 'Please enter a valid email')
      )
    }

    if (field.validation?.type === FormValidationType.Regex) {
      const pattern = field.validation.pattern
      if (pattern) {
        validator = validator.matches(
          new RegExp(pattern),
          getErrorMessage(field, 'Invalid format')
        )
      }
    }

    if (field.validation?.type === FormValidationType.Date) {
      validator = validator.matches(
        /^\d{4}-\d{2}-\d{2}$/,
        getErrorMessage(field, 'Use YYYY-MM-DD format')
      )
    }

    if (field.type === FormFieldType.Select && field.required) {
      validator = validator.required(
        getErrorMessage(field, 'Please select an option')
      )
    }

    if (field.required) {
      validator = validator.required(
        getErrorMessage(field, 'This field is required')
      )
    }

    acc[key] = validator
    return acc
  }, {})

  return yup.object().shape(shape)
}
