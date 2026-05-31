import { defineType } from 'sanity'
import { LuSettings } from 'react-icons/lu'
import { GlobalItemsType } from '@portfolio/types/base'
import String from '@components/atoms/string'
import Toggle from '@components/atoms/toggle'
import UrlPicker from '@components/atoms/url-picker'
import List from '@components/atoms/list'
import NavigationReference from '@components/atoms/navigation-reference'

const SettingsSchema = defineType({
  name: GlobalItemsType.Settings,
  title: 'Settings',
  type: 'document',
  fields: [
    String({
      name: 'firstName',
      title: 'First name',
      description: 'Author first name, used across article pages.',
    }),
    String({
      name: 'secondName',
      title: 'Second name',
      description: 'Author second name, used across article pages.',
    }),
    String({
      name: 'jobTitle',
      title: 'Job title',
      description: 'Author job title, displayed in article sign-off.',
    }),
    String({
      name: 'email',
      title: 'Email',
      description: 'Public contact email address displayed across the site.',
    }),
    Toggle({
      name: 'openForProjects',
      title: 'Open for projects',
      description: 'When enabled, shows an availability indicator in the footer.',
    }),
    String({
      name: 'availabilityText',
      title: 'Availability period',
      description: 'Short label shown next to the availability dot, e.g. "Q2 2026".',
    }),
    List({
      name: 'navigationItems',
      title: 'Navigation items',
      description: 'Pick pages flagged to show in the primary navigation.',
      of: [
        NavigationReference({
          name: 'navigationItem',
          title: 'Navigation item',
          description: 'References a page with “Show in navigation” enabled.',
        }),
      ],
    }),
    List({
      name: 'socialLinks',
      title: 'Social links',
      description: 'Collection of social media profiles and external links.',
      of: [
        UrlPicker({
          name: 'socialLink',
          title: 'Social link',
          description: 'Link to a social platform or external profile.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      subtitle: 'email',
    },
    prepare({ subtitle }) {
      return {
        title: 'Settings',
        subtitle,
        media: LuSettings,
      }
    },
  },
})

export default SettingsSchema
