import { CommonFieldProps } from '@studio/types'
import { defineField } from 'sanity'
import { PageTypeName } from '@portfolio/types/base'

const PAGE_TYPES = [
  PageTypeName.HomePage,
  PageTypeName.ProjectPage,
  PageTypeName.AboutPage,
  PageTypeName.ContactPage,
  PageTypeName.Page,
]

const NavigationReference = (base: CommonFieldProps) => {
  const targets = PAGE_TYPES.map(type => ({ type }))

  return defineField({
    ...base,
    type: 'reference',
    to: targets,
    options: {
      filter: 'showInNavigation == true',
    },
  })
}

export default NavigationReference
