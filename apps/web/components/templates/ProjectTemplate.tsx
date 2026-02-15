import type { ProjectPageDocument } from '@portfolio/types/pages'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { getComponentSectionId } from './component-section-id'
import ProjectIntro from '@/components/organisms/ProjectIntro/ProjectIntro'

export function ProjectTemplate(props: ProjectPageDocument) {
  return (
    <>
      <ProjectIntro
        slug={props.slug?.current}
        title={props.title}
        description={props.seoDescription}
        heroImage={props.projectHero}
      />
      {props.projectComponents?.map((component, index) => {
        return (
          <RenderOrganism
            key={component._key}
            component={component}
            sectionId={getComponentSectionId(component, index)}
          />
        )
      })}
    </>
  )
}
