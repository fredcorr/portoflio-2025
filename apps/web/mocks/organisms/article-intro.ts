import type { ArticleIntroProps } from '@portfolio/types/components'

export const articleIntroMock: ArticleIntroProps = {
  title: 'Go by one dresscode; wear your heart on your sleeve',
  dateLabel: 'January 15, 2026',
  readTimeLabel: '8 min read',
  tags: ['Design', 'Branding', 'Storytelling'],
  heroImage: {
    _type: 'image',
    alt: 'Rolling hills at sunrise',
    asset: {
      _type: 'reference',
      _ref: 'image-article-hero',
      url: '/images/article-hero.jpg',
      metadata: {
        dimensions: {
          width: 1200,
          height: 900,
        },
      },
    },
  },
}
