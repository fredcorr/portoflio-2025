import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ArticleIntro from './ArticleIntro'
import { articleIntroMock } from '@/mocks/organisms/article-intro'

test('renders article intro metadata, title, tags, and image', () => {
  const markup = renderToStaticMarkup(<ArticleIntro {...articleIntroMock} />)

  assert.match(markup, /January 15, 2026/)
  assert.match(markup, /8 min read/)
  assert.match(markup, /Go by one dresscode; wear your heart on your sleeve/)
  assert.match(markup, /Design/)
  assert.match(markup, /Branding/)
  assert.match(markup, /Storytelling/)
  assert.match(markup, /Rolling hills at sunrise/)
})

test('omits meta and tags when not provided', () => {
  const markup = renderToStaticMarkup(
    <ArticleIntro title="Title only" heroImage={articleIntroMock.heroImage} />
  )

  assert.match(markup, /Title only/)
  assert.ok(!markup.includes('min read'))
  assert.ok(!markup.includes('January'))
})
