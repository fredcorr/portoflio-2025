import { groq } from 'next-sanity'
import { baseComponentFields, titleFields } from '../fragments'

const title = titleFields('title')

export const faqsFields = groq`
  ${baseComponentFields},
  "title": ${title},
  questions[] {
    _key,
    "question": faq_question,
    "answer": faq_answer
  }
`
