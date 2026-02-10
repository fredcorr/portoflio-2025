import type { HomePageHeroComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { getContactEmail } from '@/utils/get-contact-email'
import Icon from '@/components/atoms/Icon/Icon'

export const HomePageHero = ({
  title,
  subtitle,
  getInTouchTitle,
}: HomePageHeroComponent) => {
  const headline = title?.trim()
  const supportingCopy = subtitle?.trim()
  const contactLabel = getInTouchTitle?.trim()
  const contactEmail = getContactEmail()

  return (
    <ComponentLayout
      overflowHidden={false}
      className="!py-0"
      contentClassName="gap-0 px-0"
    >
      <div className="md:col-span-12">
        <div className="relative  min-h-[70vh] md:min-h-screen">
          <div className="pointer-events-none absolute left-1/2 -top-20 bottom-0 z-0 w-screen -translate-x-1/2 md:-top-24">
            <div className="flex h-full w-full flex-col md:flex-row">
              <div className="flex-1 bg-foreground" />
              <div className="flex-1 bg-surface-1" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid min-h-screen grid-cols-1 grid-rows-2 items-stretch md:grid-cols-12 md:grid-rows-1">
              <div className="flex h-full pb-10 md:pb-0 md:col-span-6 items-end md:items-center justify-start">
                <div className="max-w-xl text-background">
                  {headline && (
                    <h1 className="text-display-2xl lg:font-display md:text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight">
                      {headline}
                    </h1>
                  )}
                  <div className="mt-8 flex items-center gap-3">
                    <span className="font-heading text-sm uppercase tracking-wider">
                      Scroll
                    </span>
                    <a
                      href="#main-content"
                      className="inline-flex size-8 items-center justify-center rounded-full border border-background/20 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                      aria-label="Scroll to main content"
                    >
                      <Icon
                        name="arrow-down"
                        className="size-4 text-background"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex h-full pt-10 md:pt-0 md:col-span-6 items-start md:items-center md:justify-end">
                <div className="md:max-w-md lg:max-w-xl space-y-12 md:px-6">
                  {supportingCopy && (
                    <p className="font-body text-body-lg leading-relaxed md:text-body-xl">
                      {supportingCopy}
                    </p>
                  )}

                  {(contactLabel || contactEmail) && (
                    <div className="border-t border-foreground/10 pt-8">
                      {contactLabel && (
                        <p className="font-heading text-sm uppercase tracking-wider text-foreground/60">
                          {contactLabel}
                        </p>
                      )}
                      {contactEmail && (
                        <a
                          href={`mailto:${contactEmail}`}
                          className="mt-2 inline-flex font-body text-body-lg text-foreground transition hover:opacity-70 md:text-body-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                        >
                          {contactEmail}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentLayout>
  )
}
