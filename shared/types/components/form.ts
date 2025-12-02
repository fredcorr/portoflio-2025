import { ComponentTypeName } from '../base'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export enum FormFieldType {
  Input = 'input',
  Select = 'select',
  Checkbox = 'checkbox',
  Textarea = 'textarea',
  Radio = 'radio',
}

export enum FormValidationType {
  None = 'none',
  Email = 'email',
  Date = 'date',
  Regex = 'regex',
}

export interface FormFieldItem {
  label?: string
  placeholder?: string
  type?: FormFieldType
  errorMessage?: string
  required?: boolean
  validation?: {
    type?: FormValidationType
    pattern?: string
  }
}

export interface FormMessage {
  title?: string
  subtitle?: PortableTextValue
}

export interface FormComponent
  extends SanityComponentBase<ComponentTypeName.Form> {
  title?: ComponentHeading
  subtitle?: PortableTextValue
  formFields?: FormFieldItem[]
  success?: FormMessage
  error?: FormMessage
}
