import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import ScaleIn from './ScaleIn'

test('renders children', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn>
      <p>Hello</p>
    </ScaleIn>
  )
  assert.match(markup, /Hello/)
})

test('forwards className', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn className="test-class">content</ScaleIn>
  )
  assert.match(markup, /test-class/)
})

test('renders with custom element tag', () => {
  const markup = renderToStaticMarkup(<ScaleIn as="figure">content</ScaleIn>)
  assert.match(markup, /<figure/)
})

test('renders with default div tag', () => {
  const markup = renderToStaticMarkup(<ScaleIn>content</ScaleIn>)
  assert.match(markup, /<div/)
})

test('Stagger renders children', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn.Stagger>
      <p>Hello</p>
    </ScaleIn.Stagger>
  )
  assert.match(markup, /Hello/)
})

test('Stagger forwards className', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn.Stagger className="test-class">content</ScaleIn.Stagger>
  )
  assert.match(markup, /test-class/)
})

test('Stagger renders with custom element tag', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn.Stagger as="li">content</ScaleIn.Stagger>
  )
  assert.match(markup, /<li/)
})

test('Stagger renders with default div tag', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn.Stagger>content</ScaleIn.Stagger>
  )
  assert.match(markup, /<div/)
})

const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <article className={className}>{children}</article>

test('renders with custom React component', () => {
  const markup = renderToStaticMarkup(<ScaleIn as={Wrapper}>content</ScaleIn>)
  assert.match(markup, /<article/)
})

test('Stagger renders with custom React component', () => {
  const markup = renderToStaticMarkup(
    <ScaleIn.Stagger as={Wrapper}>content</ScaleIn.Stagger>
  )
  assert.match(markup, /<article/)
})
