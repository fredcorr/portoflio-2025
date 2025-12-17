import { ComponentTypeName } from '@portfolio/types/base'
import type { FaqsComponent } from '@portfolio/types/components'

import { faqItemMock } from '@/mocks/molecules/faq-item'

export const faqsMock: FaqsComponent = {
  _type: ComponentTypeName.Faqs,
  _key: 'faqs',
  title: {
    heading: 'FAQs about Branding',
    headingLevel: 2,
  },
  questions: [
    faqItemMock,
    {
      _key: 'faq-item-2',
      question: 'Do you offer logo design as a separate service?',
      answer: faqItemMock.answer,
    },
  ],
}
