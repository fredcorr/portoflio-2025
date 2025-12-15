import { ComponentTypeName } from '@portfolio/types/base'
import type { ProcessComponent } from '@portfolio/types/components'

export const processMock: ProcessComponent = {
  _type: ComponentTypeName.Process,
  _key: 'process',
  title: {
    heading: 'Design Process',
    headingLevel: 2,
  },
  steps: [
    {
      title: 'Discovery',
      subtitle:
        "To start, we'll acquire comprehension of your company and how consumers interact with your offerings. In this phase, recognizing the core issue will be accomplished by examining and studying the collected data.",
    },
    {
      title: 'Strategy',
      subtitle:
        "Utilizing the collected data, we'll create a design plan focused on user needs, aiming to tackle user issues and boost your company's performance.",
    },
    {
      title: 'Design',
      subtitle:
        'I will proceed to roll up my sleeves and craft functional, engaging interfaces that adhere to visual guidelines, ensuring a consistent brand identity. Above all, the design will adeptly tackle user and business concerns in a seamless and proficient way.',
    },
    {
      title: 'Implementation',
      subtitle:
        "Following the manipulation of countless pixels and crafting the code, we'll possess a finalized project prepared for worldwide distribution. This endeavor might necessitate substantial coffee consumption to maintain my energy levels.",
    },
  ],
}
