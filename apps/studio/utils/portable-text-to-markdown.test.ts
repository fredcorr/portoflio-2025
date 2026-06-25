import test from 'node:test'
import assert from 'node:assert/strict'
import type { PortableTextValue } from '@portfolio/types/studio'
import { portableTextToMarkdown } from './portable-text-to-markdown'

interface BlockOverrides {
  style?: string
  listItem?: string
  level?: number
  markDefs?: { _key: string; _type: string; [key: string]: unknown }[]
  children: { text: string; marks?: string[] }[]
}

const block = (overrides: BlockOverrides): PortableTextValue[number] =>
  ({
    _type: 'block',
    _key: 'k',
    style: 'normal',
    markDefs: [],
    ...overrides,
    children: overrides.children.map((child, index) => ({
      _type: 'span',
      _key: `s${index}`,
      marks: [],
      ...child,
    })),
  }) as unknown as PortableTextValue[number]

test('returns empty string for non-array input', () => {
  assert.equal(portableTextToMarkdown(undefined), '')
  assert.equal(portableTextToMarkdown(null), '')
})

test('serializes headings', () => {
  const value = [
    block({ style: 'h1', children: [{ text: 'Title' }] }),
    block({ style: 'h2', children: [{ text: 'Subtitle' }] }),
    block({ style: 'normal', children: [{ text: 'Body text.' }] }),
  ] as PortableTextValue

  assert.equal(
    portableTextToMarkdown(value),
    '# Title\n\n## Subtitle\n\nBody text.'
  )
})

test('serializes decorators including nested marks', () => {
  const value = [
    block({ children: [{ text: 'bold', marks: ['strong'] }] }),
    block({ children: [{ text: 'italic', marks: ['em'] }] }),
    block({ children: [{ text: 'code', marks: ['code'] }] }),
    block({ children: [{ text: 'both', marks: ['strong', 'em'] }] }),
  ] as PortableTextValue

  assert.equal(
    portableTextToMarkdown(value),
    '**bold**\n\n_italic_\n\n`code`\n\n**_both_**'
  )
})

test('serializes link annotations', () => {
  const value = [
    {
      _type: 'block',
      _key: 'k',
      style: 'normal',
      markDefs: [{ _key: 'link1', _type: 'link', href: 'https://example.com' }],
      children: [
        { _type: 'span', _key: 's0', marks: [], text: 'See ' },
        { _type: 'span', _key: 's1', marks: ['link1'], text: 'this site' },
      ],
    },
  ] as unknown as PortableTextValue

  assert.equal(
    portableTextToMarkdown(value),
    'See [this site](https://example.com)'
  )
})

test('serializes bullet and numbered lists with nesting', () => {
  const value = [
    block({ listItem: 'bullet', level: 1, children: [{ text: 'One' }] }),
    block({ listItem: 'bullet', level: 2, children: [{ text: 'Nested' }] }),
    block({ listItem: 'number', level: 1, children: [{ text: 'First' }] }),
  ] as PortableTextValue

  assert.equal(portableTextToMarkdown(value), '- One\n\n  - Nested\n\n1. First')
})

test('serializes pullQuote as blockquote with attribution', () => {
  const value = [
    {
      _type: 'pullQuote',
      _key: 'pq',
      text: 'Stay hungry.',
      attribution: 'Steve Jobs',
    },
  ] as unknown as PortableTextValue

  assert.equal(
    portableTextToMarkdown(value),
    '> Stay hungry.\n>\n> — Steve Jobs'
  )
})

test('serializes pullQuote without attribution', () => {
  const value = [
    { _type: 'pullQuote', _key: 'pq', text: 'No author here.' },
  ] as unknown as PortableTextValue

  assert.equal(portableTextToMarkdown(value), '> No author here.')
})

test('serializes codeBlock as fenced block', () => {
  const value = [
    {
      _type: 'codeBlock',
      _key: 'cb',
      language: 'ts',
      code: 'const a = 1',
    },
  ] as unknown as PortableTextValue

  assert.equal(portableTextToMarkdown(value), '```ts\nconst a = 1\n```')
})
