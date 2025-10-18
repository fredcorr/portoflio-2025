import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { MdOutlineWorkOutline } from 'react-icons/md'
import { PageTypeName } from '@portfolio/types/base'
import Media from '@components/atoms/media'
import { componentsByPageType } from '..'
import { defineType } from 'sanity'

const Project = defineType({
  name: PageTypeName.ProjectPage,
  title: 'Project',
  type: 'document',
  fieldsets: [baseDocumentFieldset, seoFieldset],
  fields: [
    ...createBaseDocumentFields({
      slug: {
        basePath: 'projects/',
      },
      title: {
        initialValue: 'Project',
      },
    }).all,
    Media({
      name: 'projectHero',
      title: 'Hero',
      description: 'Image or video to display as the project thumbnail.',
    }),
    componentsByPageType(PageTypeName.ProjectPage),
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
        title: title || 'Project',
        subtitle,
        media: media || MdOutlineWorkOutline,
      }
    },
  },
})

export default Project
