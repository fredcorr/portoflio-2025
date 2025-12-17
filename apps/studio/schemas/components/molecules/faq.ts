import { defineField } from 'sanity'
import String from '@components/atoms/string'
import Block from '@components/atoms/block'
import { prefixedName } from '@utils/prefixed-name'
import { extractPlainText } from '@utils/extract-plain-text'

type PreviewValue = {
  select: Record<string, string>
  prepare: (selection: Record<string, unknown>) => Record<string, unknown>
}

type FaqFieldConfig = {
  name: string
  title?: string
  preview?: (helpers: {
    names: FaqFieldNames
    defaultPreview: PreviewValue
  }) => PreviewValue
}

export type FaqFieldNames = {
  question: string
  answer: string
}

type FaqFieldResult = {
  names: FaqFieldNames
  field: ReturnType<typeof defineField>
}

export const createFaqField = (config: FaqFieldConfig): FaqFieldResult => {
  const names: FaqFieldNames = {
    question: prefixedName(config.name, 'question'),
    answer: prefixedName(config.name, 'answer'),
  }

  const questionField = String({
    name: names.question,
    title: 'Question',
    description: 'The question title.',
  })

  const defaultPreview: PreviewValue = {
    select: {
      title: names.question,
      subtitle: names.answer,
    },
    prepare(selection) {
      const subtitle = extractPlainText(
        selection.subtitle as Parameters<typeof extractPlainText>[0]
      )

      return {
        title: (selection.title as string | undefined) || 'Question',
        subtitle: (subtitle && subtitle) || 'Answer',
      }
    },
  }

  const preview = config.preview
    ? config.preview({ names, defaultPreview })
    : defaultPreview

  const field = defineField({
    name: config.name,
    title: config.title ?? 'Question',
    type: 'object',
    fields: [
      questionField,
      Block({
        name: names.answer,
        title: 'Answer',
        description: 'The answer to the question.',
      }),
    ],
    preview,
  })

  return Object.freeze({
    names,
    field,
  })
}
