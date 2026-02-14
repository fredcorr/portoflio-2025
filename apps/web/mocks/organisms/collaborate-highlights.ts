import { ComponentTypeName } from '@portfolio/types/base'
import type { CollaborateHighlightsComponent } from '@portfolio/types/components'

export const collaborateHighlightsMock: CollaborateHighlightsComponent = {
  _type: ComponentTypeName.CollaborateHighlights,
  _key: 'collaborate-highlights',
  title: {
    heading: 'Why Collaborate\nwith me?',
    headingLevel: 2,
  },
  highlights: [
    {
      _key: 'client-centric',
      title: 'Client-Centric',
      subtitle:
        'Your goals are our focus. We listen, understand, and work closely with you to achieve your vision.',
    },
    {
      _key: 'tailored',
      title: 'Tailored Solutions',
      subtitle:
        'We do not do one-size-fits-all. We craft solutions that are unique to your business, ensuring you stand out in your industry.',
    },
    {
      _key: 'innovation',
      title: 'Creative Innovation',
      subtitle:
        'We stay ahead of design and branding trends to offer fresh and innovative ideas that set you apart.',
    },
  ],
}
