import type { NavItemProps } from '@/components/molecules/NavItem/NavItem'
import { NavItemLayout } from '@/components/molecules/NavItem/NavItem'

export const navItemMock: NavItemProps = {
  item: {
    _id: 'projects-page',
    title: 'Projects',
    slug: {
      _type: 'slug',
      current: '/projects',
    },
  },
  currentPath: '/projects',
  projectCount: 8,
  layout: NavItemLayout.Row,
  isOpen: true,
  index: 0,
}
