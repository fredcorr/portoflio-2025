import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { projectIntroMock } from '@/mocks/organisms/project-intro'
import ProjectIntro from './ProjectIntro'

test('renders breadcrumbs with current page not clickable', () => {
  const markup = renderToStaticMarkup(<ProjectIntro {...projectIntroMock} />)

  assert.match(markup, /aria-label="Breadcrumb"/)
  assert.match(markup, /href="\/projects"/)
  assert.match(markup, />Projects</)
  assert.match(markup, /aria-current="page"/)
  assert.match(markup, />Websites</)
  assert.doesNotMatch(markup, />Websites<\/a>/)
})

test('renders title and description when provided', () => {
  const markup = renderToStaticMarkup(<ProjectIntro {...projectIntroMock} />)

  assert.match(markup, /Go by one dresscode/)
  assert.match(markup, /As emerging sectors arise/)
})

test('omits optional regions when content is missing', () => {
  const markup = renderToStaticMarkup(
    <ProjectIntro breadcrumbs={[]} title="" description="" />
  )

  assert.doesNotMatch(markup, /aria-label="Breadcrumb"/)
  assert.doesNotMatch(markup, /<h1/)
  assert.doesNotMatch(markup, /<p/)
})
