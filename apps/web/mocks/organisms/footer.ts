import type { FooterProps } from '@portfolio/types/components'

export const footerMock: FooterProps = {
  email: 'hello@federicocorradi.com',
  openForProjects: true,
  availabilityText: 'Q2 2026',
  navigationItems: [
    {
      _id: 'nav-work',
      title: 'Work',
      slug: { _type: 'slug', current: 'work' },
    },
    {
      _id: 'nav-about',
      title: 'About',
      slug: { _type: 'slug', current: 'about' },
    },
    {
      _id: 'nav-journal',
      title: 'Journal',
      slug: { _type: 'slug', current: 'journal' },
    },
    {
      _id: 'nav-contact',
      title: 'Contact',
      slug: { _type: 'slug', current: 'contact' },
    },
  ],
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
