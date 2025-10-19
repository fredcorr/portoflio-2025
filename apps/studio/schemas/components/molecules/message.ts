import { defineField } from 'sanity'
import String from '@components/atoms/string'
import Block from '@components/atoms/block'
import { prefixedName } from '@utils/prefixed-name'

type MessageFieldConfig = {
  name: string
  title?: string
  collapsible?: boolean
  collapsed?: boolean
  description?: string
}

export type MessageFieldNames = {
  title: string
  subtitle: string
}

export const createMessageField = (config: MessageFieldConfig) => {
  const names: MessageFieldNames = {
    title: prefixedName(config.name, 'title'),
    subtitle: prefixedName(config.name, 'subtitle'),
  }

  const field = defineField({
    name: config.name,
    title: config.title ?? 'Message',
    type: 'object',
    description: config.description,
    options: {
      collapsible: config.collapsible ?? true,
      collapsed: config.collapsed ?? true,
    },
    fields: [
      String({
        name: names.title,
        title: 'Title',
        description: 'Message title displayed to the user.',
      }),
      Block({
        name: names.subtitle,
        title: 'Subtitle',
        description: 'Optional supporting copy for the message.',
      }),
    ],
  })

  return Object.freeze({
    names,
    field,
  })
}
