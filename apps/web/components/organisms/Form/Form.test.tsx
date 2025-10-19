import test from 'node:test'
import assert from 'node:assert/strict'
import { Form } from './Form'

test('Form component exports a function', () => {
  assert.equal(typeof Form, 'function')
})
