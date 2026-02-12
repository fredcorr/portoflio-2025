import { ComponentTypeName } from '@portfolio/types/base'
import type { AboutPageHeroComponent } from '@portfolio/types/components'

export const aboutPageHeroMock: AboutPageHeroComponent = {
  _type: ComponentTypeName.AboutPageHero,
  _key: 'about-hero',
  title: {
    heading: "Hey,\nI'm Fede",
    headingLevel: 1,
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
  bodySecondary: [
    {
      _key: 'body-2',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'body-2-span',
          _type: 'span',
          text: 'Additionally, I am a dedicated video game enthusiast and enjoy mixing hip-hop and jazz while working.',
          marks: [],
        },
      ],
    },
  ],
  location: 'Buenos Aires, Argentina',
  timezone: 'GMT-3',
  languages: 'Italian & English',
  showCta: true,
}
