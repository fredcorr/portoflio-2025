import { ComponentTypeName } from '@portfolio/types/base'
import { LuLayoutList } from 'react-icons/lu'
import { defineType } from 'sanity'
import String from '@components/atoms/string'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({ name: 'title' })

const JournalListing = defineType({
  name: ComponentTypeName.JournalListing,
  title: 'Journal Listing',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    String({
      name: 'kicker',
      title: 'Kicker',
      description: 'Small label shown above the title (e.g. "Journal").',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
    },
    prepare({ title }) {
      return {
        title: title || 'Journal Listing',
        subtitle: 'Auto-queries all published articles',
        media: LuLayoutList,
      }
    },
  },
})

export default JournalListing
