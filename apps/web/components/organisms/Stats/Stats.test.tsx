import test from 'node:test'
import assert from 'node:assert/strict'
import { Stats } from './Stats'

test('Stats component exports a function', () => {
  assert.equal(typeof Stats, 'function')
})
