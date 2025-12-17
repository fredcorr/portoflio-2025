import { ComponentTypeName } from '@portfolio/types/base'
import type { PortableTextBlock } from '@portabletext/react'
import type { BlockTextComponent } from '@portfolio/types/components'

const block = (text: string): PortableTextBlock[] => [
  {
    _key: `${text}-block`,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: `${text}-span`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
  },
]

export const blockTextSplitMock: BlockTextComponent = {
  _type: ComponentTypeName.BlockText,
  _key: 'block-text-split',
  title: {
    heading: 'String value',
    headingLevel: 3,
  },
  isHeadingLarge: false,
  body: block('String value'),
  splitLayout: true,
}

export const blockTextStackedMock: BlockTextComponent = {
  _type: ComponentTypeName.BlockText,
  _key: 'block-text-stacked',
  title: {
    heading: 'String value',
    headingLevel: 2,
  },
  isHeadingLarge: true,
  body: block('String value'),
  splitLayout: false,
}

export const blockTextSplitLargeMock: BlockTextComponent = {
  _type: ComponentTypeName.BlockText,
  _key: 'block-text-split-large',
  title: {
    heading: 'String value',
    headingLevel: 2,
  },
  isHeadingLarge: true,
  body: block('String value'),
  splitLayout: true,
}
