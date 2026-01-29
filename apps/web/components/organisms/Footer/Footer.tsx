import React from 'react'
import type { FooterProps } from '@portfolio/types/components'
import { Heading } from '@/components/atoms/Heading/Heading'
import Icon from '@/components/atoms/Icon/Icon'
import { cn } from '@/utils/cn'
import getLinkHref from '@/utils/get-link-href'

const Footer: React.FC<FooterProps> = ({ email, socialLinks, className }) => {
  const year = new Date().getFullYear()
  const hasEmail = Boolean(email)
  const hasSocialLinks = Boolean(socialLinks && socialLinks.length)

  return (
    <footer
      data-organism="footer"
      data-development="Figma: Footer CTA with responsive layout and social links."
      className={cn(
        'flex w-full flex-col gap-10 bg-background px-4 py-8 text-black dark:text-foreground md:gap-14 md:px-10 md:py-8 xl:gap-16 xl:px-28 xl:py-16',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 md:gap-8 xl:gap-12">
        <Heading
          level={2}
          className="text-center font-display text-heading-1 font-normal leading-[1.1] tracking-tight text-black dark:text-foreground xl:text-display-xl"
        >
          Let&apos;s talk!
        </Heading>
        {hasEmail && (
          <a
            href={`mailto:${email}`}
            aria-label={`Email ${email}`}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full bg-black text-surface-1 transition hover:-translate-y-0.5',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:focus-visible:outline-white',
              'md:gap-1 xl:gap-2',
              'w-[262px] px-6 py-3 md:w-[148px] md:px-4 md:py-2 xl:w-[262px] xl:px-8 xl:py-3'
            )}
          >
            <span className="font-heading text-heading-5 font-medium tracking-tight md:text-[11px] xl:text-heading-5">
              {email}
            </span>
            <Icon
              name="arrow-up-right"
              className="size-4 text-surface-1 md:size-3 xl:size-4"
              title="Email"
            />
          </a>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 text-center text-sm text-black/80 dark:text-foreground/80 md:flex-row md:justify-between md:text-left md:text-[11px] xl:text-sm">
        <p className="font-heading">{year} © — Made by Federico Corradi</p>
        {hasSocialLinks && (
          <ul
            aria-label="Social links"
            className="flex flex-wrap items-center justify-center gap-6 md:gap-5 xl:gap-10"
          >
            {socialLinks?.map((link, index) => {
              const href = getLinkHref(link)
              const label = link?.name || link?.internal_ref?.title || link?.url
              const linkKey =
                link?.internal_ref?._id ||
                link?.url ||
                link?.name ||
                `footer-link-${index}`
              const isExternal = Boolean(href && href.startsWith('http'))

              return (
                href &&
                label && (
                  <li key={linkKey}>
                    <a
                      href={href}
                      className="font-heading transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:hover:text-foreground dark:focus-visible:outline-white"
                      {...(isExternal && {
                        target: '_blank',
                        rel: 'noreferrer',
                      })}
                    >
                      {label}
                    </a>
                  </li>
                )
              )
            })}
          </ul>
        )}
      </div>
    </footer>
  )
}

export default Footer
