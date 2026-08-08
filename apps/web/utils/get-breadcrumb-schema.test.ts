import assert from 'node:assert/strict'
import test from 'node:test'

import { getBreadcrumbSchema } from './get-breadcrumb-schema'

const SITE_URL = 'https://example.com'

test('builds a BreadcrumbList rooted at Home', () => {
  const schema = getBreadcrumbSchema(SITE_URL, 'journals/restraint')

  assert.ok(schema)
  assert.equal(schema['@context'], 'https://schema.org')
  assert.equal(schema['@type'], 'BreadcrumbList')
  assert.deepEqual(schema.itemListElement[0], {
    '@type': 'ListItem',
    position: 1,
    name: 'Home',
    item: SITE_URL,
  })
})

test('numbers positions from one and resolves absolute item URLs', () => {
  const schema = getBreadcrumbSchema(SITE_URL, 'journals/restraint')

  assert.ok(schema)
  assert.deepEqual(
    schema.itemListElement.map(item => [item.position, item.name, item.item]),
    [
      [1, 'Home', SITE_URL],
      [2, 'Journals', `${SITE_URL}/journals`],
      [3, 'Restraint', `${SITE_URL}/journals/restraint`],
    ]
  )
})

test('names the final crumb with the supplied label', () => {
  const schema = getBreadcrumbSchema(
    SITE_URL,
    'journals/on-the-discipline-of-restraint',
    'On the discipline of restraint'
  )

  assert.ok(schema)
  const last = schema.itemListElement.at(-1)
  assert.equal(last?.name, 'On the discipline of restraint')
  assert.equal(
    last?.item,
    `${SITE_URL}/journals/on-the-discipline-of-restraint`
  )
})

test('leaves ancestor crumb names untouched when a label is supplied', () => {
  const schema = getBreadcrumbSchema(SITE_URL, 'journals/restraint', 'A title')

  assert.ok(schema)
  assert.equal(schema.itemListElement[1]?.name, 'Journals')
})

test('returns null for the home page', () => {
  assert.equal(getBreadcrumbSchema(SITE_URL, '/'), null)
  assert.equal(getBreadcrumbSchema(SITE_URL, ''), null)
  assert.equal(getBreadcrumbSchema(SITE_URL), null)
})
