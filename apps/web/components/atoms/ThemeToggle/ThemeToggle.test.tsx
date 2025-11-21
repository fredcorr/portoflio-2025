import test from 'node:test'
import assert from 'node:assert/strict'
import { ThemeToggle } from './ThemeToggle'

test('ThemeToggle component exports a function', () => {
  assert.equal(typeof ThemeToggle, 'function')
})
