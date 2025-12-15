import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import AboutPageHero from './AboutPageHero'
import { aboutPageHeroMock } from '@/mocks/organisms/about-page-hero'
import { DEFAULT_CONTACT_EMAIL } from '@/utils/get-contact-email'

test('renders heading, body, image, and CTA', () => {
  const markup = renderToStaticMarkup(
    <AboutPageHero {...aboutPageHeroMock} />
  )

  assert.match(markup, /Hey,\s*I&apos;m Fede/)
  assert.match(markup, /Embarking on a journey of growth and education/)
  assert.match(markup, /Portrait of Fede/)
  assert.match(markup, /mailto:hello@joey\.co/)
  assert.match(markup, /data-icon="arrow-up-right"/)
})

test('uses environment contact email when provided', () => {
  const original = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'team@example.com'

  const markup = renderToStaticMarkup(
    <AboutPageHero {...aboutPageHeroMock} />
  )

  assert.match(markup, /mailto:team@example\.com/)
  assert.match(markup, /team@example\.com/)

  if (typeof original === 'string') {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = original
  } else {
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL
  }
})

test('hides CTA when showCta is false', () => {
  const markup = renderToStaticMarkup(
    <AboutPageHero {...aboutPageHeroMock} showCta={false} />
  )

  assert.ok(!markup.includes('mailto:'))
  assert.ok(!markup.includes(DEFAULT_CONTACT_EMAIL))
})
