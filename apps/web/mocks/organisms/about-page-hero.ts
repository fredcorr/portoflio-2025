import { ComponentTypeName } from '@portfolio/types/base'
import type { AboutPageHeroComponent } from '@portfolio/types/components'

export const aboutPageHeroMock: AboutPageHeroComponent = {
  _type: ComponentTypeName.AboutPageHero,
  _key: 'about-hero',
  title: {
    heading: "Hey,\nI'm Fede",
    headingLevel: 1,
  },
  image: {
    _type: 'image',
    alt: 'Portrait of Fede wearing a green sweater',
    asset: {
      _type: 'reference',
      _ref: 'image-fede',
      url: 'https://example.com/fede.jpg',
      metadata: {
        dimensions: {
          width: 1000,
          height: 1400,
        },
      },
    },
  },
  body: [
    {
      _key: 'body-1',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'body-1-span',
          _type: 'span',
          text: "Embarking on a journey of growth and education, I've spent 9 years collaborating remotely alongside innovative individuals.",
          marks: [],
        },
      ],
    },
  ],
  showCta: true,
}
