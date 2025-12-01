import { ComponentTypeName } from '../base'
import type { PortableTextValue } from '../studio'
import type { SanityComponentBase } from './base-component'
import type { ComponentHeading } from './title'

export type FormFieldType = 'input' | 'select' | 'checkbox' | 'textarea' | 'radio'

export interface FormFieldItem {
  label?: string
  placeholder?: string
  type?: FormFieldType
  errorMessage?: string
  required?: boolean
  validation?: {
    type?: 'none' | 'email' | 'date' | 'regex'
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
