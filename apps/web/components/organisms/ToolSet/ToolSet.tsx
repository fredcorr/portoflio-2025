import React from 'react'
import type { ToolSetComponent } from '@portfolio/types/components'

import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { Heading } from '@/components/atoms/Heading/Heading'
import ToolCard from '@/components/molecules/ToolCard/ToolCard'
import { makeComponentId } from '@/utils/makeComponentId'
export interface ToolSetProps extends ToolSetComponent {}

const ToolSet = ({ _id, _key, title, tools }: ToolSetProps) => {
  const headingText = title?.heading
  const hasHeading = Boolean(headingText)
  const hasTools = Boolean(tools && tools.length)
  const headingId = makeComponentId({
    value: _id ?? _key ?? headingText,
    prefix: 'tool-set',
  })

  if (!hasHeading && !hasTools) {
    return null
  }

  return (
    <ComponentLayout
      {...(hasHeading && headingId && { 'aria-labelledby': headingId })}
      className={'text-black dark:text-foreground lg:px-[112px] lg:py-[72px]'}
      contentClassName="gap-y-10"
      data-organism="tool-set"
      data-figma-node-id="3595:2419"
    >
      {hasHeading && headingText && (
        <Heading
          id={headingId}
          level={title?.headingLevel}
          className="md:col-span-12 max-w-lg font-heading text-heading-3 font-medium leading-[1.3] tracking-tight"
        >
          {headingText}
        </Heading>
      )}

      {hasTools && tools && (
        <ul className="md:col-span-12 flex flex-wrap justify-center items-center gap-8">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool._key ?? `tool-${index}`}
              title={tool.title}
              subtitle={tool.subtitle}
              image={tool.image}
            />
          ))}
        </ul>
      )}
    </ComponentLayout>
  )
}

export default ToolSet
export { ToolSet }
