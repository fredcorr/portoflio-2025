import type { LinkItem } from '@portfolio/types/components'

export const getLinkHref = (link?: LinkItem): string | undefined => {
  const url = link?.url

  if (typeof url === 'string' && url.length > 0) {
    return url
  }

  const slugValue = link?.internal_ref?.slug?.current
  const internalHref =
    (slugValue && slugValue.startsWith('/') && slugValue) ||
    (slugValue && `/${slugValue}`)

  return internalHref
}

export default getLinkHref
