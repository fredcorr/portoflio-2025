import { useCallback, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Inline,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import { CheckmarkIcon, CopyIcon, LaunchIcon } from '@sanity/icons'
import { useClient } from 'sanity'
import type { SanityDocument } from 'sanity'
import type { PortableTextValue } from '@portfolio/types/studio'
import { portableTextToMarkdown } from '@utils/portable-text-to-markdown'
import {
  ExternalPublishError,
  publishToDevto,
  unpublishFromDevto,
} from '@utils/external-publishers'

const MEDIUM_EDITOR_URL = 'https://medium.com/new-story'

const API_VERSION = '2024-10-01'

interface ArticleDoc extends SanityDocument {
  title?: string
  tags?: string[]
  slug?: { current?: string }
  articleContent?: PortableTextValue
  mediumPublishedUrl?: string
  devtoPublishedUrl?: string
  devtoArticleId?: string
}

interface PublishExternallyModalProps {
  documentId: string
  isDraft: boolean
  doc: ArticleDoc
}

type Phase = 'idle' | 'confirming' | 'working' | 'error'

const buildCanonicalUrl = (slug?: string): string | undefined => {
  const base = process.env.SANITY_STUDIO_PREVIEW_URL
  if (!base || !slug) return undefined
  return `${base.replace(/\/$/, '')}/${slug.replace(/^\//, '')}`
}

const errorMessage = (error: unknown): string =>
  error instanceof ExternalPublishError || error instanceof Error
    ? error.message
    : 'Something went wrong.'

export function PublishExternallyModal(props: PublishExternallyModalProps) {
  const { documentId, isDraft, doc } = props
  const client = useClient({ apiVersion: API_VERSION })
  const targetId = isDraft ? `drafts.${documentId}` : documentId

  const payload = useMemo(
    () => ({
      title: doc.title ?? 'Untitled',
      markdown: portableTextToMarkdown(doc.articleContent),
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      canonicalUrl: buildCanonicalUrl(doc.slug?.current),
    }),
    [doc.title, doc.articleContent, doc.tags, doc.slug?.current]
  )

  const [devtoUrl, setDevtoUrl] = useState(doc.devtoPublishedUrl)

  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string>()
  const [devtoPhase, setDevtoPhase] = useState<Phase>('idle')
  const [devtoError, setDevtoError] = useState<string>()

  const handleCopyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(payload.markdown)
      setCopyError(undefined)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(
        'Could not access the clipboard. Copy the Markdown manually.'
      )
    }
  }, [payload.markdown])

  const handleDevtoPublish = useCallback(async () => {
    setDevtoPhase('working')
    setDevtoError(undefined)
    try {
      const result = await publishToDevto(payload)
      await client
        .patch(targetId)
        .set({ devtoPublishedUrl: result.url, devtoArticleId: result.id })
        .commit()
      setDevtoUrl(result.url)
      setDevtoPhase('idle')
    } catch (error) {
      setDevtoError(errorMessage(error))
      setDevtoPhase('error')
    }
  }, [client, payload, targetId])

  const handleDevtoUnpublish = useCallback(async () => {
    setDevtoPhase('working')
    setDevtoError(undefined)
    try {
      if (doc.devtoArticleId) {
        await unpublishFromDevto(doc.devtoArticleId)
      }
      await client
        .patch(targetId)
        .unset(['devtoPublishedUrl', 'devtoArticleId'])
        .commit()
      setDevtoUrl(undefined)
      setDevtoPhase('idle')
    } catch (error) {
      setDevtoError(errorMessage(error))
      setDevtoPhase('error')
    }
  }, [client, doc.devtoArticleId, targetId])

  return (
    <Stack space={4}>
      <Text size={1} muted>
        Publish this article to external platforms. Each platform is
        independent.
      </Text>

      <Card padding={4} radius={2} border>
        <Stack space={3}>
          <Text size={2} weight="semibold">
            Medium
          </Text>
          <Text size={1} muted>
            Medium retired its publishing API. Copy the article as Markdown and
            paste it into the Medium editor, then save the resulting link in the
            “Medium URL” field on the article.
          </Text>

          {copyError && (
            <Card padding={3} radius={2} tone="critical" border>
              <Text size={1}>{copyError}</Text>
            </Card>
          )}

          <Inline space={2}>
            <Button
              tone="primary"
              icon={copied ? CheckmarkIcon : CopyIcon}
              text={copied ? 'Copied!' : 'Copy Markdown'}
              fontSize={1}
              onClick={handleCopyMarkdown}
            />
            <Button
              as="a"
              href={MEDIUM_EDITOR_URL}
              target="_blank"
              rel="noreferrer"
              mode="ghost"
              icon={LaunchIcon}
              text="Open Medium editor"
              fontSize={1}
            />
          </Inline>
        </Stack>
      </Card>

      <PlatformSection
        title="Dev.to"
        published={Boolean(devtoUrl)}
        url={devtoUrl}
        phase={devtoPhase}
        error={devtoError}
        confirmLabel="Publish to Dev.to"
        onStart={() => setDevtoPhase('confirming')}
        onCancel={() => setDevtoPhase('idle')}
        onConfirm={handleDevtoPublish}
        onRetry={() => setDevtoPhase('confirming')}
        onUnpublish={handleDevtoUnpublish}
      />
    </Stack>
  )
}

interface PlatformSectionProps {
  title: string
  published: boolean
  url?: string
  phase: Phase
  error?: string
  confirmLabel: string
  onStart: () => void
  onCancel: () => void
  onConfirm: () => void
  onRetry: () => void
  onUnpublish?: () => void
}

function PlatformSection(props: PlatformSectionProps) {
  const {
    title,
    published,
    url,
    phase,
    error,
    confirmLabel,
    onStart,
    onCancel,
    onConfirm,
    onRetry,
    onUnpublish,
  } = props

  return (
    <Card padding={4} radius={2} border>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="semibold">
            {title}
          </Text>
          {published && <Badge tone="positive">Published</Badge>}
        </Flex>

        {phase === 'working' && (
          <Flex align="center" gap={2}>
            <Spinner muted />
            <Text size={1} muted>
              Working…
            </Text>
          </Flex>
        )}

        {phase === 'error' && error && (
          <Card padding={3} radius={2} tone="critical" border>
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {published ? (
          <Inline space={2}>
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noreferrer"
              mode="ghost"
              tone="primary"
              icon={LaunchIcon}
              text={`Open on ${title}`}
              fontSize={1}
            />
            {onUnpublish && (
              <Button
                mode="ghost"
                tone="critical"
                text="Unpublish"
                fontSize={1}
                disabled={phase === 'working'}
                onClick={onUnpublish}
              />
            )}
          </Inline>
        ) : phase === 'confirming' ? (
          <Stack space={3}>
            <Text size={1}>
              Publish this article to {title}? This will create a public post.
            </Text>
            <Inline space={2}>
              <Button
                tone="primary"
                text="Confirm"
                fontSize={1}
                onClick={onConfirm}
              />
              <Button
                mode="ghost"
                text="Cancel"
                fontSize={1}
                onClick={onCancel}
              />
            </Inline>
          </Stack>
        ) : (
          <Box>
            <Button
              tone="primary"
              text={confirmLabel}
              fontSize={1}
              disabled={phase === 'working'}
              onClick={phase === 'error' ? onRetry : onStart}
            />
          </Box>
        )}
      </Stack>
    </Card>
  )
}

export default PublishExternallyModal
