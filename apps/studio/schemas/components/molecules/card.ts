import { defineField } from 'sanity'
import String from '../atoms/string'
import Media from '../atoms/media'

const toFieldName = (prefix: string, suffix: string) =>
  [prefix, suffix].filter(Boolean).join('_')

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

export const createCardFields = (prefix: string) => {
  const fieldNames = Object.freeze({
    title: toFieldName(prefix, 'title'),
    subtitle: toFieldName(prefix, 'subtitle'),
    image: toFieldName(prefix, 'image'),
    icon: toFieldName(prefix, 'icon'),
    author: toFieldName(prefix, 'author'),
  })

  const title = String({
    name: fieldNames.title,
    title: 'Title',
    description: 'Primary headline displayed on the card.',
  })

  const subtitle = String({
    name: fieldNames.subtitle,
    title: 'Subtitle',
    description: 'Supporting copy that appears beneath the title.',
  })

  const image = Media({
    name: fieldNames.image,
    title: 'Image',
    description: 'Optional visual or illustration for the card.',
  })

  const iconBase = String({
    name: fieldNames.icon,
    title: 'Icon',
    description: 'Optional icon to accompany the card content.',
  })

  const icon = defineField({
    ...iconBase,
    options: {
      list: Array.from(CARD_ICON_OPTIONS),
      layout: 'dropdown',
    },
  })

  const author = defineField({
    name: fieldNames.author,
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
  })

  const required = Object.freeze([title, subtitle])
  const optional = Object.freeze([image, icon, author])
  const all = Object.freeze([...required, ...optional])

  return Object.freeze({
    names: fieldNames,
    title,
    subtitle,
    image,
    icon,
    author,
    required,
    optional,
    all,
  })
}
