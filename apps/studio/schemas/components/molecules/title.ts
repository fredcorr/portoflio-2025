import { defineField } from 'sanity'
import String from '@components/atoms/string'
import { prefixedName } from '@utils/prefixed-name'

type PreviewValue = {
  select: Record<string, string>
  prepare: (selection: Record<string, unknown>) => Record<string, unknown>
}

type TitleFieldConfig = {
  name: string
  title?: string
  description?: string
  preview?: (helpers: {
    names: TitleFieldNames
    defaultPreview: PreviewValue
  }) => PreviewValue
}

export type TitleFieldNames = {
  heading: string
  headingLevel: string
}

type TitleFieldResult = {
  names: TitleFieldNames
  field: ReturnType<typeof defineField>
}

export const createTitleField = (
  config: TitleFieldConfig
): TitleFieldResult => {
  const names: TitleFieldNames = {
    heading: prefixedName(config.name, 'heading'),
    headingLevel: prefixedName(config.name, 'headingLevel'),
  }

  const headingField = String({
    name: names.heading,
    title: 'Heading',
    description: config.description ?? 'Primary heading text.',
  })

  const headingLevelField = defineField({
    name: names.headingLevel,
    title: 'Heading level',
    type: 'number',
    description: 'Optional heading level (1-6).',
    initialValue: 1,
    validation: level => level.min(1).max(6),
  })

  const defaultPreview: PreviewValue = {
    select: {
      title: names.heading,
    },
    prepare(selection) {
      return {
        title:
          (selection.title as string | undefined) || config.title || 'Title',
      }
    },
  }

  const preview = config.preview
    ? config.preview({ names, defaultPreview })
    : defaultPreview

  const field = defineField({
    name: config.name,
    title: config.title ?? 'Title',
    type: 'object',
    options: {
      collapsible: true,
      collapsed: false,
    },
    fields: [headingField, headingLevelField],
    preview,
  })

  return Object.freeze({
    names,
    field,
  })
}
