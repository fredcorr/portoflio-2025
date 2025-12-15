import type { PortableTextBlock } from '@portabletext/react'

type PortableValue = string | PortableTextBlock[] | undefined | null

export const normalizePortableText = (
  value?: PortableValue
): PortableTextBlock[] => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
  }

  const key = value.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'text'

  return [
    {
      _key: `${key}-block`,
      _type: 'block',
      children: [
        {
          _key: `${key}-span`,
          _type: 'span',
          text: value,
          marks: [],
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ]
}
