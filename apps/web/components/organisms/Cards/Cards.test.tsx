import test from 'node:test'
import assert from 'node:assert/strict'
import { Cards } from './Cards'

test('Cards component exports a function', () => {
  assert.equal(typeof Cards, 'function')
})
