import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import {
  baseDocumentFieldset,
  seoFieldset,
  syndicationFieldset,
} from '@schemas/fieldsets'
import { PageTypeName } from '@portfolio/types/base'
import { MdOutlineArticle } from 'react-icons/md'
import { componentsByPageType } from '..'
import { defineField, defineType } from 'sanity'
import Media from '@components/atoms/media'
import List from '@components/atoms/list'
import Block from '@components/atoms/block'
import PublishedLinkInput from '@components/atoms/published-link-input'

const Article = defineType({
  name: PageTypeName.ArticlePage,
  title: 'Article',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset, syndicationFieldset],
  fields: [
    ...createBaseDocumentFields({
      slug: {
        basePath: 'journals/',
      },
      title: {
        initialValue: 'Article',
      },
    }).all,
    Media({
      name: 'heroImage',
      title: 'Hero image',
      description: 'Primary image used for the article header and cards.',
    }),
    List({
      name: 'tags',
      title: 'Tags',
      description: 'Taxonomy tags assigned to this article.',
      of: [{ type: 'string' }],
    }),
    Block(
      {
        name: 'articleContent',
        title: 'Content',
        description: 'Main article body content.',
      },
      [{ type: 'codeBlock' }, { type: 'pullQuote' }]
    ),
    componentsByPageType(PageTypeName.ArticlePage),
    ...seoFields.all,
    defineField({
      name: 'mediumPublishedUrl',
      title: 'Medium URL',
      type: 'url',
      description:
        'Paste the article URL here after publishing it on Medium. Renders as a clickable link.',
      fieldset: syndicationFieldset.name,
      components: { input: PublishedLinkInput },
    }),
    defineField({
      name: 'devtoPublishedUrl',
      title: 'Dev.to URL',
      type: 'url',
      description: 'Set automatically when the article is published to Dev.to.',
      fieldset: syndicationFieldset.name,
      readOnly: true,
      components: { input: PublishedLinkInput },
    }),
    defineField({
      name: 'devtoArticleId',
      title: 'Dev.to article ID',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'seoDescription',
      media: 'seoImage',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Article',
        subtitle,
        media: media || MdOutlineArticle,
      }
    },
  },
})

export default Article
