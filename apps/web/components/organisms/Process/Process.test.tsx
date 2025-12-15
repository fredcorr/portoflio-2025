import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Process } from './Process'
import { processMock } from '@/mocks/organisms/process'

test('renders heading and all steps with numbering', () => {
  const markup = renderToStaticMarkup(<Process {...processMock} />)

  assert.match(markup, /Design Process/)
  assert.match(markup, /01 —/)
  assert.match(markup, /02 —/)
  assert.match(markup, /03 —/)
  assert.match(markup, /04 —/)
  assert.match(markup, /Discovery/)
  assert.match(markup, /Implementation/)
})

test('renders empty state when no steps provided', () => {
  const markup = renderToStaticMarkup(
    <Process {...processMock} steps={[]} />
  )

  assert.match(markup, /Process steps will appear here once they are published/)
})
