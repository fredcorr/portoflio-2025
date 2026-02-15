import { defineField } from 'sanity'

const sectionId = defineField({
  name: 'sectionId',
  title: 'Section ID',
  type: 'string',
  description:
    'Optional anchor ID used for deep-linking (example: "services"). Leave empty to auto-generate.',
  validation: Rule =>
    Rule.custom((value?: string) => {
      if (!value) {
        return true
      }

      const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

      if (isValid) {
        return true
      }

      return 'Use lowercase letters, numbers, and hyphens only.'
    }),
})

const entries = Object.freeze([sectionId] as const)

export const componentFields = Object.freeze({
  sectionId,
  all: entries,
})
