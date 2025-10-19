import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { componentsByPageType } from '..'
import { PageTypeName } from '@portfolio/types/base'
import { MdOutlineDescription } from 'react-icons/md'
import { defineType } from 'sanity'

const Page = defineType({
  name: PageTypeName.Page,
  title: 'Page',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields().all,
    componentsByPageType(PageTypeName.Page),
    ...seoFields.all,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'seoDescription',
      media: 'seoImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Page',
        subtitle,
        media: media || MdOutlineDescription,
      }
    },
  },
})

export default Page
