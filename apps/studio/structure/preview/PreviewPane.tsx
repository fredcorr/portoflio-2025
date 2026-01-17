import { Card, Flex, Text } from '@sanity/ui'
import type { UserViewComponent } from 'sanity/structure'
import { usePaneRouter } from 'sanity/structure'
import { getPreviewUrl } from '@utils/preview-url'
import { useEffect, useRef } from 'react'

const PreviewPane: UserViewComponent = ({ document }) => {
  const doc = document.displayed
  const previewUrl = getPreviewUrl(doc)
  const { duplicateCurrent, hasGroupSiblings } = usePaneRouter()
  const hasSplit = useRef(false)

  useEffect(() => {
    if (hasSplit.current || hasGroupSiblings) {
      hasSplit.current = true
      return
    }

    duplicateCurrent({ params: { view: 'editor' } })
    hasSplit.current = true
  }, [duplicateCurrent, hasGroupSiblings])

  if (!previewUrl) {
    return (
      <Flex align="center" height="fill" justify="center" padding={4}>
        <Card padding={4} tone="critical">
          <Text size={1}>
            Preview is unavailable. Check SANITY_STUDIO_PREVIEW_SECRET and
            SITE_URL.
          </Text>
        </Card>
      </Flex>
    )
  }

  return (
    <Card padding={0} style={{ height: '100%' }}>
      <iframe
        key={previewUrl ?? 'preview'}
        src={previewUrl}
        title="Preview"
        style={{ border: 0, height: '100%', width: '100%' }}
      />
    </Card>
  )
}

export default PreviewPane
