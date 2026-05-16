import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ArticleIntro from './ArticleIntro'
import { articleIntroMock } from '@/mocks/organisms/article-intro'

test('renders eyebrow, title, deck, and meta grid', () => {
  const markup = renderToStaticMarkup(<ArticleIntro {...articleIntroMock} />)

  assert.match(markup, /Journal/)
  assert.match(markup, /Essay/)
  assert.match(markup, /N° 014/)
  assert.match(markup, /On the discipline of restraint/)
  assert.match(markup, /Most interfaces fail/)
  assert.match(markup, /April 14, 2026/)
  assert.match(markup, /9 min read/)
  assert.match(markup, /Federico Corradi/)
})

test('omits eyebrow extras and deck when not provided', () => {
  const markup = renderToStaticMarkup(<ArticleIntro title="Minimal title" />)

  assert.match(markup, /Minimal title/)
  assert.match(markup, /Journal/)
  assert.ok(!markup.includes('N°'))
  assert.ok(!markup.includes('min read'))
})
