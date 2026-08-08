import type { ProjectPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import ProjectIntro from '@/components/organisms/ProjectIntro/ProjectIntro'
import { getBreadcrumbLabel } from '@/utils/get-breadcrumb-schema'

export function ProjectTemplate(props: ProjectPageDocument) {
  return (
    <>
      <ProjectIntro
        slug={props.slug?.current}
        title={props.title}
        currentLabel={getBreadcrumbLabel(props)}
        description={props.seoDescription}
        heroImage={props.projectHero}
      />
      {props.projectComponents?.map((component, index) => {
        return (
          <RenderOrganism
            key={component._key}
            component={component}
            componentIndex={index}
          />
        )
      })}
    </>
  )
}
