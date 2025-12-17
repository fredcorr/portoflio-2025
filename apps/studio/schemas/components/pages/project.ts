import { createBaseDocumentFields, seoFields } from '@schemas/compositions'
import { baseDocumentFieldset, seoFieldset } from '@schemas/fieldsets'
import { MdOutlineWorkOutline } from 'react-icons/md'
import { PageTypeName } from '@portfolio/types/base'
import Media from '@components/atoms/media'
import { componentsByPageType } from '..'
import { defineType } from 'sanity'
import StringField from '../atoms/string'
import List from '../atoms/list'

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
    StringField({
      name: 'clientName',
      title: 'Client Name',
      description: 'The name of the client for whom the project was completed.',
    }),
    Media({
      name: 'projectHero',
      title: 'Hero',
      description: 'Image or video to display as the project thumbnail.',
    }),
    List({
      name: 'projectTags',
      title: 'Project Tags',
      description: 'Tags associated with the project.',
      of: [{ type: 'string' }],
    }),
    componentsByPageType(PageTypeName.ProjectPage),
    ...seoFields.all,
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'title',
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
