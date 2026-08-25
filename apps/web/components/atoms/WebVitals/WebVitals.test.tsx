import { renderToStaticMarkup } from 'react-dom/server'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import WebVitals from './WebVitals'

describe('WebVitals', () => {
  it('renders nothing to the DOM', () => {
    const html = renderToStaticMarkup(<WebVitals />)
    assert.equal(html, '')
  })
})
