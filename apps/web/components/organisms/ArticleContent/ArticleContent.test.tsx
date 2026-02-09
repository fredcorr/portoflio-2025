import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ArticleContent from './ArticleContent'
import { articleContentMock } from '@/mocks/organisms/article-content'

test('renders share actions and rich text content', () => {
  const markup = renderToStaticMarkup(
    <ArticleContent
      content={articleContentMock.content}
      shareUrl={articleContentMock.shareUrl}
      shareTitle={articleContentMock.shareTitle}
    />
  )

  assert.match(markup, /Share/)
  assert.match(markup, /facebook/i)
  assert.match(markup, /twitter\.com\/intent\/tweet/)
  assert.match(markup, /linkedin\.com\/sharing\/share-offsite/)
  assert.match(markup, /The Power of Visual Identity/)
})

test('returns empty markup when content and share url are missing', () => {
  const markup = renderToStaticMarkup(<ArticleContent />)

  assert.equal(markup, '')
})
