import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { PageTypeName } from '@portfolio/types/base'
import { MdOutlineArticle } from 'react-icons/md'
import { componentsByPageType } from '..'
import { defineType } from 'sanity'
import Media from '@components/atoms/media'
import List from '@components/atoms/list'
import Block from '@components/atoms/block'

const Article = defineType({
  name: PageTypeName.ArticlePage,
  title: 'Article',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields({
      slug: {
        basePath: 'articles/',
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
    Block({
      name: 'articleContent',
      title: 'Content',
      description: 'Main article body content.',
    }),
    componentsByPageType(PageTypeName.ArticlePage),
    ...seoFields.all,
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
