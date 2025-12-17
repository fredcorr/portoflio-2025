import { ComponentTypeName } from '@portfolio/types/base'
import type { FormComponent } from '@portfolio/types/components'
import {
  FormFieldType,
  FormValidationType,
} from '@portfolio/types/components/form'

export const getInTouchMock: FormComponent = {
  _type: ComponentTypeName.Form,
  _key: 'get-in-touch',
  title: {
    heading: "Have a project idea?\nLet's discuss it together.",
    headingLevel: 1,
  },
  subtitle: [
    {
      _key: 'get-in-touch-intro',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'get-in-touch-intro-span',
          _type: 'span',
          text: 'Let us know a few details and we will respond shortly.',
          marks: [],
        },
      ],
    },
  ],
  formFields: [
    {
      _key: 'name-field',
      label: 'Name',
      placeholder: 'Name',
      type: FormFieldType.Input,
      required: true,
      errorMessage: 'Please enter your name',
    },
    {
      _key: 'email',
      label: 'Email address',
      placeholder: 'Email address',
      type: FormFieldType.Input,
      required: true,
      validation: { type: FormValidationType.Email },
      errorMessage: 'Please enter a valid email',
    },
    {
      _key: 'phone',
      label: 'Mobile Number',
      placeholder: 'Mobile Number',
      type: FormFieldType.Input,
    },
    {
      _key: 'referral',
      label: 'How did you hear about us?',
      placeholder: 'Select an option',
      type: FormFieldType.Select,
      options: [
        { label: 'Search', value: 'search' },
        { label: 'Referral', value: 'referral' },
        { label: 'Social', value: 'social' },
      ],
    },
    {
      _key: 'message',
      label: 'Tell us more about your project',
      placeholder: 'Tell us more about your project',
      type: FormFieldType.Textarea,
      required: true,
    },
    {
      _key: 'terms',
      label: 'I agree to the terms',
      type: FormFieldType.Checkbox,
      required: true,
      errorMessage: 'You must accept the terms',
    },
  ],
  success: {
    title: 'Thanks for reaching out!',
    subtitle: [
      {
        _key: 'get-in-touch-success',
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _key: 'get-in-touch-success-span',
            _type: 'span',
            text: 'We will get back to you shortly.',
            marks: [],
          },
        ],
      },
    ],
  },
  error: {
    title: 'Submission failed',
    subtitle: [
      {
        _key: 'get-in-touch-error',
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _key: 'get-in-touch-error-span',
            _type: 'span',
            text: 'Please try again later.',
            marks: [],
          },
        ],
      },
    ],
  },
}
