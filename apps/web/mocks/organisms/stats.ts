import { ComponentTypeName } from '@portfolio/types/base'
import type { StatsComponent } from '@portfolio/types/components'

export const statsMock: StatsComponent = {
  _type: ComponentTypeName.Stats,
  _key: 'stats',
  items: [
    {
      _key: 'stat-1',
      title: '15+',
      subtitle: 'Launched Brands',
    },
    {
      _key: 'stat-2',
      title: '50M+',
      subtitle: 'Views Per Month',
    },
    {
      _key: 'stat-3',
      title: '4+',
      subtitle: 'Brand Experts',
    },
  ],
}
