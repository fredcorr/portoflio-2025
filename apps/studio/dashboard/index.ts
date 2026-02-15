import {
  projectInfoWidget,
  projectUsersWidget,
  type DashboardWidget,
} from '@sanity/dashboard'
import { documentListWidget } from 'sanity-plugin-dashboard-widget-document-list'
import { PageTypeName } from '@portfolio/types/base'
import { QuickLinksWidget } from './widgets/QuickLinksWidget'
import { StructureMenuWidget } from './widgets/StructureMenuWidget'

const projectContentTypes = [PageTypeName.ProjectPage, 'article']

export const dashboardWidgets: DashboardWidget[] = [
  projectInfoWidget({
    layout: { width: 'medium' },
  }),
  projectUsersWidget({
    layout: { width: 'small' },
  }),
  {
    name: 'structure-menu',
    component: StructureMenuWidget,
    layout: { width: 'small' },
  },
  {
    name: 'quick-links',
    component: QuickLinksWidget,
    layout: { width: 'small' },
  },
  documentListWidget({
    title: 'Content QA: Missing slug or hero',
    query: `*[_type == "${PageTypeName.ProjectPage}" && (!defined(slug.current) || !defined(projectHero.asset))]|order(_updatedAt desc)[0...20]`,
    showCreateButton: false,
    layout: { width: 'medium' },
  }),
  documentListWidget({
    title: 'Recently updated stories',
    order: '_updatedAt desc',
    types: projectContentTypes,
    limit: 8,
    layout: { width: 'medium' },
  }),
]
