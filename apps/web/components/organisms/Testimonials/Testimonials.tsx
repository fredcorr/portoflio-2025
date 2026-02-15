'use client'

import React from 'react'
import { A11y, Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Heading } from '@/components/atoms/Heading/Heading'
import RichText, { RichTextSize } from '@/components/atoms/RichText/RichText'
import { ComponentLayout } from '@/components/hoc/ComponentLayout'
import { makeComponentId } from '@/utils/makeComponentId'
import { normalizePortableText } from '@/utils/portableText'
import type { TestimonialsComponent } from '@portfolio/types/components'

const Testimonials = ({
  _id,
  _key,
  title,
  testimonials,
  sectionId,
}: TestimonialsComponent) => {
  const testimonialsList = Array.isArray(testimonials) ? testimonials : []
  const headingId = makeComponentId({
    value: _id || _key,
    prefix: 'testimonials',
  })

  return (
    <ComponentLayout
      sectionId={sectionId}
      aria-labelledby={headingId}
      className="text-black dark:text-foreground"
      contentClassName="gap-y-12 lg:gap-y-10"
    >
      {(title?.heading || title?.headingLevel) && (
        <div className="md:col-span-12">
          <Heading
            id={headingId}
            level={title?.headingLevel}
            className="font-heading text-heading-1 leading-[1.1] tracking-tight mb-0"
          >
            {title?.heading}
          </Heading>
        </div>
      )}

      {testimonialsList.length ? (
        <div className="md:col-span-12">
          <Swiper
            modules={[Autoplay, Pagination, A11y]}
            loop
            speed={750}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={
              testimonialsList.length > 1 && {
                clickable: true,
                renderBullet: (_, className) =>
                  `<span style="border-radius:0" class="${className} relative mx-2 block h-5 w-5 rotate-45 overflow-hidden border border-black/40 bg-transparent opacity-100 transition-colors duration-200 hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-foreground/50 dark:hover:border-foreground dark:focus-visible:outline-foreground after:absolute after:inset-0 after:block after:bg-black after:origin-center after:transition-transform after:duration-300 after:scale-0 after:content-[''] after:rounded-none dark:after:bg-foreground [&.swiper-pagination-bullet-active]:after:scale-100 !rounded-none"></span>`,
              }
            }
            slidesPerView={1}
            className="pb-10 [&_.swiper-pagination]:mt-10 [&_.swiper-pagination]:flex [&_.swiper-pagination]:justify-center [&_.swiper-pagination]:gap-4"
          >
            {testimonialsList.map(({ _key, subtitle, ...testimonial }) => {
              const quote = normalizePortableText(subtitle || '')

              return (
                <SwiperSlide key={_key}>
                  <article
                    className="flex flex-col gap-y-8 p-2 transition lg:flex-row lg:items-end lg:gap-x-[81px] lg:gap-y-0"
                    aria-labelledby={`${_key}-title`}
                  >
                    {quote.length > 0 ? (
                      <blockquote className="flex-1 text-black/90 dark:text-foreground/90">
                        <RichText value={quote} size={RichTextSize.XXl} />
                      </blockquote>
                    ) : null}
                    <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
                      {!!testimonial.title && (
                        <Heading
                          id={`${_key}-title`}
                          level={3}
                          className="font-heading text-heading-5 font-semibold leading-tight text-black dark:text-foreground"
                        >
                          {testimonial.title}
                        </Heading>
                      )}
                      {testimonial.author?.name && (
                        <div className="mt-4 flex flex-col">
                          <span className="font-heading text-body-lg font-semibold text-black dark:text-foreground">
                            {testimonial.author.name}
                          </span>
                          {testimonial.author.role && (
                            <span className="font-body text-body-md text-black/60 dark:text-foreground/70">
                              {testimonial.author.role}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      ) : (
        <div className="md:col-span-12 rounded-3xl border border-dashed border-black/10 bg-gray-50 px-6 py-10 text-center font-body text-body-lg text-black/60 dark:border-gray-200/40 dark:bg-gray-100 dark:text-foreground/70">
          Testimonials will appear here once they are published.
        </div>
      )}
    </ComponentLayout>
  )
}

export default Testimonials
