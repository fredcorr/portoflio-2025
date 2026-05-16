import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import { LuBookOpen } from 'react-icons/lu'
import Reference from '@components/atoms/reference'
import { defineType } from 'sanity'
import List from '@components/atoms/list'
import String from '@components/atoms/string'
import { Link } from '@components/atoms/link'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const JournalsFeed = defineType({
  name: ComponentTypeName.JournalsFeed,
  title: 'Journals Feed',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    String({
      name: 'kicker',
      title: 'Kicker',
      description: 'Small label shown above the title (e.g. "Journal").',
    }),
    Link({
      name: 'ctaLink',
      title: 'CTA Link',
      description:
        'Optional link for the CTA button. When set, the button is shown.',
    }),
    List({
      name: 'articles',
      title: 'Articles',
      description: 'Hand-pick the journal articles to feature in this section.',
      of: [
        Reference(
          {
            name: 'articleReference',
            title: 'Article',
            description: 'Reference to a published article.',
          },
          [PageTypeName.ArticlePage]
        ),
      ],
      options: {
        layout: 'list',
      },
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      articles: 'articles',
    },
    prepare({ title, articles }) {
      const count = Array.isArray(articles) ? articles.length : 0
      const subtitle = count
        ? `${count} article${count === 1 ? '' : 's'}`
        : 'No articles selected'

      return {
        title: title || 'Journals Feed',
        subtitle,
        media: LuBookOpen,
      }
    },
  },
})

export default JournalsFeed
