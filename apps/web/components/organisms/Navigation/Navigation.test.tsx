import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { navigationMock } from '@/mocks/organisms/navigation'
import Navigation from './Navigation'

test('renders navigation items and project count', () => {
  const markup = renderToStaticMarkup(
    <Navigation
      items={navigationMock.items}
      projectCount={navigationMock.projectCount}
    />
  )

  assert.match(markup, /data-organism="navigation"/)
  assert.match(markup, /Projects/)
  assert.match(markup, /Contact/)
  assert.match(markup, /About/)
  assert.match(markup, />8</)
})
