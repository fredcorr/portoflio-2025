import assert from 'node:assert/strict'
import test from 'node:test'
import { ComponentTypeName } from '@portfolio/types/base'
import { organismFragments } from './index'

/**
 * Runtime guard for the GROQ side of the organism registry. The
 * `Record<ComponentTypeName, string>` typing already enforces exhaustiveness at
 * compile time; this is the belt-and-braces check that the map stays in lockstep
 * with the enum and that no fragment is accidentally empty.
 *
 * The React render side (`organismComponents`) is guaranteed the same way by its
 * mapped type, but is intentionally not imported here — doing so would pull the
 * Next-only organism graph into a plain test runner.
 */
const enumValues = [...Object.values(ComponentTypeName)].sort()

test('organismFragments has an entry for every ComponentTypeName', () => {
  const fragmentKeys = Object.keys(organismFragments).sort()
  assert.deepEqual(fragmentKeys, enumValues)
})

test('every organism fragment is a non-empty string', () => {
  for (const [type, fragment] of Object.entries(organismFragments)) {
    assert.equal(typeof fragment, 'string', `${type} fragment must be a string`)
    assert.ok(fragment.trim().length > 0, `${type} fragment must not be empty`)
  }
})
