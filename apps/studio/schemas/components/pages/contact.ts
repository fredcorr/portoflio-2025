import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { MdOutlineConnectWithoutContact } from 'react-icons/md'
import { PageTypeName } from '@portfolio/types/base'
import { componentsByPageType } from '..'
import { defineType } from 'sanity'

const Contact = defineType({
  name: PageTypeName.ContactPage,
  title: 'Contact',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields({
      title: {
        initialValue: 'Contact',
      },
    }).all,
    componentsByPageType(PageTypeName.ContactPage),
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
        media: media || MdOutlineConnectWithoutContact,
        title: title || 'Contact',
        subtitle: subtitle,
      }
    },
  },
})

export default Contact
