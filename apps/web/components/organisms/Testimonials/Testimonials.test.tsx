import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Testimonials from './Testimonials'
import { testimonialsMock } from '@/mocks/organisms/testimonials'

test('renders heading and testimonials', () => {
  const markup = renderToStaticMarkup(<Testimonials {...testimonialsMock} />)

  assert.match(markup, /What clients say/)
  assert.match(markup, /Working with Joey was seamless/)
  assert.match(markup, /Alex Rivera/)
  assert.match(markup, /VP Product, Crtly/)
})

test('renders fallback when no testimonials', () => {
  const markup = renderToStaticMarkup(
    <Testimonials {...testimonialsMock} testimonials={[]} />
  )

  assert.match(markup, /Testimonials will appear here once they are published/)
})
