import type { ProjectPageDocument } from '@portfolio/types/pages/project-page'
import type { SettingsData } from '@portfolio/types/settings'
import type { CreativeWorkSchema } from '@/types/json-schema'
import { buildPageUrl } from '@/utils/slug'

export const getProjectSchema = (
  siteUrl: string,
  project: ProjectPageDocument,
  settings: SettingsData
): CreativeWorkSchema | null => {
  const name = project.seoTitle ?? project.title

  if (!name || !project.slug?.current) {
    return null
  }

  const url = buildPageUrl(siteUrl, project.slug.current)
  const authorName = [settings.firstName, settings.secondName]
    .filter(Boolean)
    .join(' ')

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    dateModified: project._updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(settings.jobTitle ? { jobTitle: settings.jobTitle } : {}),
    },
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.projectHero?.asset?.url ?? project.seoImage?.asset?.url
      ? {
          image:
            project.projectHero?.asset?.url ?? project.seoImage?.asset?.url,
        }
      : {}),
    ...(project.seoDescription ? { description: project.seoDescription } : {}),
    ...(project.projectTags?.length
      ? {
          keywords: project.projectTags
            .map(tag => tag.name?.current)
            .filter(Boolean)
            .join(', '),
        }
      : {}),
  }
}
