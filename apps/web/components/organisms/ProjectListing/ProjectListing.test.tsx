import assert from 'node:assert/strict'
import test from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import type { ProjectListingComponent } from '@portfolio/types/components'
import type { PortableTextBlock } from '@portabletext/react'
import ProjectListing from './ProjectListing'

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

const createProjectListing = (
  overrides: Partial<ProjectListingComponent> = {}
): ProjectListingComponent => ({
  _type: ComponentTypeName.ProjectListing,
  _key: 'project-listing',
  title: { heading: 'Featured work', headingLevel: 2 },
  subtitle: block('High-performing product design with brand craft.'),
  projects: [
    {
      _id: 'project-1',
      _type: PageTypeName.ProjectPage,
      title: 'Crtly',
      slug: { _type: 'slug', current: 'projects/crtly' },
      projectHero: {
        _type: 'image',
        alt: 'Crtly mobile app UI',
        asset: {
          _type: 'reference',
          _ref: 'image-crtly',
          url: 'https://example.com/crtly.jpg',
        },
      },
    },
    {
      _id: 'project-2',
      _type: PageTypeName.ProjectPage,
      title: 'Tansto',
      slug: { _type: 'slug', current: 'projects/web-design' },
      projectHero: {
        _type: 'image',
        alt: 'Tansto landing page',
        asset: {
          _type: 'reference',
          _ref: 'image-tansto',
          url: 'https://example.com/tansto.jpg',
        },
      },
    },
  ],
  ...overrides,
})

test('renders heading, subtitle, and project cards', () => {
  const markup = renderToStaticMarkup(
    <ProjectListing {...createProjectListing()} />
  )

  assert.match(markup, /Featured work/)
  assert.match(markup, /High-performing product design with brand craft/)
  assert.match(markup, /Crtly/)
  assert.match(markup, /Tansto/)
  assert.match(markup, /href="\/projects\/web-design"/)
  assert.match(markup, /Web Design/)
  assert.match(markup, /data-icon="arrow-up-right"/)
  assert.match(markup, />01<\/span>/)
})

test('shows CTA when enabled', () => {
  const markup = renderToStaticMarkup(
    <ProjectListing {...createProjectListing({ showCtaToProjects: true })} />
  )

  assert.match(markup, /View all projects/)
  assert.match(markup, /href="\/projects"/)
})

test('renders empty state when there are no projects', () => {
  const markup = renderToStaticMarkup(
    <ProjectListing
      {...createProjectListing({
        projects: [],
        subtitle: block('Coming soon'),
      })}
    />
  )

  assert.match(markup, /Projects will appear here once they are published/)
})

test('falls back to slug-derived subtitle when label is missing', () => {
  const markup = renderToStaticMarkup(
    <ProjectListing
      {...createProjectListing({
        projects: [
          {
            _id: 'project-1',
            _type: PageTypeName.ProjectPage,
            title: 'No label project',
            slug: { _type: 'slug', current: 'projects/brand-shapes' },
            projectHero: {
              _type: 'image',
              alt: 'Brand shapes',
              asset: {
                _type: 'reference',
                _ref: 'image-brand',
                url: 'https://example.com/brand.jpg',
              },
            },
          },
        ],
      })}
    />
  )

  assert.match(markup, /Brand Shapes/)
})
