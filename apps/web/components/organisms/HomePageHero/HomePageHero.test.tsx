import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { ComponentTypeName } from '@portfolio/types/base'
import type { HomePageHeroComponent } from '@portfolio/types/components'
import type { SettingsData } from '@portfolio/types/settings'
import { client } from '@/sanity/client'
import { HomePageHero } from './HomePageHero'

const createHero = (
  overrides: Partial<HomePageHeroComponent> = {}
): HomePageHeroComponent => ({
  _type: ComponentTypeName.HomePageHero,
  title: 'Websites & Branding',
  subtitle:
    "Hello, I'm Joey, an online product designer focusing on brand identity, advertising, and no-code instruments.",
  getInTouchTitle: "Let's talk",
  ...overrides,
})

/**
 * HomePageHero is an async Server Component that reads global settings (incl.
 * the contact email) from Sanity via `getSettings()` -> `client.fetch`. To
 * render it without a live CMS we stub `client.fetch`, await the component to
 * resolve its element, then serialize it.
 */
const renderHero = async (
  props: Partial<HomePageHeroComponent> & { scrollTargetId?: string } = {},
  settings: Partial<SettingsData> | undefined = { email: 'hello@joey.co' }
): Promise<string> => {
  const originalFetch = client.fetch
  client.fetch = (async () => ({
    settings,
    projectCount: 0,
  })) as unknown as typeof client.fetch
  try {
    const element = await HomePageHero({ ...createHero(props), ...props })
    return renderToStaticMarkup(element)
  } finally {
    client.fetch = originalFetch
  }
}

test('renders the provided headline and supporting copy', async () => {
  const markup = await renderHero()

  assert.match(markup, /Websites &amp; Branding/)
  assert.match(markup, /Joey, an online product designer/)
})

test('renders the contact label and email from Sanity settings', async () => {
  const markup = await renderHero({}, { email: 'team@example.com' })

  assert.match(markup, /Let&#x27;s talk/) // apostrophe is HTML-escaped in the markup
  assert.match(markup, /mailto:team@example\.com/)
  assert.match(markup, /team@example\.com/)
})

test('omits the contact link when settings has no email', async () => {
  const markup = await renderHero({}, { email: undefined })

  // Label still renders, but there is no mailto link without an email.
  assert.match(markup, /Let&#x27;s talk/) // apostrophe is HTML-escaped in the markup
  assert.doesNotMatch(markup, /mailto:/)
})

test('uses the provided next-section target for the scroll cta', async () => {
  const markup = await renderHero({ scrollTargetId: 'section-next' })

  assert.match(markup, /href="#section-next"/)
})

test('falls back to main-content when no next-section target is provided', async () => {
  const markup = await renderHero()

  assert.match(markup, /href="#main-content"/)
})
