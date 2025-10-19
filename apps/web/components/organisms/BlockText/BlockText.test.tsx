import test from 'node:test'
import assert from 'node:assert/strict'
import { BlockText } from './BlockText'

test('BlockText component exports a function', () => {
  assert.equal(typeof BlockText, 'function')
})
