import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import FadeIn from './FadeIn'

test('renders children', () => {
  const markup = renderToStaticMarkup(
    <FadeIn>
      <p>Hello</p>
    </FadeIn>
  )
  assert.match(markup, /Hello/)
})

test('forwards className', () => {
  const markup = renderToStaticMarkup(
    <FadeIn className="test-class">content</FadeIn>
  )
  assert.match(markup, /test-class/)
})

test('renders with custom element tag', () => {
  const markup = renderToStaticMarkup(<FadeIn as="section">content</FadeIn>)
  assert.match(markup, /<section/)
})

test('renders with default div tag', () => {
  const markup = renderToStaticMarkup(<FadeIn>content</FadeIn>)
  assert.match(markup, /<div/)
})

test('Stagger renders children', () => {
  const markup = renderToStaticMarkup(
    <FadeIn.Stagger>
      <p>Hello</p>
    </FadeIn.Stagger>
  )
  assert.match(markup, /Hello/)
})

test('Stagger forwards className', () => {
  const markup = renderToStaticMarkup(
    <FadeIn.Stagger className="test-class">content</FadeIn.Stagger>
  )
  assert.match(markup, /test-class/)
})

test('Stagger renders with custom element tag', () => {
  const markup = renderToStaticMarkup(
    <FadeIn.Stagger as="section">content</FadeIn.Stagger>
  )
  assert.match(markup, /<section/)
})

test('Stagger renders with default div tag', () => {
  const markup = renderToStaticMarkup(
    <FadeIn.Stagger>content</FadeIn.Stagger>
  )
  assert.match(markup, /<div/)
})

const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <article className={className}>{children}</article>
)

test('renders with custom React component', () => {
  const markup = renderToStaticMarkup(<FadeIn as={Wrapper}>content</FadeIn>)
  assert.match(markup, /<article/)
})

test('Stagger renders with custom React component', () => {
  const markup = renderToStaticMarkup(<FadeIn.Stagger as={Wrapper}>content</FadeIn.Stagger>)
  assert.match(markup, /<article/)
})
