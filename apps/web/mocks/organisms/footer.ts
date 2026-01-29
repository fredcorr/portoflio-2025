import type { FooterProps } from '@portfolio/types/components'

export const footerMock: FooterProps = {
  email: 'hello@federicocorradi.com',
  socialLinks: [
    {
      _key: 'social-1',
      name: 'Dribbble',
      url: 'https://dribbble.com/federico',
    },
    {
      _key: 'social-2',
      name: 'Instagram',
      url: 'https://instagram.com/federico',
    },
    {
      _key: 'social-3',
      name: 'LinkedIn',
      internal_ref: {
        _id: 'page-linkedin',
        title: 'LinkedIn',
        slug: {
          _type: 'slug',
          current: 'linkedin',
        },
      },
    },
  ],
}
