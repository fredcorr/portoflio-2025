import { ComponentTypeName } from '@portfolio/types/base'
import type { TestimonialsComponent } from '@portfolio/types/components'

export const testimonialsMock: TestimonialsComponent = {
  _type: ComponentTypeName.Testimonials,
  _key: 'testimonials-mock',
  title: {
    heading: 'What clients say',
    headingLevel: 2,
  },
  testimonials: [
    {
      _key: 'testimonial-1',
      title: 'Design Partner',
      subtitle:
        'Working with Joey was seamless—fast iterations, thoughtful systems, and delightful visuals that shipped on time.',
      author: {
        name: 'Alex Rivera',
        role: 'VP Product, Crtly',
      },
    },
    {
      _key: 'testimonial-2',
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
