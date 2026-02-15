import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import { LuLayoutGrid } from 'react-icons/lu'
import Reference from '@components/atoms/reference'
import { defineType } from 'sanity'
import Block from '@components/atoms/block'
import List from '@components/atoms/list'
import Toggle from '@components/atoms/toggle'
import { createTitleField } from '@components/molecules/title'
import { componentFields } from '@schemas/compositions'
const titleField = createTitleField({
  name: 'title',
})

const ProjectListing = defineType({
  name: ComponentTypeName.ProjectListing,
  title: 'Project Listing',
  type: 'object',
  fields: [
    ...componentFields.all,
    titleField.field,
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Supporting copy shown beneath the title.',
    }),
    List({
      name: 'projects',
      title: 'Projects',
      description: 'Select the projects to feature in this listing.',
      of: [
        Reference(
          {
            name: 'projectReference',
            title: 'Project',
            description: 'Reference to a project page entry.',
          },
          [PageTypeName.ProjectPage]
        ),
      ],
      options: {
        layout: 'grid',
      },
    }),
    Toggle({
      name: 'showCtaToProjects',
      title: 'Show "More" CTA',
      description: 'Toggle to enable the "Show all projects" button.',
    }),
    Toggle({
      name: 'splitLayout',
      title: 'Split layout',
      description:
        'Toggle to enable the split layout. The title and subtitle will be displayed side by side.',
    }),
  ],
  preview: {
    select: {
      title: titleField.names.heading,
      projects: 'projects',
    },
    prepare({ title, projects }) {
      const count = Array.isArray(projects) ? projects.length : 0
      const subtitle = count
        ? `${count} project${count === 1 ? '' : 's'}`
        : 'No projects selected'

      return {
        title: title || 'Project Listing',
        subtitle,
        media: LuLayoutGrid,
      }
    },
  },
})

export default ProjectListing
