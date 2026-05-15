export interface ShareItem {
  label: string
  icon: string
  href?: string
  onClick?: () => void
}

export type BuildShareItemsType = (
  shareUrl?: string,
  shareTitle?: string
) => ShareItem[]

export const buildShareItems: BuildShareItemsType = (shareUrl, shareTitle) => {
  if (!shareUrl) return []

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = shareTitle ? encodeURIComponent(shareTitle) : undefined

  return [
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: 'twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}${encodedTitle ? `&text=${encodedTitle}` : ''}`,
    },
    {
      label: 'Facebook',
      icon: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ]
}
