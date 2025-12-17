import type { PortableTextBlock } from '@portabletext/react'
import type { FaqItem } from '@portfolio/types/components'

const block = (text: string, keySuffix: string): PortableTextBlock => ({
  _key: `faq-${keySuffix}`,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [
    {
      _key: `faq-${keySuffix}-span`,
      _type: 'span',
      text,
      marks: [],
    },
  ],
})

export const faqItemMock: FaqItem = {
  _key: 'faq-item-1',
  question: 'What is included?',
  answer: [
    block('This is the first paragraph.', 'p1'),
    block('This is the second paragraph.', 'p2'),
  ],
}
