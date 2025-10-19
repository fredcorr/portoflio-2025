import test from 'node:test'
import assert from 'node:assert/strict'
import { ImageGallery } from './ImageGallery'

test('ImageGallery component exports a function', () => {
  assert.equal(typeof ImageGallery, 'function')
})
