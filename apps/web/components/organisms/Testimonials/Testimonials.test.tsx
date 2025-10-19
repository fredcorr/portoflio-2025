import test from 'node:test'
import assert from 'node:assert/strict'
import { Testimonials } from './Testimonials'

test('Testimonials component exports a function', () => {
  assert.equal(typeof Testimonials, 'function')
})
