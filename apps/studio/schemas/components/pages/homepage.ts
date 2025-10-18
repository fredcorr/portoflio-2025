import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { PageTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { componentsByPageType } from '..'

const Homepage = defineType({
  name: PageTypeName.HomePage,
  title: 'Homepage',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields({
      title: {
        initialValue: 'Homepage',
      },
    }).all,
    componentsByPageType(PageTypeName.HomePage),
    ...seoFields.all,
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title || 'Homepage',
      }
    },
  },
})

export default Homepage
