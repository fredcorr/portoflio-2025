import test from 'node:test'
import assert from 'node:assert/strict'
import { ProjectListing } from './ProjectListing'

test('ProjectListing component exports a function', () => {
  assert.equal(typeof ProjectListing, 'function')
})
