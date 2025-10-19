import test from 'node:test'
import assert from 'node:assert/strict'
import { Process } from './Process'

test('Process component exports a function', () => {
  assert.equal(typeof Process, 'function')
})
