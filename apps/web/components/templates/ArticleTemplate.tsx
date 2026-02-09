import type { ArticlePageDocument } from '@portfolio/types/pages'
import Breadcrumbs from '@/components/molecules/Breadcrumbs/Breadcrumbs'
import ArticleIntro from '@/components/organisms/ArticleIntro/ArticleIntro'
import ArticleContent from '@/components/organisms/ArticleContent/ArticleContent'
import { RenderOrganism } from '@/components/hoc/RenderOrganism'
import { formatDate } from '@/utils/format-date'
import { getReadTimeLabel } from '@/utils/calculate-read-time'
import { buildPageUrl } from '@/utils/slug'
import { getSiteUrl } from '@/utils/get-site-url'

export const ArticleTemplate = (props: ArticlePageDocument) => {
  const slug = props.slug?.current
  const hasBreadcrumbs = Boolean(slug)
  const title = props.seoTitle || props.title
  const dateLabel = formatDate({
    value: props._updatedAt || props._createdAt,
  })
  const readTimeLabel = getReadTimeLabel(props.articleContent)
  const heroImage = props.heroImage || props.seoImage
  const shareUrl = slug ? buildPageUrl(getSiteUrl(), slug) : undefined

  return (
    <section data-template="article">
      {hasBreadcrumbs && (
        <div className="px-4 pt-8 md:px-8 lg:px-12">
          <Breadcrumbs slug={slug} />
        </div>
      )}
      <ArticleIntro
        title={title}
        dateLabel={dateLabel}
        readTimeLabel={readTimeLabel}
        tags={props.tags}
        heroImage={heroImage}
      />
      <ArticleContent
        content={props.articleContent}
        shareUrl={shareUrl}
        shareTitle={title}
      />
      {props.articleComponents?.map(component => {
        return <RenderOrganism key={component._key} component={component} />
      })}
    </section>
  )
}

export default ArticleTemplate
