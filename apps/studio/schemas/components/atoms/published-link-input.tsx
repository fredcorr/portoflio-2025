import { LaunchIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Text } from '@sanity/ui'
import type { StringInputProps } from 'sanity'

const LABELS: Record<string, string> = {
  mediumPublishedUrl: 'Open on Medium',
  devtoPublishedUrl: 'Open on Dev.to',
}

/**
 * Read-only input for the syndication URL fields. When a URL has been saved it
 * renders a clickable "Open on …" link directly on the document; otherwise it
 * shows a muted "Not published yet" placeholder.
 */
export function PublishedLinkInput(props: StringInputProps) {
  const { value, schemaType } = props
  const label = LABELS[schemaType.name] ?? 'Open published article'

  if (!value) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Not published yet.
        </Text>
      </Card>
    )
  }

  return (
    <Card padding={3} radius={2} tone="positive" border>
      <Flex align="center" gap={3} justify="space-between">
        <Box flex={1}>
          <Text size={1} muted textOverflow="ellipsis">
            {value}
          </Text>
        </Box>
        <Button
          as="a"
          href={value}
          target="_blank"
          rel="noreferrer"
          mode="ghost"
          tone="primary"
          icon={LaunchIcon}
          text={label}
          fontSize={1}
        />
      </Flex>
    </Card>
  )
}

export default PublishedLinkInput
