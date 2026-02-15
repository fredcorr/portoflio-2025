import { ComponentTypeName } from '@portfolio/types/base'
import { GiHeron } from 'react-icons/gi'
import String from '@components/atoms/string'
import { defineType } from 'sanity'
import { componentAnchorField } from '@schemas/compositions'

const HomePageHero = defineType({
  name: ComponentTypeName.HomePageHero,
  title: 'Homepage Hero',
  type: 'object',
  fields: [
    componentAnchorField,
    String({
      name: 'title',
      title: 'Title',
      description: 'Primary headline displayed in the hero section.',
    }),
    String({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Supporting copy positioned beneath the hero title.',
    }),
    String({
      name: 'getInTouchTitle',
      title: 'Get in touch title',
      description: 'Call to action text inviting users to get in touch.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Project Listing',
        media: GiHeron,
        subtitle,
      }
    },
  },
})

export default HomePageHero
