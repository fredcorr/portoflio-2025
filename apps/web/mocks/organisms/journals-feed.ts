import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import type { JournalsFeedComponent } from '@portfolio/types/components'

export const journalsFeedMock: JournalsFeedComponent = {
  _type: ComponentTypeName.JournalsFeed,
  _key: 'journals-feed',
  kicker: 'Journal',
  title: { heading: 'Notes from the workbench.', headingLevel: 2 },
  ctaLabel: 'Read all articles',
  ctaLink: {
    name: 'Read all articles',
    url: '/journal',
  },
  articles: [
    {
      _id: 'article-1',
      _type: PageTypeName.ArticlePage,
      title: 'On the discipline of restraint.',
      slug: { _type: 'slug', current: 'journal/on-the-discipline-of-restraint' },
      tags: ['Craft', 'Essay'],
      _createdAt: '2026-04-14T00:00:00.000Z',
      articleContent: [
        {
          _key: 'block-1',
          _type: 'block',
          children: [
            {
              _key: 'span-1',
              _type: 'span',
              text: 'Most interfaces fail not because they do too little, but because they shout. A short field guide to the unfashionable craft of doing less — and meaning it.',
              marks: [],
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
    },
    {
      _id: 'article-2',
      _type: PageTypeName.ArticlePage,
      title: 'Designing for the second click.',
      slug: { _type: 'slug', current: 'journal/designing-for-the-second-click' },
      tags: ['UX', 'Essay'],
      _createdAt: '2026-04-02T00:00:00.000Z',
    },
    {
      _id: 'article-3',
      _type: PageTypeName.ArticlePage,
      title: 'A field guide to quiet typography.',
      slug: { _type: 'slug', current: 'journal/field-guide-to-quiet-typography' },
      tags: ['Typography', 'Notebook'],
      _createdAt: '2026-03-19T00:00:00.000Z',
    },
  ],
}
