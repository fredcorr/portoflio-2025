import type { PortableTextBlock } from '@portabletext/react'

export const normalizePortableText = (value?: string): PortableTextBlock[] => {
  if (!value) return []
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
