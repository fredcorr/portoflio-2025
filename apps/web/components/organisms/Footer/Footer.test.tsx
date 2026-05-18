import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import Footer from './Footer'
import { footerMock } from '@/mocks/organisms/footer'

test('renders email CTA and social links', () => {
  const markup = renderToStaticMarkup(<Footer {...footerMock} />)

  assert.match(markup, /mailto:hello@federicocorradi\.com/)
  assert.match(markup, /Dribbble/)
  assert.match(markup, /Instagram/)
  assert.match(markup, /LinkedIn/)
})

test('renders dynamic year and author in rail', () => {
  const year = new Date().getFullYear()
  const markup = renderToStaticMarkup(<Footer {...footerMock} />)

  assert.match(markup, new RegExp(`${year}`))
  assert.match(markup, /Federico Corradi/)
})

test('omits email CTA when email is missing', () => {
  const markup = renderToStaticMarkup(
    <Footer {...footerMock} email={undefined} />
  )

  assert.ok(!markup.includes('mailto:'))
})

test('renders availability kicker when openForProjects is true', () => {
  const markup = renderToStaticMarkup(
    <Footer {...footerMock} openForProjects={true} availabilityText="Q2 2026" />
  )

  assert.match(markup, /Open for projects/)
  assert.match(markup, /Q2 2026/)
})

test('omits availability kicker when openForProjects is false', () => {
  const markup = renderToStaticMarkup(
    <Footer {...footerMock} openForProjects={false} />
  )

  assert.ok(!markup.includes('Open for projects'))
})

test('renders sitemap nav links from navigationItems', () => {
  const markup = renderToStaticMarkup(<Footer {...footerMock} />)

  assert.match(markup, /href="\/work"/)
  assert.match(markup, /href="\/about"/)
  assert.match(markup, /Work/)
  assert.match(markup, /About/)
})
