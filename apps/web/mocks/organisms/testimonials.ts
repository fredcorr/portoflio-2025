import type { TestimonialsComponent } from '@portfolio/types/components'

export const testimonialsMock: TestimonialsComponent = {
  _type: 'testimonials',
  _key: 'testimonials-mock',
  title: {
    heading: 'What clients say',
    headingLevel: 2,
  },
  testimonials: [
    {
      title: 'Design Partner',
      subtitle:
        'Working with Joey was seamless—fast iterations, thoughtful systems, and delightful visuals that shipped on time.',
      author: {
        name: 'Alex Rivera',
        role: 'VP Product, Crtly',
      },
      image: {
        _type: 'image',
        asset: {
          _ref: 'image-mock-1',
          _type: 'reference',
          url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
          metadata: {
            dimensions: {
              width: 200,
              height: 200,
            },
          },
        },
        alt: 'Alex Rivera',
      },
    },
    {
      title: 'Brand + Product',
      subtitle:
        'He brought cohesion to our brand and app—clear communication, strong rationale, and tasteful craft.',
      author: {
        name: 'Morgan Lee',
        role: 'Founder, Tansto',
      },
    },
  ],
}
