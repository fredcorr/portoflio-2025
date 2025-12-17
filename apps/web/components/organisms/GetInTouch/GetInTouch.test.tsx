import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import GetInTouch from './GetInTouch'
import { getInTouchMock } from '@/mocks/organisms/get-in-touch'

test('renders heading and form fields', () => {
  const markup = renderToStaticMarkup(<GetInTouch {...getInTouchMock} />)

  assert.match(markup, /Have a project idea/)
  assert.match(markup, /Let us know a few details/)
  assert.match(markup, /Name/)
  assert.match(markup, /Email address/)
  assert.match(markup, /Submit/)
})
