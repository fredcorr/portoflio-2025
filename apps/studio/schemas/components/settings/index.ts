import { defineType } from 'sanity'
import { LuSettings } from 'react-icons/lu'
import { GlobalItemsType } from '@portfolio/types/base'
import String from '@components/atoms/string'
import Link from '@components/atoms/link'
import List from '@components/atoms/list'

const SettingsSchema = defineType({
  name: GlobalItemsType.Settings,
  title: 'Settings',
  type: 'document',
  fields: [
    String({
      name: 'email',
      title: 'Email',
      description: 'Public contact email address displayed across the site.',
    }),
    List({
      name: 'socialLinks',
      title: 'Social links',
      description: 'Collection of social media profiles and external links.',
      of: [
        Link({
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
