import test from 'node:test'
import assert from 'node:assert/strict'
import { HomePageHero } from './HomePageHero'

test('HomePageHero component exports a function', () => {
  assert.equal(typeof HomePageHero, 'function')
})
