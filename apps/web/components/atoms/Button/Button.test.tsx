import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Button from './Button'

test('renders a button element', () => {
  const markup = renderToStaticMarkup(<Button>Click</Button>)
  assert.match(markup, /<button/)
  assert.match(markup, /Click/)
})

test('ghost variant applies text color classes', () => {
  const markup = renderToStaticMarkup(<Button variant="ghost">Ghost</Button>)
  assert.match(markup, /text-foreground\/55/)
})

test('outline variant applies border classes', () => {
  const markup = renderToStaticMarkup(<Button variant="outline">Outline</Button>)
  assert.match(markup, /border-foreground\/10/)
})

test('forwards className', () => {
  const markup = renderToStaticMarkup(<Button className="custom-class">Btn</Button>)
  assert.match(markup, /custom-class/)
})

test('disabled attribute is forwarded', () => {
  const markup = renderToStaticMarkup(<Button disabled>Disabled</Button>)
  assert.match(markup, /disabled/)
})

test('sm size applies text-body-md', () => {
  const markup = renderToStaticMarkup(<Button size="sm">Sized</Button>)
  assert.match(markup, /text-body-md/)
})
