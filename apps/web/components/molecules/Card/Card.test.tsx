import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PortableTextBlock } from '@portabletext/react'

import { IconName } from '@/components/atoms/Icon/Icon'
import { RichTextSize } from '@/components/atoms/RichText/RichText'
import Card, { CardSpacing, CardTitleSize } from './Card'

const block = (text: string): PortableTextBlock[] => [
  {
    _key: `${text}-block`,
    _type: 'block',
    children: [
      {
        _key: `${text}-span`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
    markDefs: [],
    style: 'normal',
  },
]

test('renders image, icon, index, title, and subtitle', () => {
  const markup = renderToStaticMarkup(
    <Card
      title="Test Project"
      subtitle={block('Details go here')}
      href="/projects/test"
      image={{
        _type: 'image',
        asset: {
          url: '/test-image.jpg',
          metadata: { dimensions: { width: 800, height: 600 } },
        },
        alt: 'Alt text',
      }}
      iconName={IconName.Sparkle}
      index={0}
    />
  )

  assert.match(markup, /href="\/projects\/test"/)
  assert.match(markup, /alt="Alt text"/)
  assert.match(markup, /data-icon="sparkle"/)
  assert.match(markup, />01</)
  assert.match(markup, /Test Project/)
  assert.match(markup, /Details go here/)
})

test('respects sizing and spacing variants', () => {
  const markup = renderToStaticMarkup(
    <Card
      title="Sized Project"
      subtitle={block('Sized body')}
      spacing={CardSpacing.Roomy}
      titleSize={CardTitleSize.Large}
      subtitleSize={RichTextSize.Md}
    />
  )

  assert.match(markup, /text-heading-3/)
  assert.match(markup, /text-body-md/)
  assert.match(markup, /gap-6/)
})

test('does not render an image when one is not provided', () => {
  const markup = renderToStaticMarkup(<Card title="No Image Card" />)

  assert.doesNotMatch(markup, /<img/)
})

test('renders string subtitles as plain text', () => {
  const markup = renderToStaticMarkup(
    <Card title="String Subtitle" subtitle="Plain text subtitle" />
  )

  assert.match(markup, /Plain text subtitle/)
})
