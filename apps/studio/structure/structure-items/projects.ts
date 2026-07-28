import type { StructureBuilder } from 'sanity/structure'
import { PageTypeName } from '@portfolio/types/base'
import { LuBriefcase } from 'react-icons/lu'

const ProjectsItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Projects')
    .id(PageTypeName.ProjectPage)
    .icon(LuBriefcase)
    .child(S.documentTypeList(PageTypeName.ProjectPage).title('Projects'))

export default ProjectsItem
