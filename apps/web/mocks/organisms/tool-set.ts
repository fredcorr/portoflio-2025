import { ComponentTypeName } from '@portfolio/types/base'
import type { ToolSetComponent } from '@portfolio/types/components'

export const toolSetMock: ToolSetComponent = {
  _type: ComponentTypeName.ToolSet,
  _key: 'tool-set',
  title: {
    heading: 'Our tools of choice',
    headingLevel: 3,
  },
  tools: [
    {
      _key: 'tool-figma',
      title: 'Figma',
    },
    {
      _key: 'tool-slack',
      title: 'Slack',
    },
    {
      _key: 'tool-linear',
      title: 'Linear',
    },
    {
      _key: 'tool-notion',
      title: 'Notion',
    },
  ],
}
