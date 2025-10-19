import test from 'node:test'
import assert from 'node:assert/strict'
import { Faqs } from './Faqs'

test('Faqs component exports a function', () => {
  assert.equal(typeof Faqs, 'function')
})
