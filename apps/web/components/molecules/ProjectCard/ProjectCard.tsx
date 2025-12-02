import Link from 'next/link'
import { cn } from '@/utils/cn'

type ProjectCardProps = {
  title: string
  label?: string
  href?: string
  imageUrl?: string
  imageAlt?: string
}

export const ProjectCard = ({
  title,
  label,
  href,
  imageUrl,
  imageAlt = 'Project image',
}: ProjectCardProps) => {
  const card = (
    <article className="group flex h-full flex-col gap-3 rounded-[32px] bg-white transition">
      <div className="relative aspect-[1.18] overflow-hidden rounded-[32px] bg-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-300 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-200">
            Image coming soon
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        <p className="font-heading text-heading-5 font-medium leading-tight text-black">
          {title}
        </p>
        {label ? (
          <p className="font-body text-body-lg text-gray-200">{label}</p>
        ) : null}
      </div>
    </article>
  )

  if (!href) {
    return card
  }

  return (
    <Link
      href={href}
      className={cn(
        'block rounded-[32px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
      )}
      aria-label={`View ${title}`}
    >
      {card}
    </Link>
  )
}
