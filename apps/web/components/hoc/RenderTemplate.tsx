import { PageTypeName } from '@portfolio/types/base'
import { CmsPages } from '@portfolio/types/pages'
import {
  ArticleTemplate,
  ContactTemplate,
  ProjectTemplate,
  AboutTemplate,
  HomeTemplate,
  PageTemplate,
} from '@/components/templates'

interface RenderTemplateProps {
  page: CmsPages
}

export const RenderTemplate = ({ page }: RenderTemplateProps) => {
  switch (page._type) {
    case PageTypeName.HomePage:
      return <HomeTemplate {...page} />
    case PageTypeName.ProjectPage:
      return <ProjectTemplate {...page} />
    case PageTypeName.AboutPage:
      return <AboutTemplate {...page} />
    case PageTypeName.ContactPage:
      return <ContactTemplate {...page} />
    case PageTypeName.ArticlePage:
      return <ArticleTemplate {...page} />
    case PageTypeName.Page:
      return <PageTemplate {...page} />
    default:
      return null
  }
}
