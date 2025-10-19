import { defineField } from 'sanity'
import String from '@components/atoms/string'
import Toggle from '@components/atoms/toggle'
import { prefixedName } from '@utils/prefixed-name'

type FormFieldConfig = {
  name: string
  title?: string
}

export type FormFieldNames = {
  label: string
  placeholder: string
  type: string
  errorMessage: string
  required: string
  validation: string
}

export const createFormField = (config: FormFieldConfig) => {
  const names: FormFieldNames = {
    label: prefixedName(config.name, 'label'),
    placeholder: prefixedName(config.name, 'placeholder'),
    type: prefixedName(config.name, 'type'),
    errorMessage: prefixedName(config.name, 'errorMessage'),
    required: prefixedName(config.name, 'required'),
    validation: prefixedName(config.name, 'validation'),
  }

  const field = defineField({
    name: config.name,
    title: config.title ?? 'Form field',
    type: 'object',
    options: {
      collapsible: true,
      collapsed: false,
    },
    fields: [
      String({
        name: names.label,
        title: 'Label',
        description: 'Label displayed for the form field.',
      }),
      String({
        name: names.placeholder,
        title: 'Placeholder',
        description: 'Placeholder text shown inside the input.',
      }),
      defineField({
        name: names.type,
        title: 'Field type',
        type: 'string',
        options: {
          list: [
            { title: 'Input', value: 'input' },
            { title: 'Select', value: 'select' },
            { title: 'Checkbox', value: 'checkbox' },
            { title: 'Textarea', value: 'textarea' },
            { title: 'Radio', value: 'radio' },
          ],
          layout: 'dropdown',
        },
        initialValue: 'input',
      }),
      String({
        name: names.errorMessage,
        title: 'Error message',
        description: 'Message displayed when the field fails validation.',
      }),
      Toggle({
        name: names.required,
        title: 'Required',
        description: 'Toggle to make this field required.',
      }),
      defineField({
        name: names.validation,
        title: 'Validation',
        type: 'object',
        options: {
          collapsible: true,
          collapsed: true,
        },
        fields: [
          defineField({
            name: 'type',
            title: 'Validation type',
            type: 'string',
            options: {
              list: [
                { title: 'None', value: 'none' },
                { title: 'Email', value: 'email' },
                { title: 'Date', value: 'date' },
                { title: 'Regex', value: 'regex' },
              ],
              layout: 'dropdown',
            },
          }),
          String({
            name: 'pattern',
            title: 'Regex pattern',
            description: 'Pattern used when validation type is regex.',
            hidden: ({ parent }) => parent?.type !== 'regex',
          }),
        ],
      }),
    ],
  })

  return Object.freeze({ names, field })
}
