import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { faqItemMock } from '@/mocks/molecules/faq-item'
import FaqItem from './FaqItem'

test('renders question and answer using <details>/<summary>', () => {
  const markup = renderToStaticMarkup(<FaqItem {...faqItemMock} />)

  assert.match(markup, /<details/)
  assert.match(markup, /<summary/)
  assert.match(markup, /What is included\\?/)
  assert.match(markup, /This is the first paragraph\./)
  assert.match(markup, /This is the second paragraph\./)
})

test('returns null when question and answer are missing', () => {
  const markup = renderToStaticMarkup(
    <FaqItem question={undefined} answer={undefined} />
  )

  assert.equal(markup, '')
})
