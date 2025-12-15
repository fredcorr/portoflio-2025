import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { AnimatedStrapline, DEFAULT_STRAPLINE_TEXT } from './AnimatedStrapline'
import { animatedStraplineMock } from '@/mocks/organisms/animated-strapline'

test('renders the strapline text multiple times for continuous motion', () => {
  const markup = renderToStaticMarkup(
    <AnimatedStrapline {...animatedStraplineMock} />
  )
  const occurrences =
    markup.match(new RegExp(animatedStraplineMock.strapline as string, 'g'))
      ?.length ?? 0

  assert.ok(occurrences >= 2)
  assert.match(markup, /animate-strapline/)
})

test('falls back to default strapline when missing', () => {
  const markup = renderToStaticMarkup(
    <AnimatedStrapline {...animatedStraplineMock} strapline="" />
  )

  assert.match(markup, new RegExp(DEFAULT_STRAPLINE_TEXT))
})
