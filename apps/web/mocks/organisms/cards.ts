import { ComponentTypeName } from '@portfolio/types/base'
import type { CardsComponent } from '@portfolio/types/components'

export const cardsMock: CardsComponent = {
  _type: ComponentTypeName.Cards,
  _key: 'cards-mock',
  title: {
    heading: 'Capabilities',
    headingLevel: 2,
  },
  subtitle: [
    {
      _key: 'intro',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'intro-span',
          _type: 'span',
          text: 'Focused on brand, product, and visual systems.',
          marks: [],
        },
      ],
    },
  ],
  items: [
    {
      title: 'Product Design',
      subtitle:
        'End-to-end flows, information architecture, and research-led UX.',
    },
    {
      title: 'Visual Systems',
      subtitle: 'Design systems, component libraries, and accessible patterns.',
    },
    {
      title: 'Brand Craft',
      subtitle: 'Identity, art direction, and motion to tell cohesive stories.',
    },
  ],
}
