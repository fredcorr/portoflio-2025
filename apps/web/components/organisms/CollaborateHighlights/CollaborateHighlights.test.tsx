import test from 'node:test'
import assert from 'node:assert/strict'
import { CollaborateHighlights } from './CollaborateHighlights'

test('CollaborateHighlights component exports a function', () => {
  assert.equal(typeof CollaborateHighlights, 'function')
})
