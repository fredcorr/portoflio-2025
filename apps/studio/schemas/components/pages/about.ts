import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { MdOutlinePersonOutline } from 'react-icons/md'
import { PageTypeName } from '@portfolio/types/base'
import { componentsByPageType } from '..'
import { defineType } from 'sanity'

const About = defineType({
  name: PageTypeName.AboutPage,
  title: 'About',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields({
      title: {
        initialValue: 'About',
      },
    }).all,
    componentsByPageType(PageTypeName.AboutPage),
    ...seoFields.all,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'seoDescription',
      media: 'seoImage',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'About',
        subtitle,
        media: media || MdOutlinePersonOutline,
      }
    },
  },
})

export default About
