import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuUserRound } from 'react-icons/lu'
import Block from '@components/atoms/block'
import Toggle from '@components/atoms/toggle'
import { extractPlainText } from '@utils/extract-plain-text'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'

const titleField = createTitleField({
  name: 'title',
})

const AboutPageHero = defineType({
  name: ComponentTypeName.AboutPageHero,
  title: 'About Page Hero',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    Block({
      name: 'body',
      title: 'Body',
      description: 'Rich text body copy for the hero.',
    }),
    Block({
      name: 'bodySecondary',
      title: 'Secondary body',
      description: 'Secondary rich text body copy for the hero.',
    }),
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
    },
    {
      name: 'languages',
      title: 'Languages',
      type: 'string',
    },
    Toggle({
      name: 'showCta',
      title: 'Show call to action',
      description: 'Toggle to display the call to action button.',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      body: 'body',
      bodySecondary: 'bodySecondary',
      showCta: 'showCta',
    },
    prepare({ title, body, bodySecondary, showCta }) {
      const bodySummary = extractPlainText(body)
      const secondarySummary = extractPlainText(bodySecondary)

      return {
        title: title || 'About Page Hero',
        subtitle:
          bodySummary ||
          secondarySummary ||
          (showCta ? 'CTA enabled' : 'CTA hidden'),
        media: LuUserRound,
      }
    },
  },
})

export default AboutPageHero
