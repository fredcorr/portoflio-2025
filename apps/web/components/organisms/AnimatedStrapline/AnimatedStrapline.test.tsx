import test from 'node:test'
import assert from 'node:assert/strict'
import { AnimatedStrapline } from './AnimatedStrapline'

test('AnimatedStrapline component exports a function', () => {
  assert.equal(typeof AnimatedStrapline, 'function')
})
