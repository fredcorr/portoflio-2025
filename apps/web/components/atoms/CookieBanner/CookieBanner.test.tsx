import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import CookieBanner from './CookieBanner'

describe('CookieBanner', () => {
  it('renders nothing to the DOM', () => {
    const html = renderToStaticMarkup(<CookieBanner />)
    assert.equal(html, '')
  })
})
