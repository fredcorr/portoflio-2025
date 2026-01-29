import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Footer from './Footer'
import { footerMock } from '@/mocks/organisms/footer'

test('renders CTA and social links from settings', () => {
  const markup = renderToStaticMarkup(<Footer {...footerMock} />)

  assert.match(markup, /Let(?:&apos;|&#x27;)s talk/i)
  assert.match(markup, /mailto:hello@federicocorradi\.com/)
  assert.match(markup, /Dribbble/)
  assert.match(markup, /Instagram/)
  assert.match(markup, /LinkedIn/)
})

test('renders dynamic year and author', () => {
  const year = new Date().getFullYear()
  const markup = renderToStaticMarkup(<Footer {...footerMock} />)

  assert.match(markup, new RegExp(`${year}`))
  assert.match(markup, /Made by Federico Corradi/)
})

test('omits CTA when email is missing', () => {
  const markup = renderToStaticMarkup(
    <Footer {...footerMock} email={undefined} />
  )

  assert.ok(!markup.includes('mailto:'))
})
