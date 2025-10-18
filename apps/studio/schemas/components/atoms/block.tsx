import { defineField, type BlockDefinition } from 'sanity'
import { CommonFieldProps } from '@studio/types'

const defaultStyles = {
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H1', value: 'h1' },
    { title: 'H2', value: 'h2' },
  ],
  lists: [{ title: 'Numbered', value: 'number' }],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
    ],
  },
}

const Block = (
  props: CommonFieldProps,
  additionalTypes?: any[],
  customStyles = {}
) => {
  return defineField({
    ...props,
    type: 'array',
    of: [
      {
        type: 'block',
        ...defaultStyles,
        ...customStyles,
      } as BlockDefinition,
      ...(additionalTypes || []),
    ],
  })
}

export default Block
