import test from 'node:test'
import assert from 'node:assert/strict'
import { ImageGrid } from './ImageGrid'

test('ImageGrid component exports a function', () => {
  assert.equal(typeof ImageGrid, 'function')
})
