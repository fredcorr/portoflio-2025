import { defineType } from 'sanity'
import { ComponentTypeName, PageTypeName } from '@portfolio/types/base'
import { LuLayoutGrid } from 'react-icons/lu'
import String from '../atoms/string'
import Block from '../atoms/block'
import List from '../atoms/list'
import Reference from '../atoms/reference'

const ProjectListing = defineType({
  name: ComponentTypeName.ProjectListing,
  title: 'Project Listing',
  type: 'object',
  fields: [
    String({
      name: 'title',
      title: 'Title',
      description: 'Heading displayed above the list of projects.',
    }),
    Block({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Supporting copy shown beneath the title.',
    }),
    List(
      {
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
      }
    ),
  ],
  preview: {
    select: {
      title: 'title',
      projects: 'projects',
    },
    prepare({ title, projects }) {
      const count = Array.isArray(projects) ? projects.length : 0
      const subtitle = count ? `${count} project${count === 1 ? '' : 's'}` : 'No projects selected'

      return {
        title: title || 'Project Listing',
        subtitle,
        media: LuLayoutGrid,
      }
    },
  },
})

export default ProjectListing
