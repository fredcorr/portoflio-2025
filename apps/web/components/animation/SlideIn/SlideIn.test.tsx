import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import SlideIn, { SlideDirection } from './SlideIn'

test('renders children', () => {
  const markup = renderToStaticMarkup(
    <SlideIn>
      <p>Hello</p>
    </SlideIn>
  )
  assert.match(markup, /Hello/)
})

test('forwards className', () => {
  const markup = renderToStaticMarkup(
    <SlideIn className="test-class">content</SlideIn>
  )
  assert.match(markup, /test-class/)
})

test('renders with custom element tag', () => {
  const markup = renderToStaticMarkup(<SlideIn as="article">content</SlideIn>)
  assert.match(markup, /<article/)
})

test('renders with default div tag', () => {
  const markup = renderToStaticMarkup(<SlideIn>content</SlideIn>)
  assert.match(markup, /<div/)
})

test('accepts all SlideDirection values', () => {
  for (const direction of Object.values(SlideDirection)) {
    const markup = renderToStaticMarkup(
      <SlideIn direction={direction}>content</SlideIn>
    )
    assert.match(markup, /content/)
  }
})

test('Stagger renders children', () => {
  const markup = renderToStaticMarkup(
    <SlideIn.Stagger>
      <p>Hello</p>
    </SlideIn.Stagger>
  )
  assert.match(markup, /Hello/)
})

test('Stagger forwards className', () => {
  const markup = renderToStaticMarkup(
    <SlideIn.Stagger className="test-class">content</SlideIn.Stagger>
  )
  assert.match(markup, /test-class/)
})

test('Stagger renders with custom element tag', () => {
  const markup = renderToStaticMarkup(
    <SlideIn.Stagger as="article">content</SlideIn.Stagger>
  )
  assert.match(markup, /<article/)
})

test('Stagger renders with default div tag', () => {
  const markup = renderToStaticMarkup(
    <SlideIn.Stagger>content</SlideIn.Stagger>
  )
  assert.match(markup, /<div/)
})

test('Stagger accepts all SlideDirection values', () => {
  for (const direction of Object.values(SlideDirection)) {
    const markup = renderToStaticMarkup(
      <SlideIn.Stagger direction={direction}>content</SlideIn.Stagger>
    )
    assert.match(markup, /content/)
  }
})

const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <article className={className}>{children}</article>

test('renders with custom React component', () => {
  const markup = renderToStaticMarkup(<SlideIn as={Wrapper}>content</SlideIn>)
  assert.match(markup, /<article/)
})

test('Stagger renders with custom React component', () => {
  const markup = renderToStaticMarkup(
    <SlideIn.Stagger as={Wrapper}>content</SlideIn.Stagger>
  )
  assert.match(markup, /<article/)
})
