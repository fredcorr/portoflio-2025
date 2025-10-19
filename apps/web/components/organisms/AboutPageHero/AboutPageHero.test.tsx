import test from 'node:test'
import assert from 'node:assert/strict'
import { AboutPageHero } from './AboutPageHero'

test('AboutPageHero component exports a function', () => {
  assert.equal(typeof AboutPageHero, 'function')
})
