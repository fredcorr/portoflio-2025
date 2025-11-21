import type { HomePageHeroComponent } from '@portfolio/types/components'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'

const getContactEmail = () =>
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || ''

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
    <ComponentLayout>
      <div className="md:col-span-12 lg:col-span-11">
        {headline ? (
          <h1 className="inline-block gap-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-black sm:text-5xl md:text-heading-1 lg:text-display-lg xl:text-display-2xl">
            {headline}
            <a
              href="#main-content"
              className="ml-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 font-heading text-heading-5 uppercase tracking-[0.08em] text-black shadow-sm transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/10 dark:bg-gray-50 dark:text-black dark:focus-visible:outline-white"
            >
              <span>Scroll down</span>
              <span aria-hidden="true" className="text-lg">
                ↓
              </span>
            </a>
          </h1>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 pt-8 text-black md:col-span-4 md:pt-10 lg:col-span-3">
        {contactLabel ? (
          <p className="font-heading text-heading-4 font-medium uppercase tracking-tight">
            {contactLabel}
          </p>
        ) : null}
        {contactEmail ? (
          <a
            href={`mailto:${contactEmail}`}
            className="w-fit font-body text-body-xl text-black transition hover:text-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:text-foreground dark:hover:text-primary-500 dark:focus-visible:outline-white"
          >
            {contactEmail}
          </a>
        ) : null}
      </div>
      {supportingCopy ? (
        <p className="max-w-2xl pt-8 font-body text-body-xl text-black md:col-span-7 md:col-start-6 md:pt-10 lg:col-span-7 lg:col-start-6 dark:text-foreground">
          {supportingCopy}
        </p>
      ) : null}
    </ComponentLayout>
  )
}
