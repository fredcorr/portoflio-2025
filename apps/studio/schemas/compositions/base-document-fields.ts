import { defineField } from 'sanity'
import Toggle from '../components/atoms/toggle'
import { baseDocumentFieldset } from '../fieldsets'
import {
  BaseDocumentFieldsConfig,
  Slugifier,
  SlugOptionOverrides,
} from '@studio/types'

const normalizePath = (value?: string) => {
  if (!value) return undefined
  return value.replace(/\/+$/g, '').replace(/^\/+/g, '')
}

const defaultSlugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s/_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

const withBasePath = (slug: string, basePath?: string | null | undefined) => {
  if (!basePath) return slug
  const normalizedBase = normalizePath(basePath)
  const normalizedSlug = normalizePath(slug)
  return [normalizedBase, normalizedSlug].filter(Boolean).join('/')
}

export const createBaseDocumentFields = (
  config: BaseDocumentFieldsConfig = {}
) => {
  const title = defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    description:
      'The title of the page. This is used as the main heading and for SEO purposes.',
    ...(config.title?.initialValue
      ? { initialValue: config.title.initialValue }
      : {}),
  })

  const slugOptions = (() => {
    const userSlugify = config.slug?.options?.slugify

    const slugify: Slugifier = (input, schemaType) => {
      if (typeof userSlugify === 'function') {
        const result = userSlugify(input, schemaType)
        if (
          result &&
          typeof (result as PromiseLike<string>).then === 'function'
        ) {
          return (result as Promise<string>).then(slugValue =>
            withBasePath(String(slugValue), config.slug?.basePath)
          )
        }
        return withBasePath(String(result), config.slug?.basePath)
      }
      return withBasePath(defaultSlugify(input), config.slug?.basePath)
    }

    const baseOptions: SlugOptionOverrides = {
      source: 'title',
      maxLength: 96,
      ...config.slug?.options,
      slugify,
    }

    return baseOptions
  })()

  const slug = defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    fieldset: baseDocumentFieldset.name,
    options: slugOptions,
  })

  const navigationToggle = Toggle({
    name: 'showInNavigation',
    title: 'Show in navigation',
    description: 'Control whether this page appears in the primary navigation.',
    fieldset: baseDocumentFieldset.name,
  })

  const entries = Object.freeze([title, slug, navigationToggle] as const)

  return Object.freeze({
    title,
    slug,
    navigationToggle,
    all: entries,
  })
}

export const baseDocumentFields = createBaseDocumentFields()
