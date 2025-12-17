import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Select from './Select'

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
]

test('renders select with placeholder label', () => {
  const markup = renderToStaticMarkup(
    <Select label="Choose one" options={options} required />
  )

  assert.match(markup, /Choose one/)
  assert.match(markup, /option value=""/)
  assert.match(markup, /aria-required="true"/)
})

test('shows error text when provided', () => {
  const markup = renderToStaticMarkup(
    <Select label="Choose one" options={options} error="Selection required" />
  )

  assert.match(markup, /Selection required/)
  assert.match(markup, /aria-invalid="true"/)
})
