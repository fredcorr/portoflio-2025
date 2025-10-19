import { ComponentTypeName } from '@portfolio/types/base'
import { defineType } from 'sanity'
import { LuUserRound } from 'react-icons/lu'
import Block from '@components/atoms/block'
import Media from '@components/atoms/media'
import Toggle from '@components/atoms/toggle'
import { extractPlainText } from '@utils/extract-plain-text'
import { createTitleField } from '@components/molecules/title'

const titleField = createTitleField({
  name: 'title',
})

const AboutPageHero = defineType({
  name: ComponentTypeName.AboutPageHero,
  title: 'About Page Hero',
  type: 'object',
  fields: [
    titleField.field,
    Media({
      name: 'image',
      title: 'Image',
      description: 'Visual supporting the hero content.',
    }),
    Block({
      name: 'body',
      title: 'Body',
      description: 'Rich text body copy for the hero.',
    }),
    Toggle({
      name: 'showCta',
      title: 'Show call to action',
      description: 'Toggle to display the call to action button.',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      image: 'image',
      body: 'body',
      showCta: 'showCta',
    },
    prepare({ title, image, body, showCta }) {
      const bodySummary = extractPlainText(body)

      return {
        title: title || 'About Page Hero',
        subtitle: bodySummary || (showCta ? 'CTA enabled' : 'CTA hidden'),
        media: image || LuUserRound,
      }
    },
  },
})

export default AboutPageHero
