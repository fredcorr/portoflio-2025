import type { HomePageHeroComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import OverlapAnimation from '@/components/hoc/OverlapAnimation'
import { getContactEmail } from '@/utils/get-contact-email'
import Icon from '@/components/atoms/Icon/Icon'
import ThreeBackgroundTunnel from '@/components/molecules/ThreeBackgroundTunnel/ThreeBackgroundTunnel'

interface HomePageHeroProps extends HomePageHeroComponent {
  scrollTargetId?: string
}

export const HomePageHero = ({
  title,
  subtitle,
  getInTouchTitle,
  _key,
  sectionId,
  componentIndex,
  scrollTargetId,
}: HomePageHeroProps) => {
  const headline = title?.trim()
  const supportingCopy = subtitle?.trim()
  const contactLabel = getInTouchTitle?.trim()
  const contactEmail = getContactEmail()
  const ctaTarget = scrollTargetId?.trim() || 'main-content'

  return (
    <ComponentLayout
      sectionId={sectionId}
      componentKey={_key}
      componentIndex={componentIndex}
      overflowHidden={false}
      className="!py-0 z-0"
      contentClassName="gap-0 px-0"
    >
      <div className="md:col-span-12">
        <OverlapAnimation>
          <div
            id="hero-bg"
            className="pointer-events-none absolute left-1/2 -top-20 bottom-0 z-0 w-screen -translate-x-1/2 md:-top-24"
          >
            <div className="flex h-full w-full flex-col md:flex-row">
              <div className="flex-1 bg-foreground">
                <ThreeBackgroundTunnel className="absolute inset-0" />
              </div>
              <div className="flex-1 bg-surface-1" />
            </div>
          </div>

          <div className="relative z-10" id="hero-content">
            <div className="grid min-h-screen grid-cols-1 grid-rows-2 items-stretch md:grid-cols-12 md:grid-rows-1">
              <div className="relative flex h-full items-end justify-start overflow-hidden pb-10 md:col-span-6 md:items-center md:pb-0">
                <div className="relative z-10 max-w-xl text-background">
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
                      href={`#${ctaTarget}`}
                      className="inline-flex size-8 items-center justify-center rounded-full border border-background/20 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                      aria-label="Scroll to next section"
                    >
                      <Icon
                        name="arrow-down"
                        className="size-4 text-background"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex h-full items-start justify-end pt-10 md:col-span-6 md:items-center md:pt-0">
                <div className="space-y-12 md:max-w-md md:px-6 lg:max-w-xl">
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
        </OverlapAnimation>
      </div>
    </ComponentLayout>
  )
}
