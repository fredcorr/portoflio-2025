import { ComponentTypeName } from '@portfolio/types/base'
import type { ImageGalleryComponent } from '@portfolio/types/components'

export const imageGalleryMock: ImageGalleryComponent = {
  _type: ComponentTypeName.ImageGallery,
  _key: 'image-gallery-mock',
  title: {
    heading: 'Work gallery',
    headingLevel: 2,
  },
  subtitle: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'A selection of screens from the project.',
        },
      ],
    },
  ],
  images: [
    {
      _type: 'image',
      asset: {
        url: 'https://cdn.sanity.io/images/demo/demo/abc123-1200x900.jpg',
        metadata: {
          dimensions: { width: 1200, height: 900 },
        },
      },
      alt: 'Ferrari date picker UI',
    },
    {
      _type: 'image',
      asset: {
        url: 'https://cdn.sanity.io/images/demo/demo/def456-1200x900.jpg',
        metadata: {
          dimensions: { width: 1200, height: 900 },
        },
      },
      alt: 'Tsanto wellbeing page',
    },
  ],
}
