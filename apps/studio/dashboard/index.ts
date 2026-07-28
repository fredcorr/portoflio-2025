import {
  projectInfoWidget,
  type DashboardWidget,
} from '@sanity/dashboard'
import { documentListWidget } from 'sanity-plugin-dashboard-widget-document-list'
import { PageTypeName } from '@portfolio/types/base'
import { StructureMenuWidget } from './widgets/StructureMenuWidget'
import { SearchConsoleWidget } from './widgets/SearchConsoleWidget'

const projectContentTypes = [PageTypeName.ProjectPage, PageTypeName.ArticlePage]

export const dashboardWidgets: DashboardWidget[] = [
  projectInfoWidget({
    layout: { width: 'small' },
  }),
  {
    name: 'structure-menu',
    component: StructureMenuWidget,
    layout: { width: 'small' },
  },
  documentListWidget({
    title: 'Incomplete Projects — missing slug or cover image',
    query: `*[_type == "${PageTypeName.ProjectPage}" && (!defined(slug.current) || !defined(projectHero.asset))]|order(_updatedAt desc)[0...20]`,
    showCreateButton: false,
    layout: { width: 'small' },
  }),
  documentListWidget({
    title: 'Recently updated',
    order: '_updatedAt desc',
    types: projectContentTypes,
    limit: 3,
    layout: { width: 'small' },
  }),
  {
    name: 'search-console',
    component: SearchConsoleWidget,
    layout: { width: 'large' },
  },
]
