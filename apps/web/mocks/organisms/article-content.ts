import type { PortableTextBlock } from '@portabletext/react'
import type { ArticleContentProps } from '@portfolio/types/components'

const block = (text: string, style: string, key: string): PortableTextBlock => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [
    {
      _key: `${key}-span`,
      _type: 'span',
      text,
      marks: [],
    },
  ],
})

export const articleContentMock: ArticleContentProps = {
  shareUrl: 'https://example.com/articles/design-systems',
  shareTitle: 'Design systems in practice',
  content: [
    block(
      'Joey is a remarkable artist. He grasps abstract ideas and transforms them into exceptional visuals.',
      'normal',
      'block-1'
    ),
    block('The Power of Visual Identity', 'h2', 'block-2'),
    block(
      'A strong visual identity serves as the foundation for all brand communications.',
      'normal',
      'block-3'
    ),
  ],
}
