import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import FadeInStagger from './FadeInStagger'

test('renders children', () => {
  const markup = renderToStaticMarkup(
    <FadeInStagger>
      <p>Hello</p>
    </FadeInStagger>
  )
  assert.match(markup, /Hello/)
})

test('forwards className', () => {
  const markup = renderToStaticMarkup(
    <FadeInStagger className="test-class">content</FadeInStagger>
  )
  assert.match(markup, /test-class/)
})

test('renders with custom element tag', () => {
  const markup = renderToStaticMarkup(
    <FadeInStagger as="section">content</FadeInStagger>
  )
  assert.match(markup, /<section/)
})

test('renders with default div tag', () => {
  const markup = renderToStaticMarkup(<FadeInStagger>content</FadeInStagger>)
  assert.match(markup, /<div/)
})
