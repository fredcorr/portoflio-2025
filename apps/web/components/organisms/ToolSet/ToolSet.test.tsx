import test from 'node:test'
import assert from 'node:assert/strict'
import { ToolSet } from './ToolSet'

test('ToolSet component exports a function', () => {
  assert.equal(typeof ToolSet, 'function')
})
