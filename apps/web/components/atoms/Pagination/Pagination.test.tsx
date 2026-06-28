import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Pagination from './Pagination'

const noop = () => {}

test('renders nothing for a single page', () => {
  const markup = renderToStaticMarkup(
    <Pagination currentPage={1} totalPages={1} onPageChange={noop} />
  )
  assert.equal(markup, '')
})

test('marks the current page with aria-current', () => {
  const markup = renderToStaticMarkup(
    <Pagination currentPage={2} totalPages={3} onPageChange={noop} />
  )
  assert.match(markup, /aria-current="page"/)
  assert.match(markup, /aria-label="Pagination"/)
})

test('windows large ranges with a gap', () => {
  const markup = renderToStaticMarkup(
    <Pagination currentPage={5} totalPages={20} onPageChange={noop} />
  )
  // first, neighbours, last shown; gaps collapsed to an ellipsis
  assert.match(markup, /…/)
  assert.match(markup, />1</)
  assert.match(markup, />20</)
})
