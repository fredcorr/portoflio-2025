import { defineField } from 'sanity'
import String from '@components/atoms/string'
import Media from '@components/atoms/media'
import { prefixedName } from '@utils/prefixed-name'

export const CARD_ICON_OPTIONS = Object.freeze([
  { title: 'Arrow Right', value: 'arrow-right' },
  { title: 'Arrow Up', value: 'arrow-up' },
  { title: 'Arrow Down', value: 'arrow-down' },
  { title: 'Star', value: 'star' },
  { title: 'Sparkle', value: 'sparkle' },
  { title: 'Check', value: 'check' },
  { title: 'Info', value: 'info' },
  { title: 'Lightning', value: 'lightning' },
])

type OptionalFieldKey = 'image' | 'icon' | 'author'

type PreviewValue = {
  select: Record<string, string>
  prepare: (selection: Record<string, unknown>) => Record<string, unknown>
}

type CardFieldConfig = {
  name: string
  title?: string
  include?: OptionalFieldKey[]
  preview?: (helpers: {
    names: CardFieldNames
    defaultPreview: PreviewValue
  }) => PreviewValue
}

export type CardFieldNames = {
  title: string
  subtitle: string
  image: string
  icon: string
  author: string
}

type CardFieldResult = {
  names: CardFieldNames
  field: ReturnType<typeof defineField>
}

export const createCardField = (config: CardFieldConfig): CardFieldResult => {
  const names: CardFieldNames = {
    title: prefixedName(config.name, 'title'),
    subtitle: prefixedName(config.name, 'subtitle'),
    image: prefixedName(config.name, 'image'),
    icon: prefixedName(config.name, 'icon'),
    author: prefixedName(config.name, 'author'),
  }

  const titleField = String({
    name: names.title,
    title: 'Title',
    description: 'Primary headline displayed on the card.',
  })

  const subtitleField = String({
    name: names.subtitle,
    title: 'Subtitle',
    description: 'Supporting copy that appears beneath the title.',
  })

  const optionalFieldFactories: Record<OptionalFieldKey, ReturnType<typeof defineField>> = {
    image: Media({
      name: names.image,
      title: 'Image',
      description: 'Optional visual or illustration for the card.',
    }),
    icon: defineField({
      name: names.icon,
      title: 'Icon',
      type: 'string',
      description: 'Optional icon to accompany the card content.',
      options: {
        list: Array.from(CARD_ICON_OPTIONS),
        layout: 'dropdown',
      },
    }),
    author: defineField({
      name: names.author,
      title: 'Author',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        String({
          name: 'name',
          title: 'Author name',
          description: 'Name of the author displayed on the card.',
        }),
        String({
          name: 'role',
          title: 'Author role',
          description: 'Role or position of the author.',
        }),
      ],
    }),
  }

  const includeSet = new Set(config.include ?? [])
  const selectedOptionalFields = Array.from(includeSet, key => optionalFieldFactories[key])

  const fields = [titleField, subtitleField, ...selectedOptionalFields]

  const defaultPreview: PreviewValue = {
    select: {
      title: names.title,
      subtitle: names.subtitle,
    },
    prepare(selection) {
      const title = (selection.title as string | undefined) || config.title || 'Card'
      const subtitle = (selection.subtitle as string | undefined) || 'Card subtitle'
      return { title, subtitle }
    },
  }

  const preview = config.preview
    ? config.preview({ names, defaultPreview })
    : defaultPreview

  const field = defineField({
    name: config.name,
    title: config.title ?? 'Card',
    type: 'object',
    fields,
    preview,
  })

  return Object.freeze({
    names,
    field,
  })
}
